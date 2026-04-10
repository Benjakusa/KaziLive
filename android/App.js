import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import JobseekerDashboard from './src/screens/JobseekerDashboard';
import JobseekerProfile from './src/screens/JobseekerProfile';
import EmployerDashboard from './src/screens/EmployerDashboard';
import JobseekerList from './src/screens/JobseekerList';
import ProfileDetail from './src/screens/ProfileDetail';
import PaymentScreen from './src/screens/PaymentScreen';

import authReducer from './src/store/authSlice';

const Stack = createStackNavigator();
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="JobseekerDashboard" component={JobseekerDashboard} options={{ title: 'Home' }} />
          <Stack.Screen name="JobseekerProfile" component={JobseekerProfile} options={{ title: 'My Profile' }} />
          <Stack.Screen name="EmployerDashboard" component={EmployerDashboard} options={{ title: 'Employer' }} />
          <Stack.Screen name="JobseekerList" component={JobseekerList} options={{ title: 'Find Talent' }} />
          <Stack.Screen name="ProfileDetail" component={ProfileDetail} options={{ title: 'Profile' }} />
          <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}