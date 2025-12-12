// ./Centro/matogrosso.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
  Easing,
  SafeAreaView,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video } from "expo-av";

const { width, height } = Dimensions.get("window");

// Cartas para o jogo de memória (5 pares = 10 cartas)
// Cores em português e seus vídeos correspondentes - MESMA ESTRUTURA QUE GOIÁS
const initialCards = [
  { id: 1, type: "vermelho", content: "Vermelho", color: "#FF0000", videoId: "s" },
  { id: 2, type: "vermelho", content: "s", isVideo: true, videoId: "s", color: "#FF0000" },
  { id: 3, type: "azul", content: "Azul", color: "#0000FF", videoId: "t" },
  { id: 4, type: "azul", content: "t", isVideo: true, videoId: "t", color: "#0000FF" },
  { id: 5, type: "verde", content: "Verde", color: "#00FF00", videoId: "u" },
  { id: 6, type: "verde", content: "u", isVideo: true, videoId: "u", color: "#00FF00" },
  { id: 7, type: "amarelo", content: "Amarelo", color: "#FFFF00", videoId: "v" },
  { id: 8, type: "amarelo", content: "v", isVideo: true, videoId: "v", color: "#FFFF00" },
  { id: 9, type: "roxo", content: "Roxo", color: "#800080", videoId: "w" },
  { id: 10, type: "roxo", content: "w", isVideo: true, videoId: "w", color: "#800080" },
];

// VÍDEOS - mesma estrutura que Goiás
const VIDEOS_LIBRAS = {
  s: require("../assets/Centro/vermelho.mp4"),
  t: require("../assets/Centro/azul.mp4"),
  u: require("../assets/Centro/verde.mp4"),
  v: require("../assets/Centro/amarelo.mp4"),
  w: require("../assets/Centro/verde.mp4"),
};

