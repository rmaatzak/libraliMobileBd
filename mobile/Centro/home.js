import React, { useState, useEffect, useCallback } from "react";
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
import { carregarProgresso } from "../services/storage"; // Importe o serviço

export default function CentroHome({ navigation, route }) {
  const [fases, setFases] = useState([
    { numero: 1, bloqueado: false, concluida: false, imagem: require("../assets/Centro/Centro1.png") },
    { numero: 2, bloqueado: true, concluida: false, imagem: require("../assets/Centro/Centro2.png") },
    { numero: 3, bloqueado: true, concluida: false, imagem: require("../assets/Centro/Centro3.png") },
    { numero: 4, bloqueado: true, concluida: false, imagem: require("../assets/Centro/Centro1.png"), desbloqueavel: false },
  ]);

  const [loading, setLoading] = useState(true);

  // Carregar progresso salvo ao iniciar
  useEffect(() => {
    const carregarProgressoSalvo = async () => {
      try {
        const progresso = await carregarProgresso('centro');
        
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

  // Função SIMPLES para voltar
  const voltarParaKidsTela = () => {
    navigation.navigate("KidsTela");
  };

  // Atualiza fases
  const atualizarFases = useCallback((ultimaConcluida) => {
    setFases(prevFases => prevFases.map(fase => {
      if (fase.desbloqueavel === false) {
        return {
          ...fase,
          bloqueado: true
        };
      }

      const jaConcluida = fase.concluida || fase.numero <= ultimaConcluida;
      const desbloqueado = fase.numero <= ultimaConcluida + 1;

      return {
        ...fase,
        concluida: jaConcluida,
        bloqueado: !desbloqueado,
      };
    }));
  }, []);

  useEffect(() => {
    const faseConcluida = route.params?.faseConcluida || 0;
    
    // Verificar se há fase concluída vinda das telas de jogo
    if (faseConcluida > 0) {
      // Atualizar apenas se for maior que o progresso atual
      const maxConcluido = Math.max(faseConcluida, ...fases.filter(f => f.concluida).map(f => f.numero));
      if (maxConcluido > 0) {
        atualizarFases(maxConcluido);
      }

      // Limpar parâmetro
      if (route.params?.faseConcluida) {
        navigation.setParams({ faseConcluida: undefined });
      }
    }
  }, [route.params?.faseConcluida, navigation, fases, atualizarFases]);

  const irParaJogo = (numeroFase) => {
    const fase = fases[numeroFase - 1];
    
    if (fase?.bloqueado || fase?.desbloqueavel === false) return;

    switch (numeroFase) {
      case 1:
        navigation.navigate("Goias");
        break;
      case 2:
        navigation.navigate("MatoGrosso");
        break;
      case 3:
        navigation.navigate("Bahia");
        break;
      default:
        break;
    }
  };

  const renderCardFase = (faseData, estilo) => (
    <TouchableOpacity
      key={faseData.numero}
      style={[styles.cardFase, estilo]}
      onPress={() => irParaJogo(faseData.numero)}
      disabled={faseData.bloqueado || faseData.desbloqueavel === false}
      activeOpacity={0.7}
    >
      <View style={styles.polaroid}>
        {faseData.bloqueado ? (
          <View style={[
            styles.imagemBloqueada,
            faseData.desbloqueavel === false && styles.imagemEmBreve
          ]}>
            {faseData.desbloqueavel === false ? (
              <>
                <Text style={styles.textoEmBreve}>EM</Text>
                <Text style={styles.textoEmBreve}>BREVE</Text>
                <Text style={styles.textoTravado}>🔒</Text>
              </>
            ) : (
              <Text style={styles.textoTravado}>🔒</Text>
            )}
          </View>
        ) : (
          <Image 
            source={faseData.imagem} 
            style={faseData.numero === 1 ? styles.imagemFase1 : styles.imagemFase} 
          />
        )}

        {faseData.concluida && (
          <View style={styles.marcaConcluida}>
            <Text style={styles.textoCheck}>✓</Text>
          </View>
        )}

        <View style={styles.numeroFaseContainer}>
          <Text style={styles.textoNumero}>{faseData.numero}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Se estiver carregando, mostra um loading simples
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#003399', fontSize: 18 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        source={require("../assets/Centro/fundo.mp4")}
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
        
        <Text style={styles.titulo}>Números e Cores</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mapaContainer}>
          {renderCardFase(fases[0], styles.fase1)}
          {renderCardFase(fases[1], styles.fase2)}
          {renderCardFase(fases[2], styles.fase3)}
          {renderCardFase(fases[3], styles.fase4)}
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
  cardFase: { 
    position: "absolute", 
    backgroundColor: "transparent" 
  },
  polaroid: { 
    padding: 10, 
    borderRadius: 4 
  },
  fase1: { 
    top: 30, 
    left: 40 
  },
  fase2: { 
    top: 300, 
    right: 30 
  },
  fase3: { 
    top: 560, 
    left: 50 
  },
  fase4: { 
    top: 820, 
    right: 30 
  },
  imagemFase1: { 
    width: 190,
    height: 200,
    resizeMode: "cover", 
    borderRadius: 2,
    right: 10,
  },
  imagemFase: { 
    width: 130, 
    height: 170, 
    resizeMode: "cover", 
    borderRadius: 2 
  },
  imagemBloqueada: { 
    width: 150, 
    height: 180, 
    backgroundColor: "#797979ff", 
    borderRadius: 2, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  imagemEmBreve: {
    backgroundColor: "#5a5a5aff",
  },
  textoTravado: { 
    fontSize: 48, 
    opacity: 0.5 
  },
  textoEmBreve: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 2,
  },
  marcaConcluida: { 
    position: "absolute", 
    top: 10, 
    right: 10, 
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
  textoCheck: { 
    color: "white", 
    fontSize: 24, 
    fontWeight: "bold",
  },
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
    borderColor: "white" 
  },
  textoNumero: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
});