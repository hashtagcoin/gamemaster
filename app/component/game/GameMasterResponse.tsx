import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface GameMasterResponseProps {
  response: string;
}

const GameMasterResponse: React.FC<GameMasterResponseProps> = ({ response }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Master Says:</Text>
      <ScrollView style={styles.responseContainer}>
        <Text style={styles.responseText}>{response}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '90%',
    maxHeight: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  responseContainer: {
    flexGrow: 1,
  },
  responseText: {
    color: '#eee',
    fontSize: 16,
  },
});

export default GameMasterResponse;