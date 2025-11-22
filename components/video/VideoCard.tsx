import { IconSymbol } from "@/components/ui/icon-symbol";
import { Video } from "@/types/video";
import { useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  const player = useVideoPlayer(video.uri, (player) => {
    player.loop = false;
    player.muted = false;
  });

  // Player durumunu dinle
  useEffect(() => {
    setIsPlaying(player.playing);

    const subscription = player.addListener("playingChange", () => {
      setIsPlaying(player.playing);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  const handleVideoPress = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleCardPress = () => {
    // Video oynatılıyorsa durdur
    if (isPlaying) {
      player.pause();
    }
    // Detay sayfasına git
    router.push(`/video/${video.id}` as any);
  };

  return (
    <View className="bg-white dark:bg-gray-800 rounded-lg mb-4 overflow-hidden shadow-sm">
      <View className="w-full h-48 bg-gray-200 dark:bg-gray-700 relative">
        <VideoView
          player={player}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          nativeControls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
        <TouchableOpacity
          onPress={handleVideoPress}
          className="absolute inset-0 items-center justify-center bg-black/20"
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
