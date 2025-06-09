import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { assetManager } from '../../services/assetManager';

interface CharacterAvatarProps {
  id: string;
  name: string;
  type: 'character' | 'enemy' | 'npc';
  description?: string;
  hp?: number;
  maxHp?: number;
  level?: number;
  isDead?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  fillContainer?: boolean;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  id,
  name,
  type,
  description = '',
  hp,
  maxHp,
  level,
  isDead = false,
  isSelected = false,
  onPress,
  size = 'medium',
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        // Create a more detailed prompt based on character type
        let prompt = `A fantasy RPG ${type} character named ${name}`;
        
        // Add class/type specific details
        if (type === 'character' || type === 'npc') {
          prompt += `, a level ${level || 1} ${description || 'adventurer'}`;
        } else if (type === 'enemy') {
          prompt += `, a dangerous ${description || 'monster'}`;
        }
        
        // Add visual style details
        prompt += `. Style: digital painting, highly detailed character portrait, dramatic lighting, "Magic: The Gathering" art style, fantasy RPG character design, 4k resolution, intricate details`;
        
        // Add additional details for non-enemy characters
        if (type !== 'enemy') {
          prompt += `, wearing appropriate ${type === 'character' ? 'adventuring' : ''} gear`;
        }
        
        // Generate or load the avatar
        const uri = await assetManager.getAsset(
          `${type}_${id}`,
          type as any,
          prompt
        );
        
        setImageUri(uri);
      } catch (error) {
        console.error(`Error loading ${type} avatar for ${name}:`, error);
        // Set a fallback avatar based on type
        const fallbackAvatar = type === 'enemy' 
          ? 'https://placehold.co/400x400/1a1a1a/ff0000?text=Enemy'
          : 'https://placehold.co/400x400/1a1a1a/ffffff?text=Avatar';
        setImageUri(fallbackAvatar);
      }
    };

    // Only load avatar if we have a valid ID and name
    if (id && name) {
      loadAvatar();
    }
  }, [id, name, type, description, level]);

  const getSize = () => {
    switch (size) {
      case 'small': return 50;
      case 'large': return 120;
      case 'medium':
      default:
        return 80;
    }
  };

  const avatarSize = getSize();
  const showHpBar = hp !== undefined && maxHp !== undefined;
  const hpPercentage = showHpBar ? Math.max(0, Math.min(100, (hp / maxHp!) * 100)) : 0;

  const AvatarContent = (
    <View style={[
      styles.container,
      { width: avatarSize },
      isSelected && styles.selected,
      isDead && styles.dead
    ]}>
      <View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize }]}>
        {imageUri ? (
          <Image 
            source={{ uri: imageUri }} 
            style={[styles.avatar, { width: avatarSize, height: avatarSize }]}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholder, { width: avatarSize, height: avatarSize }]}>
            <Text style={styles.initials}>
              {name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
            </Text>
          </View>
        )}
        
        {level !== undefined && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lv {level}</Text>
          </View>
        )}
      </View>
      
      <Text 
        style={[styles.name, { maxWidth: avatarSize }]} 
        numberOfLines={1} 
        ellipsizeMode="tail"
      >
        {name}
      </Text>
      
      {showHpBar && (
        <View style={styles.hpContainer}>
          <View style={[styles.hpBar, { width: `${hpPercentage}%` }]} />
          <Text style={styles.hpText}>
            {hp}/{maxHp}
          </Text>
        </View>
      )}
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {AvatarContent}
    </TouchableOpacity>
  ) : (
    AvatarContent
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 8,
  },
  avatarContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#444',
    position: 'relative',
  },
  avatar: {
    borderRadius: 8,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  name: {
    color: '#fff',
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  levelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  hpContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#333',
    borderRadius: 6,
    marginTop: 4,
    overflow: 'hidden',
  },
  hpBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  hpText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  selected: {
    borderColor: '#4CAF50',
    borderRadius: 12,
    padding: 4,
  },
  dead: {
    opacity: 0.6,
  },
});

export default CharacterAvatar;
