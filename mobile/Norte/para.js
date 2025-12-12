// ./Norte/para.js
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

// ⭐ 5 CONSOANTES — H, J, K, L, M (ordem fixa!)
const steps = [
  { id: "h", label: "H", image: require("../assets/Norte/h.png") },
  { id: "j", label: "J", image: require("../assets/Norte/j.png") },
  { id: "k", label: "K", image: require("../assets/Norte/k.png") },
  { id: "l", label: "L", image: require("../assets/Norte/l.png") },
  { id: "m", label: "M", image: require("../assets/Norte/m.png") },
];

// ⭐ Vídeos (mantendo os mesmos das vogais por enquanto)
const VIDEOS_LIBRAS = {
  h: require("../assets/Norte/h.mp4"),
  j: require("../assets/Norte/j.mp4"),
  k: require("../assets/Norte/k.mp4"),
  l: require("../assets/Norte/l.mp4"),
  m: require("../assets/Norte/m.mp4"),
};

export default function Para({ navigation }) {
  const [screen, setScreen] = useState("overlay");
  const [currentStep, setCurrentStep] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [matches, setMatches] = useState([]);
  const [shuffledVideos, setShuffledVideos] = useState([]);
  const [playingVideos, setPlayingVideos] = useState([]);

  const [confetti, setConfetti] = useState([]);

  // Animações
  const overlayFade = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);

  // 🔊 Configura o modo de áudio UMA VEZ ao montar o componente
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  }, []);

  // --- Tela inicial (PARÁ) desaparece após 3s
  useEffect(() => {
    if (screen === "overlay") {
      const timer = setTimeout(() => {
        Animated.timing(overlayFade, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setScreen("como");
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // --- Tela "Como se diz" dura 4s e vai pro vídeo
  useEffect(() => {
    if (screen === "como") {
      const timer = setTimeout(() => {
        setScreen("video");
        setVideoEnded(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // --- Tela de jogo: apenas os VÍDEOS são embaralhados
  useEffect(() => {
    if (screen === "jogo") {
      const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
      setShuffledVideos(shuffle(steps));

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [screen]);

  // --- Confete quando terminar
  useEffect(() => {
    if (matches.length === steps.length && matches.length > 0) {
      generateConfetti();
    }
  }, [matches]);

  // --- ✅ CARREGA E REPRODUZ VÍDEO
  useEffect(() => {
    if (screen !== "video" || !videoRef.current) return;

    const playVideo = async () => {
      try {
        await videoRef.current.playAsync();
      } catch (err) {
        console.error("Erro ao tocar o vídeo:", err);
      }
    };

    const timer = setTimeout(playVideo, 100);
    return () => clearTimeout(timer);
  }, [screen, currentStep]);

  // ----------------- FUNÇÕES -----------------

  const generateConfetti = () => {
    setConfetti([]);

    const colors = ["#FF6B6B", "#FFD700", "#4ECDC4", "#98CEFF", "#FB9F35", "#FF69B4"];
    const shapes = ["circle", "square", "star"];

    const newConfetti = Array.from({ length: 120 }, (_, i) => {
      const startX = Math.random() * 100;
      const startY = -20;
      const horizontalDrift = (Math.random() - 0.5) * 150;
      const rotationSpeed = (Math.random() - 0.5) * 10;

      // ✅ Criar Animated.Value diretamente (sem useRef)
      const fallAnim = new Animated.Value(-100);
      const fadeAnimConfetti = new Animated.Value(1);

      const duration = 2500 + Math.random() * 1000;

      Animated.timing(fallAnim, {
        toValue: height + 100,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(fadeAnimConfetti, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, duration * 0.7);

      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = 8 + Math.random() * 12;

      return {
        id: i,
        startX,
        startY,
        horizontalDrift,
        rotationSpeed,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape,
        size,
        fallAnim,
        fadeAnim: fadeAnimConfetti,
      };
    });

    setConfetti(newConfetti);

    setTimeout(() => {
      setConfetti([]);
    }, 5000);
  };

  const handleSelectImage = (id) => {
    setSelectedImage(id);
    setPlayingVideos(shuffledVideos.map(v => v.id));
    pulseVideos();
  };

  const handleSelectVideo = (id) => {
    setSelectedVideo(id);
    if (selectedImage && selectedImage === id) {
      setMatches((prev) => [...prev, id]);
      setPlayingVideos([]);
    }
    setTimeout(() => {
      setSelectedImage(null);
      setSelectedVideo(null);
    }, 500);
  };

  const pulseVideos = () => {
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

  const isGameFinished = matches.length === steps.length;

  const handleContinueVideo = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setScreen("como");
    } else {
      setScreen("jogo");
    }
  };

  const handleReloadVideo = async () => {
    setVideoEnded(false);
    if (videoRef.current) {
      try {
        await videoRef.current.replayAsync();
      } catch (err) {
        console.error("Erro ao recarregar vídeo:", err);
      }
    }
  };

  const handleFinalizeMission = () => {
    setScreen("finalizado");
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const handleRestartGame = () => {
    setMatches([]);
    setSelectedImage(null);
    setSelectedVideo(null);
    setConfetti([]);
    setPlayingVideos([]);
    const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
    setShuffledVideos(shuffle(steps));
  };

  // ----------------- RENDER -----------------

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Tela de introdução: PARÁ */}
      {screen === "overlay" && (
        <Animated.View style={[styles.overlay, { opacity: overlayFade }]}>
          <Text style={styles.overlayText}>PARÁ</Text>
        </Animated.View>
      )}

      {/* Tela "Como se diz" */}
      {screen === "como" && (
        <ImageBackground
          source={require("../assets/Norte/para.png")}
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
                source={require("../assets/Norte/branco.png")}
                style={styles.character}
              />
            </View>
          </View>
        </ImageBackground>
      )}

      {/* Tela de vídeo Libras */}
      {screen === "video" && (
        <ImageBackground
          source={require("../assets/Norte/para.png")}
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
                  isMuted={true}
                  shouldPlay={true}
                  rate={0.5}
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
            source={require("../assets/Norte/para.png")}
            style={StyleSheet.absoluteFill}
          >
            {confetti.map((item) => (
              <Animated.View
                key={item.id}
                style={[
                  {
                    position: "absolute",
                    left: `${item.startX}%`,
                    top: `${item.startY}%`,
                    backgroundColor: item.color,
                    width: item.size,
                    height: item.size,
                    borderRadius: item.shape === "circle" ? item.size / 2 : 0,
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
                  item.shape === "star" && {
                    borderRadius: 0,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: item.color,
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
                      {
                        scale: item.fallAnim.interpolate({
                          inputRange: [-100, 0],
                          outputRange: [0.5, 1],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}

            <View style={styles.frameBorder}>
              <View style={styles.center}>
                <Text style={styles.header}>Hora de jogar!</Text>

                <View style={styles.gameArea}>
                  {/* ✅ Coluna de imagens — ORDEM FIXA: H, J, K, L, M */}
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

                  {/* ✅ Coluna de vídeos — EMBARALHADOS */}
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
                              { transform: [{ scale: pulseAnim }] },
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
                              isLooping={true}
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
                    {/* ✅ Botões ESPECÍFICOS DO JOGO */}
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
                      onPress={handleFinalizeMission}
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
          {confetti.map((item) => (
            <Animated.View
              key={item.id}
              style={[
                {
                  position: "absolute",
                  left: `${item.startX}%`,
                  top: `${item.startY}%`,
                  backgroundColor: item.color,
                  width: item.size,
                  height: item.size,
                  borderRadius: item.shape === "circle" ? item.size / 2 : 0,
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
                item.shape === "star" && {
                  borderRadius: 0,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: item.color,
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
                    {
                      scale: item.fallAnim.interpolate({
                        inputRange: [-100, 0],
                        outputRange: [0.5, 1],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}

          <View style={styles.center}>
            <Animated.Image
              source={require("../assets/Norte/Norte3.png")}
              style={[styles.polaroid, { opacity: fadeAnim }]}
            />
            <Animated.Image
              source={require("../assets/Norte/certo.png")}
              style={[styles.seloCerto, { opacity: fadeAnim }]}
            />
            <TouchableOpacity
              style={styles.voltarButton}
              onPress={() =>
                navigation.navigate("NorteHome", { faseConcluida: 3 })
              }
            >
              <Image
                source={require("../assets/Norte/certo.png")}
                style={styles.iconButton}
                tintColor="#4CAF50"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
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
  level: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  videoBox: {
    width: "80%",
    height: 220,
    bottom: 70,
    borderRadius: 12,
    overflow: "hidden",
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
    top: 200,
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
    top: 200,
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
    elevation:34, 
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
});