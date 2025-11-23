import { useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";

export function useVideoPlayback(uri: string) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
    player.muted = false;
  });

  const [isPlaying, setIsPlaying] = useState(player.playing);

  useEffect(() => {
    const subscription = player.addListener("playingChange", () => {
      setIsPlaying(player.playing);
    });

    const checkVideoEnd = setInterval(() => {
      if (
        player.playing &&
        player.duration &&
        player.currentTime !== undefined &&
        player.currentTime >= player.duration - 0.1
      ) {
        player.pause();
        player.currentTime = 0;
      }
    }, 100);

    return () => {
      subscription.remove();
      clearInterval(checkVideoEnd);
    };
  }, [player]);

  const togglePlay = () => {
    if (player.playing) {
      player.pause();
    } else {
      if (
        player.duration &&
        player.currentTime !== undefined &&
        player.currentTime >= player.duration - 0.1
      ) {
        player.currentTime = 0;
      }
      player.play();
    }
  };

  const pause = () => {
    if (player.playing) {
      player.pause();
    }
  };

  return {
    player,
    isPlaying,
    togglePlay,
    pause,
  };
}
