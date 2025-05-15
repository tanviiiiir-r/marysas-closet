import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-clothes"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="camera.fill" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="closet"
        options={{
          title: 'Closet',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="tshirt.fill" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plan-week"
        options={{
          title: 'Planner',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="calendar" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="chart.bar.fill" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-stylist"
        options={{
          title: 'AI Stylist',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="sparkles" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
