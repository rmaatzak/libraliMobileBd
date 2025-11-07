import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");
const colors = ["#87CEFA", "#FFA500"]; // azul e laranja

function FloatingBubbles() {
  const circlesRef = useRef([]);

  if (circlesRef.current.length === 0) {
    circlesRef.current = Array.from({ length: 25 }).map(() => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      size: Math.random() * 35 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 9000 + 9000,
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

export default function Cadastro({ navigation }) {
  const [fontsLoaded] = useFonts({
    Strawford: require("../assets/font/Strawford-Regular.otf"),
    Brockmann: require("../assets/font/Brockmann-Medium.otf"),
  });

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Função para cadastrar usuário
  const handleCadastro = async () => {
    // Validação básica
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    setCarregando(true);

    try {
      // Substitua localhost pelo IP do seu PC se estiver testando no celular
      // Para descobrir: ipconfig (Windows) ou ifconfig (Mac/Linux)
   const response = await fetch("http://192.168.137.1:3000/api/usuarios/cadastro", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    nome,
    email,
    senha,
  }),
});

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso! 🎉", "Cadastro realizado com sucesso!", [
          {
            text: "OK",
            onPress: () => {
              // Limpa os campos
              setNome("");
              setEmail("");
              setSenha("");
              // Navega para a próxima tela
              navigation.navigate("Escolha");
            },
          },
        ]);
      } else {
        Alert.alert("Erro", data.erro || "Erro ao cadastrar");
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);
      Alert.alert(
        "Erro de conexão",
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando (node server.js na pasta backend)."
      );
    } finally {
      setCarregando(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FloatingBubbles />

      <View style={styles.content}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Already have an account? <Text style={styles.link}>sign in</Text>
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#888"
            value={nome}
            onChangeText={setNome}
            editable={!carregando}
          />
          <TextInput
            style={styles.input}
            placeholder="Email or phone"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!carregando}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            editable={!carregando}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, carregando && styles.buttonDisabled]}
          onPress={handleCadastro}
          activeOpacity={0.8}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign up ➜</Text>
          )}
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
  circle: {
    position: "absolute",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontFamily: "Brockmann",
    fontSize: 28,
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Strawford",
    color: "#666",
    marginBottom: 40,
  },
  link: {
    color: "#00008B",
    fontWeight: "500",
  },
  form: {
    width: "100%",
    alignItems: "center",
    marginBottom: 60,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: "#fff",
    elevation: 1,
    fontFamily: "Strawford",
  },
  button: {
    position: "absolute",
    bottom: 200,
    right: 40,
    backgroundColor: "#F89F30",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 15,
    elevation: 2,
  },
  buttonText: {
    fontFamily: "Strawford",
    color: "#fff",
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});