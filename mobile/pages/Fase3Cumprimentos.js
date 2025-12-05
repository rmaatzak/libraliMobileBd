// pages/Fase3Cumprimentos.js
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import MenuLateral from "../auxilio/menuLateral";
import { FloatingBubbles } from "./login";

// Imagens para botões
const BOTAO_PROXIMO_IMG = require("../assets/seta.png");
const BOTAO_ANTERIOR_IMG = require("../assets/sair.png");
const CERTO_IMG = require("../assets/certo.png");
const ERRADO_IMG = require("../assets/erro.png");

// Importar a logo
import Logo from "../assets/logoBR.png";

// Importar vídeos de cumprimentos (ATUALIZE COM SEUS VÍDEOS)
const videosCumprimentos = {
  ola: require("../assets/videos/ola.mp4"),
  tchau: require("../assets/videos/tchau.mp4"),
  comoVai: require("../assets/videos/comovai.mp4"),
  ateLogo: require("../assets/videos/atéLogo.mp4"),
};

// Dados da fase 3 - Cumprimentos
const fase3Data = {
  id: 3,
  titulo: "Cumprimentos",
  descricao: "Aprenda cumprimentos básicos em LIBRAS",
  etapas: [
    {
      id: "demo_ola",
      tipo: "demonstracao",
      titulo: "Olá",
      descricao: "Sinal de cumprimento 'Olá' em LIBRAS",
      video: videosCumprimentos.ola,
      cumprimento: "Olá",
      videoDescricao: "Demonstração do sinal 'Olá'",
    },
    {
      id: "demo_tchau",
      tipo: "demonstracao",
      titulo: "Tchau",
      descricao: "Sinal de despedida 'Tchau' em LIBRAS",
      video: videosCumprimentos.tchau,
      cumprimento: "Tchau",
      videoDescricao: "Demonstração do sinal 'Tchau'",
    },
    {
      id: "demo_comovai",
      tipo: "demonstracao",
      titulo: "Como vai?",
      descricao: "Sinal de cumprimento 'Como vai?' em LIBRAS",
      video: videosCumprimentos.comoVai,
      cumprimento: "Como vai?",
      videoDescricao: "Demonstração do sinal 'Como vai?'",
    },
    {
      id: "demo_atelogo",
      tipo: "demonstracao",
      titulo: "Até logo",
      descricao: "Sinal de despedida 'Até logo' em LIBRAS",
      video: videosCumprimentos.ateLogo,
      cumprimento: "Até logo",
      videoDescricao: "Demonstração do sinal 'Até logo'",
    },
    {
      id: "desafio_1",
      tipo: "desafio",
      titulo: "Desafio 1",
      descricao: "Qual é este cumprimento?",
      video: videosCumprimentos.ola,
      opcoes: [
        { id: 1, texto: "Olá", correto: true },
        { id: 2, texto: "Tchau", correto: false },
        { id: 3, texto: "Como vai?", correto: false },
        { id: 4, texto: "Até logo", correto: false },
      ],
      respostaCorreta: 1,
      enunciado: "Qual cumprimento está sendo sinalizado no vídeo?",
    },
    {
      id: "desafio_2",
      tipo: "desafio",
      titulo: "Desafio 2",
      descricao: "Qual cumprimento está sendo mostrado?",
      video: videosCumprimentos.tchau,
      opcoes: [
        { id: 1, texto: "Olá", correto: false },
        { id: 2, texto: "Tchau", correto: true },
        { id: 3, texto: "Como vai?", correto: false },
        { id: 4, texto: "Até logo", correto: false },
      ],
      respostaCorreta: 2,
      enunciado: "Qual cumprimento está sendo sinalizado no vídeo?",
    },
    {
      id: "desafio_3",
      tipo: "desafio",
      titulo: "Desafio 3",
      descricao: "Identifique o cumprimento",
      video: videosCumprimentos.comoVai,
      opcoes: [
        { id: 1, texto: "Olá", correto: false },
        { id: 2, texto: "Tchau", correto: false },
        { id: 3, texto: "Como vai?", correto: true },
        { id: 4, texto: "Até logo", correto: false },
      ],
      respostaCorreta: 3,
      enunciado: "Qual cumprimento está sendo sinalizado no vídeo?",
    },
    {
      id: "desafio_4",
      tipo: "desafio",
      titulo: "Desafio 4",
      descricao: "Qual cumprimento está sendo sinalizado?",
      video: videosCumprimentos.ateLogo,
      opcoes: [
        { id: 1, texto: "Olá", correto: false },
        { id: 2, texto: "Tchau", correto: false },
        { id: 3, texto: "Como vai?", correto: false },
        { id: 4, texto: "Até logo", correto: true },
      ],
      respostaCorreta: 4,
      enunciado: "Qual cumprimento está sendo sinalizado no vídeo?",
    },
  ],
};

