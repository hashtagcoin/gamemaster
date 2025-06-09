import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StatusBar,
  FlatList,
  ListRenderItem,
  Modal
} from 'react-native';

type InventoryItem = {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
} | null;
import { Dimensions } from 'react-native';
import styles from './styles';
import { CharacterStats, Enemy } from '../../types/gameState';
import SceneView from './SceneView';
import CharacterAvatar from './CharacterAvatar';
import { assetManager } from '../../services/assetManager';
import { getGameMasterResponse } from '../../services/geminiService';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Initial game data
const initialCharacter: CharacterStats = {
  id: '1',
  name: 'Hero',
  class: 'Warrior',
  level: 5,
  hp: 85,
  maxHp: 100,
  mana: 30,
  maxMana: 50,
  strength: 15,
  dexterity: 10,
  constitution: 14,
  intelligence: 8,
  wisdom: 12,
  charisma: 10,
  experience: 0,
  stamina: 100,
  speed: 30,
  avatar_url: 'https://example.com/hero-avatar.png',
  is_dead: false,
  description: 'A brave hero on an epic quest'
};

const initialPartyMembers: CharacterStats[] = [
  {
    id: '2',
    name: 'Mage',
    class: 'Mage',
    level: 4,
    hp: 45,
    maxHp: 60,
    mana: 80,
    maxMana: 100,
    strength: 8,
    dexterity: 12,
    constitution: 10,
    intelligence: 16,
    wisdom: 14,
    charisma: 12,
    experience: 0,
    stamina: 80,
    speed: 25,
    avatar_url: 'https://example.com/mage-avatar.png',
    is_dead: false,
    description: 'A powerful magic user'
  },
  {
    id: '3',
    name: 'Cleric',
    class: 'Cleric',
    level: 4,
    hp: 65,
    maxHp: 90,
    mana: 70,
    maxMana: 90,
    strength: 10,
    dexterity: 10,
    constitution: 12,
    intelligence: 12,
    wisdom: 16,
    charisma: 14,
    experience: 0,
    stamina: 90,
    speed: 20,
    avatar_url: 'https://example.com/cleric-avatar.png',
    is_dead: false,
    description: 'A devoted healer and support'
  }
];

const initialEnemies: Enemy[] = [
  {
    id: 'e1',
    name: 'Orc',
    level: 3,
    hp: 45,
    maxHp: 45,
    strength: 14,
    dexterity: 10,
    intelligence: 8,
    class: 'Monster',
    description: 'A strong orc warrior',
    avatar_url: 'https://example.com/orc-avatar.png',
    is_dead: false
  },
  {
    id: 'e2',
    name: 'Orc',
    level: 3,
    hp: 45,
    maxHp: 45,
    strength: 14,
    dexterity: 10,
    intelligence: 8,
    class: 'Monster',
    description: 'A strong orc warrior',
    avatar_url: 'https://example.com/orc-avatar.png',
    is_dead: false
  },
  {
    id: 'e3',
    name: 'Orc',
    level: 3,
    hp: 45,
    maxHp: 45,
    strength: 14,
    dexterity: 10,
    intelligence: 8,
    class: 'Monster',
    description: 'A strong orc warrior',
    avatar_url: 'https://example.com/orc-avatar.png',
    is_dead: false
  }
];

interface NewGameScreenProps {
  handleActionSubmit: (action: string) => Promise<void>;
}

