'use client';

import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface TalkBackContextType {
  isEnabled: boolean;
  toggleTalkBack: () => void;
  speak: (text: string) => void;
  language: string;
}

const TalkBackContext = createContext<TalkBackContextType>({
  isEnabled: false,
  toggleTalkBack: () => {},
  speak: () => {},
  language: 'hi',
});

export const useTalkBack = () => useContext(TalkBackContext);

interface TalkBackProviderProps {
  children: React.ReactNode;
  language: string;
}

const VOICE_LOCALES: Record<string, string> = {
  hi: 'hi-IN',
  en: 'en-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
};

const TALKBACK_TEXT: Record<
  string,
  { title: string; on: string; off: string }
> = {
  hi: {
    title: 'ऑडियो गाइड',
    on: 'ऑडियो गाइड चालू है',
    off: 'ऑडियो गाइड बंद है',
  },
  en: {
    title: 'Audio Guide',
    on: 'Audio guide is on',
    off: 'Audio guide is off',
  },
  mr: {
    title: 'ऑडिओ मार्गदर्शक',
    on: 'ऑडिओ मार्गदर्शक सुरू आहे',
    off: 'ऑडिओ मार्गदर्शक बंद आहे',
  },
  bn: {
    title: 'অডিও গাইড',
    on: 'অডিও গাইড চালু আছে',
    off: 'অডিও গাইড বন্ধ আছে',
  },
};

export function TalkBackProvider({
  children,
  language,
}: TalkBackProviderProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  const copy = TALKBACK_TEXT[language] ?? TALKBACK_TEXT.hi;
  const voiceLocale = VOICE_LOCALES[language] ?? 'hi-IN';

  const speak = (text: string) => {
    if (
      !isEnabled ||
      typeof window === 'undefined' ||
      !('speechSynthesis' in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLocale;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const toggleTalkBack = () => {
    const next = !isEnabled;
    setIsEnabled(next);

    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(
        next ? copy.on : copy.off
      );
      utterance.lang = voiceLocale;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <TalkBackContext.Provider
      value={{ isEnabled, toggleTalkBack, speak, language }}
    >
      {children}

      <button
        type="button"
        onClick={toggleTalkBack}
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-2xl transition-all active:scale-95 border-2 ${
          isEnabled
            ? 'bg-amber-400 text-slate-900 border-amber-600 ring-4 ring-amber-300/60 font-black'
            : 'bg-slate-900 text-white border-slate-700 font-bold opacity-85 hover:opacity-100'
        }`}
        title={copy.title}
        aria-label={copy.title}
      >
        {isEnabled ? (
          <Volume2 className="size-5 animate-bounce" />
        ) : (
          <VolumeX className="size-5" />
        )}
        <span className="text-xs">
          {isEnabled ? copy.on : copy.title}
        </span>
      </button>
    </TalkBackContext.Provider>
  );
}
