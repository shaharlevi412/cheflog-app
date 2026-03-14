import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoritesScreen({ navigation }) {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  const getFont = (text) => {
    if (!text) return 'Marcellus_400Regular';
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text) ? 'SecularOne_400Regular' : 'Marcellus_400Regular';
  };

  // שולף מהזיכרון בכל פעם שנכנסים למסך הזה
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedRecipes = await AsyncStorage.getItem('savedRecipes');
        if (savedRecipes) {
          const allRecipes = JSON.parse(savedRecipes);
          // מסננים רק את מי שקיבל לב!
          const favorites = allRecipes.filter(recipe => recipe.isFavorite === true);
          setFavoriteRecipes(favorites);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* אם יש מתכונים אהובים, נציג אותם כרשימה */}
      {favoriteRecipes.length > 0 ? (
        <ScrollView contentContainerStyle={styles.listContainer}>
          <Text style={styles.title}>FAVORITES</Text>
          {favoriteRecipes.map((recipe) => (
            <TouchableOpacity 
              key={recipe.id} 
              style={styles.recipeCard}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: recipe })}
            >
              <Text style={[styles.recipeName, { fontFamily: getFont(recipe.name) }]}>
                {recipe.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        // אם אין מתכונים, נציג את המסך הריק שעיצבת
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>you haven't</Text>
          <Text style={styles.emptyText}>saved any</Text>
          <Text style={styles.emptyText}>recipes yet...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D9D9D9' },
  
  // עיצוב לרשימה המלאה
  listContainer: { alignItems: 'center', paddingTop: 80, paddingBottom: 40 },
  title: { fontSize: 45, marginBottom: 40, fontFamily: 'Marcellus_400Regular', color: '#000', fontWeight: 'bold' },
  recipeCard: { backgroundColor: '#46555A', width: '85%', paddingVertical: 20, borderRadius: 20, marginBottom: 15, alignItems: 'center' },
  recipeName: { color: '#FFFFFF', fontSize: 22, textAlign: 'center' },

  // עיצוב למסך הריק (כמו שהיה בהתחלה)
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: '15%' },
  emptyText: { fontSize: 38, fontFamily: 'Marcellus_400Regular', color: '#000', lineHeight: 45 }
});