import React, { useState, useRef, useEffect } from "react";
import { useFonts } from "expo-font";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import adultoImg from "../photos/adulto.png";
import avatar2 from "../photos/foto1.png";
import avatar3 from "../photos/foto2.png";
import avatar4 from "../photos/foto3.png";
import avatar5 from "../photos/foto4.png";
import avatar6 from "../photos/foto5.png";
import avatar7 from "../photos/foto6.png"; 




const { width, height } = Dimensions.get("window");


  

const MenuLateral = ({ navigation }) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(adultoImg);
  const [nomeUsuario, setNomeUsuario] = useState("Adulto");

  const animacaoLinha1 = useRef(new Animated.Value(0)).current;
  const animacaoLinha2 = useRef(new Animated.Value(0)).current;
  const animacaoLinha3 = useRef(new Animated.Value(0)).current;
  const animacaoMenu = useRef(new Animated.Value(width)).current;

  // Mapeamento de avatares
  const avatares = {
    avatar1: adultoImg,
    avatar2: avatar2,
    avatar3: avatar3,
    avatar4: avatar4,
    avatar5: avatar5,
    avatar6: avatar6,
    avatar7: avatar7,
  };

  

  // Carregar dados do usuário
  useEffect(() => {
    carregarDadosUsuario();

    // Configurar atualização periódica
    const interval = setInterval(carregarDadosUsuario, 3000);

    return () => clearInterval(interval);
  }, []);

  const carregarDadosUsuario = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("usuarioData");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);

        // Atualizar nome
        if (parsedUser.nome && parsedUser.nome !== nomeUsuario) {
          setNomeUsuario(parsedUser.nome);
        }

        // Atualizar foto do perfil
        if (parsedUser.avatarId && avatares[parsedUser.avatarId]) {
          setFotoPerfil(avatares[parsedUser.avatarId]);
        } else if (parsedUser.fotoPerfil) {
          setFotoPerfil(parsedUser.fotoPerfil);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  };

  
