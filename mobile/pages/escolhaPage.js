import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");
const colors = ["#87CEFA", "#FFA500"]; // azul e laranja

// 🔹 Fundo animado
function FloatingBubbles() {
  const circlesRef = useRef([]);

  // Criar apenas uma vez
  if (circlesRef.current.length === 0) {
    circlesRef.current = Array.from({ length: 30 }).map(() => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height), // 🔹 Começa visível
      size: Math.random() * 40 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 8000 + 10000, // 🔹 Subida mais rápida
      offsetX: new Animated.Value(0),
    }));
  }

  useEffect(() => {
    circlesRef.current.forEach((circle) => {
      const animate = () => {
        Animated.parallel([
          Animated.timing(circle.y, {
            toValue: -150,
            duration: circle.speed,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(circle.offsetX, {
              toValue: Math.random() * 25 - 12,
              duration: circle.speed / 2,
              useNativeDriver: true,
            }),
            Animated.timing(circle.offsetX, {
              toValue: Math.random() * -25 + 12,
              duration: circle.speed / 2,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          circle.y.setValue(height + Math.random() * 80);
          circle.x.setValue(Math.random() * width);
          animate();
        });
      };
      animate();
    });
  }, []);

  return (
    <>
      {circlesRef.current.map((circle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.circle,
            {
              backgroundColor: circle.color,
              width: circle.size,
              height: circle.size,
              borderRadius: circle.size / 2,
              opacity: 0.35,
              transform: [
                { translateX: Animated.add(circle.x, circle.offsetX) },
                { translateY: circle.y },
              ],
            },
          ]}
        />
      ))}
    </>
  );
}

export default function EscolhaPage() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);

  const handleConfirm = () => {
    if (selected === "adulto") {
      navigation.navigate("AdultoTela");
    } else if (selected === "kids") {
      navigation.navigate("KidsTela");
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Fundo animado fixo */}
      <FloatingBubbles />

      {/* 🔹 Conteúdo principal */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../photos/logo1.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.centerContent}>
          <Text style={styles.title}>Escolha a faixa etária</Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.option,
                selected === "adulto" && styles.optionSelected,
              ]}
              onPress={() => setSelected("adulto")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.circleOption,
                  selected === "adulto" && styles.circleSelected,
                ]}
              >
                <Image
                  source={require("../photos/adulto.png")}
                  style={styles.characterAdulto}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.optionTitle}>Adulto</Text>
              <Text style={styles.optionSubtitle}>(11 anos ou +)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                selected === "kids" && styles.optionSelected,
              ]}
              onPress={() => setSelected("kids")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.circleOption,
                  selected === "kids" && styles.circleSelected,
                ]}
              >
                <Image
                  source={require("../photos/kids.png")}
                  style={styles.characterKids}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.optionTitle}>Kids</Text>
              <Text style={styles.optionSubtitle}>(4 aos 10 anos)</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, !selected && { opacity: 0.5 }]}
            disabled={!selected}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// 🔹 Estilos
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
  },
  logoContainer: {
    position: "absolute",
    top: 35,
    left: 20,
  },
  logo: {
    marginTop: 25,
    width: 60,
    height: 60,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 40,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 25,
    marginBottom: 50,
  },
  option: {
    alignItems: "center",
  },
  circleOption: {
    backgroundColor: "#00008B",
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "transparent",
    marginBottom: 10,
  },
  circleSelected: {
    borderColor: "#FFA500",
  },
  characterAdulto: {
    width: 160,
    height: 160,
    top: -10,
  },
  characterKids: {
  width: 185,  // 🔹 Aumentado
  height: 185,
      // 🔹 Sobe um pouquinho pra centralizar visualmente
},

  optionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
  optionSubtitle: {
    fontSize: 13,
    color: "#555",
  },
  button: {
    backgroundColor: "#00008B",
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
