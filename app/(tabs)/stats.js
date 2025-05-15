import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StatsScreen() {
  const [clothes, setClothes] = useState([]);

  const load = async () => {
    const saved = await AsyncStorage.getItem('clothes');
    setClothes(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    load();
  }, []);

  const wornItems = clothes.filter(i => i.wearCount > 0);
  const mostWorn = [...wornItems].sort((a, b) => b.wearCount - a.wearCount).slice(0, 5);
  const leastWorn = [...wornItems].sort((a, b) => a.wearCount - b.wearCount).slice(0, 5);
  const neverWorn = clothes.filter(i => i.wearCount === 0);

  const categoryCounts = clothes.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const tagCounts = clothes.flatMap(item => item.tags || []).reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const totalWear = clothes.reduce((sum, item) => sum + item.wearCount, 0);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.images?.[0] }} style={styles.image} />
      <Text style={styles.label}>{item.category} ({item.wearCount})</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>📊 Closet Stats</Text>
        <Text>Total Clothes: {clothes.length}</Text>
        <Text>Total Wear Count: {totalWear}</Text>

        {mostWorn.length > 0 && (
          <>
            <Text style={styles.section}>🔥 Most Worn</Text>
            <FlatList horizontal data={mostWorn} keyExtractor={i => i.id} renderItem={renderItem} />
          </>
        )}

        {leastWorn.length > 0 && (
          <>
            <Text style={styles.section}>🧼 Least Worn</Text>
            <FlatList horizontal data={leastWorn} keyExtractor={i => i.id} renderItem={renderItem} />
          </>
        )}

        {neverWorn.length > 0 && (
          <>
            <Text style={styles.section}>❄️ Never Worn</Text>
            <FlatList horizontal data={neverWorn} keyExtractor={i => i.id} renderItem={renderItem} />
          </>
        )}

        <Text style={styles.section}>📂 Category Distribution</Text>
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <Text key={cat} style={styles.textItem}>• {cat}: {count}</Text>
        ))}

        <Text style={styles.section}>🏷️ Top Tags</Text>
        {topTags.length === 0 ? (
          <Text>No tags yet.</Text>
        ) : (
          topTags.map(([tag, count]) => (
            <Text key={tag} style={styles.textItem}>• {tag} ({count})</Text>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  section: { marginTop: 20, fontSize: 16, fontWeight: '600' },
  item: { marginRight: 12, alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 6, marginBottom: 4 },
  label: { fontSize: 12, textAlign: 'center' },
  textItem: { marginLeft: 6, marginVertical: 2, fontSize: 13 },
});
