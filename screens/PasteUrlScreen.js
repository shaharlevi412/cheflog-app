import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PasteUrlScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('category');
  
  // המשתנים החדשים שלנו
  const [recipeName, setRecipeName] = useState('');
  const [url, setUrl] = useState('');

  const categories = [
    'APPETIZERS', 'MAIN COURSES', 'SIDE DISHES', 'SOUP&SALADS', 'DESSERTS', 'BAKING'
  ];

  const getFont = (text) => {
    if (!text) return 'Marcellus_400Regular';
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text) ? 'SecularOne_400Regular' : 'Marcellus_400Regular';
  };

  // פונקציית השמירה
  const handleAddLink = async () => {
    if (!recipeName.trim() || !url.trim()) {
      Alert.alert('Missing Info', 'Please enter a name and paste a link!');
      return;
    }

    const newRecipe = {
      id: Date.now().toString(),
      name: recipeName,
      category: selectedCategory !== 'category' ? selectedCategory : 'General',
      url: url, // אנחנו שומרים פה את הקישור במקום מצרכים/הוראות
      isFavorite: false,
    };

    try {
      const existingRecipes = await AsyncStorage.getItem('savedRecipes');
      let recipesArray = existingRecipes ? JSON.parse(existingRecipes) : [];
      recipesArray.push(newRecipe);
      
      await AsyncStorage.setItem('savedRecipes', JSON.stringify(recipesArray));
      
      // איפוס שדות
      setRecipeName('');
      setUrl('');
      setSelectedCategory('category');

      Alert.alert('Success!', 'Recipe link added successfully 🔗');
      navigation.navigate('Home'); // חזרה למסך הבית
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not save the link.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={32} color="#000" />
      </TouchableOpacity>

      <View style={styles.formContainer}>
        {/* שדה חדש לשם המתכון */}
        <TextInput 
          style={[styles.input, { fontFamily: getFont(recipeName) }]} 
          placeholder="recipe name..." 
          placeholderTextColor="#FFFFFF" 
          value={recipeName}
          onChangeText={setRecipeName}
        />

        {/* שדה הקישור */}
        <TextInput 
          style={styles.input} 
          placeholder="paste your link here" 
          placeholderTextColor="#FFFFFF" 
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none" // שלא יעשה אות גדולה באנגלית בתחילת הקישור
        />
        
        <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
          <Text style={styles.dropdownText}>{selectedCategory}</Text>
          <Ionicons name="caret-down" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddLink}>
        <Text style={styles.addButtonText}>add</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {categories.map((cat, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCategory(cat);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{cat}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#D9D9D9', paddingTop: 130 },
  backButton: { position: 'absolute', top: 60, left: 20, padding: 10, zIndex: 1 },
  formContainer: { width: '100%', alignItems: 'center', marginTop: 20 },
  input: { backgroundColor: '#46555A', width: '80%', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 30, color: '#FFFFFF', fontSize: 18, marginBottom: 20, textAlign: 'auto' },
  dropdown: { backgroundColor: '#46555A', width: '80%', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropdownText: { color: '#FFFFFF', fontFamily: 'Marcellus_400Regular', fontSize: 18 },
  addButton: { backgroundColor: '#46555A', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20, position: 'absolute', bottom: 40, right: 40 },
  addButtonText: { color: '#FFFFFF', fontFamily: 'Marcellus_400Regular', fontSize: 18 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#D9D9D9', width: '80%', borderRadius: 20, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontFamily: 'Marcellus_400Regular', marginBottom: 20, color: '#000' },
  modalItem: { backgroundColor: '#46555A', width: '100%', paddingVertical: 12, borderRadius: 15, marginBottom: 10, alignItems: 'center' },
  modalItemText: { color: '#FFFFFF', fontFamily: 'Marcellus_400Regular', fontSize: 16 },
  closeModalButton: { marginTop: 10 },
  closeModalText: { color: '#000', fontFamily: 'Marcellus_400Regular', fontSize: 16, textDecorationLine: 'underline' }
});