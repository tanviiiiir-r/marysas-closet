import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Button,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data reload (or use real logic if needed)
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Home screen refreshed");
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.title}>Marysa's Closet</Text>
        <Link href="/add-clothes" asChild><Button title="Add Clothes" /></Link>
        <Link href="/closet" asChild><Button title="View Closet" /></Link>
        <Link href="/plan-week" asChild><Button title="Plan Outfits" /></Link>
        <Link href="/stats" asChild><Button title="Closet Stats" /></Link>
        <Link href="/ai-stylist" asChild><Button title="Ask AI Stylist" /></Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', gap: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
