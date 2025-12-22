import React, { useRef, useEffect, useState } from 'react';

const SecureVideoPlayer = ({ videoId, onProgress, initialTime = 0 }) => {
  const playerRef = useRef(null);
  const [player, setPlayer] = useState(null);

  const extractId = (idOrUrl) => {
    if (!idOrUrl) return '';
    if (idOrUrl.length === 11 && !idOrUrl.includes('/') && !idOrUrl.includes('.')) return idOrUrl;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = idOrUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : idOrUrl;
  };

  useEffect(() => {
    const videoIdToUse = extractId(videoId);
    if (!videoIdToUse) return;

    let newPlayer;

    const initPlayer = () => {
      newPlayer = new window.YT.Player(playerRef.current, {
        width: '100%',
        height: '100%',
        videoId: videoIdToUse,
        playerVars: {
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          playsinline: 1,
          start: Math.floor(initialTime),
        },
        events: {
          onReady: (event) => {
            setPlayer(event.target);
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      if (newPlayer) {
        newPlayer.destroy();
      }
    };
  }, [videoId]);

  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      if (player.getCurrentTime && player.getDuration) {
        const time = player.getCurrentTime();
        const dur = player.getDuration();

        if (onProgress) {
          onProgress({
            watched_duration: Math.floor(time),
            is_completed: time / dur > 0.9,
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, onProgress]);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-xl">
      <div className="relative aspect-video">
        <div ref={playerRef} className="absolute inset-0"></div>
      </div>
    </div>
  );
};

export default SecureVideoPlayer;
