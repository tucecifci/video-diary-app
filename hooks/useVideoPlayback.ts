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

    return () => {
      subscription.remove();
    };
  }, [player]);

  const togglePlay = () => {
    if (player.playing) {
      player.pause();
    } else {
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
