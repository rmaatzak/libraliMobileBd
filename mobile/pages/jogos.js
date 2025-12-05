// pages/jogos.js
import React, { useRef, useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import MenuLateral from "../auxilio/menuLateral";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Svg, Path } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importar a logo
import Logo from "../assets/logoBR.png";
// Importar imagem da estrela
import EstrelaImg from "../assets/estrela.png";
// Importar imagem do cadeado
import CadeadoImg from "../assets/cadeado.png";

export default function Jogos({ route, navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight] = useState(100);
  const [fasesDesbloqueadas, setFasesDesbloqueadas] = useState([1]);
  const [carregando, setCarregando] = useState(true);

  // Carregar progresso salvo
  useEffect(() => {
    carregarProgresso();
  }, []);

  // Atualizar quando voltar de uma fase
  useEffect(() => {
    if (route.params?.atualizarProgresso) {
      carregarProgresso();
    }
  }, [route.params?.atualizarProgresso]);

  const carregarProgresso = async () => {
    try {
      const progressoSalvo = await AsyncStorage.getItem("fasesDesbloqueadas");
      if (progressoSalvo) {
        const fasesSalvas = JSON.parse(progressoSalvo);
        // Garantir que pelo menos a fase 1 esteja desbloqueada
        if (!fasesSalvas.includes(1)) {
          fasesSalvas.push(1);
          await salvarProgresso(fasesSalvas);
        }
        setFasesDesbloqueadas(fasesSalvas);
      } else {
        // Primeira vez: apenas fase 1 desbloqueada
        const fasesIniciais = [1];
        await AsyncStorage.setItem(
          "fasesDesbloqueadas",
          JSON.stringify(fasesIniciais)
        );
        setFasesDesbloqueadas(fasesIniciais);
      }
    } catch (error) {
      console.log("Erro ao carregar progresso:", error);
      // Em caso de erro, garante pelo menos a fase 1
      setFasesDesbloqueadas([1]);
    } finally {
      setCarregando(false);
    }
  };

  const salvarProgresso = async (novasFases) => {
    try {
      await AsyncStorage.setItem(
        "fasesDesbloqueadas",
        JSON.stringify(novasFases)
      );
      setFasesDesbloqueadas(novasFases);
    } catch (error) {
      console.log("Erro ao salvar progresso:", error);
    }
  };

  // Função para desbloquear uma fase específica
  const desbloquearFase = async (faseId) => {
    if (!fasesDesbloqueadas.includes(faseId)) {
      const novasFases = [...fasesDesbloqueadas, faseId];
      await salvarProgresso(novasFases);
      return true;
    }
    return false;
  };

  // Header fixo no topo - SEM MOVIMENTAÇÃO
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

  // Logo sempre visível - SEM OPACIDADE
  const logoOpacity = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1],
    extrapolate: "clamp",
  });

  // Dados das fases - ATUALIZADO: Apenas 6 fases, estrela na fase 6
  const fasesData = [
    {
      id: 1,
      numero: 1,
      titulo: "Alfabeto Manual",
      descricao: "Aprenda as letras em LIBRAS",
      bloqueada: false,
      tipo: "normal",
      posicao: { x: "50%", y: 50 },
    },
    {
      id: 2,
      numero: 2,
      titulo: "Números",
      descricao: "Conte de 1 a 10",
      bloqueada: true,
      tipo: "normal",
      posicao: { x: "20%", y: 180 },
    },
    {
      id: 3,
      numero: 3,
      titulo: "Cumprimentos",
      descricao: "Olá, Bom dia, Tudo bem?",
      bloqueada: true,
      tipo: "normal",
      posicao: { x: "80%", y: 310 },
    },
    {
      id: 4,
      numero: 4,
      titulo: "Cores Básicas",
      descricao: "Vermelho, Azul, Amarelo",
      bloqueada: true,
      tipo: "normal",
      posicao: { x: "30%", y: 440 },
    },
    {
      id: 5,
      numero: 5,
      titulo: "Alimentos",
      descricao: "Fome, Sede, Copo de Água",
      bloqueada: true,
      tipo: "normal",
      posicao: { x: "60%", y: 570 },
    },
    {
      id: 6,
      numero: "★",
      titulo: "Desafio 1",
      descricao: "Revisão do aprendizado",
      bloqueada: true,
      tipo: "estrela",
      imagemEstrela: true,
      posicao: { x: "40%", y: 700 },
    },
  ];

  // Atualizar bloqueio baseado no progresso salvo
  const fasesComProgresso = fasesData.map((fase) => ({
    ...fase,
    bloqueada: !fasesDesbloqueadas.includes(fase.id),
  }));

  // FUNÇÃO ATUALIZADA - INCLUINDO FASE 5
  const iniciarFase = (fase) => {
    if (!fase.bloqueada) {
      if (fase.id === 1) {
        navigation.navigate("Fase1Alfabeto", {
          atualizarProgresso: true,
        });
      } else if (fase.id === 2) {
        navigation.navigate("Fase2Numeros", {
          atualizarProgresso: true,
        });
      } else if (fase.id === 3) {
        navigation.navigate("Fase3Cumprimentos", {
          atualizarProgresso: true,
        });
      } else if (fase.id === 4) {
        // FASE 4 - CORES BÁSICAS
        navigation.navigate("Fase4Cores", {
          atualizarProgresso: true,
        });
      } else if (fase.id === 5) {
        // NOVA FASE 5 - ALIMENTOS
        navigation.navigate("Fase5Alimentos", {
          atualizarProgresso: true,
        });
      } else if (fase.id === 6) {
  // FASE 6 - DESAFIO 1
  navigation.navigate("Fase6Desafio1", {
    atualizarProgresso: true,
  });
}
       else {
        Alert.alert(
          "Em desenvolvimento",
          `A fase ${fase.titulo} estará disponível em breve!`,
          [{ text: "OK" }]
        );
      }
    } else {
      Alert.alert(
        "Fase Bloqueada",
        `${fase.titulo} está bloqueada. Complete as fases anteriores primeiro!`,
        [{ text: "OK" }]
      );
    }
  };

  // Função para gerar o caminho do mapa do tesouro COM CURVAS MUITO SINUOSAS
  const gerarCaminhoDoTesouro = () => {
    const pontos = fasesComProgresso.map((fase) => fase.posicao);

    // Converter porcentagens em pixels aproximados
    const converterParaPixels = (ponto) => {
      const x = (parseFloat(ponto.x) / 100) * (width - 90);
      const y = ponto.y;
      return { x, y };
    };

    const pontosPixels = pontos.map(converterParaPixels);

    // Criar um caminho SVG com curvas bezier MUITO MAIS SINUOSAS
    let caminho = `M ${pontosPixels[0].x + 45} ${pontosPixels[0].y + 45}`;

    for (let i = 1; i < pontosPixels.length; i++) {
      const prev = pontosPixels[i - 1];
      const curr = pontosPixels[i];

      // Calcular direção e distância
      const distX = curr.x - prev.x;
      const distY = curr.y - prev.y;
      const distTotal = Math.sqrt(distX * distX + distY * distY);

      // Criar ondulações MUITO MAIS PRONUNCIADAS
      // Quanto maior a distância, mais sinuoso o caminho
      const amplitudeBase = Math.min(distTotal * 0.4, 100); // Aumentado de 0.3 para 0.4
      const amplitude = amplitudeBase + Math.random() * 30; // Adiciona variação aleatória

      // Alternar a direção da curva de forma mais dramática
      const direcaoCurva = i % 2 === 0 ? 1 : -1;

      // Adicionar variação extra baseada no índice para criar padrões únicos
      const variacaoExtra = Math.sin(i * 0.5) * 20;

      // Pontos de controle com MUITO MAIS curvatura
      // Primeiro ponto de controle - sai do ponto anterior com curva
      const cp1x = prev.x + 45 + distX * 0.25 + amplitude * 0.5 * direcaoCurva;
      const cp1y =
        prev.y + 45 + distY * 0.25 + amplitude * direcaoCurva + variacaoExtra;

      // Segundo ponto de controle - chega no ponto atual com curva
      const cp2x = curr.x + 45 - distX * 0.25 - amplitude * 0.5 * direcaoCurva;
      const cp2y =
        curr.y + 45 - distY * 0.25 - amplitude * direcaoCurva - variacaoExtra;

      // Para criar caminhos ainda mais orgânicos, podemos usar curvas quadráticas
      // alternadas com curvas cúbicas
      if (i % 3 === 0) {
        // A cada 3 segmentos, usa uma curva mais suave
        const cpx = (prev.x + curr.x) / 2 + 45 + amplitude * direcaoCurva;
        const cpy = (prev.y + curr.y) / 2 + 45 + amplitude * 1.5 * direcaoCurva;
        caminho += ` Q ${cpx} ${cpy}, ${curr.x + 45} ${curr.y + 45}`;
      } else {
        // Curva cúbica padrão (mais sinuosa)
        caminho += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x + 45} ${
          curr.y + 45
        }`;
      }
    }

    return caminho;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00008B" />

      {/* HEADER FIXO E PEQUENO - SEM ANIMAÇÃO DE MOVIMENTO */}
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeightAnimated,
          },
        ]}
      >
        {/* Logo fixa no header - SEM MOVIMENTAÇÃO */}
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Título fixo no header */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}></Text>
          <Text style={styles.headerSubtitle}></Text>
        </View>
      </Animated.View>

      {/* MENU LATERAL - FIXO SEM MOVIMENTAÇÃO - PASSANDO A NAVIGATION */}
      <View style={styles.menuContainer}>
        <MenuLateral navigation={navigation} />
      </View>

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
            Vamos testar seu conhecimento?
          </Text>
        </View>

        {/* MAPA DO TESOURO */}
        <View style={styles.mapaContainer}>
          {/* Linha do caminho (mapa do tesouro) COM CURVAS MUITO SINUOSAS */}
          <View style={styles.caminhoSvgContainer}>
            <Svg
              height={
                fasesComProgresso[fasesComProgresso.length - 1].posicao.y + 100
              }
              width="100%"
            >
              {/* Sombra da linha principal */}
              <Path
                d={gerarCaminhoDoTesouro()}
                fill="none"
                stroke="rgba(0, 0, 0, 0.1)"
                strokeWidth={10}
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(2, 3)"
              />

              {/* Linha principal do caminho */}
              <Path
                d={gerarCaminhoDoTesouro()}
                fill="none"
                stroke="#4A90E2"
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={fasesComProgresso[2].bloqueada ? "0" : "20,15"}
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
                strokeDasharray={fasesComProgresso[2].bloqueada ? "0" : "20,15"}
              />

              {/* Linha interna mais clara (efeito 3D) */}
              <Path
                d={gerarCaminhoDoTesouro()}
                fill="none"
                stroke="#A8D5FF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.8}
              />
            </Svg>
          </View>

          {/* Pontos de verificação (fases) */}
          {fasesComProgresso.map((fase, index) => (
            <View
              key={fase.id}
              style={[
                styles.pontoContainer,
                {
                  left: fase.posicao.x,
                  top: fase.posicao.y,
                  marginLeft: -45,
                },
              ]}
            >
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
                  {/* Número dentro da bolinha */}
                  {fase.tipo === "normal" && (
                    <Text
                      style={[
                        styles.numeroDentro,
                        fase.bloqueada && styles.numeroBloqueado,
                      ]}
                    >
                      {fase.numero}
                    </Text>
                  )}

                  {/* Imagem da estrela */}
                  {fase.tipo === "estrela" && fase.imagemEstrela && (
                    <Image
                      source={EstrelaImg}
                      style={styles.estrelaImagem}
                      resizeMode="contain"
                    />
                  )}

                  {/* Imagem do cadeado para fases bloqueadas */}
                  {fase.bloqueada && fase.tipo === "normal" && (
                    <Image
                      source={CadeadoImg}
                      style={styles.cadeadoImagem}
                      resizeMode="contain"
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

              {/* Tooltip com título */}
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
            <Icon name="" size={60} color="#FFD700" />
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
    marginTop: -20,
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
    color: "#fff",
    textAlign: "center",
    fontFamily: "Brockmann",
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
    marginTop: -80,
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
    fontSize: 17,
    fontFamily:"Strawford",
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
    minHeight: 850, // Reduzido para 6 fases
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
  // Estilo para imagem da estrela
  estrelaImagem: {
    width: 45,
    height: 45,
  },
  // Estilo para imagem do cadeado
  cadeadoImagem: {
    width: 15,
    height: 25,
    position: "absolute",
    bottom: 10,
    alignItems: "center",
    marginBottom: -10,
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
    top: 850, // Ajustado para 6 fases
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
