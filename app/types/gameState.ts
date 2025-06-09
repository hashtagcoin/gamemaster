// app/types/gameState.ts

export interface CharacterStats {
  id: string;
  name: string;
  class: string;
  level: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  experience: number;
  stamina: number;
  speed: number;
  avatar_url?: string;
  is_dead?: boolean;
  description?: string;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  class: string;
  description: string;
  avatar_url?: string;
  is_dead?: boolean;
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  imagePrompt: string;
  hp: number;
  maxHp: number;
  is_dead: boolean;
}

export interface GameState {
  gameLog: string[];
  party: CharacterStats[];
  enemies: Enemy[];
  location: {
    current: string;
    description: string;
  };
  currentScene: Scene;
  currentSceneImage: string;
  description?: string;
  imagePrompt?: string;
}

/**
 * The initial state for a new game. This object must match the GameState interface.
 */
export const DEFAULT_GAME_STATE: GameState = {
  gameLog: [
    'Your adventure begins with Baulrog the Barbarian!',
    'The air is thick with the promise of battle.'
  ],
  party: [
    {
      id: '1',
      name: 'Baulrog',
      class: 'Barbarian',
      level: 1,
      hp: 15,
      maxHp: 15,
      mana: 0,
      maxMana: 0,
      strength: 16,
      dexterity: 14,
      constitution: 14,
      intelligence: 8,
      wisdom: 10,
      charisma: 12,
      experience: 0,
      stamina: 10,
      speed: 10,
      is_dead: false,
      description: 'A fierce barbarian warrior with a mighty axe and unyielding spirit.',
      avatar_url: 'https://i.imgur.com/9pNffkj.png'
    }
  ],
  enemies: [],
  location: {
    current: 'The Bloodied Plains',
    description: 'A vast open plain where the grass has been stained red from countless battles. The wind carries the distant sound of war drums.'
  },
  currentScene: {
    id: '1',
    title: 'The Bloodied Plains',
    description: 'A vast open plain where the grass has been stained red from countless battles. The wind carries the distant sound of war drums.',
    imagePrompt: 'A vast open plain with red-stained grass and a stormy sky',
    hp: 100,
    maxHp: 100,
    is_dead: false
  },
  currentSceneImage: ''
};