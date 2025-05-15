import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddClothesScreen() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [tags, setTags] = useState('');

  const pickImage = async (fromCamera = false) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera access is required.');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 1, allowsEditing: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 1, allowsEditing: true });

    if (!result.canceled && result.assets?.[0]?.uri) {
      if (images.length >= 3) {
        Alert.alert('Limit', 'Only 3 images allowed.');
        return;
      }
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const saveItem = async () => {
    if (!images.length || !category || !color) {
      Alert.alert('Missing info', 'Add image, category and color.');
      return;
    }

    const tagList = tags.split(',').map((t) => t.trim());
    const newItem = {
      id: Date.now().toString(),
      images,
      category,
      color,
      tags: tagList,
      wearCount: 0,
    };

    const existing = await AsyncStorage.getItem('clothes');
    const items = existing ? JSON.parse(existing) : [];
    items.push(newItem);
    await AsyncStorage.setItem('clothes', JSON.stringify(items));

    Alert.alert('Saved!', 'Clothing item added.');
    setImages([]);
    setCategory('');
    setColor('');
    setTags('');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>➕ Add Clothing</Text>

        <View style={styles.row}>
          <Button title="📸 Camera" onPress={() => pickImage(true)} />
          <Button title="🖼️ Gallery" onPress={() => pickImage(false)} />
        </View>

        {images.length > 0 && (
          <ScrollView horizontal style={{ marginVertical: 10 }}>
            {images.map((img, idx) => (
              <View key={idx} style={styles.imageWrapper}>
                <Image source={{ uri: img }} style={styles.image} />
                <TouchableOpacity
                  onPress={() => removeImage(idx)}
                  style={styles.removeBtn}
                >
                  <Text style={styles.removeText}>❌</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} />
        <TextInput placeholder="Color" value={color} onChangeText={setColor} style={styles.input} />
        <TextInput placeholder="Tags (comma-separated)" value={tags} onChangeText={setTags} style={styles.input} />

        <Button title="✅ Save to Closet" onPress={saveItem} color="#4CAF50" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 15, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 10 },
  row: { flexDirection: 'row', gap: 16 },
  input: { width: '100%', borderWidth: 1, padding: 10, borderRadius: 8, borderColor: '#ccc' },
  imageWrapper: { position: 'relative', marginRight: 10 },
  image: { width: 120, height: 120, borderRadius: 8 },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'red',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  removeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