const [fontsLoaded] = useFonts({
    Strawford: require("../assets/font/Strawford-Regular.otf"),
    Brockmann: require("../assets/font/Brockmann-Medium.otf"),
  });

  

  
  const toggleMenu = () => {
    const novoEstado = !menuAberto;
    setMenuAberto(novoEstado);

    Animated.parallel([
      Animated.timing(animacaoLinha1, {
        toValue: novoEstado ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animacaoLinha2, {
        toValue: novoEstado ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animacaoLinha3, {
        toValue: novoEstado ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.spring(animacaoMenu, {
        toValue: novoEstado ? 0 : width,
        useNativeDriver: true,
        bounciness: 8,
      }),
    ]).start();
  };

    if (!fontsLoaded) {
    return null;
  }
  
  const linha1Transform = {
    transform: [
      {
        translateY: animacaoLinha1.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 8],
        }),
      },
      {
        rotate: animacaoLinha1.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "45deg"],
        }),
      },
    ],
    width: animacaoLinha1.interpolate({
      inputRange: [0, 1],
      outputRange: ["80%", "100%"],
    }),
  };

  const linha2Transform = {
    opacity: animacaoLinha2.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  };

  const linha3Transform = {
    transform: [
      {
        translateY: animacaoLinha3.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
        }),
      },
      {
        rotate: animacaoLinha3.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "-45deg"],
        }),
      },
    ],
    width: animacaoLinha3.interpolate({
      inputRange: [0, 1],
      outputRange: ["60%", "100%"],
    }),
  };

  


  const menuItems = [
    { id: 1, titulo: "Início", tela: "Interface" },
    { id: 2, titulo: "Perfil", tela: "Perfil" },
    { id: 3, titulo: "Jogos", tela: "Jogos" },
  ];

  const navegarPara = (tela) => {
    toggleMenu();
    setTimeout(() => {
      if (navigation && navigation.navigate) {
        if (
          tela === "Interface" &&
          navigation.state?.routeName === "Interface"
        ) {
          return;
        }
        navigation.navigate(tela);
      }
    }, 300);
  };

  const handleSair = () => {
    toggleMenu();
    setTimeout(() => {
      // Lógica para sair do app
      alert("Funcionalidade de sair será implementada");
    }, 300);
  };


  return (
    <View style={styles.container}>
      {/* Botão do Menu Hambúrguer à DIREITA */}
      <TouchableOpacity
        style={styles.botaoMenu}
        onPress={toggleMenu}
        activeOpacity={0.7}
      >
        <View style={styles.containerIcone}>
          <Animated.View
            style={[styles.linha, styles.linha1, linha1Transform]}
          />
          <Animated.View
            style={[styles.linha, styles.linha2, linha2Transform]}
          />
          <Animated.View
            style={[styles.linha, styles.linha3, linha3Transform]}
          />
        </View>
      </TouchableOpacity>

      {/* Overlay com blur - cobre TODA a tela */}
      {menuAberto && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}

      {/* Menu lateral - Agora abre da DIREITA e cobre a tela toda */}
      <Animated.View
        style={[
          styles.menuLateral,
          { transform: [{ translateX: animacaoMenu }] },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Cabeçalho com perfil */}
          <View style={styles.cabecalhoMenu}>
            <View style={styles.perfilContainer}>
              <View style={styles.avatarContainer}>
                <Image
                  source={fotoPerfil}
                  style={styles.avatar}
                  resizeMode="cover"
                />
                <View style={styles.statusOnline} />
              </View>
              <View style={styles.perfilInfo}>
                <Text style={styles.nomeUsuario}>{nomeUsuario}</Text>
                <Text style={styles.subtituloUsuario}>Minha Conta</Text>
                <TouchableOpacity
                  style={styles.verPerfilButton}
                  onPress={() => navegarPara("Perfil")}
                >
                  <Text style={styles.verPerfilTexto}>Ver Perfil Completo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Divisor */}
          <View style={styles.divisor} />

          {/* Label do Menu */}
          <View style={styles.labelContainer}>
            <Text style={styles.labelMenu}>MENU</Text>
          </View>

          {/* Lista de itens */}
          <ScrollView
            style={styles.listaItens}
            showsVerticalScrollIndicator={false}
          >
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemMenu}
                onPress={() =>
                  item.titulo === "Sair" ? handleSair() : navegarPara(item.tela)
                }
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.textoItem,
                    item.titulo === "Sair" && styles.textoSair,
                  ]}
                >
                  {item.titulo}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Rodapé */}
          <View style={styles.rodapeMenu}>
            <Text style={styles.textoRodape}>Versão 1.0.0</Text>
            <Text style={styles.textoRodape}>
              Avatar Atualizado Automaticamente
            </Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: "box-none",
  },
  botaoMenu: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 60,
    right: 20,
    zIndex: 10001,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 139, 0.8)",
    borderRadius: 20,
  },
  containerIcone: {
    width: 24,
    height: 18,
    justifyContent: "space-between",
  },
  linha: {
    height: 3,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  linha1: {
    width: "80%",
    alignSelf: "center",
  },
  linha2: {
    width: "100%",
  },
  linha3: {
    width: "60%",
    alignSelf: "flex-end",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 9998,
  },
  menuLateral: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: width * 0.65,
    height: height,
    backgroundColor: "rgba(6, 31, 133, 0.65)",
    zIndex: 9999,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255, 255, 255, 0.1)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: -4, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  safeArea: {
    flex: 1,
  },
  cabecalhoMenu: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 70,
    backgroundColor: "rgba(0, 0, 139, 0.3)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  perfilContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  statusOnline: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "rgba(6, 32, 133, 0.95)",
  },
  perfilInfo: {
    flex: 1,
  },
  nomeUsuario: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtituloUsuario: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
  },
  verPerfilButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    marginTop: 5,
  },
  verPerfilTexto: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  divisor: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 20,
    marginVertical: 15,
  },
  labelContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  labelMenu: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: 1.2,
    fontFamily: "Brockmann",
  },
  listaItens: {
    flex: 1,
  },
  itemMenu: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  textoItem: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Strawford",
  },
  textoSair: {
    color: "#FF6B6B",
  },
  rodapeMenu: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  textoRodape: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.4)",
    textAlign: "center",
    marginBottom: 5,
  },
});

export default MenuLateral;
