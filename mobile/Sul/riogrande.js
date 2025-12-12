// ./Sul/minas.js
import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { Video, Audio } from "expo-av";

const { width, height } = Dimensions.get("window");

const letters = [
  { id: "mae", label: "MAÇÃ", videoId: "h", image: require("../assets/Sul/maca.png") },
  { id: "pai", label: "BANANA", videoId: "j", image: require("../assets/Sul/banana.png") },
  { id: "irmao", label: "LARANJA", videoId: "k", image: require("../assets/Sul/laranjafruta.png") },
  { id: "vovo", label: "MELANCIA", videoId: "l", image: require("../assets/Sul/melancia.png") },
  { id: "avo", label: "ABACAXI", videoId: "m", image: require("../assets/Sul/abacaxi.png") },
];

const VIDEOS_LIBRAS = {
  h: require("../assets/Sul/maca.mp4"),
  j: require("../assets/Sul/banana.mp4"),
  k: require("../assets/Sul/laranja.mp4"),
  l: require("../assets/Sul/melancia.mp4"),
  m: require("../assets/Sul/abacaxi.mp4"),
};

export default function RioGrandeSul({ navigation }) {
  const [screen, setScreen] = useState("overlay");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentGameQuestion, setCurrentGameQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [confetti, setConfetti] = useState([]);
  const [showGameButtons, setShowGameButtons] = useState(false);
  const [gameOrder, setGameOrder] = useState([]); // Ordem aleatória dos vídeos

  const overlayFade = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);
  const gameVideoRef = useRef(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  }, []);

  // Tela inicial
  useEffect(() => {
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

  // Tela "como"
  useEffect(() => {
    if (screen === "como") {
      setTimeout(() => {
        setScreen("video");
        setVideoEnded(false);
      }, 4000);
    }
  }, [screen]);

  // Jogo inicia
  useEffect(() => {
    if (screen === "jogo") {
      setShowGameButtons(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
      
      // Gerar ordem aleatória dos vídeos
      if (gameOrder.length === 0) {
        const shuffled = [...letters].sort(() => Math.random() - 0.5);
        setGameOrder(shuffled);
      }
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [screen, currentGameQuestion]);

  // Confete
  useEffect(() => {
    if (screen === "finalizado" && score > 0) {
      generateConfetti();
    }
  }, [screen, score]);

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
  }, [screen, currentLetterIndex]);

  const generateConfetti = () => {
    const colors = ["#FF6B6B", "#FFD700", "#4ECDC4", "#98CEFF", "#FB9F35"];
    const newConfetti = Array.from({ length: 80 }, (_, i) => {
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

  const pulseOptions = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSelectAnswer = (answerId) => {
    // Permite trocar de resposta antes de confirmar
    setSelectedAnswer(answerId);
    pulseOptions();
  };

  const handleConfirmAnswer = () => {
    if (!selectedAnswer) return;
    
    const correctVideo = gameOrder[currentGameQuestion];
    const isCorrect = selectedAnswer === correctVideo.id;
    
    if (isCorrect) setScore(prev => prev + 1);
    setShowFeedback(true);
    setShowGameButtons(false);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      if (currentGameQuestion < gameOrder.length - 1) {
        setCurrentGameQuestion(prev => prev + 1);
      } else {
        setScreen("finalizado");
      }
    }, 1500);
  };

  const handleContinueVideo = () => {
    if (currentLetterIndex < letters.length - 1) {
      setCurrentLetterIndex(prev => prev + 1);
      setScreen("como");
    } else {
      setGameStarted(true);
      setCurrentGameQuestion(0);
      setScreen("jogo");
    }
  };

  const handleReloadVideo = async () => {
    setVideoEnded(false);
    if (videoRef.current) {
      await videoRef.current.replayAsync().catch(() => {});
    }
  };

  const handleReloadGameVideo = async () => {
    setShowGameButtons(false);
    if (gameVideoRef.current) {
      await gameVideoRef.current.replayAsync().catch(() => {});
    }
  };

  const handleRestartGame = () => {
    setCurrentLetterIndex(0);
    setGameStarted(false);
    setCurrentGameQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowGameButtons(false);
    setConfetti([]);
    setGameOrder([]);
    setScreen("como");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* OVERLAY INICIAL */}
      {screen === "overlay" && (
        <Animated.View style={[styles.overlay, { opacity: overlayFade }]}>
          <Text style={styles.overlayText}>RIO GRANDE DO SUL</Text>
        </Animated.View>
      )}

      {/* TELA COMO SE DIZ */}
      {screen === "como" && !gameStarted && (
        <ImageBackground source={require("../assets/Sul/sp.png")} style={styles.bg}>
          <View style={styles.frameBorder}>
            <View style={styles.center}>
              <Text style={styles.header}>Como se diz "{letters[currentLetterIndex].label}" em libras?</Text>
              <View style={styles.visualRow}>
                <Image source={letters[currentLetterIndex].image} style={styles.objImg} />
                <Image source={require("../assets/Sul/seta.png")} style={styles.arrowImg} />
                <Image source={require("../assets/Sul/interrogacao.png")} style={styles.objImg} />
              </View>
              <Image source={require("../assets/Sul/brancorg.png")} style={styles.character} />
            </View>
          </View>
        </ImageBackground>
      )}

      {/* TELA VÍDEO */}
      {screen === "video" && !gameStarted && (
        <ImageBackground source={require("../assets/Sul/sp.png")} style={styles.bg}>
          <View style={styles.frameBorder}>
            <View style={styles.center}>
              <View style={styles.videoBox}>
                <Video
                  ref={videoRef}
                  source={VIDEOS_LIBRAS[letters[currentLetterIndex].videoId]}
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
                      source={require("../assets/Sul/reload.png")}
                      style={styles.iconButton}
                      tintColor="#FF69B4"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinueVideo}
                  >
                    <Image
                      source={require("../assets/Sul/certo.png")}
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

      {/* TELA JOGO */}
      {screen === "jogo" && gameStarted && gameOrder.length > 0 && (
        <Animated.View style={[styles.bg, { opacity: fadeAnim }]}>
          <ImageBackground source={require("../assets/Sul/sp.png")} style={StyleSheet.absoluteFill}>
            <View style={styles.frameBorder}>
              <View style={styles.center}>
                <Text style={styles.gameHeader}>Hora de jogar!</Text>

                <View style={styles.centralVideoContainer}>
                  <Video
                    ref={gameVideoRef}
                    source={VIDEOS_LIBRAS[gameOrder[currentGameQuestion].videoId]}
                    style={styles.centralVideo}
                    resizeMode="contain"
                    isMuted
                    shouldPlay
                    rate={0.5}
                    isLooping={false}
                    onPlaybackStatusUpdate={(status) => {
                      if (status.didJustFinish) setShowGameButtons(true);
                    }}
                  />
                  
                  {/* RELOAD DO VÍDEO EMBAIXO DO VÍDEO */}
                  {showGameButtons && !selectedAnswer && !showFeedback && (
                    <View style={styles.videoReloadContainer}>
                      <TouchableOpacity
                        style={styles.videoReloadButton}
                        onPress={handleReloadGameVideo}
                      >
                        <Image
                          source={require("../assets/Sul/reload.png")}
                          style={styles.iconButton}
                          tintColor="#FF69B4"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* OPÇÕES FIXAS - IGUAL AMAZÔNIA */}
                <View style={styles.optionsContainer}>
                  {letters.map((option) => {
                    const isSelected = selectedAnswer === option.id;
                    const correctVideo = gameOrder[currentGameQuestion];
                    const isCorrect = option.id === correctVideo.id;
                    
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.optionButton,
                          isSelected && styles.selected,
                          showFeedback && isCorrect && styles.correct,
                          showFeedback && isSelected && !isCorrect && styles.wrong,
                        ]}
                        onPress={() => handleSelectAnswer(option.id)}
                        disabled={showFeedback}
                      >
                        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                          <Image source={option.image} style={styles.optionImage} />
                          <Text style={[
                            styles.optionText,
                            showFeedback && isCorrect && styles.optionTextCorrect,
                            showFeedback && isSelected && !isCorrect && styles.optionTextWrong,
                          ]}>
                            {option.label}
                          </Text>
                        </Animated.View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* BOTÃO DE CONFIRMAR EMBAIXO DAS OPÇÕES */}
                {selectedAnswer && !showFeedback && (
                  <View style={styles.confirmContainer}>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={handleConfirmAnswer}
                    >
                      <Image
                        source={require("../assets/Sul/certo.png")}
                        style={styles.iconButton}
                        tintColor="#4CAF50"
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {/* FEEDBACK */}
                {showFeedback && selectedAnswer && (
                  <View style={styles.feedbackContainer}>
                    <Text style={selectedAnswer === gameOrder[currentGameQuestion].id ? styles.feedbackCorrect : styles.feedbackWrong}>
                      {selectedAnswer === gameOrder[currentGameQuestion].id ? "Correto! +1 ponto" : `Não é essa! É a palavra "${gameOrder[currentGameQuestion].label}"`}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
      )}

      {/* TELA FINAL */}
      {screen === "finalizado" && (
        <View style={styles.finalizadoContainer}>
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

          <View style={styles.center}>
            <Text style={styles.finalScore}>Você acertou {score} de {letters.length}!</Text>
            <Animated.Image source={require("../assets/Sul/Sudeste2.png")} style={[styles.polaroid, { opacity: fadeAnim }]} />
            <Animated.Image source={require("../assets/Sul/certo.png")} style={[styles.seloCerto, { opacity: fadeAnim }]} />
            <View style={styles.finalButtonsRow}>
              <TouchableOpacity
                style={styles.restartButton}
                onPress={handleRestartGame}
              >
                <Image
                  source={require("../assets/Sul/reload.png")}
                  style={styles.iconButton}
                  tintColor="#FF69B4"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.voltarButton}
                onPress={() => navigation.navigate("SulHome", { faseConcluida: 4 })}
              >
                <Image
                  source={require("../assets/Sul/certo.png")}
                  style={styles.iconButton}
                  tintColor="#4CAF50"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  objImg: { 
    width: 150,
    height: 150,
    resizeMode: "contain",
    bottom: 50,
    left: 10,
  },
  arrowImg: { 
    width: 100, 
    height: 100, 
    marginHorizontal: 15,
    bottom: 50,
  },
  character: {
    position: "absolute",
    bottom: -70,
    width:500,
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
  gameHeader: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    bottom: 170,
  },
  centralVideoContainer: {
    width: 280,
    height: 280,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderWidth: 0,
    marginBottom: 40,
    position: "absolute",
    top: 180,
    elevation: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  centralVideo: {
    width: "100%",
    height: "100%",
  },
  videoReloadContainer: {
    position: "absolute",
    bottom: -80,
    alignSelf: "center",
  },
  videoReloadButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    position: "absolute",
    bottom: 200,
    gap: 15,
  },
  optionButton: {
    width: 100,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 34,
  },
  selected: {
    borderColor: "#FFD700",
    backgroundColor: "rgba(255, 215, 0, 0.3)",
  },
  correct: {
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.3)",
  },
  wrong: {
    borderColor: "#F44336",
    backgroundColor: "rgba(244, 67, 54, 0.3)",
  },
  optionImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 8,
  },
  optionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  optionTextCorrect: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  optionTextWrong: {
    color: "#F44336",
    fontWeight: "bold",
  },
  confirmContainer: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
  },
  confirmButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackContainer: {
    position: "absolute",
    bottom: 60,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: "center",
  },
  feedbackCorrect: {
    fontSize: 20,
    color: "#4CAF50",
    fontWeight: "bold",
    textAlign: "center",
  },
  feedbackWrong: {
    fontSize: 20,
    color: "#F44336",
    fontWeight: "bold",
    textAlign: "center",
  },
  iconButton: { 
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  finalizadoContainer: {
    flex: 1,
    backgroundColor: "#98CEFF",
    justifyContent: "center",
    alignItems: "center",
  },
  finalScore: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  polaroid: { 
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  seloCerto: {
    position: "absolute",
    top: "45%",
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  finalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 30,
  },
  restartButton: {
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
  voltarButton: {
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
  confetti: {
    position: "absolute",
    top: "-20%",
    borderRadius: 50,
  },
});