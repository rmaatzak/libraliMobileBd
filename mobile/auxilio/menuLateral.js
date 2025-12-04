import React, { useState, useRef } from "react";
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

import adultoImg from "../photos/adulto.png";

const { width, height } = Dimensions.get("window");

const MenuLateral = ({ navigation }) => {
  const [menuAberto, setMenuAberto] = useState(false);

  const animacaoLinha1 = useRef(new Animated.Value(0)).current;
  const animacaoLinha2 = useRef(new Animated.Value(0)).current;
  const animacaoLinha3 = useRef(new Animated.Value(0)).current;
  const animacaoMenu = useRef(new Animated.Value(width)).current;

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
    { id: 1, titulo: "Início", tela: "Home" },
    { id: 2, titulo: "Perfil", tela: "Perfil" },
    { id: 3, titulo: "Jogos", tela: "Jogos" },
    { id: 4, titulo: "Cursos", tela: "Cursos" },
    { id: 5, titulo: "Ajuda", tela: "Ajuda" },
    { id: 6, titulo: "Sair", tela: "Sair" },
  ];

  const navegarPara = (tela) => {
    toggleMenu();
    setTimeout(() => {
      if (navigation && navigation.navigate) {
        navigation.navigate(tela);
      }
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
                  source={adultoImg}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.perfilInfo}>
                <Text style={styles.nomeUsuario}>Adulto</Text>
                <Text style={styles.subtituloUsuario}>Minha Conta</Text>
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
                onPress={() => navegarPara(item.tela)}
                activeOpacity={0.7}
              >
                <Text style={styles.textoItem}>{item.titulo}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Rodapé */}
          <View style={styles.rodapeMenu}>
            <Text style={styles.textoRodape}>Versão 1.0.0</Text>
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
    right: 20, // Menu à DIREITA
    zIndex: 10001,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
    right: 0, // Menu sai da DIREITA
    bottom: 0,
    width: width * 0.65, // Ocupa 75% da largura da tela
    height: height, // Cobre a altura TOTAL da tela
    backgroundColor: "rgba(6, 32, 133, 0.61)",
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
  },
  perfilContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  perfilInfo: {
    flex: 1,
  },
  nomeUsuario: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  subtituloUsuario: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
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
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: 1.2,
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
  },
  textoItem: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
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
  },
});

export default MenuLateral;
