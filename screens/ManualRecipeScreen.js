import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ManualRecipeScreen({ navigation }) {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('category');

  const categories = [
    'APPETIZERS', 'MAIN COURSES', 'SIDE DISHES', 'SOUP&SALADS', 'DESSERTS', 'BAKING'
  ];

  // הפונקציה החכמה שלנו: בודקת אם יש עברית בטקסט
  const getFont = (text) => {
    if (!text) return 'Marcellus_400Regular'; // אם השדה ריק, נציג אנגלית כברירת מחדל
    const hebrewRegex = /[\u0590-\u05FF]/; // טווח התווים של עברית
    return hebrewRegex.test(text) ? 'SecularOne_400Regular' : 'Marcellus_400Regular';
  };

  const handleAddRecipe = async () => {
    if (!recipeName.trim()) {
      Alert.alert('Missing Info', 'Please enter a recipe name!');
      return;
    }

    const newRecipe = {
      id: Date.now().toString(),
      name: recipeName,
      category: selectedCategory !== 'category' ? selectedCategory : 'General',
      ingredients: ingredients,
      instructions: instructions,
    };

    try {
      const existingRecipes = await AsyncStorage.getItem('savedRecipes');
      let recipesArray = existingRecipes ? JSON.parse(existingRecipes) : [];
      recipesArray.push(newRecipe);
      await AsyncStorage.setItem('savedRecipes', JSON.stringify(recipesArray));
      
      // איפוס כל השדות שלנו כדי שהמסך יהיה נקי לפעם הבאה!
      setRecipeName('');
      setIngredients('');
      setInstructions('');
      setSelectedCategory('category');

      // הודעת הצלחה
      Alert.alert('Success!', 'Recipe added successfully 👩‍🍳');
      
      // התיקון: ניווט ישירות לטאב הבית (Home)
      navigation.navigate('Home');

    } catch (error) {
      Alert.alert('Error', 'Could not save the recipe.');
      console.error(error);
    }
  };
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={32} color="#000" />
      </TouchableOpacity>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Add your recipe</Text>

        <TextInput 
          // כאן אנחנו מפעילים את הפונקציה שקובעת את הפונט בזמן אמת!
          style={[styles.input, { fontFamily: getFont(recipeName) }]} 
          placeholder="recipe name..." 
          placeholderTextColor="#FFFFFF" 
          value={recipeName}
          onChangeText={setRecipeName}
        />

        <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
          <Text style={styles.dropdownText}>{selectedCategory}</Text>
          <Ionicons name="caret-down" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TextInput 
          style={[styles.input, styles.textArea, { fontFamily: getFont(ingredients) }]} 
          placeholder="ingredients..." 
          placeholderTextColor="#FFFFFF" 
          multiline={true} 
          value={ingredients}
          onChangeText={setIngredients}
        />

        <TextInput 
          style={[styles.input, styles.textArea, { height: 180, fontFamily: getFont(instructions) }]} 
          placeholder="instructions..." 
          placeholderTextColor="#FFFFFF" 
          multiline={true} 
          value={instructions}
          onChangeText={setInstructions}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddRecipe}>
            <Text style={styles.addButtonText}>add</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* המודאל נשאר בדיוק אותו הדבר */}
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
  mainContainer: { flex: 1, backgroundColor: '#D9D9D9' },
  backButton: { position: 'absolute', top: 60, left: 20, padding: 10, zIndex: 10 },
  container: { flex: 1 },
  content: { alignItems: 'center', paddingTop: 110, paddingBottom: 40 },
  title: { fontSize: 40, fontFamily: 'Marcellus_400Regular', color: '#000', marginBottom: 30 },
  // מחקנו מכאן את ה-fontFamily כי הוא מוגדר עכשיו דינמית בקוד למעלה
  input: { backgroundColor: '#46555A', width: '85%', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30, color: '#FFFFFF', fontSize: 18, marginBottom: 15, textAlign: 'auto' },
  dropdown: { backgroundColor: '#46555A', width: '85%', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  dropdownText: { color: '#FFFFFF', fontFamily: 'Marcellus_400Regular', fontSize: 16 },
  textArea: { height: 120, textAlignVertical: 'top', borderRadius: 40 },
  buttonContainer: { width: '85%', alignItems: 'flex-end', marginTop: 10 },
  addButton: { backgroundColor: '#46555A', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20 },
  addButtonText: { color: '#FFFFFF', fontFamily: 'Marcellus_400Regular', fontSize: 18 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#D9D9D9', width: '80%', borderRadius: 20, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontFamily: 'Marcellus_400Regular', marginBottom: 20, color: '#000' },
  modalItem: { backgroundColor: '#46555A', width: '100%', paddingVertical: 12, borderRadius: 15, marginBottom: 10, alignItems: 'center' },
  modalItemText: { color: '#FFFFFF', fontFamily: 'Marcellus_400Regular', fontSize: 16 },
  closeModalButton: { marginTop: 10 },
  closeModalText: { color: '#000', fontFamily: 'Marcellus_400Regular', fontSize: 16, textDecorationLine: 'underline' }
});