// interface.js
import React, { useRef, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import MenuLateral from "../auxilio/menuLateral";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IMPORTANTE: Altere este caminho para o local correto da sua imagem
import Logo from "../assets/logoBR.png";

// Importar avatares
import adultoImg from "../photos/adulto.png";
import avatar2 from "../photos/foto1.png";
import avatar3 from "../photos/foto2.png";
import avatar4 from "../photos/foto3.png";
import avatar5 from "../photos/foto4.png";
import avatar6 from "../photos/foto5.png";
import avatar7 from "../photos/foto6.png";

export default function Interface({ route, navigation }) {
  const { nome } = route?.params || { nome: "Usuário" };
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight] = useState(280);
  const [minHeaderHeight] = useState(100);
  const [nomeUsuario, setNomeUsuario] = useState(nome);
  const [fotoPerfil, setFotoPerfil] = useState(adultoImg);

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

    // Atualizar periodicamente para sincronizar
    const interval = setInterval(carregarDadosUsuario, 2000);

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

  // Configuração da animação do header - agora fica fixo após certo ponto
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [0, -180],
    extrapolate: "clamp",
  });

  // Header diminui até um tamanho mínimo e para
  const headerHeightAnimated = scrollY.interpolate({
    inputRange: [0, 180, 500],
    outputRange: [headerHeight, minHeaderHeight, minHeaderHeight],
    extrapolate: "clamp",
  });

  // Texto desaparece completamente
  const textOpacity = scrollY.interpolate({
    inputRange: [0, 80, 160],
    outputRange: [1, 0.1, 0],
    extrapolate: "clamp",
  });

  const textTranslateY = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [0, -80],
    extrapolate: "clamp",
  });

  // Opacidade da logo (sempre visível)
  const logoOpacity = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [0.8, 1],
    extrapolate: "clamp",
  });

  // Logo se move para cima para se centralizar no header menor
  const logoTranslateY = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  // Menu lateral também se move junto com a logo
  const menuTranslateY = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const navegarPara = (tela) => {
    navigation.navigate(tela);
  };

  // Dados dos 3 cards - COM LINKAMENTO DE IMAGENS VIA require()
  const cardsData = [
    {
      id: 1,
      titulo: "Cursos",
      descricao: "Aprenda Libras passo a passo",
      imagem: require("../assets/cursos.png"),
      cor: "#F89F30",
      tela: "Cursos",
    },
    {
      id: 2,
      titulo: "Jogos",
      descricao: "Aprenda de forma divertida",
      imagem: require("../assets/jogos.png"),
      cor: "#4169E1",
      tela: "Jogos",
    },
    {
      id: 3,
      titulo: "Outros",
      descricao: "Mais recursos e ferramentas",
      imagem: require("../assets/outros.png"),
      cor: "#F89F30",
      tela: "Outros",
    },
  ];

  // Dados dos valores - COM LINKAMENTO DE IMAGENS VIA require()
  const valoresData = [
    {
      id: 1,
      titulo: "Inclusão",
      imagem: require("../assets/inclusao.png"),
    },
    {
      id: 2,
      titulo: "Educação",
      imagem: require("../assets/educacao.png"),
    },
    {
      id: 3,
      titulo: "Comunidade",
      imagem: require("../assets/comunidade.png"),
    },
  ];

  const irParaPerfil = () => {
    navigation.navigate("Perfil");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00008B" />

      {/* HEADER ANIMADO - AGORA FIXO NO TOPO */}
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeightAnimated,
          },
        ]}
      >
        {/* Logo que fica sempre visível */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ translateY: logoTranslateY }],
            },
          ]}
        >
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        {/* Texto que desaparece ao rolar */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.hi}>Olá, {nomeUsuario}</Text>
          <Text style={styles.question}>O que você gostaria de hoje?</Text>
        </Animated.View>
      </Animated.View>

      {/* MENU LATERAL - AGORA COM ANIMAÇÃO SIMILAR À LOGO */}
      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateY: menuTranslateY }],
          },
        ]}
      >
        <MenuLateral navigation={navigation} />
      </Animated.View>

      {/* CONTEÚDO PRINCIPAL COM SCROLL */}
      <Animated.ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight + 20 },
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* SEÇÃO: VAMOS PRATICAR? */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vamos praticar?</Text>
            <Text style={styles.sectionSubtitle}>
              Escolha uma das opções abaixo para começar sua jornada em Libras
            </Text>
          </View>

          {/* 3 CARDS LADO A LADO */}
          <View style={styles.cardsRow}>
            {cardsData.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[styles.card, { borderTopColor: card.cor }]}
                onPress={() => navegarPara(card.tela)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.cardIconContainer,
                    { backgroundColor: `${card.cor}15` },
                  ]}
                >
                  <Image
                    source={card.imagem}
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{card.titulo}</Text>
                  <Text style={styles.cardDescription}>{card.descricao}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SEÇÃO: SOBRE NÓS */}
        <View style={styles.aboutContainer}>
          <View style={styles.aboutHeader}>
            <Image
              source={require("../assets/logoOriginal.png")}
              style={styles.aboutIcon}
              resizeMode="contain"
            />
          </View>

          <View style={styles.aboutContent}>
            <Text style={styles.aboutText}>
              Somos uma plataforma dedicada ao ensino da Língua Brasileira de
              Sinais (Libras) de forma acessível, inclusiva e divertida. Nosso
              objetivo é promover a inclusão social através do aprendizado da
              comunicação por sinais.
            </Text>

            {/* VALORES */}
            <View style={styles.valuesContainer}>
              {valoresData.map((valor) => (
                <View key={valor.id} style={styles.valueItem}>
                  <Image
                    source={valor.imagem}
                    style={styles.valueImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.valueTitle}>{valor.titulo}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.learnMoreButton}
              onPress={() => navigation.navigate("Sobre")}
            >
              <Text style={styles.learnMoreText}>
                Conheça nossa história completa!
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ESPAÇO FINAL (substituindo a seção do perfil) */}
        <View style={styles.footerSpace} />
      </Animated.ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 60) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00008B",
    paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight + 10,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    paddingHorizontal: 20,
    zIndex: 1000,
    overflow: "hidden",
    alignItems: "center",
  },
  logoContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 60,
    left: 20,
    zIndex: 1001,
  },
  logo: {
    width: 35,
    height: 35,
    marginTop: 25,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 40,
  },
  hi: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },
  question: {
    fontSize: 15,
    color: "#dcdcdc",
    textAlign: "center",
  },
  menuContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 60,
    right: 0,
    zIndex: 1002,
    paddingTop: 35,
    marginTop: -35,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  card: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    borderTopWidth: 4,
    borderTopColor: "#4169E1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardImage: {
    width: 40,
    height: 40,
  },
  cardContent: {
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
  aboutContainer: {
    backgroundColor: "#F8F9FA",
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  aboutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  aboutIcon: {
    width: 170,
    height: 100,
    alignItems: "center",
    display: "flex",
    marginLeft: 55,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#00008B",
    marginLeft: 10,
  },
  aboutContent: {
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center",
  },
  valuesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 25,
  },
  valueItem: {
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    width: "37%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    right: 15,
  },
  valueImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  valueTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
  learnMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#00008B",
    borderRadius: 12,
  },
  learnMoreText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#00008B",
    marginRight: 8,
  },
  footerSpace: {
    height: 50,
  },
});
