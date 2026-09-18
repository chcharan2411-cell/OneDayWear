import { useEffect, useRef, useState } from "react";

function MusicPlayer() {
  const audioRef = useRef(null);
  const currentTrackRef = useRef(0);

  const musicList = [
    "/music/peddi-music.mp3",
    "/music/my_music.mp3",
    "/music/new_song.mp3",
  ];

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.35;

    const startMusic = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        // Browser blocked autoplay.
        setIsPlaying(false);
      }
    };

    startMusic();

    return () => {
      audio.pause();
    };
  }, []);

  const playNextTrack = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    const nextTrack =
      (currentTrackRef.current + 1) % musicList.length;

    currentTrackRef.current = nextTrack;

    audio.src = musicList[nextTrack];
    audio.load();

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Unable to play next music:", error);
      setIsPlaying(false);
    }
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Unable to play music:", error);
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleAudioError = () => {
    console.error(
      "Music could not be loaded:",
      musicList[currentTrackRef.current]
    );

    playNextTrack();
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={musicList[0]}
        onEnded={playNextTrack}
        onError={handleAudioError}
        preload="auto"
      />

      <button
        onClick={toggleMusic}
        style={{
          position: "fixed",
          right: "25px",
          bottom: "25px",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "1px solid #222",
          background: "#fff",
          cursor: "pointer",
          zIndex: 9999,
          fontSize: "20px",
        }}
        title={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? "🔊" : "🔇"}
      </button>
    </>
  );
}

export default MusicPlayer;