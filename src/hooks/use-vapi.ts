"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Phase =
	| "idle"
	| "connecting"
	| "live"
	| "listening"
	| "thinking"
	| "speaking"
	| "ended"
	| "error";

interface TranscriptChunk {
	id: string;
	role: "user" | "assistant";
	text: string;
	final: boolean;
	ts: number;
}

interface UseVapiReturn {
	ready: boolean;
	phase: Phase;
	inCall: boolean;
	connecting: boolean;
	audioLevel: number;
	error: string | null;
	transcripts: TranscriptChunk[];
	start: () => Promise<void>;
	stop: () => Promise<void>;
	toggle: () => void;
	mute: (muted: boolean) => void;
	muted: boolean;
	durationMs: number;
}

const START_EVENTS = [
	"call.started",
	"call-started",
	"call_start",
	"session.started",
];
const END_EVENTS = ["call.ended", "call-ended", "call_end", "session.ended"];
const AUDIO_EVENTS = ["audio.level", "volume-level", "audio_level"];
const USER_SPEECH_START = ["user.start_speaking", "user_speaking_started"];
const USER_SPEECH_END = ["user.stop_speaking", "user_speaking_stopped"];
const ASSISTANT_SPEECH_START = [
	"assistant.start_speaking",
	"assistant_speaking_started",
];
const ASSISTANT_SPEECH_END = [
	"assistant.stop_speaking",
	"assistant_speaking_stopped",
];
const THINKING_EVENTS = ["assistant.thinking", "assistant_thinking"];
const MESSAGE_EVENTS = ["message", "assistant.message", "assistant_message"];
const PARTIAL_TRANSCRIPT = ["transcript.partial", "transcript_partial"];
const FINAL_TRANSCRIPT = ["transcript.final", "transcript_final"];
const ERROR_EVENTS = ["error", "call.error", "call_error"];

