import { IconSymbol } from "@/components/ui/icon-symbol";
import { Video } from "@/types/video";
import { useRouter } from "expo-router";
import { VideoView } from "expo-video";
import { Text, TouchableOpacity, View } from "react-native";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/video/${video.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white dark:bg-gray-800 rounded-lg mb-4 overflow-hidden shadow-sm"
      activeOpacity={0.7}
    >
      <View className="w-full h-48 bg-gray-200 dark:bg-gray-700 relative">
        <VideoView
          source={{ uri: video.uri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          useNativeControls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <IconSymbol name="play.circle.fill" size={48} color="white" />
        </View>
      </View>
      <View className="p-4">
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
      </View>
    </TouchableOpacity>
  );
}
