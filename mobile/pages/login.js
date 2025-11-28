import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useFonts } from "expo-font";
import CustomAlert from "./CustomAlert";

const { width, height } = Dimensions.get("window");
const colors = ["#87CEFA", "#FFA500"];

// ✅ EXPORTANDO FloatingBubbles separadamente
export function FloatingBubbles() {
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

export default function Login({ navigation }) {
  const [fontsLoaded] = useFonts({
    Strawford: require("../assets/font/Strawford-Regular.otf"),
    Brockmann: require("../assets/font/Brockmann-Medium.otf"),
  });

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });

  const contentPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {
      Animated.timing(contentPosition, {
        toValue: -80,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(contentPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const showAlert = (title, message, type = "success") => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      showAlert("Atenção", "Preencha todos os campos!", "warning");
      return;
    }

    try {
      console.log("🔐 Tentando fazer login...");
      console.log("Email:", email);

      const response = await fetch("http://192.168.137.1:3000/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });

      const data = await response.json();
      console.log("📦 Resposta do servidor:", data);

      if (response.ok && data.usuario) {
        console.log("✅ Login bem-sucedido!");
        showAlert("Sucesso", `Bem-vindo(a), ${data.usuario.nome}!`, "success");

        setTimeout(() => {
          setAlertVisible(false);
          navigation.navigate("Interface", {
            nome: data.usuario.nome,
          });
        }, 1500);
      } else {
        console.log("❌ Erro no login:", data.erro);
        showAlert("Erro", data.erro || "E-mail ou senha incorretos!", "error");
      }
    } catch (error) {
      console.error("❌ Erro ao conectar:", error);
      showAlert("Erro", "Não foi possível conectar ao servidor.", "error");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <FloatingBubbles />

        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ translateY: contentPosition }],
            },
          ]}
        >
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>
            Não possui uma conta?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Cadastro")}
            >
              Criar conta
            </Text>
          </Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="E-mail ou celular"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#888"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <CustomAlert
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
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
  buttonContainer: {
    alignItems: "flex-end",
    width: "100%",
  },
  button: {
    backgroundColor: "#00008B",
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
});