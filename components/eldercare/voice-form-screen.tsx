'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { Logo } from './logo';
import { setStoredProfile } from './state-store';

interface VoiceFormScreenProps {
  language: string;
  onBack: () => void;
  onSubmitSuccess: () => void;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
  isFinal: boolean;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const LOCALES: Record<string, string> = {
  hi: 'hi-IN',
  en: 'en-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
};

const COPY: Record<
  string,
  {
    header: string;
    title: string;
    description: string;
    listeningPrompt: string;
    listening: string;
    tapToSpeak: string;
    detected: string;
    transcript: string;
    name: string;
    age: string;
    city: string;
    namePlaceholder: string;
    agePlaceholder: string;
    cityPlaceholder: string;
    confirm: string;
    unsupported: string;
    permissionError: string;
    recognitionError: string;
    reviewNotice: string;
    listeningStarted: string;
  }
> = {
  en: {
    header: 'Voice Setup',
    title: 'Speak Your Details',
    description:
      'Tap the microphone and say your name, age, and city. Check the transcript and edit any field before confirming.',
    listeningPrompt: 'Listening. Please say your details.',
    listening: 'Listening… speak clearly',
    tapToSpeak: 'Tap to start speaking',
    detected: 'Review Your Information',
    transcript: 'Recognized speech',
    name: 'Name',
    age: 'Age',
    city: 'City',
    namePlaceholder: 'Enter your name',
    agePlaceholder: 'Enter your age',
    cityPlaceholder: 'Enter your city',
    confirm: 'Confirm & Open Dashboard',
    unsupported:
      'Speech recognition is not supported in this browser. You can enter the details below.',
    permissionError:
      'Microphone access was not granted. Check browser permissions or enter the details below.',
    recognitionError:
      'Speech could not be recognized. Please try again or enter the details below.',
    reviewNotice:
      'Speech recognition may make mistakes. Please review and correct your details.',
    listeningStarted: 'Listening started.',
  },
  hi: {
    header: 'वॉइस सेटअप',
    title: 'बोलकर अपनी जानकारी दें',
    description:
      'माइक्रोफ़ोन दबाकर अपना नाम, उम्र और शहर बोलें। पुष्टि करने से पहले लिखावट जाँचें और ज़रूरत हो तो सुधारें।',
    listeningPrompt: 'सुन रहे हैं। कृपया अपनी जानकारी बोलें।',
    listening: 'सुन रहे हैं… स्पष्ट बोलें',
    tapToSpeak: 'बोलना शुरू करने के लिए टैप करें',
    detected: 'अपनी जानकारी जाँचें',
    transcript: 'पहचानी गई आवाज़',
    name: 'नाम',
    age: 'उम्र',
    city: 'शहर',
    namePlaceholder: 'अपना नाम लिखें',
    agePlaceholder: 'अपनी उम्र लिखें',
    cityPlaceholder: 'अपने शहर का नाम लिखें',
    confirm: 'पुष्टि करें और डैशबोर्ड खोलें',
    unsupported:
      'इस ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। नीचे जानकारी टाइप कर सकते हैं।',
    permissionError:
      'माइक्रोफ़ोन की अनुमति नहीं मिली। ब्राउज़र अनुमति जाँचें या नीचे जानकारी टाइप करें।',
    recognitionError:
      'आवाज़ समझ नहीं आई। फिर कोशिश करें या नीचे जानकारी टाइप करें।',
    reviewNotice:
      'आवाज़ पहचान में गलती हो सकती है। कृपया जानकारी जाँचकर सुधारें।',
    listeningStarted: 'सुनना शुरू हो गया है।',
  },
  mr: {
    header: 'व्हॉइस सेटअप',
    title: 'बोलून तुमची माहिती द्या',
    description:
      'मायक्रोफोन दाबून तुमचे नाव, वय आणि शहर सांगा. पुष्टी करण्यापूर्वी मजकूर तपासा आणि गरज असल्यास दुरुस्त करा.',
    listeningPrompt: 'ऐकत आहे. कृपया तुमची माहिती सांगा.',
    listening: 'ऐकत आहे… स्पष्ट बोला',
    tapToSpeak: 'बोलण्यासाठी टॅप करा',
    detected: 'तुमची माहिती तपासा',
    transcript: 'ओळखलेले बोलणे',
    name: 'नाव',
    age: 'वय',
    city: 'शहर',
    namePlaceholder: 'तुमचे नाव लिहा',
    agePlaceholder: 'तुमचे वय लिहा',
    cityPlaceholder: 'तुमच्या शहराचे नाव लिहा',
    confirm: 'पुष्टी करून डॅशबोर्ड उघडा',
    unsupported:
      'या ब्राउझरमध्ये आवाज ओळख उपलब्ध नाही. खाली माहिती टाइप करू शकता.',
    permissionError:
      'मायक्रोफोनची परवानगी मिळाली नाही. ब्राउझरची परवानगी तपासा किंवा खाली माहिती टाइप करा.',
    recognitionError:
      'आवाज समजला नाही. पुन्हा प्रयत्न करा किंवा खाली माहिती टाइप करा.',
    reviewNotice:
      'आवाज ओळखण्यात चुका होऊ शकतात. कृपया माहिती तपासून दुरुस्त करा.',
    listeningStarted: 'ऐकणे सुरू झाले आहे.',
  },
  bn: {
    header: 'ভয়েস সেটআপ',
    title: 'কথা বলে আপনার তথ্য দিন',
    description:
      'মাইক্রোফোনে ট্যাপ করে আপনার নাম, বয়স ও শহর বলুন। নিশ্চিত করার আগে লেখা দেখে প্রয়োজন হলে সংশোধন করুন।',
    listeningPrompt: 'শুনছি। অনুগ্রহ করে আপনার তথ্য বলুন।',
    listening: 'শুনছি… স্পষ্ট করে বলুন',
    tapToSpeak: 'কথা বলা শুরু করতে ট্যাপ করুন',
    detected: 'আপনার তথ্য যাচাই করুন',
    transcript: 'চেনা কথা',
    name: 'নাম',
    age: 'বয়স',
    city: 'শহর',
    namePlaceholder: 'আপনার নাম লিখুন',
    agePlaceholder: 'আপনার বয়স লিখুন',
    cityPlaceholder: 'আপনার শহরের নাম লিখুন',
    confirm: 'নিশ্চিত করে ড্যাশবোর্ড খুলুন',
    unsupported:
      'এই ব্রাউজারে কথা শনাক্তকরণ সমর্থিত নয়। নিচে তথ্য টাইপ করতে পারেন।',
    permissionError:
      'মাইক্রোফোনের অনুমতি পাওয়া যায়নি। ব্রাউজারের অনুমতি পরীক্ষা করুন অথবা নিচে তথ্য টাইপ করুন।',
    recognitionError:
      'কথা শনাক্ত করা যায়নি। আবার চেষ্টা করুন অথবা নিচে তথ্য টাইপ করুন।',
    reviewNotice:
      'কথা শনাক্তকরণে ভুল হতে পারে। অনুগ্রহ করে তথ্য যাচাই করে সংশোধন করুন।',
    listeningStarted: 'শোনা শুরু হয়েছে।',
  },
};

function extractAge(transcript: string): string {
  const match = transcript.match(/\b(\d{1,3})\b/);
  if (!match) return '';

  const age = Number(match[1]);
  return age >= 1 && age <= 120 ? String(age) : '';
}

function extractName(transcript: string, language: string): string {
  const patterns: Record<string, RegExp> = {
    en: /(?:my name is|i am)\s+(.+?)(?=\s+(?:i am|age|aged|from|city)\b|[,.;]|$)/i,
    hi: /(?:मेरा नाम|मेरा नाम है)\s+(.+?)(?=\s+(?:मेरी उम्र|उम्र|मैं|शहर)\b|[,।;]|$)/i,
    mr: /(?:माझे नाव|माझं नाव|माझे नाव आहे)\s+(.+?)(?=\s+(?:माझे वय|वय|मी|शहर)\b|[,।;]|$)/i,
    bn: /(?:আমার নাম)\s+(.+?)(?=\s+(?:বয়স|বয়স|আমি|শহর)\b|[,।;]|$)/i,
  };

  const match = transcript.match(patterns[language] ?? patterns.en);
  return match?.[1]?.trim() ?? '';
}

export function VoiceFormScreen({
  language,
  onBack,
  onSubmitSuccess,
}: VoiceFormScreenProps) {
  const t = COPY[language] ?? COPY.hi;
  const locale = LOCALES[language] ?? 'hi-IN';

  const [isListening, setIsListening] = useState(false);
  const [spokenName, setSpokenName] = useState('');
  const [spokenAge, setSpokenAge] = useState('');
  const [spokenCity, setSpokenCity] = useState('');
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const toggleListening = () => {
    setErrorMessage('');

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const browserWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    const Recognition =
      browserWindow.SpeechRecognition ??
      browserWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setErrorMessage(t.unsupported);
      return;
    }

    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.lang = locale;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex];
      const recognized = result?.[0]?.transcript?.trim() ?? '';

