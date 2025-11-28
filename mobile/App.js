// App.js
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./pages/splashScreen";
import Cadastro from "./pages/cadastro";
import Login from "./pages/login";
import InicialPage from "./pages/inicialPage";
import EscolhaPage from "./pages/escolhaPage";
import KidsTela from "./pages/kidsTela";
import AdultoTela from "./pages/adultoTela";
import Interface from "./pages/interface";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* ✅ TELA INICIAL: Verifica se está logado */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Inicial"
          component={InicialPage}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Escolha"
          component={EscolhaPage}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AdultoTela"
          component={AdultoTela}
          options={{ 
            headerShown: false,
            gestureEnabled: false // Impede voltar com gesto após login
          }}
        />

        <Stack.Screen
          name="KidsTela"
          component={KidsTela}
          options={{ 
            headerShown: false,
            gestureEnabled: false // Impede voltar com gesto após login
          }}
        />

        <Stack.Screen
          name="Interface"
          component={Interface}
          options={{ 
            headerShown: false,
            gestureEnabled: false // Impede voltar com gesto após login
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}