const NewGameScreen = ({ handleActionSubmit }: NewGameScreenProps) => {
  const [character, setCharacter] = useState<CharacterStats>(initialCharacter);
  const [partyMembers, setPartyMembers] = useState<CharacterStats[]>(initialPartyMembers);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [selectedEnemyId, setSelectedEnemyId] = useState<string | null>(null);
  const selectedEnemy = selectedEnemyId ? enemies.find(e => e.id === selectedEnemyId) || null : null;
  const [currentScene, setCurrentScene] = useState({
    id: 'start',
    title: 'The Adventure Begins',
    description: 'You find yourself at the entrance of a dark forest. The wind howls through the trees as you prepare for your journey ahead.',
    imagePrompt: 'A dark forest entrance at dusk with a path leading into the trees. The sky is painted in deep purples and oranges as the sun sets. Fantasy RPG style.'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [battleLog, setBattleLog] = useState<string[]>(['Welcome to your adventure!']);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 'potion', name: 'Health Potion', icon: 'local-drink' } as const,
    { id: 'mana-potion', name: 'Mana Potion', icon: 'opacity' } as const,
    { id: 'scroll', name: 'Scroll', icon: 'menu-book' } as const,
    null // Empty slot for + button
  ]);
  
  // Preload assets on component mount
  const preloadAssets = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Preload main character avatar
      const mainCharPrompt = `A fantasy RPG hero named ${initialCharacter.name}, a level ${initialCharacter.level} ${initialCharacter.class}. ${initialCharacter.description}. Style: digital painting, highly detailed character portrait, dramatic lighting, "Magic: The Gathering" art style, fantasy RPG character design`;
      const mainCharAvatar = await assetManager.getAsset(
        `character_${initialCharacter.id}`,
        'character',
        mainCharPrompt
      );
      
      // Update main character with avatar URL
      setCharacter(prev => ({
        ...prev,
        avatar_url: mainCharAvatar
      }));
      
      // Preload party member avatars
      const updatedParty = await Promise.all(
        initialPartyMembers.map(async (member) => {
          const prompt = `A fantasy RPG party member named ${member.name}, a level ${member.level} ${member.class}. ${member.description || ''} Style: digital painting, highly detailed character portrait, dramatic lighting, fantasy RPG character design`;
          const avatar = await assetManager.getAsset(
            `character_${member.id}`,
            'character',
            prompt
          );
          return {
            ...member,
            avatar_url: avatar
          };
        })
      );
      
      setPartyMembers(updatedParty);
      
      // Initialize enemies with their avatars
      const enemiesWithAvatars = await Promise.all(
        initialEnemies.map(async (enemy) => {
          const prompt = `A dangerous fantasy RPG enemy: ${enemy.name}. ${enemy.description || ''} Style: digital painting, highly detailed monster portrait, dark fantasy, dramatic lighting`;
          const avatar = await assetManager.getAsset(
            `enemy_${enemy.id}`,
            'enemy',
            prompt
          );
          return {
            ...enemy,
            avatar_url: avatar
          };
        })
      );
      
      setEnemies(enemiesWithAvatars);
    } catch (error) {
      console.error('Error preloading avatars:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    preloadAssets();
  }, [preloadAssets]);

  const renderCharacterCard = (char: CharacterStats) => (
    <View style={styles.characterCard} key={char.id}>
      <CharacterAvatar
        id={`character_${char.id}`}
        name={char.name}
        type="character"
        description={char.description || char.class}
        level={char.level}
        hp={char.hp}
        maxHp={char.maxHp}
        isDead={char.is_dead}
        size="small"
      />
    </View>
  );

  const renderEnemy: ListRenderItem<Enemy> = ({ item }) => (
    <CharacterAvatar
      id={`enemy_${item.id}`}
      name={item.name}
      type="enemy"
      description={item.description}
      level={item.level}
      hp={item.hp}
      maxHp={item.maxHp}
      isDead={item.is_dead}
      isSelected={selectedEnemyId === item.id}
      onPress={() => setSelectedEnemyId(item.id)}
    />
  );

  const handleAction = async (action: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Build a prompt for the game master
      const prompt = `Player action: ${action}\n` +
        `Current location: ${currentScene.title}\n` +
        `Enemies: ${enemies.filter(e => !e.is_dead).map(e => e.name).join(', ') || 'None'}\n` +
        `Selected target: ${selectedEnemy ? selectedEnemy.name : 'None'}\n`;
      
      // Get response from game master
      const response = await getGameMasterResponse(prompt);
      
      // Update battle log
      setBattleLog(prev => [
        response.text,
        ...prev
      ].slice(0, 50));
      
      // Update game state based on response
      // This is a simplified example - in a real game, you'd parse the response
      // and update the game state accordingly
      
      // For now, just update the scene if we have a new image prompt
      setCurrentScene(prev => ({
        ...prev,
        id: `scene_${Date.now()}`,
        description: response.text,
        imagePrompt: response.imagePrompt || prev.imagePrompt
      }));

      // Simulate enemy turn
      if (enemies.some(e => !e.is_dead)) {
        setTimeout(() => {
          const aliveEnemies = enemies.filter(e => !e.is_dead);
          const selectedEnemy = selectedEnemyId ? enemies.find(e => e.id === selectedEnemyId) : null;
          if (aliveEnemies.length > 0) {
            const attacker = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
            const damage = Math.floor(Math.random() * 5) + 1;

            setBattleLog(prev => [
              `${attacker.name} attacks you for ${damage} damage!`,
              ...prev
            ].slice(0, 50));
          }
          
          setIsLoading(false);
        }, 1000);
      } else {
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('Error handling action:', error);
      setBattleLog(prev => [
        'An error occurred while processing your action.',
        ...prev
      ]);
      setIsLoading(false);
    }
  };

  const renderHeroCard = (char: CharacterStats) => (
    <View style={styles.heroCard}>
      <CharacterAvatar
        id={`character_${char.id}`}
        name={char.name}
        type="character"
        description={char.description || char.class}
        level={char.level}
        hp={char.hp}
        maxHp={char.maxHp}
        isDead={char.is_dead}
        size="large"
      />
      <View style={styles.heroInfo}>
        <Text style={styles.heroName}>{char.name}</Text>
        <Text style={styles.heroClass}>Lvl {char.level} {char.class}</Text>
        <View style={styles.healthBarContainer}>
          <View 
            style={[
              styles.healthBar, 
              { 
                backgroundColor: char.hp / char.maxHp > 0.3 ? '#4caf50' : '#f44336',
                width: `${Math.max(5, (char.hp / char.maxHp) * 100)}%` 
              }
            ]} 
          />
          <Text style={styles.healthText}>HP: {char.hp}/{char.maxHp}</Text>
        </View>
      </View>
    </View>
  );

  const renderPartyMembers = () => {
    // Always show 6 slots (2 rows of 3)
    const totalSlots = 6;
    const emptySlots = Math.max(0, totalSlots - partyMembers.length);
    
    return (
      <>
        <Text style={styles.sectionTitle}>Party Members</Text>
        <View style={styles.partyContainer}>
          {partyMembers.map((member) => (
            <View key={member.id} style={styles.partyMemberWrapper}>
              {renderCharacterCard(member)}
            </View>
          ))}
          {Array(emptySlots).fill(null).map((_, index) => (
            <View key={`empty-${index}`} style={styles.emptyPartySlot}>
              <Text style={styles.emptySlotText}>Empty</Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  const renderInventory = () => {
    return (
      <View style={{ marginTop: 16 }}>
        <Text style={styles.sectionTitle}>Inventory</Text>
        <View style={styles.inventoryContainer}>
          {inventory.map((item, index) => (
            <View key={item?.id || `empty-${index}`} style={{ width: '48%' }}>
              {renderInventorySlot(item, index)}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderInventorySlot = (item: InventoryItem, index: number) => {
    if (!item) {
      return (
        <TouchableOpacity 
          key="add-slot" 
          style={styles.inventorySlot}
          onPress={() => setShowInventoryModal(true)}
        >
          <MaterialIcons name="add-circle-outline" size={32} color="#666" />
        </TouchableOpacity>
      );
    }
    
    return (
      <TouchableOpacity 
        key={item.id}
        style={styles.inventorySlot}
        onPress={() => {
          // Handle item use
          setBattleLog(prev => [`Used ${item.name}`, ...prev]);
        }}
      >
        <MaterialIcons name={item.icon} size={28} color="#fff" />
        <Text style={styles.inventoryItemName} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderInventoryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showInventoryModal}
      onRequestClose={() => setShowInventoryModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Inventory</Text>
          <ScrollView style={styles.inventoryList}>
            {[
              { id: 'potion', name: 'Health Potion', icon: 'local-drink' } as const,
              { id: 'mana-potion', name: 'Mana Potion', icon: 'opacity' } as const,
              { id: 'antidote', name: 'Antidote', icon: 'healing' } as const,
              { id: 'elixir', name: 'Elixir', icon: 'colorize' } as const,
              { id: 'ether', name: 'Ether', icon: 'invert-colors' } as const,
            ].map(item => (
              <TouchableOpacity 
                key={item.id}
                style={styles.inventoryModalItem}
                onPress={() => {
                  // Add to first empty slot or replace last item
                  const emptySlot = inventory.findIndex(slot => !slot);
                  const newInventory = [...inventory];
                  newInventory[emptySlot !== -1 ? emptySlot : inventory.length - 1] = item;
                  setInventory(newInventory);
                  setShowInventoryModal(false);
                }}
              >
                <MaterialIcons name={item.icon} size={24} color="#fff" />
                <Text style={styles.inventoryModalItemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowInventoryModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Left Column - Character and Party */}
      <View style={styles.leftColumn}>
        {renderHeroCard(character)}
        {renderPartyMembers()}
        {renderInventory()}
        {renderInventoryModal()}
      </View>
      
      {/* Middle Column - Game Scene */}
      <View style={styles.middleColumn}>
        <View style={styles.sceneContainer}>
          <Text style={styles.sceneTitle}>{currentScene.title}</Text>
          
          <SceneView 
            sceneDescription={currentScene.description}
            sceneId={currentScene.id}
          />
          
          <View style={styles.sceneDescriptionContainer}>
            <ScrollView 
              style={styles.sceneDescriptionScroll}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.sceneDescriptionText}>
                {currentScene.description}
              </Text>
            </ScrollView>
          </View>
          
          {enemies.length > 0 && (
            <>
              <Text style={styles.enemiesTitle}>Enemies</Text>
              <FlatList
                data={enemies}
                renderItem={renderEnemy}
                keyExtractor={(item: Enemy) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.enemiesList}
              />
            </>
          )}
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.attackButton}
              onPress={() => handleAction('Attack')}
              disabled={isLoading}
            >
              <Text style={styles.actionButtonText}>
                {isLoading ? '...' : 'Attack'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.magicButton}
              onPress={() => handleActionSubmit('Magic')}
              disabled={isLoading}
            >
              <Text style={styles.actionButtonText}>
                {isLoading ? '...' : 'Magic'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.itemButton}
              onPress={() => handleActionSubmit('Items')}
              disabled={isLoading}
            >
              <Text style={styles.actionButtonText}>
                {isLoading ? '...' : 'Items'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.runButton}
              onPress={() => handleActionSubmit('Run')}
              disabled={isLoading}
            >
              <Text style={styles.actionButtonText}>
                {isLoading ? '...' : 'Run'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Right Column - Log and Messages */}
      <View style={styles.rightColumn}>
        <Text style={styles.sectionTitle}>Battle Log</Text>
        <ScrollView style={styles.logContainer}>
          <Text style={styles.logText}>- Hero attacks Orc for 12 damage!</Text>
          <Text style={styles.logText}>- Orc attacks Hero for 8 damage!</Text>
          <Text style={styles.logText}>- Mage casts Fireball on Orc for 15 damage!</Text>
          <Text style={styles.logText}>- Cleric heals Hero for 10 HP!</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default NewGameScreen;
