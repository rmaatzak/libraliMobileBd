// ./Centro/goias.js
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
// Cada número tem uma carta com o número e uma com o vídeo correspondente
const initialCards = [
  { id: 1, type: "0", content: "0", color: "#FF6B6B", videoId: "h" },
  { id: 2, type: "0", content: "h", isVideo: true, videoId: "h", color: "#FF6B6B" },
  { id: 3, type: "1", content: "1", color: "#4ECDC4", videoId: "j" },
  { id: 4, type: "1", content: "j", isVideo: true, videoId: "j", color: "#4ECDC4" },
  { id: 5, type: "2", content: "2", color: "#FFD700", videoId: "k" },
  { id: 6, type: "2", content: "k", isVideo: true, videoId: "k", color: "#FFD700" },
  { id: 7, type: "3", content: "3", color: "#98CEFF", videoId: "l" },
  { id: 8, type: "3", content: "l", isVideo: true, videoId: "l", color: "#98CEFF" },
  { id: 9, type: "4", content: "4", color: "#FF69B4", videoId: "m" },
  { id: 10, type: "4", content: "m", isVideo: true, videoId: "m", color: "#FF69B4" },
];

// USANDO OS VÍDEOS DA PASTA SUL
const VIDEOS_LIBRAS = {
  h: require("../assets/Centro/0.mp4"),
  j: require("../assets/Centro/1.mp4"),
  k: require("../assets/Centro/2.mp4"),
  l: require("../assets/Centro/3.mp4"),
  m: require("../assets/Centro/4.mp4"),
};

