import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AIStylistScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.bigText}>🧠 AI Stylist</Text>
        <Text style={styles.subText}>Coming Soon...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bigText: { fontSize: 28, fontWeight: 'bold' },
  subText: { fontSize: 18, marginTop: 10, color: '#888' },
});
