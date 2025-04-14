import { useState, useEffect } from "react";
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
import * as MediaLibrary from "expo-media-library";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function TabTwoScreen() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [mediaPermission, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    if (!mediaPermission?.granted) {
      requestPermission();
    }
  }, []);

  const query = async (data) => {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
      {
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_HF_KEY}`,
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
    setImageUri(null);
    try {
      const blob = await query({ inputs: inputText });
      const base64 = await blobToBase64(blob);
      setImageUri(base64);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to generate image.");
    }
    setLoading(false);
  };

  const downloadImage = async () => {
    if (!imageUri || !mediaPermission?.granted) return;
    try {
      const base64Data = imageUri.split("data:image/png;base64,")[1];
      const fileUri = MediaLibrary.createAssetAsync(
        `data:image/png;base64,${base64Data}`
      );
      await fileUri;
      Alert.alert("Success", "Image saved to your gallery.");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save image.");
    }
  };

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="image-outline" size={40} color="#fff" />
          <Text style={styles.title}>AI Image Generator</Text>
        </View>

        <Text style={styles.description}>Describe an image to generate:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. A guinea pig wearing sunglasses"
          placeholderTextColor="#ccc"
          multiline
          onChangeText={setInputText}
          value={inputText}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={generateImage}
          disabled={loading}
        >
          <LinearGradient
            colors={["#9b23ea", "#6a11cb"]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="sparkles" size={22} color="#fff" />
                <Text style={styles.buttonText}>Generate Image</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          {loading && (
            <Text style={styles.infoText}>
              Please wait, generating image...
            </Text>
          )}
          {imageUri && (
            <>
              <Text style={styles.previewText}>Generated Image:</Text>
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={downloadImage}
              >
                <Ionicons name="download-outline" size={20} color="#fff" />
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  scrollContainer: {
    paddingBottom: 120,
    marginTop: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    top: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#EEE",
    marginTop: 80,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: "#FFF",
    textAlignVertical: "top",
    minHeight: 80,
    marginTop: 15,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    borderRadius: 30,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  imageContainer: {
    marginTop: 30,
    alignItems: "center",
    minHeight: SCREEN_WIDTH * 0.9 + 80,
    justifyContent: "center",
  },
  previewText: {
    fontSize: 16,
    color: "#EEE",
    marginBottom: 12,
    fontWeight: "600",
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 20,
  },
  image: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
    borderRadius: 12,
  },
  downloadButton: {
    flexDirection: "row",
    marginTop: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    gap: 8,
  },
  downloadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
