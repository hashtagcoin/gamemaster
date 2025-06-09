import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { assetManager, AssetType } from '../../services/assetManager';

interface SceneViewProps {
  sceneDescription: string;
  sceneId: string;
  mapData?: {
    ascii: string;
    entities: Array<{type: string; x: number; y: number}>;
  };
}

const { width } = Dimensions.get('window');
const SCENE_WIDTH = width * 0.6; // 60% of screen width

const SceneView: React.FC<SceneViewProps> = ({ sceneDescription, sceneId, mapData }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSceneImage = async () => {
      try {
        setLoading(true);
        const uri = await assetManager.getAsset(
          `scene_${sceneId}`, 
          'scene', 
          `A fantasy RPG scene showing: ${sceneDescription}. Style: digital art, isometric view, detailed environment, vibrant colors.`
        );
        setImageUri(uri);
      } catch (error) {
        console.error('Error loading scene image:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sceneDescription) {
      loadSceneImage();
    }
  }, [sceneDescription, sceneId]);

  const renderMap = () => {
    if (!mapData?.ascii) return null;

    return (
      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Map</Text>
        <Text style={styles.asciiMap}>{mapData.ascii}</Text>
        <View style={styles.legend}>
          <Text style={styles.legendItem}>P: You</Text>
          <Text style={styles.legendItem}>E: Enemy</Text>
          <Text style={styles.legendItem}>T: Treasure</Text>
          <Text style={styles.legendItem}>D: Door</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {loading ? (
          <View style={[styles.imagePlaceholder, styles.loadingContainer]}>
            <Text style={styles.loadingText}>Generating scene...</Text>
          </View>
        ) : imageUri ? (
          <>
            <Image 
              source={{ uri: imageUri }} 
              style={styles.sceneImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
              style={styles.gradientOverlay}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              pointerEvents="none"
            />
          </>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>No scene image available</Text>
          </View>
        )}
      </View>
      
      {renderMap()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
  },
  sceneImage: {
    width: '100%',
    height: SCENE_WIDTH * 0.3, // Reduced height by 50%
    backgroundColor: '#1a1a1a',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    zIndex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  imagePlaceholder: {
    width: '100%',
    height: SCENE_WIDTH * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#888',
    fontStyle: 'italic',
  },
  placeholderText: {
    color: '#444',
  },
  mapContainer: {
    padding: 12,
    backgroundColor: '#222',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  mapTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  asciiMap: {
    fontFamily: 'monospace',
    color: '#4CAF50',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  legendItem: {
    color: '#888',
    fontSize: 12,
    marginRight: 12,
  },
});

export default SceneView;
