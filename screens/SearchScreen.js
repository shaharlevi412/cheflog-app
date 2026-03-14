import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [allRecipes, setAllRecipes] = useState([]); // שומר את כל המתכונים שיש לנו
  const [filteredRecipes, setFilteredRecipes] = useState([]); // שומר רק את תוצאות החיפוש

  const getFont = (text) => {
    if (!text) return 'Marcellus_400Regular';
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text) ? 'SecularOne_400Regular' : 'Marcellus_400Regular';
  };

  // ברגע שנכנסים למסך, אנחנו טוענים את כל המתכונים מהזיכרון
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const savedRecipes = await AsyncStorage.getItem('savedRecipes');
        if (savedRecipes) {
          setAllRecipes(JSON.parse(savedRecipes));
        }
      } catch (error) {
        console.error(error);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadRecipes();
      setSearchQuery(''); // מנקה את שורת החיפוש כשנכנסים מחדש
      setFilteredRecipes([]); // מנקה את התוצאות
    });

    return unsubscribe;
  }, [navigation]);

  // הפונקציה שמופעלת בכל פעם שאת מקלידה אות
  const handleSearch = (text) => {
    setSearchQuery(text);
    
    // אם שורת החיפוש ריקה, אל תציג כלום
    if (text.trim() === '') {
      setFilteredRecipes([]);
    } else {
      // אם יש טקסט, נסנן את הרשימה!
      const lowerCaseQuery = text.toLowerCase();
      const filtered = allRecipes.filter(recipe => {
        // בודק אם מילת החיפוש קיימת או בשם המתכון או בתוך המצרכים
        const nameMatch = recipe.name && recipe.name.toLowerCase().includes(lowerCaseQuery);
        const ingredientsMatch = recipe.ingredients && recipe.ingredients.toLowerCase().includes(lowerCaseQuery);
        return nameMatch || ingredientsMatch;
      });
      setFilteredRecipes(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#FFFFFF" style={styles.icon} />
        <TextInput 
          style={[styles.input, { fontFamily: getFont(searchQuery) }]} 
          placeholder="search" 
          placeholderTextColor="#FFFFFF"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* אזור הצגת התוצאות */}
      <ScrollView contentContainerStyle={styles.resultsContainer}>
        {/* אם הקלדנו משהו אבל אין תוצאות */}
        {searchQuery.trim() !== '' && filteredRecipes.length === 0 ? (
          <Text style={styles.noResultsText}>No recipes found...</Text>
        ) : (
          // אם מצאנו מתכונים, נציג אותם כרשימת כפתורים
          filteredRecipes.map((recipe) => (
            <TouchableOpacity 
              key={recipe.id} 
              style={styles.recipeCard}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: recipe })}
            >
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
  container: { flex: 1, alignItems: 'center', backgroundColor: '#D9D9D9', paddingTop: 100 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#46555A', width: '80%', borderRadius: 30, paddingHorizontal: 15, height: 50, marginBottom: 30 },
  icon: { marginRight: 10 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 18, textAlign: 'auto' }, // הפונט מוגדר דינמית למעלה
  resultsContainer: { width: '100%', alignItems: 'center', paddingBottom: 40 },
  noResultsText: { fontSize: 20, fontFamily: 'Marcellus_400Regular', color: '#666', marginTop: 20 },
  recipeCard: { backgroundColor: '#46555A', width: '85%', paddingVertical: 20, borderRadius: 20, marginBottom: 15, alignItems: 'center' },
  recipeName: { color: '#FFFFFF', fontSize: 22, textAlign: 'center' }
});