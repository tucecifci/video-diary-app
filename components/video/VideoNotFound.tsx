import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface VideoNotFoundProps {
  onBack: () => void;
}

export function VideoNotFound({ onBack }: VideoNotFoundProps) {
  return (
    <SafeAreaView className="flex-1 bg-black items-center justify-center">
      <Text className="text-white text-lg mb-4">
        Video bulunamadı veya silinmiş.
      </Text>
      <TouchableOpacity
        onPress={onBack}
        className="px-4 py-2 rounded-lg bg-gray-800"
      >
        <Text className="text-white">Geri dön</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
