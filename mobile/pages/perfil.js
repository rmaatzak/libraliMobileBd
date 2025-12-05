// pages/perfil.js
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import MenuLateral from "../auxilio/menuLateral";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FloatingBubbles } from "./login";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importar a logo
import Logo from "../assets/logoBR.png";
// Importar imagem de perfil padrão
import PerfilPadrao from "../photos/adulto.png";
// Importar imagem de saída
import ExitImg from "../assets/sair.png";

// Importar as 7 imagens de avatar
import Avatar1 from "../photos/adulto.png";
import Avatar2 from "../photos/foto1.png";
import Avatar3 from "../photos/foto2.png";
import Avatar4 from "../photos/foto3.png";
import Avatar5 from "../photos/foto4.png";
import Avatar6 from "../photos/foto5.png";
import Avatar7 from "../photos/foto6.png";

export default function Perfil({ route, navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight] = useState(100);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Dados do usuário
  const [usuario, setUsuario] = useState({
    nome: "Adulto",
    email: "adulto@exemplo.com",
    senha: "••••••••",
    fotoPerfil: null,
    avatarId: "avatar1",
  });

  const [editando, setEditando] = useState({
    nome: false,
    email: false,
    senha: false,
  });

  const [dadosEditados, setDadosEditados] = useState({
    nome: usuario.nome,
    email: usuario.email,
    senha: usuario.senha,
  });

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('usuarioData');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUsuario(parsedUser);
        setDadosEditados(parsedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const salvarDadosUsuario = async (novosDados) => {
    try {
      await AsyncStorage.setItem('usuarioData', JSON.stringify(novosDados));
      setUsuario(novosDados);
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      return false;
    }
  };

  const handleTrocarFoto = () => {
    setShowAvatarSelector(true);
  };

  const handleSelecionarAvatar = async (avatarId) => {
    const avatares = {
      'avatar1': Avatar1,
      'avatar2': Avatar2,
      'avatar3': Avatar3,
      'avatar4': Avatar4,
      'avatar5': Avatar5,
      'avatar6': Avatar6,
      'avatar7': Avatar7,
    };
    
    const novoUsuario = {
      ...usuario,
      fotoPerfil: avatares[avatarId],
      avatarId: avatarId,
    };
    
    const sucesso = await salvarDadosUsuario(novoUsuario);
    if (sucesso) {
      setUsuario(novoUsuario);
      setShowAvatarSelector(false);
      Alert.alert("Sucesso", "Foto de perfil atualizada!");
    } else {
      Alert.alert("Erro", "Não foi possível salvar a foto. Tente novamente.");
    }
  };

  const handleSalvarAlteracoes = async () => {
    const novoUsuario = {
      ...usuario,
      nome: dadosEditados.nome,
      email: dadosEditados.email,
      senha: dadosEditados.senha,
    };

    const sucesso = await salvarDadosUsuario(novoUsuario);
    
    if (sucesso) {
      setUsuario(novoUsuario);
      setEditando({
        nome: false,
        email: false,
        senha: false,
      });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } else {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  const voltarParaAnterior = () => {
    navigation.goBack();
  };

  // Header fixo no topo - SEM MOVIMENTAÇÃO
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0],
    extrapolate: "clamp",
  });

  // Header com altura fixa
  const headerHeightAnimated = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [headerHeight, headerHeight],
    extrapolate: "clamp",
  });

  // Logo sempre visível - SEM OPACIDADE
  const logoOpacity = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1],
    extrapolate: "clamp",
  });

  // Modal de seleção de avatar
  const AvatarSelectorModal = () => (
    <Modal
      visible={showAvatarSelector}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAvatarSelector(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Cabeçalho do modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Escolha seu Avatar</Text>
            <TouchableOpacity 
              onPress={() => setShowAvatarSelector(false)} 
              style={styles.closeButton}
            >
            </TouchableOpacity>
          </View>

          {/* Descrição */}
          <Text style={styles.modalDescription}>
            Selecione uma imagem para seu perfil
          </Text>

          {/* Grid de avatares */}
          <ScrollView contentContainerStyle={styles.avatarsGrid}>
            {[
              { id: 'avatar1', source: Avatar1, name: '' },
              { id: 'avatar2', source: Avatar2, name: '' },
              { id: 'avatar3', source: Avatar3, name: '' },
              { id: 'avatar4', source: Avatar4, name: '' },
              { id: 'avatar5', source: Avatar5, name: '' },
              { id: 'avatar6', source: Avatar6, name: '' },
              { id: 'avatar7', source: Avatar7, name: '' },
            ].map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.avatarItem,
                  usuario.avatarId === avatar.id && styles.avatarItemSelecionado
                ]}
                onPress={() => handleSelecionarAvatar(avatar.id)}
                activeOpacity={0.7}
              >
                <View style={styles.avatarImageContainer}>
                  <Image
                    source={avatar.source}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                  {usuario.avatarId === avatar.id && (
                    <View style={styles.selecionadoBadge}>
                      <Icon name="check" size={16} color="#FFF" />
                    </View>
                  )}
                </View>
                <Text style={styles.avatarName}>{avatar.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Botão de cancelar */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowAvatarSelector(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00008B" />

      {/* Bolinhas flutuantes */}
      <FloatingBubbles />

      {/* HEADER FIXO E PEQUENO */}
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeightAnimated,
          },
        ]}
      >
        {/* Logo fixa no header */}
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>
      </Animated.View>

      {/* MENU LATERAL - FIXO SEM MOVIMENTAÇÃO */}
      <View style={styles.menuContainer}>
        <MenuLateral navigation={navigation} />
      </View>

      {/* Botão de voltar no canto inferior esquerdo */}
      <TouchableOpacity
        style={styles.voltarButton}
        onPress={voltarParaAnterior}
        activeOpacity={0.7}
      >
        {ExitImg ? (
          <Image
            source={ExitImg}
            style={styles.voltarIcon}
            resizeMode="contain"
          />
        ) : (
          <Icon name="arrow-left" size={24} color="#FFF" />
        )}
      </TouchableOpacity>

      {/* CONTEÚDO PRINCIPAL COM SCROLL */}
      <Animated.ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight + 20 },
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* SEÇÃO DE PERFIL COM FOTO */}
        <View style={styles.perfilSection}>
          <View style={styles.fotoContainer}>
            {/* Foto de perfil */}
            <View style={styles.fotoWrapper}>
              <Image
                source={usuario.fotoPerfil || Avatar1}
                style={styles.fotoPerfil}
                resizeMode="cover"
              />
            </View>           
          </View>

          <Text style={styles.nomeUsuario}>{usuario.nome}</Text>
          <Text style={styles.tipoUsuario}>Conta Adulto</Text>
          
          {/* Caixa de pergunta estilizada */}
          <View style={styles.perguntaContainer}>
            <Text style={styles.perguntaTexto}>
              Quer personalizar sua experiência?
            </Text>
            <TouchableOpacity 
              style={styles.perguntaBotao}
              onPress={handleTrocarFoto}
            >
              <Text style={styles.perguntaBotaoTexto}>Escolher Avatar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CARD COM NOME E SENHA */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Dados Pessoais</Text>
            <TouchableOpacity
              onPress={() => setEditando({ ...editando, nome: true })}
              activeOpacity={0.6}
            >
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome:</Text>
            {editando.nome ? (
              <TextInput
                style={styles.inputEditavel}
                value={dadosEditados.nome}
                onChangeText={(text) =>
                  setDadosEditados({ ...dadosEditados, nome: text })
                }
                autoFocus
                onBlur={() => setEditando({ ...editando, nome: false })}
                placeholder="Digite seu nome"
              />
            ) : (
              <Text style={styles.infoValue}>{usuario.nome}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Senha:</Text>
            {editando.senha ? (
              <TextInput
                style={styles.inputEditavel}
                value={dadosEditados.senha}
                onChangeText={(text) =>
                  setDadosEditados({ ...dadosEditados, senha: text })
                }
                secureTextEntry
                autoFocus
                onBlur={() => setEditando({ ...editando, senha: false })}
                placeholder="Digite sua senha"
              />
            ) : (
              <Text style={styles.infoValue}>{usuario.senha}</Text>
            )}
            <TouchableOpacity
              onPress={() => setEditando({ ...editando, senha: true })}
              style={styles.editarIcon}
              activeOpacity={0.6}
            >
            </TouchableOpacity>
          </View>
        </View>

        {/* CARD COM EMAIL */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Contato</Text>
            <TouchableOpacity
              onPress={() => setEditando({ ...editando, email: true })}
              activeOpacity={0.6}
            >
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>E-mail:</Text>
            {editando.email ? (
              <TextInput
                style={styles.inputEditavel}
                value={dadosEditados.email}
                onChangeText={(text) =>
                  setDadosEditados({ ...dadosEditados, email: text })
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
                onBlur={() => setEditando({ ...editando, email: false })}
                placeholder="Digite seu e-mail"
              />
            ) : (
              <Text style={styles.infoValue}>{usuario.email}</Text>
            )}
          </View>
        </View>

        {/* BOTÃO DE SALVAR ALTERAÇÕES */}
        {(editando.nome || editando.email || editando.senha) && (
          <TouchableOpacity
            style={styles.salvarButton}
            onPress={handleSalvarAlteracoes}
            activeOpacity={0.8}
          >
            <Text style={styles.salvarButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        )}

        {/* ESPAÇO FINAL */}
        <View style={styles.footerSpace} />
      </Animated.ScrollView>

      {/* Modal de seleção de avatar */}
      <AvatarSelectorModal />
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00008B",
    paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight + 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 20,
    zIndex: 1000,
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 60,
    left: 20,
    zIndex: 1001,
    marginTop: -20,
  },
  logo: {
    width: 35,
    height: 35,
  },
  menuContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 60,
    right: 0,
    zIndex: 1002,
    paddingTop: 35,
    marginTop: -80,
  },
  voltarButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    zIndex: 1003,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F89F30",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  voltarIcon: {
    width: 24,
    height: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  perfilSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  fotoContainer: {
    position: "relative",
    marginBottom: 15,
  },
  fotoWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 5,
    borderColor: "#FFF",
    backgroundColor: "#E0E7FF",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  fotoPerfil: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  editarFotoButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    zIndex: 10,
  },
  pincelContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F89F30",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  nomeUsuario: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  tipoUsuario: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  perguntaContainer: {
    backgroundColor: "#F0F7FF",
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0F2FF",
    borderStyle: "dashed",
    shadowColor: "#00008B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  perguntaIcon: {
    marginBottom: 12,
    backgroundColor: "#E0F2FF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  perguntaTexto: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 22,
  },
  perguntaBotao: {
    backgroundColor: "#00008B",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#00008B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  perguntaBotaoTexto: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    width: 80,
    marginRight: 10,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  editarIcon: {
    marginLeft: 10,
  },
  inputEditavel: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#4A90E2",
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  salvarButton: {
    backgroundColor: "#00008B",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
    shadowColor: "#00008B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  salvarButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footerSpace: {
    height: 100,
  },
  // Estilos do Modal de Avatar
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 30,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  closeButton: {
    padding: 5,
  },
  modalDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 22,
  },
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  avatarItem: {
    width: (width - 80) / 3,
    alignItems: 'center',
    marginBottom: 25,
    padding: 10,
    borderRadius: 12,
  },
  avatarItemSelecionado: {
    backgroundColor: '#F0F7FF',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  avatarImageContainer: {
    position: 'relative',
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#E0E7FF',
  },
  selecionadoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A90E2',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  avatarName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});