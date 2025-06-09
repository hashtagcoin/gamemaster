import React, { useRef, useState } from 'react';
import { View, Image, StyleSheet, PanResponder, Dimensions, Text } from 'react-native';

interface MinimapProps {
  mapUrl: string;
}

const Minimap: React.FC<MinimapProps> = ({ mapUrl }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Basic pan logic
        setPosition({
          x: position.x + gestureState.dx,
          y: position.y + gestureState.dy,
        });
      },
      onPanResponderRelease: () => {
        // Optional: Add inertia or snap back to bounds
      },
    })
  ).current;

  // Basic pinch-to-zoom (conceptual, requires more advanced handling for multi-touch)
  // For a full implementation, consider `react-native-gesture-handler` and `react-native-reanimated`
  const handlePinch = (event: any) => {
    const newScale = event.nativeEvent.scale; // This is a simplified example
    setScale(newScale);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {mapUrl ? (
        <Image
          source={{ uri: mapUrl }}
          style={[
            styles.mapImage,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { scale: scale },
              ],
            },
          ]}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No Map Available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200, // Adjust height as needed
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Important for zoom/pan
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Minimap;