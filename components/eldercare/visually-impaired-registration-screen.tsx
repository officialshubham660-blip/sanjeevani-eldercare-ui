'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Mic,
  Keyboard,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from './logo';

interface VisuallyImpairedRegistrationProps {
  language: string;
  onBack: () => void;
  onContinue: (mode: 'voice' | 'text') => void;
}

const COPY: Record<
  string,
  {
    back: string;
    audience: string;
    title: string;
    description: string;
    voice: string;
    speakDetails: string;
    text: string;
    typeDetails: string;
    help: string;
    continue: string;
    compatible: string;
  }
> = {
  en: {
    back: 'Back',
    audience: 'For Visually Impaired',
    title: 'Create Your Account',
    description: 'We have made this simple and accessible for you.',
    voice: 'Voice Input',
    speakDetails: 'Speak your details',
    text: 'Text Input',
    typeDetails: 'Type your details',
    help: 'Need Help? Call Support',
    continue: 'Continue',
    compatible: 'Screen reader and audio narration compatible',
  },
  hi: {
    back: 'वापस',
    audience: 'दृष्टिबाधित लोगों के लिए',
    title: 'अपना खाता बनाएँ',
    description: 'हमने इसे आपके लिए आसान और सुलभ बनाया है।',
    voice: 'आवाज़ से जानकारी दें',
    speakDetails: 'अपनी जानकारी बोलें',
    text: 'लिखकर जानकारी दें',
    typeDetails: 'अपनी जानकारी टाइप करें',
    help: 'मदद चाहिए? सहायता केंद्र पर कॉल करें',
    continue: 'आगे बढ़ें',
    compatible: 'स्क्रीन रीडर और ऑडियो वर्णन के अनुकूल',
  },
  mr: {
    back: 'मागे',
    audience: 'दृष्टिहीन व्यक्तींसाठी',
    title: 'तुमचे खाते तयार करा',
    description: 'आम्ही हे तुमच्यासाठी सोपे आणि सुलभ केले आहे.',
    voice: 'आवाजाने माहिती द्या',
    speakDetails: 'तुमची माहिती बोला',
    text: 'मजकूर इनपुट',
    typeDetails: 'तुमची माहिती टाइप करा',
    help: 'मदत हवी आहे? सहाय्य सेवेला कॉल करा',
    continue: 'पुढे जा',
    compatible: 'स्क्रीन रीडर आणि ऑडिओ मार्गदर्शनासाठी अनुकूल',
  },
  bn: {
    back: 'ফিরে যান',
    audience: 'দৃষ্টিপ্রতিবন্ধী ব্যক্তিদের জন্য',
    title: 'আপনার অ্যাকাউন্ট তৈরি করুন',
    description: 'আমরা এটি আপনার জন্য সহজ ও ব্যবহারযোগ্য করেছি।',
    voice: 'কণ্ঠে তথ্য দিন',
    speakDetails: 'আপনার তথ্য বলুন',
    text: 'লিখে তথ্য দিন',
    typeDetails: 'আপনার তথ্য টাইপ করুন',
    help: 'সাহায্য দরকার? সহায়তা কেন্দ্রে ফোন করুন',
    continue: 'এগিয়ে যান',
    compatible: 'স্ক্রিন রিডার ও অডিও নির্দেশনার উপযোগী',
  },
};

export function VisuallyImpairedRegistrationScreen({
  language,
  onBack,
  onContinue,
}: VisuallyImpairedRegistrationProps) {
  const [selectedMode, setSelectedMode] = useState<'voice' | 'text'>('voice');
  const t = COPY[language] ?? COPY.hi;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] text-slate-800 pb-10 select-none">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          aria-label={t.back}
          title={t.back}
          className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>

        <Logo size="sm" />
        <div className="w-10" />
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-5 pt-6 space-y-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <span>{t.audience}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            {t.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
        </div>

        <div className="flex justify-center py-2">
          <div className="flex size-24 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/20">
            <svg
              className="size-14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="4" r="2" />
              <path d="m18 19 1-7-6 1" />
              <path d="m5 8 3-3 5.5 3-2.36 3.5" />
              <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
              <path d="M13.76 17.5a5 5 0 0 0-4-7.5" />
            </svg>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => setSelectedMode('voice')}
            className={`w-full rounded-2xl border-2 p-4 text-left transition-all flex items-center justify-between ${
              selectedMode === 'voice'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`flex size-12 items-center justify-center rounded-xl transition-colors ${
                  selectedMode === 'voice'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Mic className="size-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  {t.voice}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.speakDetails}
                </p>
              </div>
            </div>

            {selectedMode === 'voice' && (
              <CheckCircle2 className="size-5 text-emerald-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setSelectedMode('text')}
            className={`w-full rounded-2xl border-2 p-4 text-left transition-all flex items-center justify-between ${
              selectedMode === 'text'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`flex size-12 items-center justify-center rounded-xl transition-colors ${
                  selectedMode === 'text'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Keyboard className="size-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  {t.text}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.typeDetails}
                </p>
              </div>
            </div>

            {selectedMode === 'text' && (
              <CheckCircle2 className="size-5 text-emerald-600" />
            )}
          </button>
        </div>

        <div className="pt-2">
          <a
            href="tel:14567"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <PhoneCall className="size-4 text-emerald-600" />
            {t.help}
          </a>
        </div>

        <button
          type="button"
          onClick={() => onContinue(selectedMode)}
          className="w-full rounded-xl bg-emerald-700 py-3.5 text-xs font-black text-white shadow-md hover:bg-emerald-800 active:scale-98 transition-all tracking-wide"
        >
          {t.continue}
        </button>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-400">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>{t.compatible}</span>
        </div>
      </main>
    </div>
  );
}