export default function Goias({ navigation }) {
  const [screen, setScreen] = useState("overlay");
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
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

  const numbers = [
    { id: "zero", label: "0", videoId: "h", color: "#FF6B6B" },
    { id: "um", label: "1", videoId: "j", color: "#4ECDC4" },
    { id: "dois", label: "2", videoId: "k", color: "#FFD700" },
    { id: "tres", label: "3", videoId: "l", color: "#98CEFF" },
    { id: "quatro", label: "4", videoId: "m", color: "#FF69B4" },
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
          `Você completou o jogo em ${time} segundos!\n\nTodos os 5 pares foram encontrados!`,
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
              onPress: () => navigation.navigate("CentroHome", { faseConcluida: 1 })
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
  }, [screen, currentNumberIndex]);

  const generateConfetti = () => {
    const colors = ["#FF6B6B", "#FFD700", "#4ECDC4", "#98CEFF", "#FF69B4", "#FB9F35"];
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
      await AsyncStorage.setItem("goias_concluida", "true");
      console.log("Progresso salvo: Goiás concluído");
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
    if (currentNumberIndex < numbers.length - 1) {
      setCurrentNumberIndex(prev => prev + 1);
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
    setCurrentNumberIndex(0);
    setGameStarted(false);
    setShowTutorial(false);
    setScreen("como");
  };

// Renderização das cartas 
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
      <View style={styles.numberCardContainer}>
        <Text style={[styles.cardNumber, { color: card.color, fontSize: 42 }]}>
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
          <Text style={styles.overlayText}>GOIÁS</Text>
        </Animated.View>
      )}

      {/* TELA COMO SE DIZ */}
      {screen === "como" && !gameStarted && (
        <ImageBackground source={require("../assets/Centro/goias.png")} style={styles.bg}>
          <View style={styles.frameBorder}>
            <View style={styles.center}>
              <Text style={styles.header}>Como se diz "{numbers[currentNumberIndex].label}" em libras?</Text>
              <View style={styles.visualRow}>
                <View style={[styles.numberCircleLarge, { backgroundColor: numbers[currentNumberIndex].color }]}>
                  <Text style={styles.numberTextLarge}>{numbers[currentNumberIndex].label}</Text>
                </View>
                <Image source={require("../assets/Centro/seta.png")} style={styles.arrowImg} />
                <Image source={require("../assets/Centro/interrogacao.png")} style={styles.interrogacaoImg} />
              </View>
              <Image source={require("../assets/Centro/rosagoias.png")} style={styles.character} />
            </View>
          </View>
        </ImageBackground>
      )}

      {/* TELA VÍDEO */}
      {screen === "video" && !gameStarted && (
        <ImageBackground source={require("../assets/Centro/goias.png")} style={styles.bg}>
          <View style={styles.frameBorder}>
            <View style={styles.center}>
              <View style={styles.videoBox}>
                <Video
                  ref={videoRef}
                  source={VIDEOS_LIBRAS[numbers[currentNumberIndex].videoId]}
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
        <ImageBackground source={require("../assets/Centro/goias.png")} style={styles.bg}>
          <View style={styles.frameBorder}>
            <View style={styles.center}>
              <View style={styles.tutorialBox}>
                <Text style={styles.tutorialTitle}>Jogo da Memória</Text>
                <Text style={styles.tutorialText}>
                  Combine cada número com seu respectivo sinal em libras!
                </Text>
                <Text style={styles.tutorialText}>
                  Você tem 5 pares para encontrar:
                </Text>
                
                <View style={styles.tutorialExamples}>
                  <View style={styles.tutorialPair}>
                    <View style={[styles.tutorialCard, { borderColor: "#FF6B6B" }]}>
                      <Text style={[styles.tutorialExampleText, { color: "#FF6B6B" }]}>0</Text>
                    </View>
                    <Text style={styles.tutorialArrow}>⇄</Text>
                    <View style={[styles.tutorialCard, { borderColor: "#FF6B6B" }]}>
                      <Text style={styles.tutorialExampleText}>H</Text>
                      <Text style={styles.tutorialVideoText}>Vídeo</Text>
                    </View>
                  </View>
                  
                  <View style={styles.tutorialPair}>
                    <View style={[styles.tutorialCard, { borderColor: "#4ECDC4" }]}>
                      <Text style={[styles.tutorialExampleText, { color: "#4ECDC4" }]}>1</Text>
                    </View>
                    <Text style={styles.tutorialArrow}>⇄</Text>
                    <View style={[styles.tutorialCard, { borderColor: "#4ECDC4" }]}>
                      <Text style={styles.tutorialExampleText}>J</Text>
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
          <ImageBackground source={require("../assets/Centro/goias.png")} style={StyleSheet.absoluteFill}>
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
              <Text style={styles.gameSubtitle}>Encontre os 5 pares</Text>

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
    fontSize: 43,
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
    fontSize: 35,
    fontWeight: "bold",
    color: "#fff",
    padding: 0,
    borderRadius: 12,
    marginBottom: 20,
    bottom: 120,
    textAlign: 'center',
    width: '90%',
  },
  visualRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 200,
  },
  numberCircleLarge: {
    width: 100,
    height: 100,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    bottom: 50,
    left: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    right: 10,
  },
  numberTextLarge: {
    fontSize: 50,
    fontWeight: "700",
    color: "white",
    fontFamily: Platform.OS === 'ios' ? 'Arial Rounded MT Bold' : 'sans-serif-condensed',
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
    bottom: -10,
    width:500,
    height: 500,
    resizeMode: "contain",
    left: 80,
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
    width: 80,
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  tutorialExampleText: {
    fontSize: 32,
    fontWeight: "bold",
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
    width: 85,
    height: 110,
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
  },
  cardNumber: {
    fontSize: 42,
    fontWeight: "700",
    fontFamily: Platform.OS === 'ios' ? 'Arial Rounded MT Bold' : 'sans-serif-condensed',
  },
  videoCardContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardVideoLabel: {
    fontSize: 36,
    fontWeight: "bold",
  },
  cardVideoText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
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
  // Adicione estes estilos à sua StyleSheet
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
numberCardContainer: {
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},
});