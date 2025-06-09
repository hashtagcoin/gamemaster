import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface Entity {
  id: string;
  name: string;
  avatar_url: string;
  is_dead: boolean;
}

interface EntitiesPanelProps {
  entities: Entity[];
}

const EntitiesPanel: React.FC<EntitiesPanelProps> = ({ entities }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Nearby Entities</Text>
      {entities?.map((entity) => (
        <View key={entity.id} style={[styles.entityCard, entity.is_dead && styles.dead]}>
          <Image source={{ uri: entity.avatar_url }} style={styles.avatar} />
          <Text style={styles.name}>{entity.name}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginVertical: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  entityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3a3a',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    color: '#fff',
    fontSize: 16,
  },
  dead: {
    opacity: 0.6,
    // For grayscale effect, React Native doesn't support 'filter' directly.
    // A common workaround is to use tintColor or a third-party image manipulation library.
    // For simplicity, we'll just reduce opacity here.
  },
});

export default EntitiesPanel;