'use client';

import React, { useState } from 'react';
import { Heart, Volume2, Globe, ArrowRight, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { Logo } from './logo';

interface WelcomeScreenProps {
  language: string;
  setLanguage: (lang: string) => void;
  onSelectElderly: () => void;
  onSelectVisuallyImpaired: () => void;
}

const LANGUAGES = [
  { code: 'hi', label: 'हिंदी', sub: 'Hindi' },
  { code: 'en', label: 'English', sub: 'English' },
  { code: 'mr', label: 'मराठी', sub: 'Marathi' },
  { code: 'bn', label: 'বাংলা', sub: 'Bengali' },
];

export function WelcomeScreen({
  language,
  setLanguage,
  onSelectElderly,
  onSelectVisuallyImpaired,
}: WelcomeScreenProps) {
  const [fontScale, setFontScale] = useState(1);

  const t = {
    hi: {
      tag: 'आपका डिजिटल साथी',
      title: 'संजीवनी में आपका स्वागत है',
      subtitle: 'बुजुर्गों और देखभाल करने वालों के लिए आसान, सुरक्षित और मददगार ऐप',
      langTitle: 'अपनी भाषा चुनें (Choose Language)',
      modeTitle: 'आप ऐप का उपयोग कैसे करना चाहते हैं?',
      seniorBtnTitle: 'सीनियर सिटिजन मोड',
      seniorBtnSub: 'बड़े अक्षर, सरल डैशबोर्ड, दवाई और डॉक्टर की याद दिलाने वाला',
      voiceBtnTitle: 'आवाज़ / वॉइस-असिस्टेंट मोड',
      voiceBtnSub: 'कम दृष्टि या बिना पढ़े सिर्फ बोलकर उपयोग करने के लिए',
      secureNote: '100% सुरक्षित और उपयोग में आसान',
    },
    en: {
      tag: 'Your Digital Companion',
      title: 'Welcome to Sanjeevani',
      subtitle: 'Simple, secure & helpful app for seniors and caregivers',
      langTitle: 'Choose Your Language',
      modeTitle: 'How would you like to use the app?',
      seniorBtnTitle: 'Senior Citizen Mode',
      seniorBtnSub: 'Large text, clear dashboard, medicine & checkup reminders',
      voiceBtnTitle: 'Voice / Screen-Free Mode',
      voiceBtnSub: 'Optimized for speech input, low-vision or audio guidance',
      secureNote: '100% Safe, Private & Easy to Use',
    },
    mr: {
      tag: 'तुमचा डिजिटल साथीदार',
      title: 'संजीवनी मध्ये आपले स्वागत आहे',
      subtitle: 'ज्येष्ठ नागरिकांसाठी आणि काळजीवाहकांसाठी सुलभ व सुरक्षित ॲप',
      langTitle: 'भाषा निवडा (Choose Language)',
      modeTitle: 'तुम्हाला ॲप कसे वापरायचे आहे?',
      seniorBtnTitle: 'ज्येष्ठ नागरिक मोड',
      seniorBtnSub: 'मोठी अक्षरे, साधे डॅशबोर्ड आणि औषधांची आठवण',
      voiceBtnTitle: 'आवाज / व्हॉइस-असिस्टंट मोड',
      voiceBtnSub: 'फक्त बोलून चालवण्यासाठी अनुकूल',
      secureNote: '100% सुरक्षित आणि सोपे',
    },
    bn: {
      tag: 'আপনার ডিজিটাল সঙ্গী',
      title: 'সঞ্জীবনী-তে আপনাকে স্বাগতম',
      subtitle: 'প্রবীণ এবং যত্নশীলদের জন্য সহজ এবং নিরাপদ অ্যাপ',
      langTitle: 'ভাষা নির্বাচন করুন (Choose Language)',
      modeTitle: 'আপনি কীভাবে অ্যাপটি ব্যবহার করতে চান?',
      seniorBtnTitle: 'সিনিয়র সিটিজেন মোড',
      seniorBtnSub: 'বড় টেক্সট, সাধারণ ড্যাশবোর্ড এবং ওষুধের রিমাইন্ডার',
      voiceBtnTitle: 'ভয়েস / স্পিচ মোড',
      voiceBtnSub: 'কথা বলে সহজে ব্যবহার করার জন্য',
      secureNote: '১০০% নিরাপদ এবং ব্যবহার করা সহজ',
    },
  }[language as 'hi' | 'en' | 'mr' | 'bn'] || {
    tag: 'Your Digital Companion',
    title: 'Welcome to Sanjeevani',
    subtitle: 'Simple, secure & helpful app for seniors and caregivers',
    langTitle: 'Choose Your Language',
    modeTitle: 'How would you like to use the app?',
    seniorBtnTitle: 'Senior Citizen Mode',
    seniorBtnSub: 'Large text, clear dashboard, medicine & checkup reminders',
    voiceBtnTitle: 'Voice / Screen-Free Mode',
    voiceBtnSub: 'Optimized for speech input, low-vision or audio guidance',
    secureNote: '100% Safe, Private & Easy to Use',
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f8fafc] text-slate-800 pb-10 select-none"
      style={{ zoom: fontScale }}
    >
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <Logo size="sm" />

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFontScale((s) => Math.max(0.9, s - 0.05))}
            className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
            title="Decrease font"
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => setFontScale((s) => Math.min(1.2, s + 0.05))}
            className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
            title="Increase font"
          >
            A+
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-6 space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 p-6 text-white shadow-xl text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-emerald-100 backdrop-blur-xs">
            <Sparkles className="size-3.5 text-amber-300" />
            {t.tag}
          </div>
          <h2 className="text-2xl font-black tracking-tight">{t.title}</h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed max-w-xs mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Globe className="size-4 text-emerald-600" />
            <span>{t.langTitle}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`flex items-center justify-between rounded-2xl border p-3 text-left transition-all ${
                  language === l.code
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <p className="text-sm font-black text-slate-900">{l.label}</p>
                  <p className="text-[10px] font-semibold text-slate-400">{l.sub}</p>
                </div>
                {language === l.code && (
                  <div className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold text-slate-700">{t.modeTitle}</p>

          <button
            type="button"
            onClick={onSelectElderly}
            className="group flex w-full items-center gap-4 rounded-2xl border-2 border-emerald-500/80 bg-white p-4 text-left shadow-sm hover:border-emerald-600 hover:shadow-md active:scale-98 transition-all"
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserCheck className="size-7" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                {t.seniorBtnTitle}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {t.seniorBtnSub}
              </p>
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700">
              <ArrowRight className="size-4" />
            </div>
          </button>

          <button
            type="button"
            onClick={onSelectVisuallyImpaired}
            className="group flex w-full items-center gap-4 rounded-2xl border-2 border-blue-400/80 bg-white p-4 text-left shadow-sm hover:border-blue-600 hover:shadow-md active:scale-98 transition-all"
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Volume2 className="size-7" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                {t.voiceBtnTitle}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {t.voiceBtnSub}
              </p>
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700">
              <ArrowRight className="size-4" />
            </div>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-slate-500">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>{t.secureNote}</span>
        </div>
      </main>
    </div>
  );
}
