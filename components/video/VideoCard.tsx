import { IconSymbol } from "@/components/ui/icon-symbol";
import { useVideoPlayback } from "@/hooks/useVideoPlayback";
import { Video } from "@/types/video";
import { useRouter } from "expo-router";
import { VideoView } from "expo-video";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const router = useRouter();
  const { player, isPlaying, togglePlay, pause } = useVideoPlayback(video.uri);

  const handleVideoPress = () => {
    togglePlay();
  };

  const handleCardPress = () => {
    pause();
    router.push({
      pathname: "/video/detailPage",
      params: { id: video.id },
    } as any);
  };

  return (
    <View className="bg-white dark:bg-gray-800 rounded-lg mb-4 overflow-hidden shadow-sm">
      <View
        className={`w-full h-48 relative ${
          Platform.OS === "android"
            ? "bg-black dark:bg-black items-center justify-center"
            : "bg-gray-200 dark:bg-gray-700 overflow-hidden"
        }`}
      >
        <VideoView
          player={player}
          style={{
            width: "100%",
            height: "100%",
          }}
          contentFit={Platform.OS === "android" ? "contain" : "cover"}
          nativeControls={false}
          allowsPictureInPicture={false}
        />
        <TouchableOpacity
          onPress={handleVideoPress}
          className="absolute inset-0 items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
          activeOpacity={0.8}
        >
          {!isPlaying && (
            <IconSymbol name="play.circle.fill" size={48} color="white" />
          )}
        </TouchableOpacity>
        {isPlaying && (
          <TouchableOpacity
            onPress={handleVideoPress}
            className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
            activeOpacity={0.8}
          >
            <IconSymbol name="pause.fill" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        onPress={handleCardPress}
        activeOpacity={0.7}
        className="p-4"
      >
        <Text
          className="text-lg font-semibold text-gray-900 dark:text-white mb-1"
          numberOfLines={1}
        >
          {video.name}
        </Text>
        <Text
          className="text-sm text-gray-600 dark:text-gray-400"
          numberOfLines={2}
        >
          {video.description || "No description"}
        </Text>
        <Text className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          {new Date(video.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
