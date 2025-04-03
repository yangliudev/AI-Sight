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
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/gp.jpeg")}
          style={styles.logo}
        />
        <Text style={styles.title}>Guinea Pigs</Text>
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
  content: {
    alignItems: "center",
  },
  logo: {
    width: 160, // Increased size
    height: 160, // Increased size
    borderRadius: 9999, // Makes it fully round
    marginBottom: 25,
    borderWidth: 3,
    borderColor: "white", // Adds a clean border
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#EEE",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 15,
  },
  factContainer: {
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
    backgroundColor: "#6317a9",
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
