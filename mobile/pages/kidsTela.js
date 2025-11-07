import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Kids() {
  const [mensagem, setMensagem] = useState("Olá, mundo!");

  function mudarMensagem() {
    setMensagem(mensagem === "Olá, mundo!" ? "Oi, amiguinho!" : "Olá, mundo!");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mensagem}</Text>
      <Text style={styles.subtitle}>Versão divertida para crianças!</Text>

      <TouchableOpacity style={styles.button} onPress={mudarMensagem}>
        <Text style={styles.buttonText}>Trocar mensagem</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff8dc",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ff69b4",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#ff8c00",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#87ceeb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
