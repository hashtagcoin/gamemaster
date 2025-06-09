// app/component/game/CharacterSheet.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CharacterStats } from '../../types/gameState';

interface CharacterSheetProps {
  character: CharacterStats;
}

// This component displays the character's detailed stats.
const CharacterSheet: React.FC<CharacterSheetProps> = ({ character }) => {
  if (!character) {
    return null;
  }

  // Render the character's information
  return (
    <View style={styles.sheetContainer}>
      <Text style={styles.title}>{character.name}, Level {character.level}</Text>
      <Text style={styles.description}>"{character.description}"</Text>
      
      <View style={styles.divider} />

      <View style={styles.statItem}>
        <Text style={styles.statLabel}>HP:</Text>
        <Text style={styles.statValue}>{character.hp} / {character.maxHp}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Strength:</Text>
        <Text style={styles.statValue}>{character.strength}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Dexterity:</Text>
        <Text style={styles.statValue}>{character.dexterity}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Intelligence:</Text>
        <Text style={styles.statValue}>{character.intelligence}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    padding: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginTop: 10,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  statLabel: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CharacterSheet;