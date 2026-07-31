import { useCallback, useRef, useState } from "react";
import { chatWithVideo } from "../services/api";
import { getAccessToken } from "../services/tokenStore";

let idCounter = 0;

function nextId() {
  idCounter += 1;
  return idCounter;
}

export function useChat(videoId) {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);
  const inFlightRef = useRef(false);

  const runQuestion = useCallback(
    async (question) => {
      const trimmed = question.trim();
      if (!trimmed || inFlightRef.current) return;

      // Guest users cannot use chat
      const token = getAccessToken();

      if (!token) {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            text: "Please sign in to chat with this video.",
          },
        ]);
        return;
      }

      inFlightRef.current = true;
      setError(null);
      setIsThinking(true);

      try {
        const res = await chatWithVideo({
          video_id: videoId,
          question: trimmed,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            text: res.answer,
            usedTranscript: !!res.used_transcript,
            relatedTopic: !!res.related_topic,
            sources: res.sources || [],
          },
        ]);
      } catch (err) {
        setError(err.message);

        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            failed: true,
            failedQuestion: trimmed,
          },
        ]);
      } finally {
        setIsThinking(false);
        inFlightRef.current = false;
      }
    },
    [videoId]
  );

  const sendMessage = useCallback(
    (question) => {
      const trimmed = question.trim();

      if (!trimmed || inFlightRef.current) return;

      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "user",
          text: trimmed,
        },
      ]);

      runQuestion(trimmed);
    },
    [runQuestion]
  );

  const retryMessage = useCallback(
    (messageId, question) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      runQuestion(question);
    },
    [runQuestion]
  );

  return {
    messages,
    isThinking,
    error,
    sendMessage,
    retryMessage,
  };
}