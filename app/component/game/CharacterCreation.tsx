import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useGame } from '../../contexts/GameContext';
import { getGameMasterResponse } from '../../services/GameMasterService';

const CharacterCreation: React.FC = () => {
  const [name, setName] = useState('');
  const [characterClass, setCharacterClass] = useState('');
  const { setPlayerCharacter, addGameLogEntry } = useGame(); // Changed setCharacter to setPlayerCharacter

  const handleCreateCharacter = async () => {
    console.log('handleCreateCharacter called');
    console.log('Name:', name);
    console.log('Character Class:', characterClass);
    if (name && characterClass) {
      const newCharacter = { name, characterClass };
      setPlayerCharacter(newCharacter); // Changed setCharacter to setPlayerCharacter

      const initialPrompt = `Create an introductory scene for a single-player RPG. The player character is a ${characterClass} named ${name}. Describe their immediate surroundings and present them with a clear starting objective or situation. The response should be engaging and set the tone for a fantasy adventure.`;
      const initialResponse = await getGameMasterResponse(initialPrompt);
      addGameLogEntry({ type: 'gm', text: initialResponse });
    } else {
      // Provide feedback to the user if fields are empty
      alert('Please enter both a character name and a character class.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Character</Text>
      <Text style={styles.label}>Character Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          console.log('Name input changed:', text);
        }}
      />
      <Text style={styles.label}>Character Class:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Warrior, Mage, Rogue"
        value={characterClass}
        onChangeText={(text) => {
          setCharacterClass(text);
          console.log('Character Class input changed:', text);
        }}
      />
      <Button title="Create Character" onPress={handleCreateCharacter} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
    marginBottom: 15,
    backgroundColor: '#333',
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    alignSelf: 'flex-start',
    marginLeft: '5%', // Adjust as needed to align with input
  },
});

export default CharacterCreation;