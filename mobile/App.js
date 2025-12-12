// App.js
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Cadastro from "./pages/cadastro";
import Login from "./pages/login";
import InicialPage from "./pages/inicialPage";
import EscolhaPage from "./pages/escolhaPage";
import KidsTela from "./pages/kidsTela";
import Interface from "./pages/interface";
import Jogos from "./pages/jogos";
import Perfil from "./pages/perfil";
import Fase1Alfabeto from "./pages/Fase1Alfabeto";
import Fase2Numeros from "./pages/Fase2Numeros";
import Fase3Cumprimentos from "./pages/Fase3Cumprimentos";
import Fase4Cores from "./pages/Fase4Cores";
import Fase5Alimentos from "./pages/Fase5Alimentos";
import Fase6Desafio1 from "./pages/Fase6Desafio1";


// Homes das regiões
import NorteHome from './Norte/home';
import CentroHome from './Centro/home';
import SulHome from './Sul/home';

// Fases da região Norte
import Amazonia from './Norte/amazonia';
import Acre from './Norte/acre';
import Para from './Norte/para';
import Nordeste1 from './Norte/ceara';
import Nordeste2 from './Norte/bahia';

// Fases da região Sul (Sudeste)
import Minas from './Sul/minas';
import SaoPaulo from './Sul/sp';
import RioJaneiro from './Sul/rj';
import RioGrandeSul from './Sul/riogrande';

// Fases da região Centro
import Goias from './Centro/goias';
import MatoGrosso from './Centro/matogrosso';
import Bahia from './Centro/bahia';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Inicial"
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

           <Stack.Screen 
          name="NorteHome" 
          component={NorteHome}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="CentroHome" 
          component={CentroHome}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="SulHome" 
          component={SulHome}
          options={{ headerShown: false }}
        />

        {/* FASES DA REGIÃO NORTE */}
        <Stack.Screen 
          name="Amazonia"
          component={Amazonia}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="Acre"
          component={Acre}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="Para"
          component={Para}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="Nordeste1"
          component={Nordeste1}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="Nordeste2"
          component={Nordeste2}
          options={{ headerShown: false }}
        />

        {/* FASES DA REGIÃO SUL */}
        <Stack.Screen 
          name="Minas"     
          component={Minas}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="SaoPaulo"
          component={SaoPaulo}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="RioJaneiro"
          component={RioJaneiro}
          options={{ headerShown: false }}
        />
        
        {/* REMOVIDO: SantaCatarina */}
        
        <Stack.Screen 
          name="RioGrandeSul"
          component={RioGrandeSul}
          options={{ headerShown: false }}
        />

        {/* FASES DA REGIÃO CENTRO */}
        <Stack.Screen 
          name="Goias"
          component={Goias}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="MatoGrosso"
          component={MatoGrosso}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="Bahia"
          component={Bahia}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
