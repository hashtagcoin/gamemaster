import { GoogleGenerativeAI } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system';
import { GEMINI_API_KEY } from '@env';
import { Platform } from 'react-native';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const textModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });
// Image generation endpoint
const IMAGE_GEN_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent';

// Helper function to convert image URI to base64
const imageToBase64 = async (uri: string): Promise<string> => {
  if (Platform.OS === 'web') {
    // Web implementation
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } else {
    // React Native implementation
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  }
};

export interface GameMasterResponse {
  text: string;
  imagePrompt?: string;
  mapData?: {
    ascii: string;
    entities: Array<{type: string; x: number; y: number}>;
  };
}

export async function getGameMasterResponse(prompt: string): Promise<GameMasterResponse> {
  const fullPrompt = `You are the Game Master for a text-based adventure game. Your role is to narrate the story, describe locations, present challenges, and manage the game world based on player actions. 

For each response, provide a JSON object with these fields:
1. "narrative": The narrative text describing what happens next
2. "imagePrompt": A detailed prompt for generating an image of the current scene
3. "map": An object with:
   - "ascii": A 7x7 ASCII map using # for walls, . for open space, P for player, E for enemy, T for treasure, D for door
   - "entities": Array of objects with type, x, y coordinates

Example response:
\`\`\`json
{
  "narrative": "You enter a dark cave...",
  "imagePrompt": "A dark cave entrance with moss-covered walls and a flickering torch casting shadows. The entrance is partially covered by vines.",
  "map": {
    "ascii": "#######\n#.....#\n#.P.E.#\n#.....#\n#..T..#\n#.....#\n#######",
    "entities": [
      { "type": "player", "x": 2, "y": 2 },
      { "type": "enemy", "x": 4, "y": 2 },
      { "type": "treasure", "x": 3, "y": 4 }
    ]
  }
}
\`\`\`

Current game state and player's action:\n${prompt}`;

  try {
    const result = await textModel.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error('Could not parse response from Game Master');
    }
    
    const responseData = JSON.parse(jsonMatch[1]);
    
    return {
      text: responseData.narrative,
      imagePrompt: responseData.imagePrompt,
      mapData: responseData.map
    };
  } catch (error) {
    console.error('Error in getGameMasterResponse:', error);
    return {
      text: 'An error occurred while processing your action. Please try again.',
      imagePrompt: 'A mysterious error has occurred in the game world.'
    };
  }
}

const DEFAULT_DND_SCENE = `A group of adventurers stands at the entrance of a dark, mysterious dungeon. The rogue is examining the ancient stone door for traps, while the wizard studies the arcane runes carved into the frame. The fighter keeps watch down the torch-lit corridor, and the cleric clutches their holy symbol, sensing an ominous presence. The air is thick with dust and the scent of old magic.`;

export async function generateImage(prompt?: string, existingImageUri?: string): Promise<string> {
  // Use default D&D scene if no prompt is provided
  if (!prompt?.trim()) {
    prompt = DEFAULT_DND_SCENE;
  }
  
  try {
    // First try to find a matching image in cache
    const cacheDir = `${FileSystem.cacheDirectory}generated_images/`;
    const fileName = `${hashCode(prompt)}.jpg`;
    const fileUri = `${cacheDir}${fileName}`;
    
    // Create directory if it doesn't exist
    await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
    
    // Check if we already have this image
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      return fileUri;
    }
    
    // Prepare the request body for image generation
    const requestBody = {
      contents: [{
        parts: [
          {
            text: `Generate a high-quality, detailed fantasy RPG scene in the style of Dungeons & Dragons 5e. 
                   Scene: ${prompt}
                   Style: Digital art, isometric view, highly detailed environment, dramatic lighting, rich colors.`
          }
        ]
      }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    };

    // Make the API request
    const response = await fetch(`${IMAGE_GEN_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const responseData = await response.json();
    
    // Extract the generated image data
    const imageData = responseData.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData?.mimeType?.startsWith('image/')
    )?.inlineData?.data;
    
    if (!imageData) {
      console.error('No image data in response:', JSON.stringify(responseData, null, 2));
      throw new Error('No image data in the response');
    }
    
    // Save the image to cache
    await FileSystem.writeAsStringAsync(fileUri, imageData, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    return fileUri;
    
    // In a real implementation with image data:
    // const imageData = result.response.candidates[0].content.parts[0].text;
    // await FileSystem.writeAsStringAsync(fileUri, imageData, { encoding: FileSystem.EncodingType.Base64 });
    // return fileUri;
    
  } catch (error) {
    console.error('Error generating image:', error);
    return 'https://placehold.co/400x400/1a1a1a/ff0000?text=Error+Generating+Image';
  }
}

// Helper function to generate a hash code for filenames
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}