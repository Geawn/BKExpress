import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import SearchScreen from './screens/SearchScreen';
import SplashScreen from './components/SplashScreen';
import CategoryScreen from './screens/CategoryScreen';
import AddCateScreen from './screens/AddCateScreen';
import SavedArticlesScreen from './screens/SavedArticlesScreen';
import UtilityScreen from './screens/UtilityScreen';
import SettingsScreen from './screens/SettingsScreen';
import { AntDesign } from '@expo/vector-icons';

import { store } from './store/store'
import { Provider } from 'react-redux'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          position: 'absolute',
          bottom: 0.5,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 15,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        header: () => <NoHeader />,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Utility"
        component={UtilityScreen}
        options={{
          tabBarLabel: 'Tiện ích',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="appstore-o" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Cài đặt',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// for no header in home screen
const NoHeader = () => {
  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer style={{ backgroundColor: 'blue' }}>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ header: () => <NoHeader /> }} />
          <Stack.Screen name="MainApp" component={TabNavigator} options={{ header: () => <NoHeader /> }} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{ header: () => <NoHeader /> }} />
          <Stack.Screen name="Search" component={SearchScreen} options={{ header: () => <NoHeader /> }} />
          <Stack.Screen
            name="Category"
            component={CategoryScreen}
            options={{
              header: () => <NoHeader />,
              gestureDirection: 'horizontal-inverted',
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen name="AddCate" component={AddCateScreen} options={{ header: () => <NoHeader /> }} />
          <Stack.Screen name="SavedArticles" component={SavedArticlesScreen} options={{ header: () => <NoHeader /> }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}