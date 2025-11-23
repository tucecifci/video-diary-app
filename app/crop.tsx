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
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5); // Başlangıçta 5 saniye

  const player = useVideoPlayer(params.videoUri || "", (player) => {
    player.loop = false;
    player.muted = false;
  });

  // Video yüklendiğinde başlangıç ve bitiş zamanlarını ayarla
  useEffect(() => {
    if (duration > 0) {
      // Video süresi 5 saniyeden fazlaysa, ilk 5 saniyeyi seç
      if (duration >= 5) {
        setStartTime(0);
        setEndTime(5);
      } else {
        // Video 5 saniyeden kısaysa, tüm videoyu seç
        setStartTime(0);
        setEndTime(duration);
      }
    }
  }, [duration]);

  // Seçilen segment'i loop olarak oynat
  useEffect(() => {
    if (player.duration && player.currentTime !== undefined) {
      // Eğer seçilen segment'in dışına çıkarsa, başa dön
      if (player.currentTime < startTime || player.currentTime > endTime) {
        player.currentTime = startTime;
      }

      // Segment'in sonuna geldiğinde başa dön
      if (player.currentTime >= endTime && player.playing) {
        player.currentTime = startTime;
      }
    }
  }, [player.currentTime, startTime, endTime, player]);

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

  const handleStartTimeChange = (value: number) => {
    const newStartTime = Math.max(0, Math.min(value, endTime - 1));
    setStartTime(newStartTime);

    // Eğer endTime ile arası 5 saniyeden fazlaysa, endTime'ı ayarla
    if (endTime - newStartTime > 5) {
      setEndTime(newStartTime + 5);
    }

    // Video'yu yeni başlangıç noktasına al
    player.currentTime = newStartTime;
  };

  const handleEndTimeChange = (value: number) => {
    const newEndTime = Math.min(duration, Math.max(value, startTime + 1));
    setEndTime(newEndTime);

    // Eğer startTime ile arası 5 saniyeden fazlaysa, startTime'ı ayarla
    if (newEndTime - startTime > 5) {
      setStartTime(newEndTime - 5);
    }
  };

  const selectedDuration = endTime - startTime;
  const isValidSegment = Math.abs(selectedDuration - 5) < 0.1; // 5 saniye ± 0.1 saniye tolerans

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
        {/* Segment Seçimi - Başlangıç */}
        <View className="mb-2">
          <Text className="text-white text-xs mb-1">Başlangıç</Text>
          <Slider
            style={{ width: "100%", height: 30 }}
            minimumValue={0}
            maximumValue={duration || 1}
            value={startTime}
            onValueChange={handleStartTimeChange}
            minimumTrackTintColor="#10b981"
            maximumTrackTintColor="#4b5563"
            thumbTintColor="#10b981"
          />
          <Text className="text-white text-xs mt-1">
            {formatTime(startTime)}
          </Text>
        </View>

        {/* Segment Seçimi - Bitiş */}
        <View className="mb-2">
          <Text className="text-white text-xs mb-1">Bitiş</Text>
          <Slider
            style={{ width: "100%", height: 30 }}
            minimumValue={0}
            maximumValue={duration || 1}
            value={endTime}
            onValueChange={handleEndTimeChange}
            minimumTrackTintColor="#ef4444"
            maximumTrackTintColor="#4b5563"
            thumbTintColor="#ef4444"
          />
          <Text className="text-white text-xs mt-1">{formatTime(endTime)}</Text>
        </View>

        {/* Seçilen Segment Bilgisi */}
        <View className="mb-4 items-center">
          <Text className="text-white text-sm">
            Seçilen: {formatTime(startTime)} - {formatTime(endTime)} (
            {formatTime(selectedDuration)})
          </Text>
          {!isValidSegment && (
            <Text className="text-yellow-400 text-xs mt-1">
              ⚠️ Tam 5 saniye seçmelisiniz
            </Text>
          )}
          {isValidSegment && (
            <Text className="text-green-400 text-xs mt-1">
              ✓ 5 saniyelik segment seçildi
            </Text>
          )}
        </View>

        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => {
              if (player.playing) {
                player.pause();
              } else {
                // Seçilen segment'i oynat
                player.currentTime = startTime;
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

          {/* Next Butonu - Sadece geçerli segment seçildiyse aktif */}
          <TouchableOpacity
            onPress={() => {
              if (isValidSegment) {
                // Metadata form sayfasına yönlendir
                router.push({
                  pathname: "/crop/metadata",
                  params: {
                    videoUri: params.videoUri || "",
                    startTime: startTime.toString(),
                    endTime: endTime.toString(),
                  },
                });
              }
            }}
            disabled={!isValidSegment}
            className={`px-6 py-3 rounded-lg ${
              isValidSegment ? "bg-blue-500" : "bg-gray-600 opacity-50"
            }`}
          >
            <Text className="text-white font-semibold">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
