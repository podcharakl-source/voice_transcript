import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileAudio, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Copy, 
  Download, 
  RotateCcw,
  Waves
} from 'lucide-react';
import Markdown from 'react-markdown';
import { transcribeAudio } from './services/transcriptionService';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.toLowerCase().endsWith('.m4a') || selectedFile.type === 'audio/x-m4a' || selectedFile.type === 'audio/m4a') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please upload an M4A file.");
        setFile(null);
      }
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.name.toLowerCase().endsWith('.m4a')) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Please upload an M4A file.");
      }
    }
  };

  const handleTranscribe = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setTranscript(null);

    try {
      const base64Data = await fileToBase64(file);
      const result = await transcribeAudio(base64Data, 'audio/x-m4a');
      setTranscript(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (transcript) {
      const blob = new Blob([transcript], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcript-${file?.name?.replace('.m4a', '') || 'file'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTranscript(null);
    setError(null);
  };

  const messages = [
    "Analyzing audio frequencies...",
    "Understanding speech patterns...",
    "Extracting text context...",
    "Polishing the final transcript...",
    "Almost there, finalizing characters..."
  ];

  return (
    <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-950/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header id="app-header" className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
              <Waves className="text-white size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">ScribeAI</h1>
          </div>
          <div className="hidden sm:flex gap-6 text-sm font-medium text-neutral-400">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Gemini API</a>
          </div>
        </header>

        {/* Hero Section */}
        <div id="hero-section" className="text-center mb-16 px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500"
          >
            Turn your audio into <br /> clear, accurate text.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-neutral-400 max-w-xl mx-auto"
          >
            ScribeAI uses advanced neural networks to transcribe M4A files with human-like precision. Fast, secure, and ready for your files.
          </motion.p>
        </div>

        {/* Main Interface */}
        <div id="main-content" className="space-y-8">
          {!transcript && !isUploading && (
            <motion.div 
              id="upload-zone"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative group h-[400px] border-2 border-dashed rounded-3xl transition-all duration-500 flex flex-col items-center justify-center p-12 overflow-hidden
                ${isDragging ? 'border-orange-500 bg-orange-500/5' : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'}
              `}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <input 
                id="file-input"
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".m4a"
                className="hidden" 
              />
              
              <div className="relative z-20 text-center space-y-4">
                <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 
                  ${file ? 'bg-orange-600 scale-110' : 'bg-neutral-800 group-hover:bg-neutral-700'}`}
                >
                  {file ? <CheckCircle2 className="size-10 text-white" /> : <Upload className="size-10 text-neutral-400" />}
                </div>
                
                <div>
                  <h3 id="file-status" className="text-xl font-semibold mb-2">
                    {file ? file.name : "Drop your M4A here"}
                  </h3>
                  <p className="text-neutral-500 text-sm">
                    {file 
                      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to transcribe` 
                      : "or click to browse from your device"}
                  </p>
                </div>

                {!file ? (
                  <button 
                    id="browse-btn"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-all shadow-xl shadow-white/5 active:scale-95"
                  >
                    Select File
                  </button>
                ) : (
                  <div className="flex gap-4 justify-center mt-6">
                    <button 
                      id="reset-btn"
                      onClick={handleReset}
                      className="px-6 py-3 border border-neutral-700 text-neutral-300 font-semibold rounded-full hover:bg-neutral-800 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <RotateCcw className="size-4" /> Reset
                    </button>
                    <button 
                      id="transcribe-btn"
                      onClick={handleTranscribe}
                      className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-full hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/20 active:scale-95 flex items-center gap-2"
                    >
                      Transcribe Now <Waves className="size-4" />
                    </button>
                  </div>
                )}
              </div>


              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}

          {/* Loading State */}
          <AnimatePresence>
            {isUploading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-12 text-center"
              >
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-neutral-800 rounded-full border-t-orange-600 animate-spin" />
                    <Loader2 className="absolute inset-0 m-auto text-orange-600 size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Transcribing Audio</h3>
                    <motion.div
                      key={Math.floor(Date.now() / 3000)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-neutral-500 text-sm h-6 font-mono"
                    >
                      {messages[Math.floor(Date.now() / 3000) % messages.length]}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400"
            >
              <AlertCircle className="size-5" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Results Section */}
          <AnimatePresence>
            {transcript && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl flex flex-col overflow-hidden"
              >
                <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-600/20 flex items-center justify-center">
                      <FileAudio className="text-orange-600 size-5" />
                    </div>
                    <span className="font-semibold text-neutral-200 truncate max-w-[200px] md:max-w-xs">{file?.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopy}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium
                        ${isCopied ? 'bg-green-600/20 text-green-400' : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'}
                      `}
                    >
                      <Copy className="size-4" />
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="p-2 bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                      <Download className="size-4" />
                    </button>
                    <button 
                      onClick={handleReset}
                      className="p-2 bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                      <RotateCcw className="size-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-8 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700">
                  <div className="prose prose-invert prose-orange max-w-none">
                    <Markdown>{transcript}</Markdown>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <footer className="mt-24 text-center space-y-6">
          <div className="flex items-center justify-center gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
            <span className="text-xs font-bold tracking-widest uppercase">Powered by Gemini AI</span>
          </div>
          <p className="text-neutral-600 text-sm max-w-sm mx-auto">
            Uploaded files are processed locally and transcribed using Google's secure AI infrastructure. No audio is stored after processing.
          </p>
        </footer>
      </div>
    </div>
  );
}

