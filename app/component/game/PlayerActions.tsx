import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PlayerActionsProps {
  onAction: (action: string) => void;
}

const PlayerActions: React.FC<PlayerActionsProps> = ({ onAction }) => {
  const actions = ['Explore', 'Talk', 'Attack', 'Use Item', 'Rest'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actions</Text>
      <View style={styles.actionsContainer}>
        {actions.map((action, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.actionButton}
            onPress={() => onAction(action)}
          >
            <Text style={styles.actionText}>{action}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '48%',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PlayerActions;