'use client';

import React, { useState } from 'react';
import { ArrowLeft, HeartPulse, Check, Save } from 'lucide-react';

interface DailyWellbeingScreenProps {
  onBack: () => void;
  language: string;
}

const COPY: Record<
  string,
  {
    back: string;
    title: string;
    feelingQuestion: string;
    moods: { happy: string; okay: string; low: string };
    sleep: string;
    hours: string;
    decreaseSleep: string;
    increaseSleep: string;
    walk: string;
    minutes: string;
    decreaseWalk: string;
    increaseWalk: string;
    notesTitle: string;
    notesPlaceholder: string;
    saved: string;
    save: string;
  }
> = {
  en: {
    back: 'Go back',
    title: 'Daily Wellbeing',
    feelingQuestion: 'How are you feeling today?',
    moods: { happy: 'Good', okay: 'Okay', low: 'Tired / Low' },
    sleep: 'Sleep Last Night',
    hours: 'Hours',
    decreaseSleep: 'Decrease sleep hours',
    increaseSleep: 'Increase sleep hours',
    walk: 'Light Walk / Yoga',
    minutes: 'Mins',
    decreaseWalk: 'Decrease walking time',
    increaseWalk: 'Increase walking time',
    notesTitle: 'Add Doctor / Daily Health Notes',
    notesPlaceholder:
      'e.g. Mild headache after lunch, blood pressure checked normal 120/80...',
    saved: 'Wellbeing Logged!',
    save: "Save Today's Entry",
  },
  hi: {
    back: 'वापस जाएँ',
    title: 'दैनिक स्वास्थ्य',
    feelingQuestion: 'आज आप कैसा महसूस कर रहे हैं?',
    moods: { happy: 'अच्छा', okay: 'ठीक', low: 'थका / उदास' },
    sleep: 'पिछली रात की नींद',
    hours: 'घंटे',
    decreaseSleep: 'नींद के घंटे घटाएँ',
    increaseSleep: 'नींद के घंटे बढ़ाएँ',
    walk: 'हल्की सैर / योग',
    minutes: 'मिनट',
    decreaseWalk: 'सैर का समय घटाएँ',
    increaseWalk: 'सैर का समय बढ़ाएँ',
    notesTitle: 'डॉक्टर / दैनिक स्वास्थ्य नोट जोड़ें',
    notesPlaceholder:
      'जैसे: दोपहर के भोजन के बाद हल्का सिरदर्द, रक्तचाप सामान्य 120/80...',
    saved: 'स्वास्थ्य दर्ज हो गया!',
    save: 'आज की जानकारी सहेजें',
  },
  mr: {
    back: 'मागे जा',
    title: 'दैनिक आरोग्य',
    feelingQuestion: 'आज तुम्हाला कसे वाटत आहे?',
    moods: { happy: 'छान', okay: 'ठीक', low: 'थकवा / उदास' },
    sleep: 'काल रात्रीची झोप',
    hours: 'तास',
    decreaseSleep: 'झोपेचे तास कमी करा',
    increaseSleep: 'झोपेचे तास वाढवा',
    walk: 'हलके चालणे / योग',
    minutes: 'मिनिटे',
    decreaseWalk: 'चालण्याचा वेळ कमी करा',
    increaseWalk: 'चालण्याचा वेळ वाढवा',
    notesTitle: 'डॉक्टर / दैनंदिन आरोग्याच्या नोंदी जोडा',
    notesPlaceholder:
      'उदा. दुपारच्या जेवणानंतर सौम्य डोकेदुखी, रक्तदाब सामान्य 120/80...',
    saved: 'आरोग्याची नोंद जतन झाली!',
    save: 'आजची नोंद जतन करा',
  },
  bn: {
    back: 'ফিরে যান',
    title: 'দৈনিক সুস্থতা',
    feelingQuestion: 'আজ আপনার কেমন লাগছে?',
    moods: { happy: 'ভালো', okay: 'ঠিক আছে', low: 'ক্লান্ত / মন খারাপ' },
    sleep: 'গত রাতের ঘুম',
    hours: 'ঘণ্টা',
    decreaseSleep: 'ঘুমের সময় কমান',
    increaseSleep: 'ঘুমের সময় বাড়ান',
    walk: 'হালকা হাঁটা / যোগব্যায়াম',
    minutes: 'মিনিট',
    decreaseWalk: 'হাঁটার সময় কমান',
    increaseWalk: 'হাঁটার সময় বাড়ান',
    notesTitle: 'ডাক্তার / দৈনিক স্বাস্থ্যের নোট যোগ করুন',
    notesPlaceholder:
      'যেমন: দুপুরের খাবারের পর হালকা মাথাব্যথা, রক্তচাপ স্বাভাবিক ১২০/৮০...',
    saved: 'সুস্থতার তথ্য নথিভুক্ত হয়েছে!',
    save: 'আজকের তথ্য সংরক্ষণ করুন',
  },
};

