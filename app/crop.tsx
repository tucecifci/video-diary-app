import { IconSymbol } from "@/components/ui/icon-symbol";
import Slider from "@react-native-community/slider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CropScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ videoUri: string }>();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const player = useVideoPlayer(params.videoUri || "", (player) => {
    player.loop = false;
    player.muted = false;
  });

  useEffect(() => {
    if (params.videoUri && player.duration && !player.playing) {
      const timer = setTimeout(() => {
        player.play();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [params.videoUri, player.duration, player]);

  useEffect(() => {
    const updateDuration = () => {
      if (player.duration) {
        setDuration(player.duration);
      }
    };

    updateDuration();

    const interval = setInterval(() => {
      updateDuration();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [player]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player.currentTime !== undefined) {
        setCurrentTime(player.currentTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [player]);

  const handleSliderChange = (value: number) => {
    player.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClose = () => {
    player.pause();
    router.back();
  };

  if (!params.videoUri) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">Video bulunamadı</Text>
        <TouchableOpacity onPress={handleClose} className="mt-4">
          <Text className="text-blue-500">Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <View className="flex-row items-center px-4 py-3 bg-black/80 rounded-b-lg">
        <TouchableOpacity onPress={handleClose}>
          <IconSymbol name="xmark" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center">
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
          nativeControls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
      </View>

      <View className="bg-black/90 px-4 py-6 rounded-t-lg">
        <View className="mb-4">
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={duration || 1}
            value={currentTime}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#4b5563"
            thumbTintColor="#3b82f6"
          />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-sm">{formatTime(currentTime)}</Text>
          <Text className="text-white text-sm">{formatTime(duration)}</Text>
        </View>

        <View className="items-center">
          <TouchableOpacity
            onPress={() => {
              if (player.playing) {
                player.pause();
              } else {
                player.play();
              }
            }}
            className="bg-blue-500 rounded-full p-4"
          >
            <IconSymbol
              name={player.playing ? "pause.fill" : "play.fill"}
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
