import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.section}>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ by Yang Liu</Text>
          <Image
            source={require("../../assets/images/gp.jpeg")}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 90,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  section: {
    marginTop: 100,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
