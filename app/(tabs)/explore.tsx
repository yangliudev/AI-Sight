import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { HUGGING_FACE_API_KEY } from "@env";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function TabTwoScreen() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const query = async (data) => {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return await response.blob();
  };

  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

  const generateImage = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const blob = await query({ inputs: inputText });
      const base64 = await blobToBase64(blob);
      setImageUri(base64); // React Native <Image> accepts base64
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to generate image.");
      setImageUri(null);
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="image-outline" size={40} color="#fff" />
          <Text style={styles.title}>AI Image Generator</Text>
        </View>

        <Text style={styles.description}>Describe an image to generate:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Astronaut riding a horse"
          placeholderTextColor="#ccc"
          multiline
          onChangeText={setInputText}
          value={inputText}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={generateImage}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Generating..." : "Generate Image"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={{ marginTop: 20 }}
          />
        )}

        {imageUri && (
          <View style={styles.imageWrapper}>
            <Text style={styles.previewText}>Generated Image:</Text>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#fff",
    textAlignVertical: "top",
    minHeight: 80,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 3,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  imageWrapper: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#ffffff22",
    padding: 10,
    borderRadius: 16,
  },
  previewText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
    fontWeight: "600",
  },
  image: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
    borderRadius: 12,
  },
});
