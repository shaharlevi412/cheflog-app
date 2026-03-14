import React, { useState } from 'react';
// הוספנו פה את Linking!
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe } = route.params;
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite || false);

  const getFont = (text) => {
    if (!text) return 'Marcellus_400Regular';
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text) ? 'SecularOne_400Regular' : 'Marcellus_400Regular';
  };

  const handleToggleFavorite = async () => {
    try {
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      const savedRecipes = await AsyncStorage.getItem('savedRecipes');
      if (savedRecipes) {
        let recipesArray = JSON.parse(savedRecipes);
        const updatedRecipes = recipesArray.map(item => {
          if (item.id === recipe.id) return { ...item, isFavorite: newFavoriteStatus };
          return item;
        });
        await AsyncStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRecipe = () => {
    const deleteAction = async () => {
      try {
        const savedRecipes = await AsyncStorage.getItem('savedRecipes');
        if (savedRecipes) {
          let recipesArray = JSON.parse(savedRecipes);
          recipesArray = recipesArray.filter(item => item.id !== recipe.id);
          await AsyncStorage.setItem('savedRecipes', JSON.stringify(recipesArray));
          navigation.goBack();
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this recipe?")) deleteAction();
    } else {
      Alert.alert("Delete Recipe", "Are you sure you want to delete this recipe?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: deleteAction }
      ]);
    }
  };

  // פונקציה שפותחת את הקישור
  const openLink = () => {
    if (recipe.url) {
      Linking.openURL(recipe.url).catch(err => console.error("Couldn't load page", err));
    }
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={32} color="#000" />
      </TouchableOpacity>

      <View style={styles.rightButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleToggleFavorite}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleDeleteRecipe}>
          <Ionicons name="trash-outline" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { fontFamily: getFont(recipe.name) }]}>
          {recipe.name}
        </Text>
        <Text style={styles.categoryBadge}>{recipe.category}</Text>

        {/* כאן הקסם: אם יש למתכון URL, נציג כפתור לאתר. אם לא, נציג מצרכים והוראות! */}
        {recipe.url ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipe Link:</Text>
            <TouchableOpacity onPress={openLink} style={styles.linkButton}>
              <Ionicons name="link-outline" size={24} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.linkButtonText}>Open in Browser</Text>
            </TouchableOpacity>
            {/* מציג גם את הקישור עצמו בקטן מתחת */}
            <Text style={styles.rawLinkText}>{recipe.url}</Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients:</Text>
              <Text style={[styles.textContent, { fontFamily: getFont(recipe.ingredients) }]}>
                {recipe.ingredients}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions:</Text>
              <Text style={[styles.textContent, { fontFamily: getFont(recipe.instructions) }]}>
                {recipe.instructions}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#D9D9D9' },
  backButton: { position: 'absolute', top: 60, left: 20, padding: 10, zIndex: 10 },
  rightButtonsContainer: { position: 'absolute', top: 60, right: 20, flexDirection: 'row', zIndex: 10 },
  actionButton: { padding: 10, marginLeft: 5 },
  container: { flex: 1 },
  content: { paddingTop: 120, paddingHorizontal: 25, paddingBottom: 40 },
  title: { fontSize: 40, color: '#000', marginBottom: 10 },
  categoryBadge: { fontSize: 16, fontFamily: 'Marcellus_400Regular', color: '#FFFFFF', backgroundColor: '#46555A', alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20, marginBottom: 30, overflow: 'hidden' },
  section: { marginBottom: 30, backgroundColor: 'rgba(70, 85, 90, 0.1)', padding: 20, borderRadius: 20 },
  sectionTitle: { fontSize: 22, fontFamily: 'Marcellus_400Regular', color: '#46555A', marginBottom: 15, fontWeight: 'bold' },
  textContent: { fontSize: 20, color: '#000', lineHeight: 30, textAlign: 'auto' },
  
  // עיצוב לכפתור הקישור
  linkButton: { flexDirection: 'row', backgroundColor: '#46555A', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  linkButtonText: { color: '#FFFFFF', fontFamily: 'Marcellus_400Regular', fontSize: 18 },
  rawLinkText: { color: '#666', fontSize: 14, textAlign: 'center', marginTop: 5 }
});