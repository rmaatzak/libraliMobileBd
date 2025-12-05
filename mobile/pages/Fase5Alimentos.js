// pages/Fase5Alimentos.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Image,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { Video } from "expo-av";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MenuLateral from "../auxilio/menuLateral";

// Bolinhas flutuantes (import da tela login)
import { FloatingBubbles } from "./login";

// Imagens para botões
const BOTAO_PROXIMO_IMG = require("../assets/seta.png");
const BOTAO_ANTERIOR_IMG = require("../assets/sair.png");
const CERTO_IMG = require("../assets/certo.png");
const ERRADO_IMG = require("../assets/erro.png");

// Importar a logo para o header
import Logo from "../assets/logoBR.png";

// Importar os vídeos dos alimentos
const videosAlimentos = {
  fome: require("../assets/videos/Fome.mp4"),
  sede: require("../assets/videos/sede.mp4"),
  copo_agua: require("../assets/videos/copoAgua.mp4"),
};

// Dados da fase 5 - Alimentos
const fase5Data = {
  id: 5,
  titulo: "Alimentos",
  descricao: "Aprenda sinais relacionados a alimentos e bebidas em LIBRAS",
  etapas: [
    // DEMONSTRAÇÕES
    {
      id: "demo_fome",
      tipo: "demonstracao",
      titulo: "Fome",
      descricao: "Sinal de FOME em LIBRAS",
      video: videosAlimentos.fome,
      palavra: "Fome",
      videoDescricao: "Demonstração do sinal de FOME",
    },
    {
      id: "demo_sede",
      tipo: "demonstracao",
      titulo: "Sede",
      descricao: "Sinal de SEDE em LIBRAS",
      video: videosAlimentos.sede,
      palavra: "Sede",
      videoDescricao: "Demonstração do sinal de SEDE",
    },
    {
      id: "demo_copo_agua",
      tipo: "demonstracao",
      titulo: "Copo de Água",
      descricao: "Sinal de COPO DE ÁGUA em LIBRAS",
      video: videosAlimentos.copo_agua,
      palavra: "Copo de Água",
      videoDescricao: "Demonstração do sinal de COPO DE ÁGUA",
    },
    // DESAFIOS (3 desafios apenas)
    {
      id: "desafio_1",
      tipo: "desafio",
      titulo: "Desafio 1",
      descricao: "Qual sinal está sendo mostrado?",
      video: videosAlimentos.fome,
      opcoes: [
        {
          id: 1,
          video: videosAlimentos.fome,
          texto: "Fome",
          correto: true,
        },
        {
          id: 2,
          video: videosAlimentos.sede,
          texto: "Sede",
          correto: false,
        },
      ],
      respostaCorreta: 1,
      enunciado: "Selecione o vídeo que mostra o sinal de FOME",
    },
    {
      id: "desafio_2",
      tipo: "desafio",
      titulo: "Desafio 2",
      descricao: "Identifique o sinal apresentado",
      video: videosAlimentos.sede,
      opcoes: [
        {
          id: 1,
          video: videosAlimentos.fome,
          texto: "Fome",
          correto: false,
        },
        {
          id: 2,
          video: videosAlimentos.sede,
          texto: "Sede",
          correto: true,
        },
      ],
      respostaCorreta: 2,
      enunciado: "Selecione o vídeo que mostra o sinal de SEDE",
    },
    {
      id: "desafio_3",
      tipo: "desafio",
      titulo: "Desafio 3",
      descricao: "Qual é este sinal?",
      video: videosAlimentos.copo_agua,
      opcoes: [
        {
          id: 1,
          video: videosAlimentos.copo_agua,
          texto: "Copo de Água",
          correto: true,
        },
        {
          id: 2,
          video: videosAlimentos.fome,
          texto: "Fome",
          correto: false,
        },
      ],
      respostaCorreta: 1,
      enunciado: "Selecione o vídeo que mostra o sinal de COPO DE ÁGUA",
    },
  ],
};

