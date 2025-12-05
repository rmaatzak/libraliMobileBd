// App.js
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Cadastro from "./pages/cadastro";
import Login from "./pages/login";
import InicialPage from "./pages/inicialPage";
import EscolhaPage from "./pages/escolhaPage";
import KidsTela from "./pages/kidsTela";
import AdultoTela from "./pages/adultoTela";
import Interface from "./pages/interface";
import Jogos from "./pages/jogos";
import Perfil from "./pages/perfil";
import Fase1Alfabeto from "./pages/Fase1Alfabeto";
import Fase2Numeros from "./pages/Fase2Numeros";
import Fase3Cumprimentos from "./pages/Fase3Cumprimentos";
import Fase4Cores from "./pages/Fase4Cores";
import Fase5Alimentos from "./pages/Fase5Alimentos";
import Fase6Desafio1 from "./pages/Fase6Desafio1";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Jogos"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false, // Desativa gestos de voltar globalmente
        }}
      >
        <Stack.Screen name="Inicial" component={InicialPage} />
        <Stack.Screen name="Escolha" component={EscolhaPage} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Login" component={Login} />

        {/* Telas principais após login */}
        <Stack.Screen name="AdultoTela" component={AdultoTela} />
        <Stack.Screen name="KidsTela" component={KidsTela} />
        <Stack.Screen name="Interface" component={Interface} />

        {/* Menu de navegação */}
        <Stack.Screen name="Jogos" component={Jogos} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen
          name="Fase1Alfabeto"
          component={Fase1Alfabeto}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Fase2Numeros"
          component={Fase2Numeros}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Fase3Cumprimentos"
          component={Fase3Cumprimentos}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="Fase4Cores" component={Fase4Cores} />
        <Stack.Screen name="Fase5Alimentos" component={Fase5Alimentos} />
        <Stack.Screen name="Fase6Desafio1" component={Fase6Desafio1} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
