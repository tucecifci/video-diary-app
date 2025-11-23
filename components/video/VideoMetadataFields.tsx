import { Text, TextInput, View } from "react-native";

interface VideoMetadataFieldsProps {
  name: string;
  description: string;
  onChangeName: (value: string) => void;
  onChangeDescription: (value: string) => void;
}

export function VideoMetadataFields({
  name,
  description,
  onChangeName,
  onChangeDescription,
}: VideoMetadataFieldsProps) {
  return (
    <>
      {/* Name Input */}
      <View className="mb-6">
        <Text className="text-white text-sm font-semibold mb-2">
          Video İsmi *
        </Text>
        <TextInput
          value={name}
          onChangeText={onChangeName}
          placeholder="Video ismini girin"
          placeholderTextColor="#9ca3af"
          className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
          style={{ color: "#ffffff" }}
          autoFocus={false}
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </View>

      {/* Description Input */}
      <View className="mb-6">
        <Text className="text-white text-sm font-semibold mb-2">Açıklama</Text>
        <TextInput
          value={description}
          onChangeText={onChangeDescription}
          placeholder="Video açıklaması (opsiyonel)"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 min-h-[100px]"
          style={{ color: "#ffffff" }}
          returnKeyType="done"
          blurOnSubmit={true}
        />
      </View>
    </>
  );
}
