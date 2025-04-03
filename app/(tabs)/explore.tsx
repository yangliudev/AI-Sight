import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { HUGGING_FACE_API_KEY } from "@env";

const HF_MODEL = "facebook/bart-large-cnn";

export default function TabTwoScreen() {
  console.log(HUGGING_FACE_API_KEY);
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HUGGING_FACE_API_KEY}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: inputText }),
      }
    );
    const data = await response.json();
    setSummary(data[0]?.summary_text || "No summary generated.");
    setLoading(false);
  };

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={50} color="#fff" />
        <Text style={styles.title}>AI-Powered Summarizer</Text>
      </View>
      <Text style={styles.description}>Enter text to summarize:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your text here..."
        placeholderTextColor="#ccc"
        multiline
        onChangeText={setInputText}
        value={inputText}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={fetchSummary}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Summarize Text"}
        </Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#fff" />}
      {summary ? <Text style={styles.summary}>{summary}</Text> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: "#fff",
    textAlignVertical: "top",
    minHeight: 100,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#ff9800",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  summary: {
    marginTop: 20,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 15,
  },
});
