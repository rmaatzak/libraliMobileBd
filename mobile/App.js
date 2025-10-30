import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import InicialPage from './pages/inicialPage';
import AdultoPage from "./pages/adultoPage"


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicial">
        <Stack.Screen
          name="Inicial"
          component={InicialPage}
          options={{ headerShown: false }}
        />
 
      <Stack.Screen 
          name="Adulto"
          component={AdultoPage}
          options={{ headerShown: false }}
        /> 

      </Stack.Navigator>
    </NavigationContainer>
  );
}
