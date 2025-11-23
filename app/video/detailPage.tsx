import { IconSymbol } from "@/components/ui/icon-symbol";
import { useVideoStore } from "@/store/videoStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VideoDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const video = useVideoStore((state) => (id ? state.getVideo(id) : undefined));
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useVideoPlayer(video?.uri ?? "", (player) => {
    player.loop = false;
    player.muted = false;
  });

  useEffect(() => {
    const subscription = player.addListener("playingChange", () => {
      setIsPlaying(player.playing);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  const handleBack = () => {
    if (player.playing) {
      player.pause();
    }
    router.back();
  };

  if (!video) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg mb-4">
          Video bulunamadı veya silinmiş.
        </Text>
        <TouchableOpacity
          onPress={handleBack}
          className="px-4 py-2 rounded-lg bg-gray-800"
        >
          <Text className="text-white">Geri dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
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
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
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
