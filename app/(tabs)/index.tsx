import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import { useRouter } from "expo-router";

const generateRandomIds = (count, maxId = 1084) => {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * maxId));
  }
  return Array.from(ids);
};

export default function HomeScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const router = useRouter();

  const fetchRandomImages = async () => {
    setLoading(true);
    try {
      const randomIds = generateRandomIds(5);

      const randomImageList = await Promise.all(
        randomIds.map(async (id) => {
          const response = await fetch(`https://picsum.photos/id/${id}/info`);
          const data = await response.json();
          const url = `https://picsum.photos/id/${id}/800/500`;
          const download_url = `https://picsum.photos/id/${id}/1920/1080`;

          // Prefetch image to cache
          await Image.prefetch(url);

          return {
            id,
            url,
            download_url,
            author: data.author,
            width: data.width,
            height: data.height,
          };
        })
      );

      setImages(randomImageList);
    } catch {
      // Retry after short delay if failed
      setTimeout(fetchRandomImages, 1500);
    } finally {
      setLoading(false);
      setInitialLoading(false);
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
          onPress={() => router.navigate("/home/settings")}
        />
      </View>

      {initialLoading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : (
        <>
          <Text style={styles.swipeHint}>↓ Swipe down to refresh</Text>
          <FlatList
            data={images}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={fetchRandomImages}
                colors={["#fff"]}
                tintColor="#fff"
              />
            }
          />
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 90,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
  },
  settingsIcon: {
    paddingTop: 2,
    marginRight: 0,
  },
  loader: {
    marginTop: 100,
  },
  listContainer: {
    paddingBottom: 120,
    marginTop: 10,
  },
  swipeHint: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
    opacity: 0.8,
  },
  card: {
    backgroundColor: "#401367",
    borderRadius: 16,
    marginBottom: 20,
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
    borderRadius: 12,
    marginBottom: 12,
  },
  detail: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
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
});
