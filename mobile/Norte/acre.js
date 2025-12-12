// ./Norte/acre.js
import React, { useState, useEffect, useRef, useCallback } from "react";
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

// ⭐ CONSOANTES do ACRE: B, C, D, F, G
const steps = [
  { id: "b", label: "B", image: require("../assets/Norte/b.png") },
  { id: "c", label: "C", image: require("../assets/Norte/c.png") },
  { id: "d", label: "D", image: require("../assets/Norte/d.png") },
  { id: "f", label: "F", image: require("../assets/Norte/f.png") },
  { id: "g", label: "G", image: require("../assets/Norte/g.png") },
];

// ⭐ Vídeos (reutilizando a.mp4, e.mp4, etc. — como você tem)
const VIDEOS_LIBRAS = {
  b: require("../assets/Norte/b.mp4"),
  c: require("../assets/Norte/c.mp4"),
  d: require("../assets/Norte/d.mp4"),
  f: require("../assets/Norte/f.mp4"),
  g: require("../assets/Norte/g.mp4"),
};

export default function Acre({ navigation }) {
  const [screen, setScreen] = useState("overlay");
  const [currentStep, setCurrentStep] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [matches, setMatches] = useState([]);
  const [shuffledVideos, setShuffledVideos] = useState([]);
  const [playingVideos, setPlayingVideos] = useState([]);

  // ✅ CORREÇÃO DO LOOP: substituímos pulseAnim por pulseScale (número simples)
  const [pulseScale, setPulseScale] = useState(1);

  // ✅ Confetes melhorados — agora com física realista
  const [confetti, setConfetti] = useState([]);

  // Animações (seguras)
  const overlayFade = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  }, []);

  useEffect(() => {
    if (screen === "overlay") {
      const timer = setTimeout(() => {
        Animated.timing(overlayFade, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setScreen("como"));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]); // Adicionei screen como dependência

  // --- Tela "como" → vídeo
  useEffect(() => {
    if (screen === "como") {
      const timer = setTimeout(() => {
        setScreen("video");
        setVideoEnded(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // --- Entra no jogo → embaralha vídeos
  useEffect(() => {
    if (screen === "jogo") {
      const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
      setShuffledVideos(shuffle(steps));

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [screen]);

  // --- Ao concluir, dispara confete + vai para finalizado
  useEffect(() => {
    if (matches.length === 5 && screen === "jogo") {
      generateConfetti();
      const timer = setTimeout(() => setScreen("finalizado"), 1000);
      return () => clearTimeout(timer);
    }
  }, [matches, screen]);

  // --- Toca vídeo quando entra na tela
  useEffect(() => {
    if (screen !== "video" || !videoRef.current) return;

    const play = async () => {
      try {
        await videoRef.current.playAsync();
      } catch (err) {
        console.warn("Erro ao tocar vídeo:", err);
      }
    };

    const timer = setTimeout(play, 100);
    return () => clearTimeout(timer);
  }, [screen, currentStep]);

  // ✨ CONFETE REFEITO — físico realista, vida individual, smooth
  const generateConfetti = useCallback(() => {
    const colors = ["#FFD700", "#00BFFF", "#32CD32", "#FF6347", "#9370DB", "#FF1493"];
    
    const newConfetti = Array.from({ length: 80 }, (_, i) => {
      // Posição inicial aleatória na parte superior
      const startX = Math.random() * width;
      const startY = -20 - Math.random() * 100;

      // Física: velocidade vertical, desvio horizontal, rotação
      const fallDuration = 2000 + Math.random() * 1500;
      const horizontalDrift = (Math.random() - 0.5) * 300;
      const rotationSpeed = (Math.random() - 0.5) * 720;

      // Animações individuais
      const fallAnim = new Animated.Value(0);
      const fadeAnim = new Animated.Value(1);
      const scaleAnim = new Animated.Value(0.5);

      // ✅ Animação de queda + fade out suave
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(fallAnim, {
            toValue: 1,
            duration: fallDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: fallDuration * 0.7,
            delay: fallDuration * 0.3,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      return {
        id: i,
        startX,
        startY,
        fallAnim,
        fadeAnim,
        scaleAnim,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 12,
        horizontalDrift,
        rotationSpeed,
      };
    });

    setConfetti(newConfetti);

    // Limpa após 4s
    setTimeout(() => setConfetti([]), 4000);
  }, []);

  // ✅ Funções de interação (sem loop!)
  const handleSelectImage = useCallback((id) => {
    setSelectedImage(id);
    setPlayingVideos(shuffledVideos.map(v => v.id));
    // ✅ Pulsação suave com estado simples
    setPulseScale(1.15);
    setTimeout(() => setPulseScale(1), 400);
  }, [shuffledVideos]);

  const handleSelectVideo = useCallback((id) => {
    setSelectedVideo(id);
    if (selectedImage && selectedImage === id) {
      setMatches(prev => [...prev, id]);
      setPlayingVideos([]);
    }
    setTimeout(() => {
      setSelectedImage(null);
      setSelectedVideo(null);
    }, 500);
  }, [selectedImage]);

  const handleContinueVideo = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      setScreen("como");
    } else {
      setScreen("jogo");
    }
  };

  const handleReloadVideo = async () => {
    setVideoEnded(false);
    if (videoRef.current) {
      await videoRef.current.replayAsync().catch(() => {});
    }
  };

  const handleRestartGame = () => {
    setMatches([]);
    setSelectedImage(null);
    setSelectedVideo(null);
    setPlayingVideos([]);
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    setShuffledVideos(shuffle(steps));
  };

  const isGameFinished = matches.length === 5;

  // ----------------- RENDER -----------------

  return (
    <SafeAreaView style={styles.container}>
      {/* Tela de introdução: ACRE */}
      {screen === "overlay" && (
        <Animated.View style={[styles.overlay, { opacity: overlayFade }]}>
          <Text style={styles.overlayText}>ACRE</Text>
          <Text style={styles.overlaySubtext}>Consoantes B, C, D, F, G</Text>
        </Animated.View>
      )}

      {/* Tela "Como se diz" */}
      {screen === "como" && (
        <ImageBackground
          source={require("../assets/Norte/acre.png")}
          style={styles.bg}
        >
          <View style={styles.frameBorder}>
            <View style={styles.center}>
              <Text style={styles.header}>
                Como se diz "{steps[currentStep].label}" em libras?
              </Text>

              <View style={styles.visualRow}>
                <Image source={steps[currentStep].image} style={styles.objImg} />
                <Image
                  source={require("../assets/Norte/seta.png")}
                  style={styles.arrowImg}
                />
                <Image
                  source={require("../assets/Norte/interrogacao.png")}
                  style={styles.objImg}
                />
              </View>

              <Image
                source={require("../assets/Norte/amarelo.png")}
                style={styles.character}
              />
            </View>
          </View>
        </ImageBackground>
      )}

      {/* Tela de vídeo Libras */}
      {screen === "video" && (
        <ImageBackground
          source={require("../assets/Norte/acre.png")}
          style={styles.bg}
        >
          <View style={styles.frameBorder}>
            <View style={styles.center}>
              <View style={styles.videoBox}>
                <Video
                  ref={videoRef}
                  source={VIDEOS_LIBRAS[steps[currentStep].id]}
                  style={styles.video}
                  resizeMode="contain"
                  isMuted
                  shouldPlay
                  rate={0.8}
                  isLooping={false}
                  onPlaybackStatusUpdate={(status) => {
                    if (status.isLoaded && status.didJustFinish) {
                      setVideoEnded(true);
                    }
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
                      source={require("../assets/Norte/reload.png")}
                      style={styles.iconButton}
                      tintColor="#FF69B4"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinueVideo}
                  >
                    <Image
                      source={require("../assets/Norte/certo.png")}
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

      {/* Tela do jogo de ligar */}
      {screen === "jogo" && (
        <Animated.View style={[styles.bg, { opacity: fadeAnim }]}>
          <ImageBackground
            source={require("../assets/Norte/acre.png")}
            style={styles.absoluteFill}
          >
            {/* ✨ Confetes animados */}
            {confetti.map((item) => {
              const translateY = item.fallAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [item.startY, height + 100],
              });
              const translateX = item.fallAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, item.horizontalDrift],
              });
              const rotate = item.fallAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', `${item.rotationSpeed}deg`],
              });

              return (
                <Animated.View
                  key={item.id}
                  style={[
                    styles.confettiBase,
                    {
                      left: item.startX,
                      top: 0,
                      width: item.size,
                      height: item.size,
                      backgroundColor: item.color,
                      borderRadius: item.size / 2,
                      opacity: item.fadeAnim,
                      transform: [
                        { translateY },
                        { translateX },
                        { rotate },
                        { scale: item.scaleAnim },
                      ],
                    },
                  ]}
                />
              );
            })}

            <View style={styles.frameBorder}>
              <View style={styles.center}>
                <Text style={styles.gameHeader}>Hora de jogar!</Text>

                <View style={styles.gameArea}>
                  {/* Coluna de imagens — B, C, D, F, G (fixa) */}
                  <View style={styles.column}>
                    {steps.map((item) => {
                      const matched = matches.includes(item.id);
                      const selected = selectedImage === item.id;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => handleSelectImage(item.id)}
                          disabled={matched}
                          style={[
                            styles.gameItem,
                            selected && styles.selected,
                            matched && styles.correct,
                          ]}
                        >
                          <Image
                            source={item.image}
                            style={styles.objImgSmall}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Coluna de vídeos — embaralhados */}
                  <View style={styles.column}>
                    {shuffledVideos.map((item) => {
                      const matched = matches.includes(item.id);
                      const selected = selectedVideo === item.id;
                      const shouldPlay = playingVideos.includes(item.id) && !matched;

                      return (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => handleSelectVideo(item.id)}
                          disabled={matched}
                        >
                          <Animated.View
                            style={[
                              styles.gameItem,
                              { transform: [{ scale: pulseScale }] },
                              selected && styles.selected,
                              matched && styles.correct,
                            ]}
                          >
                            <Video
                              source={VIDEOS_LIBRAS[item.id]}
                              style={styles.videoSmall}
                              resizeMode="cover"
                              isMuted
                              shouldPlay={shouldPlay}
                              isLooping
                              useNativeControls={false}
                            />
                          </Animated.View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {isGameFinished && (
                  <View style={styles.buttonsRow}>
                    <TouchableOpacity
                      style={styles.jogoReloadButton}
                      onPress={handleRestartGame}
                    >
                      <Image
                        source={require("../assets/Norte/reload.png")}
                        style={styles.iconButton}
                        tintColor="#FF69B4"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.jogoContinueButton}
                      onPress={() => setScreen("finalizado")}
                    >
                      <Image
                        source={require("../assets/Norte/certo.png")}
                        style={styles.iconButton}
                        tintColor="#4CAF50"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
      )}

      {/* Tela final */}
      {screen === "finalizado" && (
        <View style={styles.finalizadoContainer}>
          {/* Confete final */}
          {confetti.map((item) => {
            const translateY = item.fallAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [item.startY, height + 100],
            });
            const translateX = item.fallAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, item.horizontalDrift],
            });
            const rotate = item.fallAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', `${item.rotationSpeed}deg`],
            });

            return (
              <Animated.View
                key={item.id}
                style={[
                  styles.confettiBase,
                  {
                    left: item.startX,
                    top: 0,
                    width: item.size,
                    height: item.size,
                    backgroundColor: item.color,
                    borderRadius: item.size / 2,
                    opacity: item.fadeAnim,
                    transform: [
                      { translateY },
                      { translateX },
                      { rotate },
                      { scale: item.scaleAnim },
                    ],
                  },
                ]}
              />
            );
          })}

          <View style={styles.center}>
            <Animated.Image
              source={require("../assets/Norte/Norte2.png")}
              style={[styles.polaroid, { opacity: fadeAnim }]}
            />
            <Animated.Image
              source={require("../assets/Norte/certo.png")}
              style={[styles.seloCerto, { opacity: fadeAnim }]}
            />
            <TouchableOpacity
              style={styles.voltarButton}
              onPress={() =>
                navigation.navigate("NorteHome", { faseConcluida: 2 })
              }
            >
              <Text style={styles.voltarText}>Concluir Acre</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  absoluteFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
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
  overlaySubtext: {
    fontSize: 20,
    color: "#fff",
    marginTop: 10,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    padding: 0,
    borderRadius: 12,
    marginBottom: 20,
    bottom: 120,
    textAlign: 'center',
    width: '90%',
  },
  gameHeader: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: 'center',
    bottom: 100,
  },
  visualRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 200,
    justifyContent: 'center',
  },
  objImg: { 
    width: 150,
    height: 150,
    resizeMode: "contain",
    bottom: 50,
  },
  arrowImg: { 
    width:100, 
    height: 100, 
    marginHorizontal: 15,
    bottom: 50,
  },
  character: {
    position: "absolute",
    bottom: -30,
    width: 490,
    height: 490,
    resizeMode: "contain",
  },
  videoBox: {
    width: "80%",
    height: 220,
    bottom: 70,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: 'rgba(0,0,0,0.3)',
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

  jogoReloadButton: {
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
    marginTop: 20,
    marginRight: 20,
  },
  jogoContinueButton: {
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
    marginTop: 20,
    marginLeft: 20,
  },

  iconButton: { 
    width: 50,
    height: 50,
    resizeMode: "contain",
  },

  gameArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  column: { 
    alignItems: "center",
  },
  gameItem: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.28)",
    borderRadius: 12,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 34, 
    overflow: 'hidden',
  },
  objImgSmall: { 
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  videoSmall: {
    width: "100%",
    height: "100%",
  },
  selected: {
    borderColor: "#ffd700",
    backgroundColor: "rgba(255,215,0,0.3)",
  },
  correct: {
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76,175,80,0.3)",
  },
  
  confettiBase: {
    position: "absolute",
    zIndex: 1000,
  },
  
  finalizadoContainer: {
    flex: 1,
    backgroundColor: "#98CEFF",
    justifyContent: "center",
    alignItems: "center",
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
  voltarButton: {
    marginTop: 30,
    width: 180,
    height: 60,
    borderRadius: 30,
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
  voltarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});