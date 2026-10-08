export interface ModelInfo {
  id: string;
  name: string;
  family: 'Gemini 3' | 'Gemini 2.5' | 'Specialized';
  desc: string;
  speed: number;       // 1 - 5
  reasoning: number;   // 1 - 5
  cost: number;        // 1 - 5 (higher is more cost efficient)
  isSupported: boolean; // supports file audio transcription
  badge: string;
  requiresPaid?: boolean;
}

export const MODELS: ModelInfo[] = [
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    family: "Gemini 3",
    desc: "Offers near-Pro reasoning and coding speeds at a Flash-tier price, optimized for fast, long-horizon agentic execution.",
    speed: 5,
    reasoning: 4,
    cost: 4,
    isSupported: true,
    badge: "Recommended"
  },
  {
    id: "gemini-3.5-transcribe",
    name: "Gemini 3.5 Transcribe",
    family: "Specialized",
    desc: "Dedicated static and pre-recorded audio transcription model built specifically for high fidelity speech-to-text conversion.",
    speed: 5,
    reasoning: 4,
    cost: 5,
    isSupported: true,
    badge: "Audio Specialist"
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    family: "Gemini 2.5",
    desc: "A highly balanced model for low-latency, high-volume operations with built-in streaming/audio support.",
    speed: 4,
    reasoning: 3,
    cost: 4,
    isSupported: true,
    badge: "Balanced"
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash-Lite",
    family: "Gemini 3",
    desc: "The most cost-efficient model in the lineup, tailored for high-volume, cost-sensitive tasks and low latency.",
    speed: 5,
    reasoning: 3,
    cost: 5,
    isSupported: true,
    badge: "Cost Saver"
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    family: "Gemini 2.5",
    desc: "A robust reasoning model for deep analysis, featuring adaptive thinking and up to a 1M token context window.",
    speed: 3,
    reasoning: 4,
    cost: 3,
    isSupported: true,
    badge: "Stable Reasoning"
  },
  {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro",
    family: "Gemini 3",
    desc: "The flagship Google AI Studio model, built on state-of-the-art reasoning for the most complex multimodal and agentic workflows.",
    speed: 4,
    reasoning: 5,
    cost: 2,
    isSupported: true,
    badge: "Flagship",
    requiresPaid: true
  },
  {
    id: "gemini-3.8-live",
    name: "Gemini Live & TTS",
    family: "Specialized",
    desc: "Native text-to-speech (TTS) and bidirectional Gemini API audio models built for sub-second, real-time voice-first applications.",
    speed: 5,
    reasoning: 3,
    cost: 3,
    isSupported: false,
    badge: "Voice Stream Only"
  },
  {
    id: "gemini-3-pro-image",
    name: "Gemini 3 Pro Image",
    family: "Specialized",
    desc: "Specialized generative and editing models designed for highly contextual, multi-image fusion and conversational editing.",
    speed: 3,
    reasoning: 4,
    cost: 2,
    isSupported: false,
    badge: "Image Generation",
    requiresPaid: true
  },
  {
    id: "gemini-3.1-flash-image",
    name: "Nano Banana 2 & Pro",
    family: "Specialized",
    desc: "State-of-the-art image generation and editing models optimized for speed and highly contextual native creation.",
    speed: 5,
    reasoning: 3,
    cost: 4,
    isSupported: false,
    badge: "Image Generation",
    requiresPaid: true
  }
];