export function useVapi(): UseVapiReturn {
	const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
	const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

	const vapiRef = useRef<any | null>(null);
	const levelTargetRef = useRef(0);
	const rafRef = useRef<number>(0);
	const startedAtRef = useRef<number | null>(null);
	const micTracksRef = useRef<MediaStreamTrack[]>([]);

	const [ready, setReady] = useState(false);
	const [phase, setPhase] = useState<Phase>("idle");
	const [audioLevel, setAudioLevel] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [transcripts, setTranscripts] = useState<TranscriptChunk[]>([]);
	const [muted, setMuted] = useState(false);
	const [durationMs, setDurationMs] = useState(0);

	// After you attach events (where transcripts updated), enforce trimming:
	const upsertTranscript = (chunk: TranscriptChunk) =>
		setTranscripts((prev) => {
			const idx = prev.findIndex((c) => c.id === chunk.id);
			let next: TranscriptChunk[];
			if (idx === -1) next = [...prev, chunk];
			else {
				next = [...prev];
				next[idx] = { ...next[idx], ...chunk };
			}
			// Trim to last 50
			if (next.length > 50) next = next.slice(next.length - 50);
			return next;
		});

	// Smooth audio interpolation
	const smooth = useCallback(() => {
		setAudioLevel((prev) => prev + (levelTargetRef.current - prev) * 0.18);
		rafRef.current = requestAnimationFrame(smooth);
	}, []);

	// Duration ticker
	useEffect(() => {
		let t: number | null = null;
		if (startedAtRef.current) {
			const tick = () => {
				setDurationMs(Date.now() - (startedAtRef.current as number));
				t = window.setTimeout(tick, 1000);
			};
			tick();
		} else {
			setDurationMs(0);
		}
		return () => {
			if (t) clearTimeout(t);
		};
	}, [phase]);

	useEffect(() => {
		let cancelled = false;
		async function init() {
			if (typeof window === "undefined") return;
			if (!apiKey || !assistantId) {
				setError("Missing env vars");
				return;
			}
			try {
				const mod = await import("@vapi-ai/web");
				if (cancelled) return;
				const Vapi = mod.default ?? mod;
				vapiRef.current = new Vapi(apiKey);
				attachEvents();
				setReady(true);
				smooth();
			} catch (e: any) {
				setError(e?.message || "Load failed");
				setPhase("error");
			}
		}

		function attach(eNames: string[], handler: (...a: any[]) => void) {
			eNames.forEach((n) => vapiRef.current?.on?.(n, handler));
		}
		function detach(eNames: string[], handler: (...a: any[]) => void) {
			eNames.forEach((n) => vapiRef.current?.off?.(n, handler));
		}

		function attachEvents() {
			const v = vapiRef.current;
			if (!v) return;

			const onStart = () => {
				startedAtRef.current = Date.now();
				setPhase(() => "live");
			};
			const onEnd = () => {
				setPhase("ended");
				levelTargetRef.current = 0;
				startedAtRef.current = null;
			};
			const onAudio = (lvl: number) => {
				if (typeof lvl === "number") {
					const norm =
						lvl > 1
							? Math.min(1, lvl / 100)
							: Math.max(0, Math.min(1, lvl));
					levelTargetRef.current = norm;
				}
			};
			const onUserSpeakStart = () => setPhase(() => "listening");
			const onUserSpeakEnd = () =>
				setPhase((p) => (p === "listening" ? "thinking" : p));
			const onAssistantSpeakStart = () => setPhase("speaking");
			const onAssistantSpeakEnd = () => setPhase("live");
			const onThinking = () =>
				setPhase((p) => (p === "listening" ? "thinking" : "thinking"));

			const upsertTranscript = (chunk: TranscriptChunk) =>
				setTranscripts((prev) => {
					const idx = prev.findIndex((c) => c.id === chunk.id);
					if (idx === -1) return [...prev, chunk];
					const clone = [...prev];
					clone[idx] = { ...clone[idx], ...chunk };
					return clone;
				});

			const onPartial = (d: any) => {
				upsertTranscript({
					id: d?.id || `partial-${Date.now()}`,
					role: d?.role === "user" ? "user" : "assistant",
					text: d?.text || d?.transcript || "",
					final: false,
					ts: Date.now(),
				});
			};
			const onFinal = (d: any) => {
				upsertTranscript({
					id: d?.id || `final-${Date.now()}`,
					role: d?.role === "user" ? "user" : "assistant",
					text: d?.text || d?.transcript || "",
					final: true,
					ts: Date.now(),
				});
			};
			const onMessage = (m: any) => {
				if (!m?.text) return;
				upsertTranscript({
					id: m.id || `msg-${Date.now()}`,
					role: m.role === "user" ? "user" : "assistant",
					text: m.text,
					final: true,
					ts: Date.now(),
				});
			};
			const onErr = (err: any) => {
				setError(err?.message || String(err) || "Error");
				setPhase("error");
			};

			attach(START_EVENTS, onStart);
			attach(END_EVENTS, onEnd);
			attach(AUDIO_EVENTS, onAudio);
			attach(USER_SPEECH_START, onUserSpeakStart);
			attach(USER_SPEECH_END, onUserSpeakEnd);
			attach(ASSISTANT_SPEECH_START, onAssistantSpeakStart);
			attach(ASSISTANT_SPEECH_END, onAssistantSpeakEnd);
			attach(THINKING_EVENTS, onThinking);
			attach(PARTIAL_TRANSCRIPT, onPartial);
			attach(FINAL_TRANSCRIPT, onFinal);
			attach(MESSAGE_EVENTS, onMessage);
			attach(ERROR_EVENTS, onErr);

			(v as any).__cleanup = () => {
				detach(START_EVENTS, onStart);
				detach(END_EVENTS, onEnd);
				detach(AUDIO_EVENTS, onAudio);
				detach(USER_SPEECH_START, onUserSpeakStart);
				detach(USER_SPEECH_END, onUserSpeakEnd);
				detach(ASSISTANT_SPEECH_START, onAssistantSpeakStart);
				detach(ASSISTANT_SPEECH_END, onAssistantSpeakEnd);
				detach(THINKING_EVENTS, onThinking);
				detach(PARTIAL_TRANSCRIPT, onPartial);
				detach(FINAL_TRANSCRIPT, onFinal);
				detach(MESSAGE_EVENTS, onMessage);
				detach(ERROR_EVENTS, onErr);
			};
		}

		init();
		return () => {
			cancelled = true;
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			try {
				vapiRef.current?.__cleanup?.();
			} catch {}
		};
	}, [apiKey, assistantId, smooth]);

	const captureUserTracks = async () => {
		try {
			const stream: MediaStream =
				await navigator.mediaDevices.getUserMedia({ audio: true });
			micTracksRef.current = stream.getAudioTracks();
		} catch {
			// Ignore if blocked
		}
	};

	const applyMute = (m: boolean) => {
		// SDK methods (try several)
		try {
			vapiRef.current?.mute?.(m);
		} catch {}
		try {
			vapiRef.current?.setMuted?.(m);
		} catch {}
		try {
			vapiRef.current?.updateCall?.({ muted: m });
		} catch {}
		// Local mic tracks
		micTracksRef.current.forEach((t) => (t.enabled = !m));
	};

	const start = useCallback(async () => {
		if (!ready || !vapiRef.current) return;
		setError(null);
		setPhase("connecting");
		try {
			await captureUserTracks();
			await vapiRef.current.start?.(assistantId);
			setTimeout(() => {
				setPhase((p) => (p === "connecting" ? "live" : p));
				if (muted) applyMute(true);
			}, 1800);
		} catch (e: any) {
			setError(e?.message || "Start failed");
			setPhase("error");
		}
	}, [assistantId, ready, muted]);

	const stop = useCallback(async () => {
		if (!vapiRef.current) return;
		try {
			await vapiRef.current.stop?.();
		} catch (e: any) {
			setError(e?.message || "Stop failed");
		} finally {
			setPhase("ended");
			levelTargetRef.current = 0;
		}
	}, []);

	const toggle = useCallback(() => {
		if (
			phase === "connecting" ||
			phase === "live" ||
			phase === "listening" ||
			phase === "speaking" ||
			phase === "thinking"
		) {
			stop();
		} else {
			start();
		}
	}, [phase, start, stop]);

	const mute = useCallback((m: boolean) => {
		setMuted(m);
		applyMute(m);
	}, []);

	return {
		ready,
		phase,
		inCall: [
			"connecting",
			"live",
			"listening",
			"speaking",
			"thinking",
		].includes(phase),
		connecting: phase === "connecting",
		audioLevel,
		error,
		transcripts,
		start,
		stop,
		toggle,
		mute,
		muted,
		durationMs,
	};
}
