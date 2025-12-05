// avatarSelector.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Importando as 7 imagens de perfil disponíveis
import Avatar1 from "../photos/adulto.png";
import Avatar2 from "../photos/foto1.png";
import Avatar3 from "../photos/foto2.png";
import Avatar4 from "../photos/foto3.png";
import Avatar5 from "../photos/foto4.png";
import Avatar6 from "../photos/foto5.png";
import Avatar7 from "../photos/foto6.png";

const { width } = Dimensions.get("window");

const AvatarSelector = ({ visible, onClose, onSelectAvatar }) => {
  // Lista das 7 opções de avatar
  const avatars = [
    { id: 1, source: Avatar1, name: "Adulto" },
    { id: 2, source: Avatar2, name: "Estudante" },
    { id: 3, source: Avatar3, name: "Professor" },
    { id: 4, source: Avatar4, name: "Aventureiro" },
    { id: 5, source: Avatar5, name: "Explorador" },
    { id: 6, source: Avatar6, name: "Aprendiz" },
    { id: 7, source: Avatar7, name: "Mestre" },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Cabeçalho do modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Escolha seu Avatar</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Descrição */}
          <Text style={styles.modalDescription}>
            Selecione uma imagem para seu perfil
          </Text>

          {/* Grid de avatares */}
          <ScrollView contentContainerStyle={styles.avatarsGrid}>
            {avatars.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                style={styles.avatarItem}
                onPress={() => onSelectAvatar(avatar.source)}
                activeOpacity={0.7}
              >
                <View style={styles.avatarImageContainer}>
                  <Image
                    source={avatar.source}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                  <View style={styles.avatarSelectionRing} />
                </View>
                <Text style={styles.avatarName}>{avatar.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Botão de cancelar */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  modalDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
    textAlign: "center",
  },
  avatarsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  avatarItem: {
    width: (width - 80) / 3,
    alignItems: "center",
    marginBottom: 25,
  },
  avatarImageContainer: {
    position: "relative",
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#E0E7FF",
  },
  avatarSelectionRing: {
    position: "absolute",
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#4A90E2",
    opacity: 0,
  },
  avatarName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#444",
    textAlign: "center",
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
});

export default AvatarSelector;