export default function Fase5Alimentos({ route, navigation }) {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [acertos, setAcertos] = useState(0);
  const [videoStatus, setVideoStatus] = useState({});
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const videoRefs = useRef([]);

  const etapa = fase5Data.etapas[etapaAtual];
  const totalDesafios = fase5Data.etapas.filter(
    (e) => e.tipo === "desafio"
  ).length;

  useEffect(() => {
    // Inicializar status dos vídeos - AUTOPLAY E LOOP
    if (etapa.video && videoRefs.current[0]) {
      videoRefs.current[0].playAsync();
      setVideoStatus((prev) => ({
        ...prev,
        [etapa.id]: { isPlaying: true },
      }));
    }
  }, [etapaAtual]);

  // Função para desbloquear a próxima fase (Fase 6 - Desafio)
  const desbloquearProximaFase = async () => {
    try {
      const progressoAtual = await AsyncStorage.getItem("fasesDesbloqueadas");
      let fasesDesbloqueadas = progressoAtual
        ? JSON.parse(progressoAtual)
        : [1, 2, 3, 4, 5]; // Fase 5 já está desbloqueada

      // Se fase 6 ainda não está desbloqueada, adiciona
      if (!fasesDesbloqueadas.includes(6)) {
        fasesDesbloqueadas.push(6);
        await AsyncStorage.setItem(
          "fasesDesbloqueadas",
          JSON.stringify(fasesDesbloqueadas)
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao desbloquear fase:", error);
      return false;
    }
  };

  const handleResposta = (opcaoId) => {
    if (etapa.tipo !== "desafio") return;

    const correta = opcaoId === etapa.respostaCorreta;
    setRespostas((prev) => ({
      ...prev,
      [etapa.id]: { escolhida: opcaoId, correta },
    }));

    if (correta) {
      setAcertos((prev) => prev + 1);
      setMensagemModal("🎉 Parabéns! Resposta Correta!");
    } else {
      setMensagemModal("❌ Resposta Incorreta.");
    }

    setMostrarResultado(true);
    setModalVisivel(true);

    // Verificar se é o último desafio
    const isUltimoDesafio = etapaAtual === fase5Data.etapas.length - 1;

    // Avançar automaticamente após 2 segundos
    setTimeout(() => {
      setModalVisivel(false);

      if (!isUltimoDesafio) {
        // Se NÃO for o último desafio, avança para o próximo
        setTimeout(() => {
          avancarEtapa();
        }, 500);
      } else {
        // Se for o último desafio, mostrar resultado final
        setTimeout(() => {
          mostrarResultadoFase();
        }, 500);
      }
    }, 2000);
  };

  const mostrarResultadoFase = async () => {
    // Calcular se passou (precisa de pelo menos 2 acertos para desbloquear Fase 6)
    const acertosMinimos = 2; // 2 de 3
    const aprovado = acertos >= acertosMinimos;

    if (aprovado) {
      try {
        // Desbloquear a fase 6
        const faseDesbloqueada = await desbloquearProximaFase();

        Alert.alert(
          "🎊 Fase Concluída!",
          `Você acertou ${acertos} de ${totalDesafios} desafios!${
            faseDesbloqueada ? "\n\nFase 6 (Desafio Final) desbloqueada!" : ""
          }`,
          [
            {
              text: "Voltar ao Mapa",
              onPress: () =>
                navigation.navigate("Jogos", { atualizarProgresso: true }),
            },
          ]
        );
      } catch (error) {
        console.error("Erro ao salvar progresso:", error);
        Alert.alert(
          "Fase Concluída!",
          `Você acertou ${acertos} de ${totalDesafios} desafios!`,
          [
            {
              text: "Voltar ao Mapa",
              onPress: () =>
                navigation.navigate("Jogos", { atualizarProgresso: true }),
            },
          ]
        );
      }
    } else {
      // Se não atingiu o mínimo de acertos
      Alert.alert(
        "Fase Não Concluída",
        `Você acertou ${acertos} de ${totalDesafios} desafios.\nPrecisa de pelo menos ${acertosMinimos} acertos para desbloquear a próxima fase.`,
        [
          {
            text: "Tentar Novamente",
            onPress: () => {
              // Voltar para o primeiro desafio
              const primeiroDesafioIndex = fase5Data.etapas.findIndex(
                (e) => e.tipo === "desafio"
              );
              setEtapaAtual(primeiroDesafioIndex);
              setRespostas({});
              setAcertos(0);
            },
          },
          {
            text: "Voltar ao Mapa",
            onPress: () =>
              navigation.navigate("Jogos", { atualizarProgresso: true }),
            style: "cancel",
          },
        ]
      );
    }
  };

  const avancarEtapa = () => {
    if (etapaAtual < fase5Data.etapas.length - 1) {
      setEtapaAtual((prev) => prev + 1);
      setMostrarResultado(false);
    } else {
      // Fase concluída
      mostrarResultadoFase();
    }
  };

  const voltarEtapa = () => {
    if (etapaAtual > 0) {
      setEtapaAtual((prev) => prev - 1);
      setMostrarResultado(false);

      // Limpar resposta da etapa anterior
      const etapaAnteriorId = fase5Data.etapas[etapaAtual - 1].id;
      setRespostas((prev) => {
        const novasRespostas = { ...prev };
        delete novasRespostas[etapaAnteriorId];
        return novasRespostas;
      });

      // Ajustar contagem de acertos se necessário
      const etapaAnterior = fase5Data.etapas[etapaAtual - 1];
      if (
        etapaAnterior.tipo === "desafio" &&
        respostas[etapaAnterior.id]?.correta
      ) {
        setAcertos((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const renderDemonstracao = () => (
    <View style={styles.etapaContainer}>
      <Text style={styles.etapaTitulo}>{etapa.titulo}</Text>
      <Text style={styles.etapaDescricao}>{etapa.descricao}</Text>

      <View style={styles.videoContainer}>
        <View style={styles.videoWrapper}>
          <Video
            ref={(ref) => (videoRefs.current[0] = ref)}
            source={etapa.video}
            style={styles.video}
            useNativeControls={true}
            resizeMode="contain"
            isLooping={true}
            shouldPlay={true}
            onPlaybackStatusUpdate={(status) => {
              setVideoStatus((prev) => ({
                ...prev,
                [etapa.id]: status,
              }));
            }}
          />
        </View>
      </View>

      <View style={styles.botoesNavegacao}>
        {/* Botão Anterior */}
        <TouchableOpacity
          style={[
            styles.botaoNavegacao,
            etapaAtual === 0 && styles.botaoDisabled,
          ]}
          onPress={voltarEtapa}
          disabled={etapaAtual === 0}
        >
          {BOTAO_ANTERIOR_IMG ? (
            <Image
              source={BOTAO_ANTERIOR_IMG}
              style={styles.botaoImagem}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.botaoNavegacaoTexto}>Anterior</Text>
          )}
        </TouchableOpacity>

        {/* Botão Próximo */}
        <TouchableOpacity
          style={styles.botaoNavegacaoPrimario}
          onPress={avancarEtapa}
        >
          {BOTAO_PROXIMO_IMG ? (
            <Image
              source={BOTAO_PROXIMO_IMG}
              style={styles.botaoImagemPrimario}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.botaoNavegacaoPrimarioTexto}>
              {etapaAtual === fase5Data.etapas.length - 1
                ? "Concluir"
                : "Próximo"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDesafio = () => {
    const respostaAtual = respostas[etapa.id];
    const numeroDesafio = etapaAtual - 2; // -2 porque temos 3 demonstrações antes

    return (
      <View style={styles.etapaContainer}>
        <Text style={styles.etapaTitulo}>{etapa.titulo}</Text>
        <Text style={styles.etapaDescricao}>{etapa.descricao}</Text>

        {/* Video de demonstração principal */}
        <View style={styles.videoContainer}>
          <View style={styles.videoWrapper}>
            <Video
              ref={(ref) => (videoRefs.current[0] = ref)}
              source={etapa.video}
              style={styles.video}
              useNativeControls={true}
              resizeMode="contain"
              isLooping={true}
              shouldPlay={true}
              onPlaybackStatusUpdate={(status) => {
                setVideoStatus((prev) => ({
                  ...prev,
                  [etapa.id]: status,
                }));
              }}
            />
          </View>

          {/* Enunciado em texto */}
          <Text style={styles.enunciadoDesafio}>
            {etapa.enunciado || "Qual sinal está sendo mostrado no vídeo?"}
          </Text>
        </View>

        {/* Opções como vídeos lado a lado */}
        <View style={styles.opcoesContainer}>
          <Text style={styles.opcoesTitulo}>Selecione o vídeo correto:</Text>

          <View style={styles.opcoesVideosContainer}>
            {etapa.opcoes.map((opcao, index) => {
              let estiloContainer = styles.opcaoVideoContainer;
              let estiloBorda = styles.opcaoVideoBorda;

              if (mostrarResultado && respostaAtual) {
                if (opcao.id === respostaAtual.escolhida) {
                  estiloBorda = opcao.correto
                    ? styles.opcaoVideoCorreta
                    : styles.opcaoVideoIncorreta;
                } else if (opcao.correto) {
                  estiloBorda = styles.opcaoVideoCorretaNaoEscolhida;
                }
              }

              return (
                <TouchableOpacity
                  key={opcao.id}
                  style={[estiloContainer, respostaAtual && estiloBorda]}
                  onPress={() => handleResposta(opcao.id)}
                  disabled={mostrarResultado || respostaAtual}
                  activeOpacity={0.8}
                >
                  {/* Vídeo da opção */}
                  <View style={styles.opcaoVideoWrapper}>
                    <Video
                      ref={(ref) => (videoRefs.current[index + 1] = ref)}
                      source={opcao.video}
                      style={styles.opcaoVideo}
                      useNativeControls={false}
                      resizeMode="contain"
                      isLooping={true}
                      shouldPlay={!mostrarResultado}
                      isMuted={true}
                    />
                  </View>

                  {/* Texto da opção */}
                  <Text style={styles.opcaoVideoTexto}>{opcao.texto}</Text>

                  {/* Indicador de correção */}
                  {mostrarResultado && respostaAtual && (
                    <View style={styles.indicadorResposta}>
                      {opcao.id === respostaAtual.escolhida ? (
                        opcao.correto ? (
                          CERTO_IMG ? (
                            <Image
                              source={CERTO_IMG}
                              style={styles.indicadorImagem}
                              resizeMode="contain"
                            />
                          ) : (
                            <Icon
                              name="check-circle"
                              size={24}
                              color="#4CAF50"
                            />
                          )
                        ) : ERRADO_IMG ? (
                          <Image
                            source={ERRADO_IMG}
                            style={styles.indicadorImagem}
                            resizeMode="contain"
                          />
                        ) : (
                          <Icon name="cancel" size={24} color="#F44336" />
                        )
                      ) : opcao.correto ? (
                        CERTO_IMG ? (
                          <Image
                            source={CERTO_IMG}
                            style={styles.indicadorImagem}
                            resizeMode="contain"
                          />
                        ) : (
                          <Icon name="check-circle" size={24} color="#4CAF50" />
                        )
                      ) : null}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Instrução inicial */}
        {!mostrarResultado && !respostaAtual && (
          <Text style={styles.instrucaoDesafio}>
            Toque em um dos vídeos para selecionar sua resposta
          </Text>
        )}

        {/* Mostrar quando está processando */}
        {mostrarResultado && respostaAtual && !modalVisivel && (
          <Text style={styles.processandoTexto}>
            Preparando próximo desafio...
          </Text>
        )}

        {/* Progresso */}
        <View style={styles.progressoContainer}>
          <Text style={styles.progressoTexto}>
            Desafio {numeroDesafio} de 3
          </Text>
          <View style={styles.progressoBarraContainer}>
            <View
              style={[
                styles.progressoBarra,
                { width: `${(numeroDesafio / 3) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.acertosTexto}>
            Acertos: {acertos} de {Math.max(numeroDesafio - 1, 0)}
          </Text>
          <Text style={styles.instrucaoProgresso}>
            {acertos >= 2
              ? "✨ Você já pode desbloquear a próxima fase!"
              : `Precisa de ${2 - acertos} acerto(s) para desbloquear a Fase 6`}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00008B" />

      {/* Bolinhas flutuantes */}
      <FloatingBubbles />

      {/* HEADER SIMPLIFICADO */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      {/* Menu Lateral */}
      <View style={styles.menuContainer}>
        <MenuLateral navigation={navigation} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {etapa.tipo === "demonstracao" ? renderDemonstracao() : renderDesafio()}
      </ScrollView>

      {/* Modal de feedback */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTexto}>{mensagemModal}</Text>
            <Text style={styles.modalInstrucao}>
              {etapaAtual === fase5Data.etapas.length - 1
                ? "Mostrando resultado final..."
                : "Avançando para próximo desafio..."}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

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
    height: 100,
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
  menuContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 60,
    right: 0,
    zIndex: 1002,
    paddingTop: 35,
    marginTop: -80,
  },
  scrollView: {
    flex: 1,
    marginTop: 100,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  etapaContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  etapaTitulo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  etapaDescricao: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  videoContainer: {
    marginBottom: 30,
  },
  videoWrapper: {
    width: width - 40,
    height: 300,
    backgroundColor: "#000",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  enunciadoDesafio: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 15,
    lineHeight: 26,
  },
  opcoesContainer: {
    marginBottom: 30,
  },
  opcoesTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  opcoesVideosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  opcaoVideoContainer: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  opcaoVideoBorda: {
    borderColor: "#E8E8E8",
  },
  opcaoVideoCorreta: {
    borderColor: "#4CAF50",
    borderWidth: 3,
    backgroundColor: "#E8F5E9",
  },
  opcaoVideoIncorreta: {
    borderColor: "#F44336",
    borderWidth: 3,
    backgroundColor: "#FFEBEE",
  },
  opcaoVideoCorretaNaoEscolhida: {
    borderColor: "#4CAF50",
    borderWidth: 3,
    backgroundColor: "#E8F5E9",
  },
  opcaoVideoWrapper: {
    width: "100%",
    height: 150,
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  opcaoVideo: {
    width: "100%",
    height: "100%",
  },
  opcaoVideoTexto: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 5,
  },
  indicadorResposta: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
  },
  indicadorImagem: {
    width: 20,
    height: 20,
  },
  instrucaoDesafio: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  processandoTexto: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  botoesNavegacao: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 10,
  },
  botaoNavegacao: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#4A90E2",
    minWidth: 120,
    alignItems: "center",
  },
  botaoImagem: {
    width: 100,
    height: 40,
  },
  botaoImagemPrimario: {
    width: 100,
    height: 40,
  },
  botaoNavegacaoTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2",
  },
  botaoDisabled: {
    borderColor: "#E0E0E0",
    backgroundColor: "#F5F5F5",
    opacity: 0.5,
  },
  botaoNavegacaoPrimario: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    backgroundColor: "#00008B",
    minWidth: 120,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  botaoNavegacaoPrimarioTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  progressoContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  progressoTexto: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  progressoBarraContainer: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginBottom: 15,
    overflow: "hidden",
  },
  progressoBarra: {
    height: "100%",
    backgroundColor: "#4A90E2",
    borderRadius: 5,
  },
  acertosTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2",
    textAlign: "center",
    marginBottom: 5,
  },
  instrucaoProgresso: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    minWidth: width * 0.7,
  },
  modalTexto: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  modalInstrucao: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
});
