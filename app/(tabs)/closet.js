import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClosetScreen() {
  const [clothes, setClothes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [wornCount, setWornCount] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const scale = useSharedValue(1);
  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => (scale.value = event.scale),
    onEnd: () => (scale.value = withTiming(1)),
  });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    loadClothes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, wornCount, clothes]);

  const loadClothes = async () => {
    const saved = await AsyncStorage.getItem('clothes');
    const data = saved ? JSON.parse(saved) : [];
    setClothes(data);
  };

  const applyFilters = () => {
    let result = [...clothes];
    const query = searchQuery.toLowerCase().trim();

    if (query) {
      result = result.filter(item =>
        item.category.toLowerCase().includes(query) ||
        item.color.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (wornCount.trim() !== '' && !isNaN(wornCount)) {
      const count = parseInt(wornCount);
      result = result.filter(item => item.wearCount === count);
    }

    result.sort((a, b) => (b.favorite === true) - (a.favorite === true));
    setFiltered(result);
  };

  const toggleFavorite = async (id) => {
    const updated = clothes.map(item =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );
    await AsyncStorage.setItem('clothes', JSON.stringify(updated));
    setClothes(updated);
  };

  const confirmWear = (id) => {
    Alert.alert("Mark as worn?", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Yes", onPress: async () => {
          const updated = clothes.map(item =>
            item.id === id ? { ...item, wearCount: item.wearCount + 1 } : item
          );
          await AsyncStorage.setItem('clothes', JSON.stringify(updated));
          setClothes(updated);
        }
      }
    ]);
  };

  const confirmUnmark = (id) => {
    Alert.alert("Unmark?", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Yes", onPress: async () => {
          const updated = clothes.map(item =>
            item.id === id && item.wearCount > 0
              ? { ...item, wearCount: item.wearCount - 1 }
              : item
          );
          await AsyncStorage.setItem('clothes', JSON.stringify(updated));
          setClothes(updated);
        }
      }
    ]);
  };

  const toggleSelect = (id) => {
    if (!multiSelectMode) return;
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleLongPress = (id) => {
    setMultiSelectMode(true);
    setSelectedItems([id]);
  };

  const deleteSelected = () => {
    Alert.alert("Delete selected?", `Remove ${selectedItems.length} items?`, [
      { text: "Cancel" },
      {
        text: "Yes", onPress: async () => {
          const updated = clothes.filter(item => !selectedItems.includes(item.id));
          await AsyncStorage.setItem('clothes', JSON.stringify(updated));
          setClothes(updated);
          setMultiSelectMode(false);
          setSelectedItems([]);
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.filters}>
        <TextInput
          placeholder="Search by category, color, or tags"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
        />
        <TextInput
          placeholder="Times worn"
          value={wornCount}
          onChangeText={setWornCount}
          keyboardType="numeric"
          style={styles.input}
        />
        {multiSelectMode && (
          <TouchableOpacity style={styles.deleteBar} onPress={deleteSelected}>
            <Text style={styles.deleteBarText}>🗑 Delete Selected</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              selectedItems.includes(item.id) && styles.selectedCard,
            ]}
            onPress={() => toggleSelect(item.id)}
            onLongPress={() => handleLongPress(item.id)}
          >
            <Image source={{ uri: item.images[0] }} style={styles.image} />
            <Text style={styles.text}>{item.category} ({item.color})</Text>
            <Text style={styles.text}>👕 {item.wearCount} time(s)</Text>
            {!multiSelectMode && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: '#4CAF50' }]}
                  onPress={() => confirmWear(item.id)}
                >
                  <Text style={styles.btnText}>Worn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: '#f44336' }]}
                  onPress={() => confirmUnmark(item.id)}
                >
                  <Text style={styles.btnText}>Unmark</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => toggleFavorite(item.id)}
                  style={[styles.btn, { backgroundColor: item.favorite ? 'gold' : '#ccc' }]}
                >
                  <Text style={styles.btnText}>{item.favorite ? '★' : '☆'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </Pressable>
        )}
      />

      <Modal visible={!!previewImage} transparent animationType="fade">
        <Pressable style={styles.modalContainer} onPress={() => setPreviewImage(null)}>
          {previewImage && (
            <PinchGestureHandler onGestureEvent={pinchHandler}>
              <Animated.Image
                source={{ uri: previewImage }}
                style={[styles.fullImage, animatedStyle]}
              />
            </PinchGestureHandler>
          )}
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9f9f9', paddingTop: 10 },
  filters: { paddingHorizontal: 10, gap: 10, marginBottom: 10 },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  deleteBar: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteBarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  grid: { padding: 10 },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 6,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#00000022',
  },
  selectedCard: {
    borderColor: '#f44336',
    borderWidth: 2,
  },
  image: { width: 120, height: 120, borderRadius: 8, marginBottom: 6 },
  text: { fontSize: 12, textAlign: 'center' },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnText: { color: '#fff', fontSize: 12 },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000dd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    resizeMode: 'contain',
  },
});
