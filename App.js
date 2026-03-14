import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// התיקון שלנו: הפרדנו את הייבוא!
import { useFonts } from 'expo-font'; 
import { Marcellus_400Regular } from '@expo-google-fonts/marcellus';
import { SecularOne_400Regular } from '@expo-google-fonts/secular-one';

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import AddRecipeScreen from './screens/AddRecipeScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import PasteUrlScreen from './screens/PasteUrlScreen';
import ManualRecipeScreen from './screens/ManualRecipeScreen';
import CategoryRecipesScreen from './screens/CategoryRecipesScreen'; 
import RecipeDetailScreen from './screens/RecipeDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AddRecipeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddRecipeMain" component={AddRecipeScreen} />
      <Stack.Screen name="PasteUrl" component={PasteUrlScreen} />
      <Stack.Screen name="ManualRecipe" component={ManualRecipeScreen} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="CategoryRecipes" component={CategoryRecipesScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Marcellus_400Regular,
    SecularOne_400Regular,
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { 
            backgroundColor: '#D9D9D9',
            borderTopWidth: 1,
            borderTopColor: '#000',
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#000',
          tabBarLabelStyle: {
            fontFamily: 'Marcellus_400Regular',
            fontSize: 10,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'caret-up';
            else if (route.name === 'Search') iconName = 'search-outline';
            else if (route.name === 'Add Recipe') iconName = 'pencil-outline';
            else if (route.name === 'Favorites') iconName = 'heart-outline';
            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack} 
          options={{ tabBarLabel: 'HOME' }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault(); 
              navigation.navigate('Home', { screen: 'HomeMain' }); 
            },
          })}
        />
        
        <Tab.Screen 
          name="Search" 
          component={SearchStack} 
          options={{ tabBarLabel: 'SEARCH' }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('Search', { screen: 'SearchMain' });
            },
          })}
        />
        
        <Tab.Screen 
          name="Add Recipe" 
          component={AddRecipeStack} 
          options={{ tabBarLabel: 'ADD RECIPE' }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('Add Recipe', { screen: 'AddRecipeMain' });
            },
          })}
        />
        
        <Tab.Screen 
          name="Favorites" 
          component={FavoritesStack} 
          options={{ tabBarLabel: 'FAVORITES' }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('Favorites', { screen: 'FavoritesMain' });
            },
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}