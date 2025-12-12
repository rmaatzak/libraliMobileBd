// Norte/home.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { carregarProgresso, salvarProgresso } from "../services/storage"; // Importe o serviço

export default function NorteHome({ navigation, route }) {
  const [fases, setFases] = useState([
    { numero: 1, bloqueado: false, concluida: false, imagem: require("../assets/Norte/Norte1.png") },
    { numero: 2, bloqueado: true, concluida: false, imagem: require("../assets/Norte/Norte2.png") },
    { numero: 3, bloqueado: true, concluida: false, imagem: require("../assets/Norte/Norte3.png") },
    { numero: 4, bloqueado: true, concluida: false, imagem: require("../assets/Norte/Nordeste1.png") },
    { numero: 5, bloqueado: true, concluida: false, imagem: require("../assets/Norte/Nordeste2.png") },
  ]);

  const [loading, setLoading] = useState(true);
  const jaAtualizouRef = useRef(false);

  // Carregar progresso salvo ao iniciar
  useEffect(() => {
    const carregarProgressoSalvo = async () => {
      try {
        const progresso = await carregarProgresso('norte');
        
        if (progresso > 0) {
          atualizarFases(progresso);
        }
      } catch (error) {
        console.error('Erro ao carregar progresso:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarProgressoSalvo();
  }, []);

  const voltarParaKidsTela = () => {
    navigation.navigate("KidsTela");
  };

  // Função para atualizar fases
  const atualizarFases = useCallback((ultimaConcluida) => {
    setFases(prevFases => {
      return prevFases.map(fase => {
        const jaConcluida = fase.concluida || fase.numero <= ultimaConcluida;
        const desbloqueado = fase.numero <= ultimaConcluida + 1;

        return {
          ...fase,
          concluida: jaConcluida,
          bloqueado: !desbloqueado,
        };
      });
    });
  }, []);

  // Atualizar quando receber fase concluída
  useEffect(() => {
    const faseConcluida = route.params?.faseConcluida;
    
    if (!faseConcluida || jaAtualizouRef.current) return;
    
    jaAtualizouRef.current = true;
    
    const maxConcluido = faseConcluida;
    
    if (maxConcluido > 0) {
      // Salvar progresso
      salvarProgresso('norte', maxConcluido);
      
      // Atualizar interface
      atualizarFases(maxConcluido);
      
      const timer = setTimeout(() => {
        if (route.params?.faseConcluida) {
          navigation.setParams({ faseConcluida: undefined });
          jaAtualizouRef.current = false;
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [route.params?.faseConcluida]);

  const irParaJogo = (numeroFase) => {
    if (fases[numeroFase - 1]?.bloqueado) return;

    if (numeroFase === 1) navigation.navigate("Amazonia");
    else if (numeroFase === 2) navigation.navigate("Acre");
    else if (numeroFase === 3) navigation.navigate("Para");
    else if (numeroFase === 4) navigation.navigate("Nordeste1");
    else if (numeroFase === 5) navigation.navigate("Nordeste2");
  };
  const renderCardFase = (faseData, estilo) => {
    return (
      <TouchableOpacity
        key={faseData.numero}
        style={[styles.cardFase, estilo]}
        onPress={() => irParaJogo(faseData.numero)}
        activeOpacity={0.7}
      >
        <View style={styles.polaroid}>
          {faseData.bloqueado ? (
            <View style={styles.imagemBloqueada}>
              <Text style={styles.textoTravado}>🔒</Text>
            </View>
          ) : (
            <>
              <Image source={faseData.imagem} style={styles.imagemFase} />
              {faseData.concluida && (
                <View style={styles.marcaConcluida}>
                  <Text style={styles.textoCheck}>✓</Text>
                </View>
              )}
            </>
          )}
          <View style={[
            styles.numeroFaseContainer,
            faseData.concluida && styles.numeroConcluido
          ]}>
            <Text style={styles.numeroFase}>{faseData.numero}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Video
        source={require("../assets/Norte/fundo.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
      />

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.botaoVoltar} 
          onPress={voltarParaKidsTela}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={28} color="#003399" />
        </TouchableOpacity>
        
        <Text style={styles.titulo}>Alfabeto</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mapaContainer}>
          {renderCardFase(fases[0], styles.fase1)}
          {renderCardFase(fases[1], styles.fase2)}
          {renderCardFase(fases[2], styles.fase3)}
          {renderCardFase(fases[3], styles.fase4)}
          {renderCardFase(fases[4], styles.fase5)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#9ED0FF" },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  botaoVoltar: {
    position: "absolute",
    left: 20,
    top: 60,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#003399",
  },
  titulo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#003399",
    textAlign: "center",
    marginBottom: 5,
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  mapaContainer: {
    width: "100%",
    minHeight: 1350,
    position: "relative",
    paddingHorizontal: 20,
    paddingBottom: 100,
    marginTop: 10,
  },
  cardFase: { position: "absolute", backgroundColor: "transparent" },
  polaroid: {
    padding: 10,
    borderRadius: 4,
  },
  fase1: { top: 40, left: 50 },
  fase2: { top: 300, right: 40 },
  fase3: { top: 560, left: 70 },
  fase4: { top: 820, right: 50 },
  fase5: { top: 1080, left: 60 },
  imagemFase: { width: 150, height: 210, resizeMode: "cover", borderRadius: 2 },
  imagemBloqueada: {
    width: 130,
    height: 170,
    backgroundColor: "#797979ff",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  textoTravado: { fontSize: 48, opacity: 0.5 },
  marcaConcluida: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#28A745",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
    elevation: 5,
  },
  textoCheck: { color: "white", fontSize: 24, fontWeight: "bold" },
  numeroFaseContainer: {
    position: "absolute",
    bottom: -8,
    left: -8,
    backgroundColor: "#0044CC",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  numeroConcluido: {
    backgroundColor: "#28A745",
  },
  numeroFase: { color: "white", fontSize: 18, fontWeight: "bold" },
});