import { IconSymbol } from "@/components/ui/icon-symbol";
import { VideoNotFound } from "@/components/video/VideoNotFound";
import { useVideoPlayback } from "@/hooks/useVideoPlayback";
import { useVideoStore } from "@/store/videoStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { VideoView } from "expo-video";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VideoDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const video = useVideoStore((state) => (id ? state.getVideo(id) : undefined));

  const { player, isPlaying, togglePlay, pause } = useVideoPlayback(
    video?.uri ?? ""
  );

  const handleBack = () => {
    pause();
    router.back();
  };

  if (!video) {
    return <VideoNotFound onBack={handleBack} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-4 py-3 bg-black/80 rounded-b-lg">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleBack}>
            <IconSymbol name="chevron.left" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/video/editPage",
              params: { id },
            } as any)
          }
        >
          <IconSymbol name="square.and.pencil" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 px-4 pt-4 pb-6">
        <View className="flex-1 bg-black rounded-3xl overflow-hidden mb-4 border border-white/10">
          <VideoView
            player={player}
            style={{ width: "100%", height: "100%" }}
            contentFit="contain"
            nativeControls
            allowsFullscreen
            allowsPictureInPicture={false}
          />
          <TouchableOpacity
            onPress={togglePlay}
            className="absolute inset-0 items-center justify-center bg-black/10"
            activeOpacity={0.8}
          >
            {!isPlaying && (
              <IconSymbol name="play.circle.fill" size={64} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <View>
          <Text className="text-white text-2xl font-bold mb-2">
            {video.name}
          </Text>
          {video.description ? (
            <Text className="text-gray-300 text-base">{video.description}</Text>
          ) : (
            <Text className="text-gray-500 text-sm">
              Bu video için açıklama eklenmemiş.
            </Text>
          )}

          <View className="mt-2">
            <Text className="text-gray-500 text-xs">
              Oluşturulma:{" "}
              {new Date(video.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Text>
            {typeof video.duration === "number" && (
              <Text className="text-gray-500 text-xs mt-1">
                Süre: {video.duration.toFixed(1)} sn
              </Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
