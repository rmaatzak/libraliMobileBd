import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';

const CustomAlert = ({ visible, title, message, onClose, type = 'success' }) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible]);

  // ✅ AQUI VOCÊ COLOCA O CAMINHO DAS SUAS IMAGENS
  const getImageAndColor = () => {
    switch (type) {
      case 'success':
        return { 
          bg: '#4CAF50', 
          image: require('../assets/certo.png') // 👈 TROCAR AQUI
        };
      case 'error':
        return { 
          bg: '#F44336', 
          image: require('../assets/certo.png') // 👈 TROCAR AQUI
        };
      case 'warning':
        return { 
          bg: '#FF9800', 
          image: require('../assets/certo.png') // 👈 TROCAR AQUI
        };
      default:
        return { 
          bg: '#2196F3', 
          image: require('../assets/certo.png') // 👈 TROCAR AQUI
        };
    }
  };

  const config = getImageAndColor();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.alertBox,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          {/* ✅ ÍCONE COM IMAGEM */}
          <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
            <Image 
              source={config.image} 
              style={styles.iconImage}
              resizeMode="contain"
            />
          </View>

          {/* Conteúdo */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Botão */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: config.bg }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    paddingBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -35,
    elevation: 5,
  },
  iconImage: {
    width: 40,
    height: 40,
    tintColor: '#fff', // ✅ Deixa a imagem branca (se for PNG transparente)
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 25,
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomAlert;