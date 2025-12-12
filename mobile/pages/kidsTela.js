import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function KidsTela({ route, navigation }) {
  // Pega o nome da navegação ou usa "Visitante" como fallback
  const { nome } = route?.params || { nome: 'Visitante' };
  const [userName, setUserName] = useState(nome); // começa com o nome recebido
  const [currentScreen, setCurrentScreen] = useState(0);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userID = await AsyncStorage.getItem('userID');
        if (!userID) {
          // Já está como "Visitante", não precisa mudar
          return;
        }

        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`http://192.168.137.1:3000/api/usuarios/verificar`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.usuario?.nome) {
          setUserName(data.usuario.nome);
        }
      } catch (error) {
        console.error('Erro ao buscar nome do usuário:', error);
        // Não altera o estado — mantém o nome de route.params ou "Visitante"
      }
    };

    fetchUserName();
  }, []);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentScreen(index);
  };

  return (
    <View style={styles.container}>
      {/* Vídeo de fundo */}
      <Video
        source={require('../assets/Norte/fundo.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greetingText}>Olá!</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.menuIcon}>←</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Carrossel com Regiões */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* SLIDE 1 - NORTE */}
        <View style={[styles.page, { width: SCREEN_WIDTH }]}>
          <View style={styles.photosContainer}>
            <Image
              source={require('../assets/Norte/homeNorte.png')}
              style={styles.photo}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => navigation.navigate('NorteHome')}
            >
              <Text style={styles.playIcon}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SLIDE 2 - CENTRO */}
        <View style={[styles.page, { width: SCREEN_WIDTH }]}>
          <View style={styles.photosContainer}>
            <Image
              source={require('../assets/Centro/Centro.png')}
              style={styles.photo}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => navigation.navigate('CentroHome')}
            >
              <Text style={styles.playIcon}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SLIDE 3 - SUL */}
        <View style={[styles.page, { width: SCREEN_WIDTH }]}>
          <View style={styles.photosContainer}>
            <Image
              source={require('../assets/Sul/Sudeste.png')}
              style={styles.photo}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => navigation.navigate('SulHome')}
            >
              <Text style={styles.playIcon}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Paginação */}
      <View style={styles.pagination}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentScreen === index ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>

      {/* Nuvens decorativas */}
      <View style={styles.cloudBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 10,
  },

  headerLeft: {
    flex: 1,
    marginTop: 60,
  },

  headerRight: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },

  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  greetingText: {
    fontSize: 22,
    color: 'white',
    fontWeight: '300',
    marginBottom: 2,
  },

  userName: {
    fontSize: 34,
    color: '#1e3a8a',
    fontWeight: 'bold',
  },

  menuIcon: {
    fontSize: 20,
    color: '#666',
  },

  page: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  photosContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 80,
  },

  photo: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.48,
  },

  playButton: {
    width: 180,
    height: 55,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  playIcon: {
    fontSize: 20,
    color: '#9CA3AF',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 5,
  },

  activeDot: {
    backgroundColor: '#1e3a8a',
  },

  cloudBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
  },
});