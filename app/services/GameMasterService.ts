import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env'; // Assuming you'll set up environment variables

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

export const getGameMasterResponse = async (prompt: string): Promise<string> => {
  try {
    // Construct the full prompt with instructions for enemy management
    const fullPrompt = `You are the Game Master for a text-based adventure game. Your goal is to narrate the story, manage the game state, and respond to player actions.

Player Action: ${prompt}

Your tasks:
1. Narrate the scene based on the player's action.
2. Update the game state (character, game log, etc.) in JSON format.
3. **Manage Enemies:** If the narrative introduces new enemies, add them as objects to the \`enemies\` array in the \`gameState\`. Each enemy object must have \`id\`, \`name\`, \`hp\`, \`maxHp\`, and \`is_dead: false\`. You must also generate a detailed image prompt for each new, unique enemy type's avatar. If combat occurs, update the \`hp\` of the enemies. If an enemy's \`hp\` reaches 0, set its \`is_dead\` flag to \`true\` and describe its defeat in the narrative.

Return your response as a JSON object with the following structure: { narrativeText: string, updatedGameState: GameState, suggestedActions: string[] }.
`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error getting Game Master response:', error);
    return 'The Game Master is currently unavailable. Please try again later.';
  }
};