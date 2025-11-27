import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

// ✅ CORRIGIDO: mudei de "kidsTela" para "KidsTela" (primeira letra maiúscula)
export default function KidsTela() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F7FF" />
      <View style={styles.container}>
        <Text style={styles.title}>👋 Olá, mundo!</Text>
        <Text style={styles.subtitle}>Bem-vindo ao cantinho dos kids</Text>

        <View style={styles.card}>
          <Text style={styles.bigText}>🎈 Vamos brincar?</Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => {
              // Ação simples: pode navegar ou executar algo
              console.log("Botão brincar pressionado!");
            }}
          >
            <Text style={styles.buttonText}>Começar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Feito com carinho 💛</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#E8F7FF",
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FF6B6B",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#2D6A4F",
    textAlign: "center",
  },
  card: {
    marginTop: 30,
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  bigText: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
    color: "#3A86FF",
  },
  button: {
    backgroundColor: "#FFB703",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  footer: {
    marginTop: 24,
    color: "#6C757D",
  },
});