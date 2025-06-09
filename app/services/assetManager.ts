import * as FileSystem from 'expo-file-system';
import { generateImage } from './geminiService';

type AssetType = 'scene' | 'character' | 'enemy' | 'map' | 'item';

class AssetManager {
  private memoryCache: Map<string, string> = new Map();
  private assetBaseDir: string;
  private placeholderImage = 'https://placehold.co/400x400/1a1a1a/ffffff?text=Loading...';
  private errorImage = 'https://placehold.co/400x400/1a1a1a/ff0000?text=Error+Loading+Image';

  constructor() {
    this.assetBaseDir = `${FileSystem.cacheDirectory}assets/`;
    this.ensureDirectoriesExist();
  }

  private async ensureDirectoriesExist() {
    try {
      // Create base asset directory
      await FileSystem.makeDirectoryAsync(this.assetBaseDir, { intermediates: true });
      
      // Create subdirectories for different asset types
      const assetTypes: AssetType[] = ['scene', 'character', 'enemy', 'map', 'item'];
      for (const type of assetTypes) {
        await FileSystem.makeDirectoryAsync(`${this.assetBaseDir}${type}/`, { intermediates: true });
      }
    } catch (error) {
      console.error('Error creating asset directories:', error);
    }
  }

  private getAssetPath(assetId: string, type: AssetType): string {
    return `${this.assetBaseDir}${type}/${assetId}.jpg`;
  }

  /**
   * Generate a unique ID for an asset based on its type and prompt
   */
  private generateAssetId(prompt: string, type: AssetType): string {
    // Simple hash function to generate a consistent ID from the prompt
    let hash = 0;
    const str = `${type}_${prompt}`;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  /**
   * Get an asset by ID, either from cache, disk, or generate it
   */
  async getAsset(assetId: string, type: AssetType, prompt?: string): Promise<string> {
    // Check memory cache first
    const cacheKey = `${type}_${assetId}`;
    if (this.memoryCache.has(cacheKey)) {
      return this.memoryCache.get(cacheKey) || this.placeholderImage;
    }

    const filePath = this.getAssetPath(assetId, type);
    
    try {
      // Check if file exists on disk
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      
      if (fileInfo.exists) {
        // File exists, load it into memory cache
        console.log(`Loading ${type} asset from disk:`, assetId);
        this.memoryCache.set(cacheKey, filePath);
        return filePath;
      } else if (prompt) {
        // File doesn't exist but we have a prompt, generate it
        console.log(`Generating new ${type} asset:`, assetId);
        const imageUri = await generateImage(prompt);
        
        if (imageUri.startsWith('http')) {
          // If it's a remote URL, download it
          const downloadResult = await FileSystem.downloadAsync(
            imageUri,
            filePath
          );
          
          if (downloadResult.status === 200) {
            this.memoryCache.set(cacheKey, filePath);
            return filePath;
          }
        } else {
          // If it's a local file path
          this.memoryCache.set(cacheKey, imageUri);
          return imageUri;
        }
      }
      
      return this.placeholderImage;
    } catch (error) {
      console.error(`Error getting ${type} asset ${assetId}:`, error);
      return this.errorImage;
    }
  }

  /**
   * Preload assets for better performance
   */
  async preloadAssets(assets: Array<{id: string; type: AssetType; prompt: string}>) {
    await Promise.all(
      assets.map(asset => this.getAsset(asset.id, asset.type, asset.prompt))
    );
  }

  /**
   * Clear all cached assets
   */
  async clearCache(): Promise<void> {
    try {
      this.memoryCache.clear();
      await FileSystem.deleteAsync(this.assetBaseDir, { idempotent: true });
      await this.ensureDirectoriesExist();
      console.log('Asset cache cleared.');
    } catch (error) {
      console.error('Error clearing asset cache:', error);
    }
  }
}

export const assetManager = new AssetManager();
export type { AssetType };