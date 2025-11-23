import { deleteVideoFile } from "@/lib/videoStorage";
import { useVideoStore } from "@/store/videoStore";
import { Video } from "@/types/video";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

interface UseDeleteVideoOptions {
  video: Video | undefined;
  videoId: string | undefined;
  onPause?: () => void;
}

export function useDeleteVideo({
  video,
  videoId,
  onPause,
}: UseDeleteVideoOptions) {
  const router = useRouter();
  const deleteVideo = useVideoStore((state) => state.deleteVideo);

  const handleDelete = () => {
    if (!video || !videoId) return;

    Alert.alert(
      "Videoyu Sil",
      `"${video.name}" adlı videoyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteVideoFile(video.uri);
              deleteVideo(videoId);
              onPause?.();
              router.replace("/");
            } catch (error) {
              console.error("Video silinirken hata:", error);
              Alert.alert("Hata", "Video silinirken bir hata oluştu.");
            }
          },
        },
      ]
    );
  };

  return { handleDelete };
}
