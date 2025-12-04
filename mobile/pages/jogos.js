// pages/jogos.js
import React, { useRef, useState } from "react";
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
import { Svg, Path } from "react-native-svg";

// Importar a logo
import Logo from "../assets/logoBR.png";

export default function Jogos({ route, navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight] = useState(100);

  // Header fixo no topo
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0],
    extrapolate: "clamp",
  });

  // Header com altura fixa
  const headerHeightAnimated = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [headerHeight, headerHeight],
    extrapolate: "clamp",
  });

  // Logo sempre visível
  const logoOpacity = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1],
    extrapolate: "clamp",
  });

  // Logo se move para cima para se centralizar no header menor
  const logoTranslateY = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  // Menu lateral também se move
  const menuTranslateY = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const navegarPara = (tela) => {
    navigation.navigate(tela);
  };

  // Dados das fases - Agora a cada 5ª fase é uma estrela
  const fasesData = [
    {
      id: 1,
      numero: 1,
      titulo: "Alfabeto Manual",
      descricao: "Aprenda as letras em LIBRAS",
      bloqueada: false,
      tipo: "normal",
      icone: "alpha-a-box",
      posicao: { x: "50%", y: 50 },
    },
    {
      id: 2,
      numero: 2,
      titulo: "Números",
      descricao: "Conte de 1 a 10",
      bloqueada: false,
      tipo: "normal",
      icone: "numeric-1-box",
      posicao: { x: "20%", y: 180 },
    },
    {
      id: 3,
      numero: 3,
      titulo: "Cumprimentos",
      descricao: "Olá, Bom dia, Tudo bem?",
      bloqueada: false,
      tipo: "normal",
      icone: "hand-wave",
      posicao: { x: "80%", y: 310 },
    },
    {
      id: 4,
      numero: 4,
      titulo: "Cores Básicas",
      descricao: "Vermelho, Azul, Amarelo",
      bloqueada: true,
      tipo: "normal",
      icone: "palette",
      posicao: { x: "30%", y: 440 },
    },
    {
      id: 5,
      numero: "★",
      titulo: "Desafio 1",
      descricao: "Revisão do aprendizado",
      bloqueada: true,
      tipo: "estrela",
      icone: "star",
      posicao: { x: "60%", y: 570 },
    },
    {
      id: 6,
      numero: 6,
      titulo: "Família",
      descricao: "Mãe, Pai, Irmão...",
      bloqueada: true,
      tipo: "normal",
      icone: "account-group",
      posicao: { x: "70%", y: 700 },
    },
    {
      id: 7,
      numero: 7,
      titulo: "Animais",
      descricao: "Cachorro, Gato, Pássaro",
      bloqueada: true,
      tipo: "normal",
      icone: "paw",
      posicao: { x: "30%", y: 830 },
    },
    {
      id: 8,
      numero: 8,
      titulo: "Alimentos",
      descricao: "Comidas e bebidas",
      bloqueada: true,
      tipo: "normal",
      icone: "food-apple",
      posicao: { x: "60%", y: 960 },
    },
    {
      id: 9,
      numero: 9,
      titulo: "Verbose Básicos",
      descricao: "Comer, Beber, Dormir",
      bloqueada: true,
      tipo: "normal",
      icone: "run",
      posicao: { x: "40%", y: 1090 },
    },
    {
      id: 10,
      numero: "★",
      titulo: "Desafio 2",
      descricao: "Teste intermediário",
      bloqueada: true,
      tipo: "estrela",
      icone: "star",
      posicao: { x: "70%", y: 1220 },
    },
    {
      id: 11,
      numero: 11,
      titulo: "Emoções",
      descricao: "Feliz, Triste, Bravo",
      bloqueada: true,
      tipo: "normal",
      icone: "emoticon-happy",
      posicao: { x: "50%", y: 1350 },
    },
    {
      id: 12,
      numero: 12,
      titulo: "Profissões",
      descricao: "Médico, Professor, Engenheiro",
      bloqueada: true,
      tipo: "normal",
      icone: "briefcase",
      posicao: { x: "20%", y: 1480 },
    },
  ];

  const iniciarFase = (fase) => {
    if (!fase.bloqueada) {
      alert(`Iniciando ${fase.titulo}`);
      // navigation.navigate('JogoFase1', { fase: fase.numero });
    } else {
      alert(
        `${fase.titulo} está bloqueada. Complete as fases anteriores primeiro!`
      );
    }
  };

  // Função para gerar o caminho do mapa do tesouro
  const gerarCaminhoDoTesouro = () => {
    const pontos = fasesData.map((fase) => fase.posicao);

    // Converter porcentagens em pixels aproximados
    const converterParaPixels = (ponto, index) => {
      const x = (parseFloat(ponto.x) / 100) * (width - 90);
      const y = ponto.y;
      return { x, y };
    };

    const pontosPixels = pontos.map(converterParaPixels);

    // Criar um caminho SVG com curvas suaves
    let caminho = `M ${pontosPixels[0].x + 45} ${pontosPixels[0].y + 45}`;

    for (let i = 1; i < pontosPixels.length; i++) {
      const prev = pontosPixels[i - 1];
      const curr = pontosPixels[i];

      // Calcular pontos de controle para curvas bezier
      const cp1x = prev.x + 45 + (curr.x - prev.x) * 0.5;
      const cp1y = prev.y + 45;
      const cp2x = curr.x + 45 - (curr.x - prev.x) * 0.5;
      const cp2y = curr.y + 45;

      caminho += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x + 45} ${
        curr.y + 45
      }`;
    }

    return caminho;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00008B" />

      {/* HEADER FIXO E PEQUENO - ESTILO IGUAL AO INTERFACE.JS */}
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeightAnimated,
          },
        ]}
      >
        {/* Logo fixa no header pequeno */}
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

        {/* Título fixo no header */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Jogos</Text>
          <Text style={styles.headerSubtitle}>Aprenda jogando!</Text>
        </View>
      </Animated.View>

      {/* MENU LATERAL - AGORA COM ANIMAÇÃO IGUAL AO INTERFACE.JS */}
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
        {/* TÍTULO DA PÁGINA */}
        <View style={styles.tituloContainer}>
          <Text style={styles.tituloPrincipal}>
            Descubra o tesouro do conhecimento!
          </Text>
          <Text style={styles.subtitulo}>
            Siga o mapa e complete as fases para desbloquear novas aventuras!
          </Text>
        </View>

        {/* MAPA DO TESOURO */}
        <View style={styles.mapaContainer}>
          {/* Linha do caminho (mapa do tesouro) */}
          <View style={styles.caminhoSvgContainer}>
            <Svg
              height={fasesData[fasesData.length - 1].posicao.y + 100}
              width="100%"
            >
              <Path
                d={gerarCaminhoDoTesouro()}
                fill="none"
                stroke="#4A90E2"
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={fasesData[2].bloqueada ? "0" : "15,10"}
              />

              {/* Efeito de brilho na linha */}
              <Path
                d={gerarCaminhoDoTesouro()}
                fill="none"
                stroke="#7BB4FF"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.6}
              />
            </Svg>
          </View>

          {/* Pontos de verificação (fases) */}
          {fasesData.map((fase, index) => (
            <View
              key={fase.id}
              style={[
                styles.pontoContainer,
                {
                  left: fase.posicao.x,
                  top: fase.posicao.y,
                  marginLeft: -45, // Metade do tamanho da bolinha
                },
              ]}
            >
              {/* Linha pontilhada para fases bloqueadas */}
              {fase.bloqueada && index > 0 && (
                <View style={styles.linhaPontilhada} />
              )}

              {/* Bolinha da fase */}
              <TouchableOpacity
                style={[
                  styles.bolinhaFase,
                  fase.bloqueada && styles.bolinhaBloqueada,
                  fase.tipo === "estrela" && styles.bolinhaEstrela,
                  index === 0 && styles.bolinhaAtual,
                ]}
                onPress={() => iniciarFase(fase)}
                activeOpacity={0.8}
                disabled={fase.bloqueada}
              >
                {/* Fundo da bolinha */}
                <View
                  style={[
                    styles.bolinhaFundo,
                    fase.bloqueada && styles.bolinhaFundoBloqueada,
                    fase.tipo === "estrela" && styles.bolinhaFundoEstrela,
                  ]}
                >
                  {/* Número/estrela dentro da bolinha */}
                  {fase.tipo === "estrela" ? (
                    <Text style={styles.estrelaDentro}>★</Text>
                  ) : (
                    <Text
                      style={[
                        styles.numeroDentro,
                        fase.bloqueada && styles.numeroBloqueado,
                      ]}
                    >
                      {fase.numero}
                    </Text>
                  )}

                  {/* Ícone pequeno no centro */}
                  {!fase.bloqueada && fase.tipo === "normal" && (
                    <Icon
                      name={fase.icone}
                      size={20}
                      color="#FFF"
                      style={styles.iconeDentro}
                    />
                  )}

                  {/* Cadeado se estiver bloqueada */}
                  {fase.bloqueada && (
                    <Icon
                      name="lock"
                      size={20}
                      color="#999"
                      style={styles.iconeBloqueado}
                    />
                  )}
                </View>

                {/* Efeito de brilho para bolinhas desbloqueadas */}
                {!fase.bloqueada && fase.tipo === "normal" && (
                  <View style={styles.brilhoEfeito} />
                )}

                {/* Efeito especial para estrelas */}
                {fase.tipo === "estrela" && (
                  <View style={styles.estrelaEfeito} />
                )}
              </TouchableOpacity>

              {/* Tooltip com título (aparece ao pressionar) */}
              <View style={styles.tooltipContainer}>
                <Text
                  style={[
                    styles.tooltipTexto,
                    fase.bloqueada && styles.tooltipBloqueado,
                  ]}
                >
                  {fase.titulo}
                </Text>
              </View>
            </View>
          ))}

          {/* Ícone de tesouro no final */}
          <View style={styles.tesouroFinal}>
            <Icon name="treasure-chest" size={60} color="#FFD700" />
            <Text style={styles.tesouroTexto}>Tesouro Final</Text>
          </View>
        </View>

        {/* ESPAÇO FINAL */}
        <View style={styles.footerSpace} />
      </Animated.ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00008B",
    paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight + 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 20,
    zIndex: 1000,
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    marginLeft: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
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
    paddingBottom: 100,
  },
  tituloContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 10,
  },
  tituloPrincipal: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  // ESTILOS DO MAPA DO TESOURO
  mapaContainer: {
    minHeight: 1600,
    position: "relative",
    marginHorizontal: 10,
  },
  caminhoSvgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  pontoContainer: {
    position: "absolute",
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  linhaPontilhada: {
    position: "absolute",
    top: -60,
    width: 4,
    height: 60,
    backgroundColor: "transparent",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  bolinhaFase: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    position: "relative",
  },
  bolinhaBloqueada: {
    opacity: 0.7,
  },
  bolinhaEstrela: {
    shadowColor: "#FFD700",
  },
  bolinhaAtual: {
    shadowColor: "#4A90E2",
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  bolinhaFundo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#FFF",
    position: "relative",
  },
  bolinhaFundoBloqueada: {
    backgroundColor: "#CBD5E1",
    borderColor: "#E2E8F0",
  },
  bolinhaFundoEstrela: {
    backgroundColor: "#FFD700",
    borderColor: "#FFF",
  },
  numeroDentro: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  numeroBloqueado: {
    color: "#94A3B8",
  },
  estrelaDentro: {
    fontSize: 40,
    color: "#FFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  iconeDentro: {
    position: "absolute",
    bottom: 10,
    opacity: 0.9,
  },
  iconeBloqueado: {
    position: "absolute",
    bottom: 10,
  },
  brilhoEfeito: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    top: 15,
    left: 15,
  },
  estrelaEfeito: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "rgba(255, 215, 0, 0.3)",
    borderStyle: "dashed",
  },
  tooltipContainer: {
    position: "absolute",
    top: -40,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120,
    alignItems: "center",
  },
  tooltipTexto: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A90E2",
    textAlign: "center",
  },
  tooltipBloqueado: {
    color: "#94A3B8",
  },
  tesouroFinal: {
    position: "absolute",
    left: "50%",
    marginLeft: -30,
    top: 1600,
    alignItems: "center",
    zIndex: 3,
  },
  tesouroTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D97706",
    marginTop: 5,
  },
  footerSpace: {
    height: 100,
  },
});
