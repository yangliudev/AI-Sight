import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchFact = () => {
    setLoading(true);
    fetch("http://numbersapi.com/random/trivia?json")
      .then((response) => response.json())
      .then((data) => {
        setFact(data.text);
        setLoading(false);
      })
      .catch(() => {
        setFact("Failed to load a trivia fact.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFact(); // Fetch a fact on initial load
  }, []);

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>AI Sight</Text>
        <Ionicons
          name="settings-outline"
          size={30}
          color="white"
          style={styles.settingsIcon}
        />
      </View>

      <View style={styles.content}>
        <Image
          source={require("@/assets/images/gp.jpeg")}
          style={styles.logo}
        />

        <View style={styles.card}>
          <Text style={styles.subtitle}>Did you know?</Text>
          <View style={styles.factContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text style={styles.fact}>{fact}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={fetchFact}
            disabled={loading}
          >
            <Ionicons name="refresh-circle" size={28} color="white" />
            <Text style={styles.buttonText}>New Fact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    paddingTop: 40,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  settingsIcon: {
    position: "absolute",
    right: -15,
    top: 40,
  },
  content: {
    alignItems: "center",
    marginTop: 100,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 9999,
    marginBottom: 25,
    borderWidth: 3,
    borderColor: "white",
  },
  subtitle: {
    fontSize: 20,
    color: "#EEE",
    textAlign: "left",
    fontWeight: "600",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent card
    borderRadius: 20, // Rounded corners
    padding: 25,
    width: "85%", // Adjust width for card
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  factContainer: {
    marginTop: 10,
    // backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 80,
    maxWidth: "90%",
  },
  fact: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "500",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(99, 23, 169, 0.7)", // Semi-transparent purple
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
