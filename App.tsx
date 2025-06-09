// App.tsx

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

// --- Imports ---
import { GameProvider, useGame } from './app/contexts/GameContext';
import CharacterCreation from './app/component/game/CharacterCreation';
import NewGameScreen from './app/component/game/NewGameScreen';
import { getGameMasterResponse } from './app/services/geminiService';
import { assetManager } from './app/services/AssetManager';
import { GameState } from './app/types/gameState';
import { globalStyles } from './app/styles/global';

function AppContent() {
  const { gameState, setGameState, addGameLog } = useGame();
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    // This is a placeholder for asset loading.
    setAssetsLoaded(true);
  }, []);

  // Check if a character exists in the game state's party array.
  // This line is now safe because we will ensure the default state has `party: []`
  const character = gameState.party.length > 0 ? gameState.party[0] : null;

  const handleActionSubmit = async (action: string) => {
    try {
      const response = await getGameMasterResponse(action);
      
      // Log the narrative text from the response
      if (response.text) {
        addGameLog(response.text);
      } else {
        console.warn('Narrative text was undefined in Game Master response.');
        addGameLog('The Game Master did not provide a narrative response.');
      }
      
      // Handle map data if present in the response
      if (response.mapData) {
        setGameState(prevState => ({
          ...prevState,
          currentMap: response.mapData
        }));
      }

    } catch (error) {
      console.error('Error handling action submit:', error);
      addGameLog('An error occurred while processing your action.');
    }
  };

  if (!assetsLoaded) {
    return (
      <View style={globalStyles.loadingContainer}>
        <Text style={globalStyles.loadingText}>Loading Assets...</Text>
      </View>
    );
  }

  // This is the core logic: show CharacterCreation if no character exists,
  // otherwise show the main GameScreen.
  return (
    <View style={globalStyles.container}>
      {character ? (
        <NewGameScreen handleActionSubmit={handleActionSubmit} />
      ) : (
        <CharacterCreation />
      )}
    </View>
  );
}

// The main App component that wraps everything in the GameProvider.
export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