export default function Fase3Cumprimentos({ route, navigation }) {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [acertos, setAcertos] = useState(0);
  const [videoStatus, setVideoStatus] = useState({});
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const videoRef = useRef(null);

  const etapa = fase3Data.etapas[etapaAtual];
  const totalDesafios = fase3Data.etapas.filter(
    (e) => e.tipo === "desafio"
  ).length;

  useEffect(() => {
    // Inicializar status do vídeo - AUTOPLAY E LOOP
    if (etapa.video && videoRef.current) {
      videoRef.current.playAsync();
      setVideoStatus((prev) => ({
        ...prev,
        [etapa.id]: { isPlaying: true },
      }));
    }
  }, [etapaAtual]);

  // Função para desbloquear a próxima fase
  const desbloquearProximaFase = async () => {
    try {
      const progressoAtual = await AsyncStorage.getItem("fasesDesbloqueadas");
      let fasesDesbloqueadas = progressoAtual
        ? JSON.parse(progressoAtual)
        : [1, 2, 3];

      // Se fase 4 ainda não está desbloqueada, adiciona
      if (!fasesDesbloqueadas.includes(4)) {
        fasesDesbloqueadas.push(4);
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
    const isUltimoDesafio = etapaAtual === fase3Data.etapas.length - 1;

    setTimeout(() => {
      setModalVisivel(false);

      if (!isUltimoDesafio) {
        setTimeout(() => {
          avancarEtapa();
        }, 500);
      } else {
        setTimeout(() => {
          mostrarResultadoFase();
        }, 500);
      }
    }, 2000);
  };

  const mostrarResultadoFase = async () => {
    // Calcular se passou (precisa de pelo menos 3 acertos)
    const acertosMinimos = 3;
    const aprovado = acertos >= acertosMinimos;

    if (aprovado) {
      try {
        // Desbloquear a fase 4
        const faseDesbloqueada = await desbloquearProximaFase();

        Alert.alert(
          "🎊 Fase Concluída!",
          `Você acertou ${acertos} de ${totalDesafios} desafios!${
            faseDesbloqueada ? "\n\nFase 4 (Cores Básicas) desbloqueada!" : ""
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
      Alert.alert(
        "Fase Não Concluída",
        `Você acertou ${acertos} de ${totalDesafios} desafios.\nPrecisa de pelo menos ${acertosMinimos} acertos para desbloquear a próxima fase.`,
        [
          {
            text: "Tentar Novamente",
            onPress: () => {
              const primeiroDesafioIndex = fase3Data.etapas.findIndex(
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
    if (etapaAtual < fase3Data.etapas.length - 1) {
      setEtapaAtual((prev) => prev + 1);
      setMostrarResultado(false);
    } else {
      mostrarResultadoFase();
    }
  };

  const voltarEtapa = () => {
    if (etapaAtual > 0) {
      setEtapaAtual((prev) => prev - 1);
      setMostrarResultado(false);

      const etapaAnteriorId = fase3Data.etapas[etapaAtual - 1].id;
      setRespostas((prev) => {
        const novasRespostas = { ...prev };
        delete novasRespostas[etapaAnteriorId];
        return novasRespostas;
      });

      const etapaAnterior = fase3Data.etapas[etapaAtual - 1];
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
            ref={videoRef}
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
              {etapaAtual === fase3Data.etapas.length - 1
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
    const numeroDesafio = etapaAtual - 3;

    return (
      <View style={styles.etapaContainer}>
        <Text style={styles.etapaTitulo}>{etapa.titulo}</Text>
        <Text style={styles.etapaDescricao}>{etapa.descricao}</Text>

        <View style={styles.videoContainer}>
          <View style={styles.videoWrapper}>
            <Video
              ref={videoRef}
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

          <Text style={styles.enunciadoDesafio}>{etapa.enunciado}</Text>
        </View>

        <View style={styles.opcoesContainer}>
          <Text style={styles.opcoesTitulo}>
            Selecione a alternativa correta:
          </Text>

          {etapa.opcoes.map((opcao) => {
            let estiloOpcao = styles.opcao;
            let estiloTextoOpcao = styles.opcaoTexto;

            if (mostrarResultado && respostaAtual) {
              if (opcao.id === respostaAtual.escolhida) {
                estiloOpcao = opcao.correto
                  ? styles.opcaoCorreta
                  : styles.opcaoIncorreta;
              } else if (opcao.correto) {
                estiloOpcao = styles.opcaoCorretaNaoEscolhida;
              }
            }

            return (
              <TouchableOpacity
                key={opcao.id}
                style={[estiloOpcao, respostaAtual && styles.opcaoSelecionada]}
                onPress={() => handleResposta(opcao.id)}
                disabled={mostrarResultado || respostaAtual}
              >
                <Text style={estiloTextoOpcao}>{opcao.texto}</Text>

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
                          <Icon name="check-circle" size={24} color="#4CAF50" />
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

        {!mostrarResultado && !respostaAtual && (
          <Text style={styles.instrucaoDesafio}>
            Selecione uma opção para continuar
          </Text>
        )}

        {mostrarResultado && respostaAtual && !modalVisivel && (
          <Text style={styles.processandoTexto}>
            Preparando próximo desafio...
          </Text>
        )}

        <View style={styles.progressoContainer}>
          <Text style={styles.progressoTexto}>
            Desafio {numeroDesafio} de 4
          </Text>
          <View style={styles.progressoBarraContainer}>
            <View
              style={[
                styles.progressoBarra,
                { width: `${(numeroDesafio / 4) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.acertosTexto}>
            Acertos: {acertos} de {Math.max(numeroDesafio - 1, 0)}
          </Text>
          <Text style={styles.instrucaoProgresso}>
            {acertos >= 3
              ? "✨ Você já pode desbloquear a próxima fase!"
              : `Precisa de ${3 - acertos} acerto(s) para desbloquear a Fase 4`}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00008B" />

      <FloatingBubbles />

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

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
              {etapaAtual === fase3Data.etapas.length - 1
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
    height: 100,
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
    padding: 20,
    paddingBottom: 100,
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
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 25,
    textAlign: "center",
    paddingHorizontal: 10,
    lineHeight: 26,
  },
  opcao: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  opcaoTexto: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  opcaoSelecionada: {
    elevation: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  opcaoCorreta: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
    borderWidth: 3,
  },
  opcaoIncorreta: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
    borderWidth: 3,
  },
  opcaoCorretaNaoEscolhida: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
    borderWidth: 3,
  },
  indicadorResposta: {
    marginLeft: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  indicadorImagem: {
    width: 30,
    height: 30,
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
