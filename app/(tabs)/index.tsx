import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const generateRandomIds = (count, maxId = 1084) => {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * maxId));
  }
  return Array.from(ids);
};

export default function HomeScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRandomImages = async () => {
    setLoading(true);
    try {
      const randomIds = generateRandomIds(5); // 5 unique image IDs
      const randomImageList = await Promise.all(
        randomIds.map(async (id) => {
          const response = await fetch(`https://picsum.photos/id/${id}/info`);
          const data = await response.json();
          return {
            id,
            url: `https://picsum.photos/id/${id}/800/500`,
            download_url: `https://picsum.photos/id/${id}/1920/1080`,
            author: data.author,
            width: data.width,
            height: data.height,
          };
        })
      );
      setImages(randomImageList);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (url, id) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Storage permission is needed to download images."
      );
      return;
    }

    try {
      const fileUri = `${FileSystem.documentDirectory}${id}.jpg`;
      const downloaded = await FileSystem.downloadAsync(url, fileUri);
      await MediaLibrary.saveToLibraryAsync(downloaded.uri);
      Alert.alert("Downloaded", "Image saved to gallery.");
    } catch {
      Alert.alert("Error", "Failed to download image.");
    }
  };

  useEffect(() => {
    fetchRandomImages();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.url }} style={styles.image} />
      <Text style={styles.detail}>ID: {item.id}</Text>
      <Text style={styles.detail}>Author: {item.author}</Text>
      <Text style={styles.detail}>
        Dimensions: {item.width}x{item.height}
      </Text>
      <TouchableOpacity
        style={styles.downloadBtn}
        onPress={() => downloadImage(item.download_url, item.id)}
      >
        <Ionicons name="download-outline" size={20} color="white" />
        <Text style={styles.downloadText}>Download</Text>
      </TouchableOpacity>
    </View>
  );

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

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 100 }}
        />
      ) : (
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={fetchRandomImages}
      >
        <Ionicons name="refresh" size={20} color="white" />
        <Text style={styles.refreshText}>Load New</Text>
      </TouchableOpacity>
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
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },
  settingsIcon: {
    top: 40,
    right: -15,
  },
  listContainer: {
    paddingBottom: 140,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    marginBottom: 25,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginBottom: 12,
  },
  detail: {
    color: "#fff",
    fontSize: 14,
    marginTop: 2,
  },
  downloadBtn: {
    flexDirection: "row",
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
  },
  downloadText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "600",
    fontSize: 16,
  },
  refreshButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  refreshText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
