import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// הוספנו את המילה navigation בסוגריים כדי שהמסך יוכל להשתמש ביכולות הניווט
export default function AddRecipeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* לחיצה על הכפתור תשלח אותנו למסך הדבקת הקישור */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('PasteUrl')}
      >
        <Text style={styles.buttonText}>copy URL</Text>
      </TouchableOpacity>
      
      {/* לחיצה על הכפתור השני תשלח אותנו למסך ההזנה הידנית */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ManualRecipe')}
      >
        <Text style={styles.buttonText}>my recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
  },
  button: {
    backgroundColor: '#46555A',
    width: '75%',
    paddingVertical: 20,
    borderRadius: 30,
    marginBottom: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontFamily: 'Marcellus_400Regular', // כמובן עם הפונט החדש שלנו!
  }
});