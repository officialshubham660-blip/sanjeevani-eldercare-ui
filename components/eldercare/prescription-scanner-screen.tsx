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
  ShieldAlert,
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

// Keywords that verify authentic back-side medicine foil/blister strip
const STRIP_VALIDATION_KEYWORDS = [
  'exp', 'expiry', 'mfg', 'mfd', 'batch', 'b.no', 'lot', 'mrp',
  'tab', 'tablet', 'cap', 'capsule', 'mg', 'mcg', 'ml', 'usp', 'ip', 'bp',
  'dosage', 'composition', 'contains', 'protect from', 'storage', 'schedule'
];

// Keywords that verify an authentic doctor slip/prescription
const PRESCRIPTION_VALIDATION_KEYWORDS = [
  'rx', 'dr.', 'dr ', 'doctor', 'clinic', 'hospital', 'patient', 'age', 'sex',
  'diagnosis', 'tab', 'tablet', 'cap', 'capsule', 'syrup', 'mg', 'od', 'bd', 'tds',
  'sos', 'reg. no', 'opd', 'signature', 'date'
];

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

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isEn ? 'en-US' : 'hi-IN';
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis fallback
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera access is not available in this browser.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
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
            text: scanMode === 'strip_expiry'
              ? 'Scan the BACK side of medicine strip showing expiry & salt.'
              : 'Hold doctor prescription slip flat inside the frame.',
            voice: scanMode === 'strip_expiry'
              ? 'Scan the back side of medicine strip showing expiry date.'
              : 'Hold doctor prescription slip inside the frame.',
            delay: 1500,
          },
          {
            step: 'MOVE_CLOSER' as GuidanceStep,
            text: 'Hold steady and ensure lighting is clear.',
            voice: 'Hold steady and ensure lighting is clear.',
            delay: 2000,
          },
          {
            step: 'HOLD_STEADY' as GuidanceStep,
            text: 'Ready. Tap the camera button to scan.',
            voice: 'Ready. Tap the camera button to scan.',
            delay: 1500,
          },
        ]
      : [
          {
            step: 'LOOKING' as GuidanceStep,
            text: scanMode === 'strip_expiry'
              ? 'दवा की पट्टी का पिछला हिस्सा (एक्सपायरी और नाम वाला) रखें।'
              : 'डॉक्टर का पर्चा सीधा और साफ रखें।',
            voice: scanMode === 'strip_expiry'
              ? 'दवा की पट्टी का पिछला हिस्सा रखें।'
              : 'डॉक्टर का पर्चा सीधा रखें।',
            delay: 1500,
          },
          {
            step: 'MOVE_CLOSER' as GuidanceStep,
            text: 'कैमरा स्थिर रखें और लिखावट पर रोशनी आने दें।',
            voice: 'कैमरा स्थिर रखें।',
            delay: 2000,
          },
          {
            step: 'HOLD_STEADY' as GuidanceStep,
            text: 'तैयार। स्कैन करने के लिए कैमरा बटन दबाएँ।',
            voice: 'तैयार। स्कैन करने के लिए कैमरा बटन दबाएँ।',
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
            ? 'Ready. Tap camera button to scan.'
            : 'तैयार। स्कैन करने के लिए कैमरा बटन दबाएँ।'
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
      isEn ? 'Analyzing medical text...' : 'दवा या पर्चे की लिखावट जांची जा रही है...'
    );

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not prepare camera image.');
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

      const lowerText = recognizedText.toLowerCase();

      // STRICT VALIDATION: Ensure it is actually a medicine strip or doctor slip
      if (scanMode === 'strip_expiry') {
        const matchesStrip = STRIP_VALIDATION_KEYWORDS.filter((keyword) =>
          lowerText.includes(keyword)
        );

        if (matchesStrip.length === 0) {
          const failMsg = isEn
            ? 'Invalid Scan: This is not a medicine strip. Please scan the BACK side showing batch, expiry, or salt (mg).'
            : 'गलत स्कैन: यह दवा की पट्टी नहीं है। कृपया दवा का पिछला हिस्सा स्कैन करें जहाँ एक्सपायरी, बैच या mg लिखा हो।';
          setScanError(failMsg);
          speakGuide(failMsg);
          setGuidanceStep('LOOKING');
          return;
        }
      } else {
        const matchesPrescription = PRESCRIPTION_VALIDATION_KEYWORDS.filter((keyword) =>
          lowerText.includes(keyword)
        );

        if (matchesPrescription.length === 0) {
          const failMsg = isEn
            ? "Invalid Scan: Doctor's prescription not detected. Please scan an authentic doctor slip or clinic letterhead."
            : 'गलत स्कैन: डॉक्टर का पर्चा नहीं मिला। कृपया डॉक्टर की पर्ची या क्लिनिक लेटरहेड स्कैन करें।';
          setScanError(failMsg);
          speakGuide(failMsg);
          setGuidanceStep('LOOKING');
          return;
        }
      }

      // Valid medical scan confirmed
      onScanComplete?.(scanMode, recognizedText);
    } catch (error) {
      console.error('OCR scan failed:', error);
      setScanError(
        isEn
          ? 'Scanning failed. Hold steady, ensure clear light, and try again.'
          : 'स्कैन नहीं हो सका। कैमरे को स्थिर रखें और फिर कोशिश करें।'
      );
      setGuidanceStep('LOOKING');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950 text-white select-none">
      {/* Top Controls */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 bg-linear-to-b from-black/80 to-transparent">
        <button
          type="button"
          onClick={onBack}
          aria-label={isEn ? 'Go back' : 'वापस जाएँ'}
          className="rounded-full bg-white/20 p-2.5 backdrop-blur-md active:scale-95 transition-all text-white"
        >
          <ArrowLeft className="size-5" />
        </button>

        <div className="flex rounded-full bg-black/60 p-1 border border-white/20 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setScanMode('strip_expiry');
              setScanError('');
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-black transition-all ${
              scanMode === 'strip_expiry'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isEn ? 'Strip Back & Expiry' : 'दवा का पिछला हिस्सा'}
          </button>
          <button
            type="button"
            onClick={() => {
              setScanMode('prescription');
              setScanError('');
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-black transition-all ${
              scanMode === 'prescription'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isEn ? 'Doctor Slip' : 'डॉक्टर पर्चा'}
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
          title={isEn ? 'Toggle Voice Guidance' : 'आवाज़ बदलें'}
          aria-label={isEn ? 'Toggle voice guidance' : 'आवाज़ बदलें'}
        >
          {voiceEnabled ? (
            <Volume2 className="size-5" />
          ) : (
            <VolumeX className="size-5" />
          )}
        </button>
      </div>

      {/* Video Viewport with Targeting Overlay */}
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
            scanError
              ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)]'
              : guidanceStep === 'HOLD_STEADY'
                ? 'border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.5)] scale-105'
                : 'border-white/60 shadow-2xl'
          }`}
        >
          <div className="flex w-full items-center justify-between">
            <span className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-black uppercase text-white/80">
              {scanMode === 'strip_expiry'
                ? isEn ? 'Back of Strip' : 'दवा का पिछला भाग'
                : isEn ? 'Doctor Prescription' : 'डॉक्टर की पर्ची'}
            </span>
            {guidanceStep === 'HOLD_STEADY' && !scanError && (
              <span className="flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                <Sparkles className="size-3" />
                {isEn ? 'Ready' : 'तैयार'}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center justify-center">
            {isScanning ? (
              <div className="flex size-20 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-black shadow-2xl animate-pulse">
                {isEn ? 'Reading…' : 'जांच जारी…'}
              </div>
            ) : scanError ? (
              <div className="flex items-center gap-2 rounded-2xl bg-red-600/90 px-4 py-2 text-white font-black text-xs shadow-xl text-center">
                <ShieldAlert className="size-5 shrink-0" />
                <span>{isEn ? 'Re-align Strip' : 'दवा सही से रखें'}</span>
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
            <span className="text-[11px] font-semibold text-white/80">
              {scanMode === 'strip_expiry'
                ? isEn
                  ? 'Only scan back foil with Exp & Salt'
                  : 'सिर्फ एक्सपायरी और नाम वाला हिस्सा दिखाएं'
                : isEn
                  ? "Only scan Doctor's signature & Rx"
                  : 'सिर्फ डॉक्टर का लिखा पर्चा दिखाएं'}
            </span>
          </div>
        </div>

        {/* Dynamic Voice/Text Guidance Box */}
        <div className="absolute inset-x-4 bottom-28 z-30 flex items-center justify-center">
          <div className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-center border backdrop-blur-md shadow-2xl max-w-sm ${
            scanError
              ? 'bg-red-950/90 border-red-400 text-red-100'
              : 'bg-black/80 border-white/20 text-white'
          }`}>
            {scanError ? (
              <ShieldAlert className="size-5 shrink-0 text-red-400" />
            ) : (
              <Volume2 className="size-4 shrink-0 text-emerald-400" />
            )}
            <p className="text-xs font-bold tracking-wide">
              {scanError || guidanceText}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Shutter Controls */}
      <div className="relative z-30 flex items-center justify-around bg-black/90 p-6 border-t border-white/10 pb-10">
        <button
          type="button"
          disabled={isScanning}
          onClick={() => {
            setScanError('');
            setGuidanceCycle((cycle) => cycle + 1);
            setGuidanceStep('LOOKING');
          }}
          className="flex flex-col items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white disabled:opacity-50"
        >
          <RotateCcw className="size-5" />
          <span>{isEn ? 'Reset' : 'रीसेट'}</span>
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