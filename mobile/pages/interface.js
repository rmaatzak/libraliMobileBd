import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";


export default function Interface({route}) {
const [selected, setSelected] = useState("Cursos"); // ✅ CORRIGIDO: mudei de "Course" para "Cursos"
  const { nome } = route.params || { nome: "Usuário" };
  const contents = {
    Cursos: [
      { color: "#C7E6FF", img: "https://cdn-icons-png.flaticon.com/512/706/706830.png" },
    ],
    Livros: [
      { color: "#FFD6D6", img: "https://cdn-icons-png.flaticon.com/512/747/747086.png" },
    ],
    Videos: [
      { color: "#C4F0D9", img: "https://cdn-icons-png.flaticon.com/512/4105/4105456.png" },
    ],
    "Saiba mais": [
      { color: "#E3F2C1", img: "https://cdn-icons-png.flaticon.com/512/2729/2729007.png" },
    ],
  };

  const [fontsLoaded] = useFonts({
      Strawford: require("../assets/font/Strawford-Regular.otf"),
      Brockmann: require("../assets/font/Brockmann-Medium.otf")
    });
  
  return (
    <ScrollView style={styles.container}>

      {/* HEADER ROSA */}
      <View style={styles.header}>
          <Image
           source={require("../assets/logo.png")}
          style={styles.headerImage}
        />
      </View>

      {/* CAIXA BRANCA ÚNICA */}
      <View style={styles.whiteBox}>

        <Text style={styles.hiText}>Olá, {nome}</Text>
        <Text style={styles.subText}>O que gostaria de fazer hoje?</Text>

        {/* FILTROS */}
        <View style={styles.sectionsRow}>
          {["Cursos", "Livros", "Videos", "Saiba mais"].map((item) => (
            <TouchableOpacity key={item} onPress={() => setSelected(item)}>
              <Text
                style={[
                  styles.sectionText,
                  selected === item && styles.sectionActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CARDS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {contents[selected].map((c, index) => (
            <View key={index} style={[styles.card, { backgroundColor: c.color }]}>
              <Image source={{ uri: c.img }} style={styles.cardImage} />
            </View>
          ))}
        </ScrollView>

        {/* TRENDING (AGORA DENTRO DA MESMA CAIXA BRANCA) */}
        <View style={styles.trendingHeader}>
          <Text style={styles.trendingTitle}>Jogos</Text>
          <Text style={styles.seeDetails}>ver mais</Text>
        </View>

        <View style={styles.trendingItem}>
          <View style={styles.iconCircle}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/2966/2966489.png" }}
              style={styles.iconTrending}
            />
          </View>

          <View>
            <Text style={styles.trendingItemTitle}>Keep Your Body Healthy</Text>
            <Text style={styles.trendingDesc}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt.
            </Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },

  /* HEADER ROSA */
  header: {
    width: "100%",
    height: 230,
    backgroundColor: "#00008b27",
    justifyContent: "center",
    alignItems: "center",
  },


  /* CAIXA BRANCA ÚNICA */
  whiteBox: {
    backgroundColor: "#fff",
    marginTop: -40,
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
    padding: 25,
    paddingTop: 35,
  },

    headerImage: {
    width: 200,
    height: 200,
    marginRight:10,
  },

  hiText: {
    fontSize: 30,
    marginBottom:7,
    marginTop: 20,
    fontFamily:"Brockmann",
  },
  subText: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 20,
        fontFamily:"Strawford"

  },

  sectionsRow: {
    flexDirection: "row",
    gap: 25,
    marginBottom: 20,
    justifyContent:"center",
    alignItems:"center"
  },
  sectionText: {
    fontSize: 15,
    opacity: 0.5,
    fontFamily:"Brockmann"

  },
  sectionActive: {
    opacity: 1,
    color: "#00008B",
    backgroundColor:"#00008b27",
    borderRadius:10,
    paddingLeft:10,
    paddingRight:10,
    paddingTop:5,
    paddingBottom:5,
  },

  card: {
    width: 160,
    height: 190,
    borderRadius: 30,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  cardImage: {
    width: 120,
    height: 120,
  },

  trendingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 30,
    marginBottom: 15,
  },
  trendingTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  seeDetails: {
    opacity: 0.5,
  },

  trendingItem: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: "#FFDFCC",
    justifyContent: "center",
    alignItems: "center",
  },
  iconTrending: {
    width: 30,
    height: 30,
  },

  trendingItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trendingDesc: {
    width: 250,
    opacity: 0.6,
  },
});