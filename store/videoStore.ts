import { Video } from "@/types/video";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface VideoState {
  videos: Video[];
  addVideo: (video: Video) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  getVideo: (id: string) => Video | undefined;
  clearAllVideos: () => void;
}

export const useVideoStore = create<VideoState>()(
  persist(
    (set, get) => ({
      videos: [],
      addVideo: (video) =>
        set((state) => ({
          videos: [video, ...state.videos],
        })),
      updateVideo: (id, updates) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === id ? { ...video, ...updates } : video
          ),
        })),
      deleteVideo: (id) =>
        set((state) => ({
          videos: state.videos.filter((video) => video.id !== id),
        })),
      getVideo: (id) => {
        const state = get();
        return state.videos.find((video) => video.id === id);
      },
      clearAllVideos: () => {
        set({ videos: [] });
      },
    }),
    {
      name: "video-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