      if (!recognized) {
        setErrorMessage(t.recognitionError);
        return;
      }

      setTranscript(recognized);

      const extractedName = extractName(recognized, language);
      const extractedAge = extractAge(recognized);

      if (extractedName) setSpokenName(extractedName);
      if (extractedAge) setSpokenAge(extractedAge);
    };

    recognition.onerror = (event) => {
      setIsListening(false);

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setErrorMessage(t.permissionError);
      } else {
        setErrorMessage(t.recognitionError);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
      setIsListening(true);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(t.listeningStarted);
        utterance.lang = locale;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Could not start speech recognition:', error);
      setIsListening(false);
      setErrorMessage(t.recognitionError);
    }
  };

  const handleFinish = () => {
    if (!spokenName.trim() || !spokenAge.trim() || !spokenCity.trim()) {
      setErrorMessage(
        language === 'en'
          ? 'Please enter your name, age, and city before continuing.'
          : language === 'mr'
            ? 'पुढे जाण्यापूर्वी नाव, वय आणि शहर भरा.'
            : language === 'bn'
              ? 'এগোনোর আগে নাম, বয়স ও শহর লিখুন।'
              : 'आगे बढ़ने से पहले नाम, उम्र और शहर भरें।'
      );
      return;
    }

    setStoredProfile({
      name: spokenName.trim(),
      age: spokenAge.trim(),
      city: spokenCity.trim(),
      avatar: '👵',
    });

    onSubmitSuccess();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#022c22] text-white pb-12 select-none">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-900 bg-[#064e3b] px-4 py-3 shadow-md">
        <button
          type="button"
          onClick={onBack}
          aria-label={language === 'en' ? 'Go back' : language === 'mr' ? 'मागे जा' : language === 'bn' ? 'ফিরে যান' : 'वापस जाएँ'}
          className="flex size-10 items-center justify-center rounded-xl bg-emerald-800 text-white hover:bg-emerald-700"
        >
          <ArrowLeft className="size-5" />
        </button>
        <span className="text-sm font-black tracking-wide text-emerald-200">
          {t.header}
        </span>
        <div className="w-10" />
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-5 pt-8 text-center flex flex-col justify-between">
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-emerald-100">{t.title}</h2>
          <p className="text-xs text-emerald-300 max-w-xs mx-auto leading-relaxed">
            {t.description}
          </p>

          <div className="py-8 flex justify-center">
            <button
              type="button"
              onClick={toggleListening}
              aria-label={isListening ? t.listening : t.tapToSpeak}
              className={`relative flex size-32 items-center justify-center rounded-full transition-all shadow-2xl active:scale-95 ${
                isListening
                  ? 'bg-rose-600 ring-8 ring-rose-400/50 animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 ring-8 ring-emerald-500/30'
              }`}
            >
              {isListening ? (
                <MicOff className="size-14 text-white" />
              ) : (
                <Mic className="size-14 text-white" />
              )}
            </button>
          </div>

          <p className="text-xs font-bold text-emerald-200">
            {isListening ? t.listening : t.tapToSpeak}
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-950/40 p-3 text-left text-xs text-amber-100"
          >
            <ShieldAlert className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-emerald-800 bg-[#064e3b]/80 p-4 text-left space-y-3">
          <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            {t.detected}
          </h3>

          <label className="block text-xs text-emerald-100">
            {t.name}
            <input
              value={spokenName}
              onChange={(event) => setSpokenName(event.target.value)}
              placeholder={t.namePlaceholder}
              className="mt-1 w-full rounded-lg border border-emerald-700 bg-emerald-950/50 px-3 py-2 text-sm text-white placeholder:text-emerald-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>

          <label className="block text-xs text-emerald-100">
            {t.age}
            <input
              type="number"
              min="1"
              max="120"
              value={spokenAge}
              onChange={(event) => setSpokenAge(event.target.value)}
              placeholder={t.agePlaceholder}
              className="mt-1 w-full rounded-lg border border-emerald-700 bg-emerald-950/50 px-3 py-2 text-sm text-white placeholder:text-emerald-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>

          <label className="block text-xs text-emerald-100">
            {t.city}
            <input
              value={spokenCity}
              onChange={(event) => setSpokenCity(event.target.value)}
              placeholder={t.cityPlaceholder}
              className="mt-1 w-full rounded-lg border border-emerald-700 bg-emerald-950/50 px-3 py-2 text-sm text-white placeholder:text-emerald-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>

          {transcript && (
            <div>
              <p className="mb-1 text-[10px] font-bold text-emerald-400">
                {t.transcript}
              </p>
              <p className="rounded-lg bg-emerald-950/50 p-2 text-xs text-emerald-100">
                {transcript}
              </p>
            </div>
          )}

          <p className="text-[10px] leading-relaxed text-emerald-300">
            {t.reviewNotice}
          </p>
        </div>

        <div className="pt-6">
          <button
            type="button"
            onClick={handleFinish}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-xs font-black text-emerald-950 shadow-xl hover:bg-emerald-50 active:scale-98 transition-all"
          >
            <Check className="size-4 text-emerald-800" />
            {t.confirm}
          </button>
        </div>
      </main>
    </div>
  );
}
