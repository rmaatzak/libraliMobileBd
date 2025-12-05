import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");

// Funções auxiliares para responsividade
const wp = (pct) => (width * pct) / 100;
const hp = (pct) => (height * pct) / 100;

const colors = ["#87CEFA", "#87CEFA"];

function FloatingBubbles() {
  const circlesRef = useRef([]);

  if (circlesRef.current.length === 0) {
    circlesRef.current = Array.from({ length: 25 }).map(() => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      size: Math.random() * wp(6) + wp(4),
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

  const contentPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        Animated.timing(contentPosition, {
          toValue: -hp(10),
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(contentPosition, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleProsseguir = () => {
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    navigation.navigate("Escolha", {
      dadosCadastro: { nome, email, senha },
    });
  };

  if (!fontsLoaded) {
    return null;
  }

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
          <Text style={styles.title}>Criar conta</Text>

          <Text style={styles.subtitle}>
            Já possui uma conta?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Login")}
            >
              Entrar
            </Text>
          </Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#888"
              value={nome}
              onChangeText={setNome}
              editable={!carregando}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail ou celular"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!carregando}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#888"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              editable={!carregando}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, carregando && styles.buttonDisabled]}
              onPress={handleProsseguir}
              activeOpacity={0.8}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Prosseguir</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
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
    paddingHorizontal: wp(8),
  },
  title: {
    fontFamily: "Brockmann",
    fontSize: wp(7.2),
    color: "#000",
    marginBottom: hp(1),
  },
  subtitle: {
    fontFamily: "Strawford",
    color: "#666",
    marginBottom: hp(5),
    fontSize: wp(4.3),
  },
  link: {
    color: "#00008B",
    fontWeight: "500",
    fontSize: wp(4.3),
  },
  form: {
    width: "100%",
    alignItems: "center",
    marginBottom: hp(7),
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    fontSize: wp(4.3),
    backgroundColor: "#fff",
    elevation: 1,
    fontFamily: "Strawford",
  },
  buttonContainer: {
    alignItems: "flex-end",
    width: "100%",
  },
  button: {
    backgroundColor: "#F89F30",
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(7),
    borderRadius: wp(4),
    elevation: 2,
  },
  buttonText: {
    fontFamily: "Strawford",
    color: "#fff",
    fontSize: wp(4.3),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});