import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlanWeekScreen() {
  const [clothes, setClothes] = useState([]);
  const [planner, setPlanner] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const load = async () => {
    const saved = await AsyncStorage.getItem('clothes');
    const plans = await AsyncStorage.getItem('plannedOutfits');
    setClothes(saved ? JSON.parse(saved) : []);
    const parsedPlans = plans ? JSON.parse(plans) : {};
    setPlanner(parsedPlans);
  };

  useEffect(() => {
    load().then(() => setIsMounted(true));
  }, []);

  const openModal = (day) => {
    if (!isMounted) return;
    setSelectedDate(day);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDate('');
  };

  const toggleItem = async (id) => {
    const current = planner[selectedDate] || [];
    const updated = current.includes(id)
      ? current.filter(i => i !== id)
      : [...current, id];
    const newPlan = { ...planner, [selectedDate]: updated };
    await AsyncStorage.setItem('plannedOutfits', JSON.stringify(newPlan));
    setPlanner(newPlan);
  };

  const renderPlannedOutfits = () => {
    const planned = planner[selectedDate] || [];
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {planned.map(id => {
          const item = clothes.find(c => c.id === id);
          if (!item) return null;
          return (
            <TouchableOpacity
              key={id}
              style={styles.imageWrapper}
              onLongPress={() => {
                Alert.alert("Remove?", "Remove this item from the day?", [
                  { text: "Cancel" },
                  { text: "Yes", onPress: () => toggleItem(id) },
                ]);
              }}
            >
              <Image source={{ uri: item.images[0] }} style={styles.image} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderClothesSelection = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {clothes.map(item => (
        <TouchableOpacity
          key={item.id}
          onPress={() => toggleItem(item.id)}
          style={[
            styles.imageWrapper,
            (planner[selectedDate] || []).includes(item.id) && styles.selected,
          ]}
        >
          <Image source={{ uri: item.images[0] }} style={styles.image} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const markedDates = Object.keys(planner).reduce((acc, date) => {
    if (planner[date]?.length > 0) {
      acc[date] = { marked: true, dotColor: '#007AFF' };
    }
    return acc;
  }, {});

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...(markedDates[selectedDate] || {}),
      selected: true,
      selectedColor: '#00BFA5',
    };
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Calendar
        onDayPress={day => openModal(day.dateString)}
        markedDates={markedDates}
      />

      {isMounted && (
        <Modal visible={modalVisible} animationType="slide">
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Plan for {selectedDate}</Text>

              <Text style={styles.sectionTitle}>Planned Outfits:</Text>
              {renderPlannedOutfits()}

              <Text style={styles.sectionTitle}>Add More Clothes:</Text>
              {renderClothesSelection()}

              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  imageWrapper: {
    marginRight: 12,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  selected: {
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
