import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  const categories = [
    'APPETIZERS', 'MAIN COURSES', 'SIDE DISHES', 'SOUP&SALADS', 'DESSERTS', 'BAKING'
  ];

  return (
    // שינינו את המעטפת ל-ScrollView
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer} // כאן שמים את היישור למרכז
    >
      <Text style={styles.title}>MY RECIPES</Text>
      
      {categories.map((category, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.button}
          onPress={() => navigation.navigate('CategoryRecipes', { categoryName: category })}
        >
          <Text style={styles.buttonText}>{category}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#D9D9D9' 
  },
  contentContainer: {
    alignItems: 'center', 
    paddingTop: 80,
    paddingBottom: 40, // הוספנו ריווח קטן למטה כדי שהכפתור האחרון לא יידבק לתפריט התחתון
  },
  title: { 
    fontSize: 45, 
    marginBottom: 40, 
    fontFamily: 'Marcellus_400Regular', 
    color: '#000', 
    fontWeight: 'bold' 
  },
  button: { 
    backgroundColor: '#46555A', 
    width: '75%', 
    paddingVertical: 18, 
    borderRadius: 30, 
    marginBottom: 16, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontFamily: 'Marcellus_400Regular', 
    letterSpacing: 1 
  }
});