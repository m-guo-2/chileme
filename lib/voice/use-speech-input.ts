"use client";

import { useCallback, useMemo, useRef, useState } from "react";

type SpeechStatus = "idle" | "listening" | "unsupported" | "error";

export function useSpeechInput(language = "zh-CN") {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const isSupported = useMemo(
    () => typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    [],
  );

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setStatus("idle");
  }, []);

  const start = useCallback(() => {
    if (!isSupported) {
      setStatus("unsupported");
      setError("当前浏览器不支持语音转写，请直接输入文字。");
      return;
    }

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setStatus("unsupported");
      setError("当前浏览器不支持语音转写，请直接输入文字。");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const nextTranscript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join("");

      setTranscript(nextTranscript);
    };

    recognition.onerror = (event) => {
      setStatus("error");
      setError(event.message || `语音识别失败: ${event.error}`);
    };

    recognition.onend = () => {
      setStatus("idle");
    };

    recognitionRef.current = recognition;
    setError("");
    setStatus("listening");
    recognition.start();
  }, [isSupported, language]);

  const reset = useCallback(() => {
    setTranscript("");
    setError("");
    setStatus(isSupported ? "idle" : "unsupported");
  }, [isSupported]);

  return {
    transcript,
    status,
    error,
    isSupported,
    start,
    stop,
    reset,
    setTranscript,
  };
}
