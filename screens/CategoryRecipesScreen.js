import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CategoryRecipesScreen({ route, navigation }) {
  const { categoryName } = route.params;
  const [recipes, setRecipes] = useState([]);

  // הוספנו את הפונקציה החכמה לבחירת פונט גם לפה!
  const getFont = (text) => {
    if (!text) return 'Marcellus_400Regular';
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text) ? 'SecularOne_400Regular' : 'Marcellus_400Regular';
  };

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const savedRecipes = await AsyncStorage.getItem('savedRecipes');
        if (savedRecipes) {
          const allRecipes = JSON.parse(savedRecipes);
          const filteredRecipes = allRecipes.filter(recipe => recipe.category === categoryName);
          setRecipes(filteredRecipes);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadRecipes();
    });

    return unsubscribe;
  }, [navigation, categoryName]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={32} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>{categoryName}</Text>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {recipes.length === 0 ? (
          <Text style={styles.emptyText}>No recipes here yet...</Text>
        ) : (
          recipes.map((recipe) => (
            <TouchableOpacity 
              key={recipe.id} 
              style={styles.recipeCard}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: recipe })}
            >
              {/* כאן אנחנו קוראים לפונקציה כדי שתקבע את הפונט של הכפתור */}
              <Text style={[styles.recipeName, { fontFamily: getFont(recipe.name) }]}>
                {recipe.name}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    paddingTop: 100,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 35,
    fontFamily: 'Marcellus_400Regular',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  listContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: 'Marcellus_400Regular',
    color: '#666',
    marginTop: 50,
  },
  recipeCard: {
    backgroundColor: '#46555A',
    width: '85%',
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  // הורדנו מפה את ה-fontFamily כי עכשיו הוא מוגדר דינמית למעלה
  recipeName: {
    color: '#FFFFFF',
    fontSize: 22,
    textAlign: 'center',
  }
});