import { saveAs } from "file-saver";
import { useCallback } from "react";

interface MonitorMessage {
  from: "monitor";
  eventType: "downloadFile" | "openNewWindow";
  target?: string;
  url: string;
  download?: string;
}

interface ProgressInfo {
  progress: number;
  speed: number;
  remainingTime: number;
}

export const useMonitorMessage = () => {
  const sendMonitorMessage = useCallback(
    (message: Omit<MonitorMessage, "from">) => {
      console.log("sendMonitorMessage", message);
      window.parent.postMessage(
        {
          from: "monitor",
          ...message,
        },
        "*"
      );
    },
    []
  );

  const handleDownload = useCallback(
    async (
      url: string,
      filename?: string,
      onProgress?: (info: ProgressInfo) => void
    ) => {
      try {
        sendMonitorMessage({
          eventType: "downloadFile",
          url,
          download: filename,
        });

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentLength = response.headers.get("content-length");
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        let loaded = 0;
        let lastUpdate = Date.now();
        let lastLoaded = 0;
        let lastProgressUpdate = 0;

        const reader = response.body!.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          loaded += value.length;

          if (total && onProgress) {
            const now = Date.now();
            const timeDiff = (now - lastUpdate) / 1000; // Convert to seconds
            const progress = (loaded / total) * 100;

            // Update progress every 1% or at least every second
            if (progress - lastProgressUpdate >= 1 || timeDiff >= 1) {
              const loadedDiff = loaded - lastLoaded;
              const speed = loadedDiff / timeDiff; // bytes/second
              const remainingBytes = total - loaded;
              const remainingTime = remainingBytes / speed;

              onProgress({
                progress,
                speed,
                remainingTime,
              });

              lastUpdate = now;
              lastLoaded = loaded;
              lastProgressUpdate = progress;
            }
          }
        }

        const blob = new Blob(chunks);
        saveAs(blob, filename);
        return { success: true as const };
      } catch (error) {
        console.error("Download failed:", error);
        return {
          success: false as const,
          error: error instanceof Error ? error.message : "Download failed",
        };
      }
    },
    [sendMonitorMessage]
  );

  const handleNewWindow = useCallback(
    (url: string, target: string = "_blank") => {
      sendMonitorMessage({
        eventType: "openNewWindow",
        url,
        target,
      });
      window.open(url, target);
    },
    [sendMonitorMessage]
  );

  return {
    handleDownload,
    handleNewWindow,
    sendMonitorMessage,
  };
};