export default function MatoGrosso({ navigation }) {
  const [screen, setScreen] = useState("overlay");
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Estado para o jogo de cartas
  const [cards, setCards] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [matched, setMatched] = useState([]);
  const [time, setTime] = useState(0);
  const [counting, setCounting] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  
  const overlayFade = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const videoRef = React.useRef(null);
  const intervalRef = React.useRef(null);

  const colors = [
    { id: "vermelho", label: "Vermelho", videoId: "s", color: "#FF0000" },
    { id: "azul", label: "Azul", videoId: "t", color: "#0000FF" },
    { id: "verde", label: "Verde", videoId: "u", color: "#00FF00" },
    { id: "amarelo", label: "Amarelo", videoId: "v", color: "#FFFF00" },
    { id: "roxo", label: "Roxo", videoId: "w", color: "#800080" },
  ];

  useEffect(() => {
    // Tela inicial
    if (screen === "overlay") {
      setTimeout(() => {
        Animated.timing(overlayFade, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setScreen("como"));
      }, 1500);
    }
  }, [screen]);

  useEffect(() => {
    // Tela "como"
    if (screen === "como") {
      setTimeout(() => {
        setScreen("video");
        setVideoEnded(false);
      }, 4000);
    }
  }, [screen]);

  useEffect(() => {
    // Jogo inicia
    if (screen === "jogo") {
      if (cards.length === 0) {
        shuffleCards();
      }
      setTime(0);
      setCounting(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [screen]);

  useEffect(() => {
    // Timer
    if (counting) {
      intervalRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [counting]);

  useEffect(() => {
    // Confete quando completar o jogo
    if (matched.length === 10 && screen === "jogo") {
      generateConfetti();
      setCounting(false);
      clearInterval(intervalRef.current);
      salvarProgresso();
      
      setTimeout(() => {
        Alert.alert(
          "🎉 Parabéns!",
          `Você completou o jogo em ${time} segundos!\n\nTodas as cores foram combinadas!`,
          [
            { 
              text: "Jogar Novamente", 
              onPress: () => {
                shuffleCards();
                setTime(0);
                setCounting(true);
              }
            },
            { 
              text: "Voltar ao Menu", 
              onPress: () => navigation.navigate("CentroHome", { faseConcluida: 3 })
            },
          ]
        );
      }, 1000);
    }
  }, [matched, screen]);

  // Toca vídeo
  useEffect(() => {
    if (screen === "video" && videoRef.current) {
      const play = async () => {
        try {
          await videoRef.current.playAsync();
        } catch (err) {
          console.log("Erro vídeo:", err);
        }
      };
      setTimeout(play, 100);
    }
  }, [screen, currentColorIndex]);

  const generateConfetti = () => {
    const colors = ["#FF0000", "#0000FF", "#00FF00", "#FFFF00", "#800080", "#FF69B4"];
    const newConfetti = Array.from({ length: 100 }, (_, i) => {
      const fallAnim = new Animated.Value(-100);
      const fadeAnim = new Animated.Value(1);
      const duration = 2500 + Math.random() * 1000;
      
      Animated.timing(fallAnim, {
        toValue: height + 100,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, duration * 0.7);

      return {
        id: i,
        startX: Math.random() * 100,
        startY: -20,
        horizontalDrift: (Math.random() - 0.5) * 150,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 12,
        fallAnim,
        fadeAnim,
      };
    });

    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 4000);
  };

  function shuffleCards() {
    const shuffled = initialCards
      .map((c) => ({ ...c, key: Math.random() }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setMatched([]);
    setRevealed([]);
  }

  async function salvarProgresso() {
    try {
      await AsyncStorage.setItem("matogrosso_concluida", "true");
      console.log("Progresso salvo: Mato Grosso concluído");
    } catch (error) {
      console.log("Erro ao salvar progresso:", error);
    }
  }

  function handleCardPress(index) {
    if (revealed.includes(index) || matched.includes(index)) return;
    if (revealed.length === 2) return;

    const newRevealed = [...revealed, index];
    setRevealed(newRevealed);

    if (newRevealed.length === 2) {
      const [first, second] = newRevealed;

      setTimeout(() => {
        if (cards[first].type === cards[second].type) {
          const newMatched = [...matched, first, second];
          setMatched(newMatched);
        }
        setRevealed([]);
      }, 800);
    }
  }

  const handleContinueVideo = () => {
    if (currentColorIndex < colors.length - 1) {
      setCurrentColorIndex(prev => prev + 1);
      setScreen("como");
    } else {
      setGameStarted(true);
      setShowTutorial(true);
    }
  };

  const handleReloadVideo = async () => {
    setVideoEnded(false);
    if (videoRef.current) {
      await videoRef.current.replayAsync().catch(() => {});
    }
  };

  const handleStartGame = () => {
    setShowTutorial(false);
    setScreen("jogo");
  };

  const handleRestartGame = () => {
    setCurrentColorIndex(0);
    setGameStarted(false);
    setShowTutorial(false);
    setScreen("como");
  };

  // Renderização das cartas - MESMA LÓGICA QUE GOIÁS
  const renderCardContent = (card, isRevealed) => {
    if (card.isVideo) {
      return (
        <View style={styles.videoCardContainer}>
          {isRevealed ? (
            <Video
              source={VIDEOS_LIBRAS[card.videoId]}
              style={styles.cardVideo}
              resizeMode="cover"
              isMuted
              shouldPlay={true}
              isLooping={false}
              rate={0.5}
            />
          ) : (
            <View style={styles.videoPlaceholder}>
              <Text style={[styles.videoPlaceholderText, { color: card.color }]}>
                Vídeo
              </Text>
            </View>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.colorCardContainer}>
          <View style={[styles.colorCircle, { backgroundColor: card.color }]} />
          <Text style={[styles.colorName, { color: card.color }]}>
            {card.content}
          </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* OVERLAY INICIAL */}
      {screen === "overlay" && (
        <Animated.View style={[styles.overlay, { opacity: overlayFade }]}>
          <Text style={styles.overlayText}>MATO GROSSO</Text>
        </Animated.View>
      )}

      {/* TELA COMO SE DIZ - COM CÍRCULO COLORIDO */}
      {screen === "como" && !gameStarted && (
        <ImageBackground source={require("../assets/Centro/mt.png")} style={styles.bg}>
          <View style={styles.frameBorder}>
            <View style={styles.center}>
              <Text style={styles.header}>Como se diz "{colors[currentColorIndex].label}" em libras?</Text>
              <View style={styles.visualRow}>
                <View style={[styles.colorCircleLarge, { backgroundColor: colors[currentColorIndex].color }]}>
                  <Text style={styles.colorTextLarge}>{colors[currentColorIndex].label}</Text>
                </View>
                <Image source={require("../assets/Centro/seta.png")} style={styles.arrowImg} />
                <Image source={require("../assets/Centro/interrogacao.png")} style={styles.interrogacaoImg} />
              </View>
              <Image source={require("../assets/Centro/brancomt.png")} style={styles.character} />
            </View>
          </View>
        </ImageBackground>
      )}

      {/* TELA VÍDEO */}
      {screen === "video" && !gameStarted && (
        <ImageBackground source={require("../assets/Centro/mt.png")} style={styles.bg}>
          <View style={styles.frameBorder}>
            <View style={styles.center}>
              <View style={styles.videoBox}>
                <Video
                  ref={videoRef}
                  source={VIDEOS_LIBRAS[colors[currentColorIndex].videoId]}
                  style={styles.video}
                  resizeMode="contain"
                  isMuted
                  shouldPlay
                  rate={0.5}
                  isLooping={false}
                  onPlaybackStatusUpdate={(status) => {
                    if (status.didJustFinish) setVideoEnded(true);
                  }}
                />
              </View>

              {videoEnded && (
                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={styles.reloadButton}
                    onPress={handleReloadVideo}
                  >
                    <Image
                      source={require("../assets/Centro/reload.png")}
                      style={styles.iconButton}
                      tintColor="#FF69B4"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinueVideo}
                  >
                    <Image
                      source={require("../assets/Centro/certo.png")}
                      style={styles.iconButton}
                      tintColor="#4CAF50"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ImageBackground>
      )}

      {/* TUTORIAL DO JOGO */}
      {showTutorial && (
        <ImageBackground source={require("../assets/Centro/mt.png")} style={styles.bg}>
          <View style={styles.frameBorder}>
            <View style={styles.center}>
              <View style={styles.tutorialBox}>
                <Text style={styles.tutorialTitle}>Jogo da Memória</Text>
                <Text style={styles.tutorialText}>
                  Combine cada cor com seu respectivo sinal em libras!
                </Text>
                <Text style={styles.tutorialText}>
                  Você tem 5 pares para encontrar:
                </Text>
                
                <View style={styles.tutorialExamples}>
                  <View style={styles.tutorialPair}>
                    <View style={[styles.tutorialCard, { borderColor: "#FF0000" }]}>
                      <View style={[styles.tutorialColorCircle, { backgroundColor: "#FF0000" }]} />
                      <Text style={[styles.tutorialExampleText, { color: "#FF0000" }]}>Vermelho</Text>
                    </View>
                    <Text style={styles.tutorialArrow}>⇄</Text>
                    <View style={[styles.tutorialCard, { borderColor: "#FF0000" }]}>
                      <Text style={styles.tutorialExampleText}>S</Text>
                      <Text style={styles.tutorialVideoText}>Vídeo</Text>
                    </View>
                  </View>
                  
                  <View style={styles.tutorialPair}>
                    <View style={[styles.tutorialCard, { borderColor: "#0000FF" }]}>
                      <View style={[styles.tutorialColorCircle, { backgroundColor: "#0000FF" }]} />
                      <Text style={[styles.tutorialExampleText, { color: "#0000FF" }]}>Azul</Text>
                    </View>
                    <Text style={styles.tutorialArrow}>⇄</Text>
                    <View style={[styles.tutorialCard, { borderColor: "#0000FF" }]}>
                      <Text style={styles.tutorialExampleText}>T</Text>
                      <Text style={styles.tutorialVideoText}>Vídeo</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.startGameButton}
                  onPress={handleStartGame}
                >
                  <Text style={styles.startGameButtonText}>Começar Jogo!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      )}

      {/* TELA JOGO DE CARTAS */}
      {screen === "jogo" && gameStarted && (
        <Animated.View style={[styles.bg, { opacity: fadeAnim }]}>
          <ImageBackground source={require("../assets/Centro/mt.png")} style={StyleSheet.absoluteFill}>
            {confetti.map((item) => (
              <Animated.View
                key={item.id}
                style={[
                  styles.confetti,
                  {
                    left: `${item.startX}%`,
                    backgroundColor: item.color,
                    width: item.size,
                    height: item.size,
                    opacity: item.fadeAnim,
                    transform: [
                      { translateY: item.fallAnim },
                      {
                        translateX: item.fallAnim.interpolate({
                          inputRange: [-100, height + 100],
                          outputRange: [0, item.horizontalDrift],
                        }),
                      },
                      {
                        rotate: item.fallAnim.interpolate({
                          inputRange: [-100, height + 100],
                          outputRange: ['0deg', `${item.rotationSpeed * 360}deg`],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}

            <View style={styles.gameTopBar}>
              <TouchableOpacity
                onPress={() => navigation.navigate("CentroHome")}
                style={styles.backButton}
              >
                <Text style={styles.backText}>← Voltar</Text>
              </TouchableOpacity>

              <Text style={styles.timer}>⏱ {time}s</Text>
            </View>

            <View style={styles.center}>
              <Text style={styles.gameHeader}>Jogo da Memória</Text>
              <Text style={styles.gameSubtitle}>Cores - Encontre os 5 pares</Text>

              <View style={styles.gameGrid}>
                {cards.map((card, index) => (
                  <TouchableOpacity
                    key={card.key}
                    style={[
                      styles.card,
                      revealed.includes(index) || matched.includes(index) 
                        ? styles.cardRevealed 
                        : styles.cardHidden,
                      matched.includes(index) && styles.cardMatched
                    ]}
                    onPress={() => handleCardPress(index)}
                    disabled={matched.includes(index)}
                  >
                    {revealed.includes(index) || matched.includes(index) ? (
                      <View style={[
                        styles.cardContent,
                        { borderColor: card.color }
                      ]}>
                        {renderCardContent(card, true)}
                      </View>
                    ) : (
                      <View style={styles.cardBack}>
                        <Image
                          source={require("../assets/Centro/interrogacao.png")}
                          style={styles.cardBackImage}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.gameStats}>
                <Text style={styles.statsText}>
                  Pares: {matched.length / 2} de 5
                </Text>
                <View style={styles.gameButtons}>
                  <TouchableOpacity
                    style={styles.restartGameButton}
                    onPress={() => {
                      shuffleCards();
                      setTime(0);
                      setCounting(true);
                    }}
                  >
                    <Image
                      source={require("../assets/Centro/reload.png")}
                      style={styles.smallIcon}
                      tintColor="#FF69B4"
                    />
                    <Text style={styles.restartGameText}>Reiniciar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.menuButton}
                    onPress={handleRestartGame}
                  >
                    <Image
                      source={require("../assets/Centro/certo.png")}
                      style={styles.smallIcon}
                      tintColor="#4CAF50"
                    />
                    <Text style={styles.menuButtonText}>Menu</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#98CEFF",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  bg: { 
    flex: 1,
  },
  center: { 
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
  },
  
  frameBorder: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  header: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    padding: 0,
    borderRadius: 12,
    marginBottom: 20,
    bottom: 170,
    justifyContent: "center",
    textAlign: "center",
  },
  visualRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 200,
  },
  colorCircleLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    bottom: 50,
    left: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  colorTextLarge: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    fontFamily: Platform.OS === 'ios' ? 'Arial Rounded MT Bold' : 'sans-serif-condensed',
    textAlign: 'center',
  },
  arrowImg: { 
    width: 100, 
    height: 100, 
    marginHorizontal: 15,
    bottom: 50,
    left: 20,
  },
  interrogacaoImg: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    bottom: 50,
  },
  character: {
    position: "absolute",
    bottom: -70,
    width: 500,
    height: 500,
    resizeMode: "contain",
  },
  videoBox: {
    width: "80%",
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    bottom: 70,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 60,
    position: "absolute",
    bottom: 250,
    left: 0,
    right: 0,
  },
  reloadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderColor: "#FF69B4",
    borderWidth: 2,
  },
  continueButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  iconButton: { 
    width: 50,
    height: 50,
    resizeMode: "contain",
  },

  // Tutorial
  tutorialBox: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  tutorialTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  tutorialText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 24,
  },
  tutorialExamples: {
    marginVertical: 20,
    width: "100%",
  },
  tutorialPair: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  tutorialCard: {
    width: 100,
    height: 120,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
  },
  tutorialColorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  tutorialExampleText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  tutorialArrow: {
    fontSize: 28,
    marginHorizontal: 15,
    color: "#666",
  },
  tutorialVideoText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  startGameButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  startGameButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  // Jogo de Cartas
  gameTopBar: {
    position: "absolute",
    top: 40,
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "rgba(139, 69, 19, 0.8)",
    borderRadius: 10,
  },
  backText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16,
  },
  timer: {
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gameHeader: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  gameSubtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  gameGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 400,
    marginBottom: 30,
  },
  card: {
    width: 95,
    height: 120,
    margin: 6,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  cardHidden: {
    backgroundColor: "#4b99c6",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cardRevealed: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  cardMatched: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 3,
  },
  cardBack: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4b99c6",
  },
  cardBackImage: {
    width: 40,
    height: 40,
    tintColor: "#fff",
  },
  cardContent: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 5,
  },
  colorCardContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  colorName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  videoCardContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8,
  },
  cardVideo: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  videoPlaceholderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameStats: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  statsText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gameButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  restartGameButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FF69B4",
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  smallIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  restartGameText: {
    color: "#FF69B4",
    fontWeight: "bold",
    fontSize: 16,
  },
  menuButtonText: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 16,
  },
  confetti: {
    position: "absolute",
    top: "-20%",
    borderRadius: 50,
    zIndex: 5,
  },
});