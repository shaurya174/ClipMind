import { useEffect, useRef, useState } from "react";

let apiPromise = null;

function loadYouTubeIframeAPI() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });

  return apiPromise;
}

/**
 * Mounts a real YouTube IFrame Player into a ref-owned DOM node (not a
 * string id) so timestamp clicks can seek smoothly via seekTo() and so a
 * prior destroy()'s DOM quirks can never block the next mount.
 */
export function useYouTubePlayer(containerRef, videoId) {
  const playerRef = useRef(null);
  const pendingSeekRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!videoId || !container) return undefined;

    let cancelled = false;
    setIsReady(false);

    container.innerHTML = "";
    const mountNode = document.createElement("div");
    mountNode.style.width = "100%";
    mountNode.style.height = "100%";
    container.appendChild(mountNode);

    loadYouTubeIframeAPI().then((YT) => {
      if (cancelled) return;

      playerRef.current = new YT.Player(mountNode, {
        videoId,
        playerVars: {
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            if (cancelled) return;
            setIsReady(true);
            if (pendingSeekRef.current != null) {
              const seconds = pendingSeekRef.current;
              pendingSeekRef.current = null;
              playerRef.current.seekTo(seconds, true);
              playerRef.current.playVideo();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        // Player may already be torn down by the API itself on unmount races.
      }
      playerRef.current = null;
      if (container) container.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  function seekTo(seconds) {
    const target = Number(seconds);
    if (Number.isNaN(target)) return;

    const player = playerRef.current;
    if (player && typeof player.seekTo === "function") {
      player.seekTo(target, true);
      player.playVideo();
    } else {
      pendingSeekRef.current = target;
    }
  }

  return { seekTo, isReady };
}
