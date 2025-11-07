import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AdultoTela() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, mundo!</Text>
      <Text style={styles.subtitle}>Versão simples para adultos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
});
