'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';

interface PrescriptionScannerScreenProps {
  onBack: () => void;
  onScanComplete: (
    mode: 'prescription' | 'strip_expiry',
    recognizedText: string
  ) => void;
  language: string;
}

type GuidanceStep =
  | 'LOOKING'
  | 'MOVE_RIGHT'
  | 'MOVE_CLOSER'
  | 'HOLD_STEADY'
  | 'CAPTURED';

export function PrescriptionScannerScreen({
  onBack,
  onScanComplete,
  language,
}: PrescriptionScannerScreenProps) {
  const isEn = language === 'en';

  const [scanMode, setScanMode] =
    useState<'strip_expiry' | 'prescription'>('strip_expiry');
  const [guidanceStep, setGuidanceStep] =
    useState<GuidanceStep>('LOOKING');
  const [guidanceText, setGuidanceText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [guidanceCycle, setGuidanceCycle] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const speakGuide = (text: string) => {
    if (
      !voiceEnabled ||
      typeof window === 'undefined' ||
      !('speechSynthesis' in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isEn ? 'en-US' : 'hi-IN';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera access is not available in this browser.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setScanError(
          isEn
            ? 'Camera access failed. Allow camera permission and try again.'
            : 'कैमरा नहीं खुला। कैमरे की अनुमति दें और फिर कोशिश करें।'
        );
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());

      if (
        typeof window !== 'undefined' &&
        'speechSynthesis' in window
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isEn]);

  useEffect(() => {
    const sequence = isEn
      ? [
          {
            step: 'LOOKING' as GuidanceStep,
            text: 'Place the medicine text inside the frame.',
            voice: 'Place the medicine text inside the frame.',
            delay: 1500,
          },
          {
            step: 'MOVE_RIGHT' as GuidanceStep,
            text: 'Move the camera slightly to the right if needed.',
            voice: 'Move the camera slightly to the right if needed.',
            delay: 2500,
          },
          {
            step: 'MOVE_CLOSER' as GuidanceStep,
            text: 'Hold steady and move a little closer.',
            voice: 'Hold steady and move a little closer.',
            delay: 2500,
          },
          {
            step: 'HOLD_STEADY' as GuidanceStep,
            text: 'Ready. Tap the camera button to read the text.',
            voice: 'Ready. Tap the camera button to read the text.',
            delay: 1500,
          },
        ]
      : [
          {
            step: 'LOOKING' as GuidanceStep,
            text: 'दवा पर लिखा नाम फ्रेम के अंदर रखें।',
            voice: 'दवा पर लिखा नाम फ्रेम के अंदर रखें।',
            delay: 1500,
          },
          {
            step: 'MOVE_RIGHT' as GuidanceStep,
            text: 'ज़रूरत हो तो कैमरे को थोड़ा दाईं ओर करें।',
            voice: 'ज़रूरत हो तो कैमरे को थोड़ा दाईं ओर करें।',
            delay: 2500,
          },
          {
            step: 'MOVE_CLOSER' as GuidanceStep,
            text: 'कैमरे को स्थिर रखें और थोड़ा पास लाएँ।',
            voice: 'कैमरे को स्थिर रखें और थोड़ा पास लाएँ।',
            delay: 2500,
          },
          {
            step: 'HOLD_STEADY' as GuidanceStep,
            text: 'तैयार। लिखावट पढ़ने के लिए कैमरा बटन दबाएँ।',
            voice: 'तैयार। लिखावट पढ़ने के लिए कैमरा बटन दबाएँ।',
            delay: 1500,
          },
        ];

    let currentIndex = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const runGuidance = () => {
      const step = sequence[currentIndex];

      if (!step) {
        setGuidanceStep('HOLD_STEADY');
        setGuidanceText(
          isEn
            ? 'Ready. Tap the camera button to read the text.'
            : 'तैयार। लिखावट पढ़ने के लिए कैमरा बटन दबाएँ।'
        );
        return;
      }

      setGuidanceStep(step.step);
      setGuidanceText(step.text);
      speakGuide(step.voice);

      timer = setTimeout(() => {
        currentIndex += 1;
        runGuidance();
      }, step.delay);
    };

    runGuidance();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [scanMode, voiceEnabled, language, guidanceCycle]);

  const handleCapture = async () => {
    if (isScanning) return;

    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setScanError(
        isEn
          ? 'The camera is not ready. Check camera permission and try again.'
          : 'कैमरा तैयार नहीं है। कैमरे की अनुमति जाँचें और फिर कोशिश करें।'
      );
      return;
    }

    setIsScanning(true);
    setScanError('');
    setGuidanceStep('CAPTURED');
    setGuidanceText(
      isEn ? 'Reading text from the image...' : 'तस्वीर से लिखावट पढ़ी जा रही है...'
    );

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not prepare the camera image.');
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng');

      let recognizedText = '';

      try {
        const result = await worker.recognize(canvas);
        recognizedText = result.data.text.trim();
      } finally {
        await worker.terminate();
      }

      if (!recognizedText) {
        setScanError(
          isEn
            ? 'No readable text was found. Move closer, improve the lighting, and try again.'
            : 'पढ़ने योग्य लिखावट नहीं मिली। कैमरे को पास लाएँ, रोशनी बेहतर करें और फिर कोशिश करें।'
        );
        setGuidanceStep('LOOKING');
        setGuidanceText(
          isEn ? 'Try scanning the medicine again.' : 'दवा को फिर से स्कैन करें।'
        );
        return;
      }

      onScanComplete(scanMode, recognizedText);
    } catch (error) {
      console.error('OCR scan failed:', error);
      setScanError(
        isEn
          ? 'Text scanning failed. Check your connection and try again.'
          : 'लिखावट स्कैन नहीं हो सकी। इंटरनेट कनेक्शन जाँचकर फिर कोशिश करें।'
      );
      setGuidanceStep('LOOKING');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950 text-white select-none">
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 bg-linear-to-b from-black/80 to-transparent">
        <button
          type="button"
          onClick={onBack}
          aria-label={isEn ? 'Go back' : 'वापस जाएँ'}
          className="rounded-full bg-white/20 p-2.5 backdrop-blur-md active:scale-95 transition-all text-white"
        >
          <ArrowLeft className="size-5" />
        </button>

        <div className="flex rounded-full bg-black/50 p-1 border border-white/20 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setScanMode('strip_expiry')}
            className={`rounded-full px-3 py-1 text-xs font-black transition-all ${
              scanMode === 'strip_expiry'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isEn ? 'Strip & Expiry' : 'स्ट्रिप और एक्सपायरी'}
          </button>
          <button
            type="button"
            onClick={() => setScanMode('prescription')}
            className={`rounded-full px-3 py-1 text-xs font-black transition-all ${
              scanMode === 'prescription'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isEn ? 'Prescription' : 'डॉक्टर का पर्चा'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            if (
              voiceEnabled &&
              typeof window !== 'undefined' &&
              'speechSynthesis' in window
            ) {
              window.speechSynthesis.cancel();
            }
            setVoiceEnabled((enabled) => !enabled);
          }}
          className={`rounded-full p-2.5 backdrop-blur-md transition-all active:scale-95 ${
            voiceEnabled
              ? 'bg-emerald-600 text-white'
              : 'bg-white/20 text-slate-300'
          }`}
          title={
            isEn
              ? 'Toggle Voice Guidance'
              : 'आवाज़ संबंधी निर्देश चालू/बंद करें'
          }
          aria-label={
            isEn ? 'Toggle voice guidance' : 'आवाज़ संबंधी निर्देश बदलें'
          }
        >
          {voiceEnabled ? (
            <Volume2 className="size-5" />
          ) : (
            <VolumeX className="size-5" />
          )}
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 size-full object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80 pointer-events-none" />

        <div
          className={`relative z-20 flex size-72 flex-col items-center justify-between rounded-3xl border-4 p-4 transition-all duration-300 ${
            guidanceStep === 'HOLD_STEADY'
              ? 'border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.5)] scale-105'
              : guidanceStep === 'MOVE_RIGHT' ||
                  guidanceStep === 'MOVE_CLOSER'
                ? 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)]'
                : 'border-white/60 shadow-2xl'
          }`}
        >
          <div className="flex w-full items-center justify-between">
            <span className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-black uppercase text-white/80">
              {isEn ? 'Text Scanner' : 'लिखावट स्कैनर'}
            </span>
            {guidanceStep === 'HOLD_STEADY' && (
              <span className="flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                <Sparkles className="size-3" />
                {isEn ? 'Ready' : 'तैयार'}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center justify-center">
            {isScanning ? (
              <div className="flex size-20 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-black shadow-2xl animate-pulse">
                {isEn ? 'Reading…' : 'पढ़ रहा है…'}
              </div>
            ) : guidanceStep === 'MOVE_RIGHT' ? (
              <div className="flex items-center gap-2 rounded-2xl bg-amber-500/90 px-4 py-2 text-slate-950 font-black text-sm shadow-xl animate-bounce">
                <span>{isEn ? 'Pan Right' : 'दाईं ओर करें'}</span>
                <ChevronRight className="size-5 stroke-[3]" />
              </div>
            ) : guidanceStep === 'MOVE_CLOSER' ? (
              <div className="flex items-center gap-2 rounded-2xl bg-amber-500/90 px-4 py-2 text-slate-950 font-black text-sm shadow-xl">
                <Maximize2 className="size-4 stroke-[3]" />
                <span>{isEn ? 'Move Closer' : 'पास लाएँ'}</span>
              </div>
            ) : guidanceStep === 'HOLD_STEADY' ? (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-white font-black text-sm shadow-xl">
                <CheckCircle2 className="size-5" />
                <span>{isEn ? 'Hold Steady' : 'स्थिर रखें'}</span>
              </div>
            ) : (
              <Camera className="size-12 text-white/40 animate-pulse" />
            )}
          </div>

          <div className="w-full text-center">
            <span className="text-[11px] font-medium text-white/70">
              {scanMode === 'strip_expiry'
                ? isEn
                  ? 'Keep medicine text in the frame'
                  : 'दवा की लिखावट फ्रेम में रखें'
                : isEn
                  ? 'Keep prescription text in the frame'
                  : 'पर्चे की लिखावट फ्रेम में रखें'}
            </span>
          </div>
        </div>

        <div className="absolute inset-x-4 bottom-28 z-30 flex items-center justify-center">
          <div className="flex items-center gap-2.5 rounded-2xl bg-black/80 px-4 py-3 text-center border border-white/20 backdrop-blur-md shadow-2xl max-w-sm">
            <Volume2 className="size-4 shrink-0 text-emerald-400" />
            <p className="text-xs font-bold text-white tracking-wide">
              {guidanceText}
            </p>
          </div>
        </div>

        {scanError && (
          <div
            role="alert"
            className="absolute inset-x-4 bottom-4 z-40 rounded-xl border border-red-300 bg-red-950/90 p-3 text-center text-xs font-semibold text-white"
          >
            {scanError}
          </div>
        )}
      </div>

      <div className="relative z-30 flex items-center justify-around bg-black/90 p-6 border-t border-white/10 pb-10">
        <button
          type="button"
          disabled={isScanning}
          onClick={() => {
            setScanError('');
            setGuidanceCycle((cycle) => cycle + 1);
            setGuidanceStep('LOOKING');
            setGuidanceText(
              isEn
                ? 'Position the medicine text inside the frame.'
                : 'दवा पर लिखा नाम फ्रेम के अंदर रखें।'
            );
            speakGuide(
              isEn
                ? 'Position the medicine text inside the frame.'
                : 'दवा पर लिखा नाम फ्रेम के अंदर रखें।'
            );
          }}
          className="flex flex-col items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white disabled:opacity-50"
        >
          <RotateCcw className="size-5" />
          <span>{isEn ? 'Reset' : 'रीसेट करें'}</span>
        </button>

        <button
          type="button"
          disabled={isScanning}
          onClick={handleCapture}
          aria-label={isEn ? 'Capture and read text' : 'फोटो लेकर लिखावट पढ़ें'}
          className="flex size-18 items-center justify-center rounded-full bg-white p-1 shadow-2xl ring-4 ring-emerald-500/50 active:scale-95 transition-all disabled:opacity-60"
        >
          <div className="size-14 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center">
            <Camera className="size-7 text-white" />
          </div>
        </button>

        <div className="w-10" />
      </div>
    </div>
  );
}
