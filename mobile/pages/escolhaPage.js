import React, { useState, useEffect, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";

const { width, height } = Dimensions.get("window");
const colors = ["#87CEFA", "#FFA500"];

function FloatingBubbles() {
  const circlesRef = useRef([]);

  if (circlesRef.current.length === 0) {
    circlesRef.current = Array.from({ length: 30 }).map(() => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      size: Math.random() * 40 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 8000 + 10000,
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
  const route = useRoute();
  
  const [selected, setSelected] = useState(null);
  const [carregando, setCarregando] = useState(false);
  
  // ✅ Recebe os dados do cadastro
  const dadosCadastro = route.params?.dadosCadastro;

  // 🔍 DEBUG: Verifica se os dados chegaram
  useEffect(() => {
    console.log("🔍 Dados recebidos na EscolhaPage:", dadosCadastro);
    
    if (!dadosCadastro) {
      console.warn("⚠️ ATENÇÃO: Nenhum dado foi recebido do Cadastro!");
      Alert.alert(
        "Erro",
        "Dados do cadastro não foram recebidos. Volte e preencha novamente."
      );
    }
  }, [dadosCadastro]);

  // ✅ Função que salva no banco de dados COM a faixa etária
  const handleConfirmar = async () => {
    console.log("🔘 Botão Confirmar clicado!");
    console.log("📊 Estado 'selected':", selected);
    
    if (!selected) {
      Alert.alert("Atenção", "Selecione uma opção antes de confirmar!");
      return;
    }

    // Verifica se tem dados do cadastro
    if (!dadosCadastro || !dadosCadastro.nome || !dadosCadastro.email || !dadosCadastro.senha) {
      Alert.alert("Erro", "Dados incompletos. Por favor, volte e preencha o cadastro novamente.");
      console.error("❌ Dados do cadastro inválidos:", dadosCadastro);
      return;
    }

    setCarregando(true);
    console.log("⏳ Iniciando requisição...");

    try {
      // ✅ Determina a faixa etária baseado na seleção
      const faixaEtaria = selected === "adulto" ? "adulto" : "kids";
      
      const dadosParaEnviar = {
        nome: dadosCadastro.nome,
        email: dadosCadastro.email,
        senha: dadosCadastro.senha,
        faixaEtaria: faixaEtaria,
      };

      console.log("📤 Enviando dados:", dadosParaEnviar);
      
      // ✅ AGORA SIM envia tudo para o backend
      const response = await fetch("http://192.168.137.1:3000/api/usuarios/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      console.log("📥 Status da resposta:", response.status);

      const data = await response.json();
      console.log("📥 Resposta do servidor:", data);

      if (response.ok) {
        console.log("✅ Cadastro realizado com sucesso!");
        Alert.alert("Sucesso! 🎉", "Cadastro realizado com sucesso!", [
          {
            text: "OK",
            onPress: () => {
              console.log("🚀 Navegando para:", selected === "adulto" ? "AdultoTela" : "KidsTela");
              // ✅ Navega para a tela correta baseado na escolha
              if (selected === "adulto") {
                navigation.navigate("Interface");
              } else {
                navigation.navigate("KidsTela");
              }
            },
          },
        ]);
      } else {
        console.error("❌ Erro na resposta:", data);
        Alert.alert("Erro", data.erro || "Erro ao cadastrar");
      }
    } catch (erro) {
      console.error("❌ Erro na requisição:", erro);
      Alert.alert(
        "Erro de conexão",
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando.\n\nErro: " + erro.message
      );
    } finally {
      setCarregando(false);
      console.log("✅ Requisição finalizada");
    }
  };

  return (
    <View style={styles.container}>
      <FloatingBubbles />

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
              onPress={() => {
                console.log("👤 Adulto selecionado");
                setSelected("adulto");
              }}
              activeOpacity={0.8}
              disabled={carregando}
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
              onPress={() => {
                console.log("👶 Kids selecionado");
                setSelected("kids");
              }}
              activeOpacity={0.8}
              disabled={carregando}
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
            style={[
              styles.button,
              (!selected || carregando) && { opacity: 0.5 },
            ]}
            disabled={!selected || carregando}
            onPress={handleConfirmar}
            activeOpacity={0.8}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Confirmar</Text>
            )}
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
    width: 185,
    height: 185,
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

// escolhaPage.js