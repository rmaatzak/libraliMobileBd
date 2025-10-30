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

const { width, height } = Dimensions.get("window");
const colors = ["#87CEFA", "#FFA500"]; // azul e laranja

export default function App({ navigation }) {
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
            source={require("./photos/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.welcome}>Bem-Vindo(a) ao nosso aplicativo.</Text>
          <Text style={styles.subtext}>Aproveite</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Continue</Text>
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
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginTop: -80,
  },
  subtext: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#1A0978",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});