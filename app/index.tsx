import { IconSymbol } from "@/components/ui/icon-symbol";
import { EmptyVideoList } from "@/components/video/EmptyVideoList";
import { VideoCard } from "@/components/video/VideoCard";
import { requestGalleryPermission } from "@/lib/permissions";
import { useVideoStore } from "@/store/videoStore";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const videos = useVideoStore((state) => state.videos);
  const clearAllVideos = useVideoStore((state) => state.clearAllVideos);
  useEffect(() => {
    const hasUncroppedVideos = videos.some(
      (video) => video.originalUri === video.uri
    );

    if (hasUncroppedVideos && videos.length > 0) {
      clearAllVideos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddVideo = async () => {
    const hasPermission = await requestGalleryPermission();

    if (!hasPermission) {
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: 300,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const videoAsset = result.assets[0];
        router.push({
          pathname: "/crop",
          params: { videoUri: videoAsset.uri },
        });
      }
    } catch (error) {
      console.error("Video seçme hatası:", error);
      Alert.alert("Hata", "Video seçilirken bir hata oluştu.", [
        { text: "Tamam" },
      ]);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      edges={["top"]}
    >
      <View className="bg-white dark:bg-gray-800 px-4 py-6 shadow-sm">
        <View className="flex-row items-center justify-center">
          <Text className="text-4xl font-bold text-gray-900 dark:text-white">
            Video Diary
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {videos.length > 0 && (
          <View className="mb-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </View>
        )}

        <EmptyVideoList hasVideos={videos.length > 0} />

        <View className="items-center pb-12 pt-8">
          <TouchableOpacity
            onPress={handleAddVideo}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg flex-row items-center gap-2"
            activeOpacity={0.7}
          >
            <IconSymbol name="play.fill" size={16} color="#000" />
            <Text className="text-gray-900 dark:text-white font-semibold">
              Add Video
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
