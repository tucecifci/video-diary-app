import { Text, View } from "react-native";

interface EmptyVideoListProps {
  hasVideos: boolean;
}

export function EmptyVideoList({ hasVideos }: EmptyVideoListProps) {
  if (hasVideos) {
    return null; // Videolar varsa gösterilmez
  }

  return (
    <View className="flex-1 items-center justify-center px-4 py-12">
      <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-3 text-center">
        No videos yet
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
        Ready to start? Import your first video or learn how to use the app.
      </Text>
    </View>
  );
}
