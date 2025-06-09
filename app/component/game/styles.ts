
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
  },
  leftColumn: {
    width: '30%',
    backgroundColor: '#222',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  middleColumn: {
    flex: 1,
    padding: 8,
  },
  rightColumn: {
    width: '25%',
    backgroundColor: '#222',
    padding: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#333',
  },
  sceneContainer: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  sceneTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sceneDescriptionContainer: {
    maxHeight: 200,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sceneDescriptionScroll: {
    paddingRight: 8,
  },
  sceneDescriptionText: {
    color: '#ccc',
    lineHeight: 22,
  },
  enemiesTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  enemiesContainer: {
    marginBottom: 16,
    height: 120, // Fixed height for the entire enemies section
  },
  enemiesList: {
    height: 90, // Match the height of enemyWrapper
    flexGrow: 0, // Prevent vertical expansion
    alignItems: 'center', // Center cards vertically in the list
  },
  enemyWrapper: {
    width: 72, // 20% slimmer (90 * 0.8)
    height: 90,
    marginRight: 6,
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEnemySlot: {
    backgroundColor: 'rgba(42, 42, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4444',
    borderStyle: 'dashed',
    width: 72, // 20% slimmer to match enemyWrapper
    height: 90, // Match the height of enemyWrapper
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'column',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    borderRadius: 8,
    padding: 8,
  },
  actionButton: {
    width: 120,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attackButton: {
    backgroundColor: '#d32f2f',
  },
  magicButton: {
    backgroundColor: '#7b1fa2',
  },
  itemButton: {
    backgroundColor: '#1976d2',
  },
  runButton: {
    backgroundColor: '#f57c00',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 8,
  },
  logTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logContent: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    padding: 8,
  },
  logText: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 16,
  },
  characterCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
  },
  healthBarContainer: {
    marginTop: 2,
    width: '100%',
  },
  healthBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  healthFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  // Inventory styles
  inventoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  inventorySlot: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  inventoryItemName: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  inventoryList: {
    marginBottom: 15,
  },
  inventoryModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    marginBottom: 8,
  },
  inventoryModalItemText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Empty party slot styles
  emptyPartySlot: {
    backgroundColor: 'rgba(42, 42, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    borderStyle: 'dashed',
    width: 80, // 20% slimmer (100 * 0.8)
    height: 100,
  },
  emptySlotText: {
    color: '#666',
    fontSize: 12,
  },
  partyMemberWrapper: {
    width: 80, // 20% slimmer (100 * 0.8)
    height: 100,
    marginRight: 6, // Reduced to match enemy cards
    backgroundColor: '#2a2a2a',
    borderRadius: 6, // Matched to enemy cards
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    aspectRatio: 1,
  },
  
  partyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  healthText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 1,
  },
  partyContainer: {
    flexDirection: 'row',
    padding: 4,
    height: 100,
    alignItems: 'center', // Center cards vertically in the list
  },
  scrollContentContainer: {
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default styles;
