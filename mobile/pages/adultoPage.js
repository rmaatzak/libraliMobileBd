import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

export default function AdultoPage() {
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
      {/* LOGO NO CANTO */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../photos/logo1.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* CONTEÚDO CENTRAL */}
      <View style={styles.centerContent}>
        <Text style={styles.title}>Escolha a faixa etária</Text>

        {/* OPÇÕES */}
        <View style={styles.optionsContainer}>
          {/* ADULTO */}
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
                styles.circle,
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

          {/* KIDS */}
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
                styles.circle,
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

        {/* BOTÃO CONFIRMAR */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // 🔹 LOGO NO CANTO
  logoContainer: {
    position: "absolute",
    top: 35,
    left: 20,
  },
  logo: {
    width: 60, // 🔹 menor
    height: 60,
  },

  // 🔹 CONTEÚDO CENTRAL
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40, // 🔹 sobe tudo um pouco
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 40, // 🔹 mais espaço abaixo do texto
  },

  // 🔹 OPÇÕES
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 25,
    marginBottom: 50,
  },
  option: {
    alignItems: "center",
  },
  optionSelected: {},
  circle: {
    backgroundColor: "#00008B",
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "transparent",
    marginBottom: 10,
    overflow: "visible",
  },
  circleSelected: {
    borderColor: "#FFA500",
  },

  // 🔹 PERSONAGENS
  characterAdulto: {
    width: 160,
    height: 160,
    top: -10, // sai um pouco pra cima
  },
  characterKids: {
    width: 140, // 🔹 ligeiramente menor pra caber certinho
    height: 140,
    top: -5, // levemente pra cima, mas centralizado visualmente
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

  // 🔹 BOTÃO CONFIRMAR
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
