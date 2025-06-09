// app/contexts/GameContext.tsx

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { GameState, DEFAULT_GAME_STATE, CharacterStats, Enemy } from '../types/gameState';

interface GameContextType {
  gameState: GameState;
  isLoading: boolean;
  error: string | null;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setPlayerCharacter: (character: CharacterStats) => void;
  addGameLog: (entry: string) => void;
  setCurrentScene: (scene: string, description?: string) => void;
  generateImage: (prompt: string) => Promise<string>;
  addEnemy: (enemy: Omit<Enemy, 'id'>) => void;
  updateEnemy: (id: string, updates: Partial<Enemy>) => void;
  removeEnemy: (id: string) => void;
  updateCharacter: (character: Partial<CharacterStats>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
  initialGameState?: GameState;
}

export const GameProvider: React.FC<GameProviderProps> = ({ 
  children, 
  initialGameState = DEFAULT_GAME_STATE 
}) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generate image using Gemini API
  const generateImage = useCallback(async (prompt: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      // This is a placeholder - you'll need to implement the actual Gemini API call
      // For now, we'll return a placeholder image
      return 'https://via.placeholder.com/200x200?text=Loading+Image...';
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image. Please try again.');
      return '';
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper function to create a new character.
  const setPlayerCharacter = useCallback((character: CharacterStats) => {
    setGameState(prevState => ({
      ...prevState,
      party: [character], // Assuming single player for now
    }));
  }, []);

  // Helper function to add a log entry.
  const addGameLog = useCallback((entry: string) => {
    setGameState(prevState => ({
      ...prevState,
      gameLog: [...prevState.gameLog, entry],
    }));
  }, []);

  // Helper function to set the current scene.
  const setCurrentScene = useCallback((scene: string, description?: string) => {
    setGameState(prevState => ({
      ...prevState,
      location: {
        ...prevState.location,
        current: scene,
        description: description || prevState.location.description,
      },
    }));
  }, []);

  // Add a new enemy to the game state
  const addEnemy = useCallback((enemy: Omit<Enemy, 'id'>) => {
    const newEnemy: Enemy = {
      ...enemy,
      id: `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setGameState(prevState => ({
      ...prevState,
      enemies: [...prevState.enemies, newEnemy],
    }));
    
    return newEnemy.id;
  }, []);

  // Update an existing enemy
  const updateEnemy = useCallback((id: string, updates: Partial<Enemy>) => {
    setGameState(prevState => ({
      ...prevState,
      enemies: prevState.enemies.map(enemy => 
        enemy.id === id ? { ...enemy, ...updates } : enemy
      ),
    }));
  }, []);

  // Remove an enemy from the game state
  const removeEnemy = useCallback((id: string) => {
    setGameState(prevState => ({
      ...prevState,
      enemies: prevState.enemies.filter(enemy => enemy.id !== id),
    }));
  }, []);

  // Update the current character's stats
  const updateCharacter = useCallback((updates: Partial<CharacterStats>) => {
    setGameState(prevState => ({
      ...prevState,
      party: prevState.party.map((char, index) => 
        index === 0 ? { ...char, ...updates } : char
      ),
    }));
  }, []);

  // The value that will be passed to the context consumers.
  const contextValue = {
    gameState,
    isLoading,
    error,
    setGameState,
    setPlayerCharacter,
    addGameLog,
    setCurrentScene,
    generateImage,
    addEnemy,
    updateEnemy,
    removeEnemy,
    updateCharacter,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// The custom hook that components will use to access the context.
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};