const MOODS = [
  {
    id: 'happy',
    icon: '😊',
    color: 'bg-emerald-100 border-emerald-500 text-emerald-800',
  },
  {
    id: 'okay',
    icon: '😐',
    color: 'bg-amber-100 border-amber-500 text-amber-800',
  },
  {
    id: 'sad',
    icon: '😔',
    color: 'bg-rose-100 border-rose-500 text-rose-800',
  },
] as const;

export function DailyWellbeingScreen({
  onBack,
  language,
}: DailyWellbeingScreenProps) {
  const t = COPY[language] ?? COPY.hi;

  const [selectedMood, setSelectedMood] = useState('happy');
  const [sleepHours, setSleepHours] = useState(7);
  const [walkMinutes, setWalkMinutes] = useState(20);
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const getMoodLabel = (moodId: string) => {
    if (moodId === 'happy') return t.moods.happy;
    if (moodId === 'okay') return t.moods.okay;
    return t.moods.low;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] text-slate-800 pb-12 select-none">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          aria-label={t.back}
          className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>

        <h2 className="text-sm font-bold text-slate-900">{t.title}</h2>
        <div className="w-10" />
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <HeartPulse className="size-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900">
              {t.feelingQuestion}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() => setSelectedMood(mood.id)}
                aria-pressed={selectedMood === mood.id}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-all ${
                  selectedMood === mood.id
                    ? `${mood.color} shadow-sm font-black`
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="text-3xl">{mood.icon}</span>
                <span className="text-[11px] font-bold">
                  {getMoodLabel(mood.id)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500">
              {t.sleep}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
                {sleepHours}
              </span>
              <span className="text-xs text-slate-600">{t.hours}</span>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSleepHours((p) => Math.max(1, p - 1))}
                aria-label={t.decreaseSleep}
                className="size-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-700"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setSleepHours((p) => Math.min(14, p + 1))}
                aria-label={t.increaseSleep}
                className="size-7 rounded-lg bg-emerald-600 text-xs font-bold text-white"
              >
                +
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500">
              {t.walk}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
                {walkMinutes}
              </span>
              <span className="text-xs text-slate-600">{t.minutes}</span>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setWalkMinutes((p) => Math.max(0, p - 5))}
                aria-label={t.decreaseWalk}
                className="size-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-700"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setWalkMinutes((p) => p + 5)}
                aria-label={t.increaseWalk}
                className="size-7 rounded-lg bg-emerald-600 text-xs font-bold text-white"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs"
        >
          <h3 className="text-xs font-bold text-slate-900">{t.notesTitle}</h3>

          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.notesPlaceholder}
            aria-label={t.notesTitle}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-xs font-black text-white shadow-md hover:bg-emerald-800 active:scale-98 transition-all"
          >
            {isSaved ? (
              <Check className="size-4" />
            ) : (
              <Save className="size-4" />
            )}
            {isSaved ? t.saved : t.save}
          </button>
        </form>
      </main>
    </div>
  );
}
