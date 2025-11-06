import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");
const colors = ["#87CEFA", "#FFA500"]; // azul e laranja

export default function InicialPage() {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Strawford: require("../assets/font/Strawford-Regular.otf"),
  });

  // Criar círculos animados
  const circles = Array.from({ length: 15 }).map(() => ({
    x: new Animated.Value(Math.random() * width),
    y: new Animated.Value(Math.random() * height),
    size: Math.random() * 40 + 20,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: Math.random() * 0.5 + 0.2,
  }));

  useEffect(() => {
    const animations = circles.map((circle) => {
      const move = () => {
        Animated.timing(circle.y, {
          toValue: -100,
          duration: (height / circle.speedY) * 15,
          useNativeDriver: true,
        }).start(() => {
          circle.y.setValue(height + 100);
          circle.x.setValue(Math.random() * width);
          move();
        });
      };
      move();
      return null;
    });
    return () => animations.forEach((a) => a && a.stop && a.stop());
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Fundo animado */}
      {circles.map((circle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.circle,
            {
              backgroundColor: circle.color,
              width: circle.size,
              height: circle.size,
              borderRadius: circle.size / 2,
              transform: [
                { translateX: circle.x },
                { translateY: circle.y },
              ],
              opacity: 0.4,
            },
          ]}
        />
      ))}
      {/* Conteúdo centralizado */}
      <View style={styles.content}>
        <View style={styles.centerGroup}>
          <Image
            source={require("../photos/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcome}>A vida além dos sons.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Cadastro")}
          >
            <Text style={styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  circle: {
    position: "absolute",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -60,
  },
  centerGroup: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 230,
    height: 250,
  },
  welcome: {
    fontFamily: "Strawford",
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginTop: -80,
  },
  
  button: {
    backgroundColor: "#1A0978",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
  },
  buttonText: {
    fontFamily: "Strawford",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});