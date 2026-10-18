'use client';

import React, { useEffect } from 'react';
import { ArrowLeft, Droplets, Plus, Minus, Bell } from 'lucide-react';
import { getStoredWater, setStoredWater } from './state-store';

interface WaterTrackerScreenProps {
  onBack: () => void;
  waterCount: number;
  setWaterCount: React.Dispatch<React.SetStateAction<number>>;
  language: string;
}

const COPY: Record<
  string,
  {
    title: string;
    glasses: string;
    dailyGoal: string;
    completed: string;
    back: string;
    removeGlass: string;
    addGlass: string;
    totalToday: string;
    nextReminder: string;
    reminder: string;
    todayLog: string;
    glassLabel: string;
  }
> = {
  en: {
    title: 'Water Tracker',
    glasses: 'Glasses',
    dailyGoal: 'Daily Hydration Goal',
    completed: 'Completed',
    back: 'Go back',
    removeGlass: 'Remove one glass',
    addGlass: 'Add one glass',
    totalToday: 'Total Drank Today',
    nextReminder: 'Next Reminder: 3:00 PM',
    reminder:
      'Drink one full glass of warm or normal water after your afternoon rest.',
    todayLog: "Today's Log (Glass Breakdown)",
    glassLabel: 'G',
  },
  hi: {
    title: 'पानी ट्रैकर',
    glasses: 'गिलास',
    dailyGoal: 'दैनिक पानी पीने का लक्ष्य',
    completed: 'पूरा हुआ',
    back: 'वापस जाएँ',
    removeGlass: 'एक गिलास कम करें',
    addGlass: 'एक गिलास जोड़ें',
    totalToday: 'आज कुल पिया',
    nextReminder: 'अगली याद: दोपहर 3:00 बजे',
    reminder:
      'दोपहर के आराम के बाद एक पूरा गिलास गर्म या सामान्य पानी पिएँ।',
    todayLog: 'आज का रिकॉर्ड (गिलास का विवरण)',
    glassLabel: 'गिलास',
  },
  mr: {
    title: 'पाणी ट्रॅकर',
    glasses: 'ग्लास',
    dailyGoal: 'दररोज पाणी पिण्याचे लक्ष्य',
    completed: 'पूर्ण',
    back: 'मागे जा',
    removeGlass: 'एक ग्लास कमी करा',
    addGlass: 'एक ग्लास जोडा',
    totalToday: 'आज एकूण प्यायले',
    nextReminder: 'पुढील आठवण: दुपारी ३:०० वाजता',
    reminder:
      'दुपारच्या विश्रांतीनंतर एक पूर्ण ग्लास कोमट किंवा साधे पाणी प्या.',
    todayLog: 'आजची नोंद (ग्लासचा तपशील)',
    glassLabel: 'ग्लास',
  },
  bn: {
    title: 'জল ট্র্যাকার',
    glasses: 'গ্লাস',
    dailyGoal: 'প্রতিদিন জল পানের লক্ষ্য',
    completed: 'সম্পূর্ণ',
    back: 'ফিরে যান',
    removeGlass: 'এক গ্লাস কমান',
    addGlass: 'এক গ্লাস যোগ করুন',
    totalToday: 'আজ মোট পান করেছেন',
    nextReminder: 'পরবর্তী স্মরণ: দুপুর ৩:০০',
    reminder:
      'দুপুরের বিশ্রামের পরে এক গ্লাস গরম বা সাধারণ জল পান করুন।',
    todayLog: 'আজকের হিসাব (গ্লাসের বিবরণ)',
    glassLabel: 'গ্লাস',
  },
};

export function WaterTrackerScreen({
  onBack,
  waterCount,
  setWaterCount,
  language,
}: WaterTrackerScreenProps) {
  const totalGoal = 8;
  const t = COPY[language] ?? COPY.hi;

  useEffect(() => {
    const storedCount = getStoredWater();
    setWaterCount(storedCount);
  }, [setWaterCount]);

  const glasses = waterCount;
  const progressPercent = Math.min(
    Math.round((glasses / totalGoal) * 100),
    100
  );

  const addGlass = () => {
    setWaterCount((previous) => {
      const next = previous < 15 ? previous + 1 : previous;
      setStoredWater(next);
      return next;
    });
  };

  const removeGlass = () => {
    setWaterCount((previous) => {
      const next = previous > 0 ? previous - 1 : previous;
      setStoredWater(next);
      return next;
    });
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
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white shadow-lg text-center space-y-3">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs">
            <Droplets className="size-8 text-white fill-current" />
          </div>

          <div>
            <h3 className="text-3xl font-black">
              {glasses} / {totalGoal} {t.glasses}
            </h3>
            <p className="text-xs text-blue-100 mt-0.5">{t.dailyGoal}</p>
          </div>

          <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] font-bold text-cyan-100">
            {progressPercent}% {t.completed}
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <button
            type="button"
            onClick={removeGlass}
            disabled={glasses === 0}
            aria-label={t.removeGlass}
            className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 active:scale-95 transition-all"
          >
            <Minus className="size-6" />
          </button>

          <div className="text-center">
            <span className="text-2xl font-black text-slate-900">
              {glasses * 250} ml
            </span>
            <p className="text-[11px] text-slate-400">{t.totalToday}</p>
          </div>

          <button
            type="button"
            onClick={addGlass}
            aria-label={t.addGlass}
            className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus className="size-6" />
          </button>
        </div>

        <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4 flex items-start gap-3">
          <Bell className="size-5 text-cyan-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-cyan-950">
              {t.nextReminder}
            </h4>
            <p className="text-[11px] text-cyan-800/80 mt-0.5 leading-relaxed">
              {t.reminder}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
          <h4 className="text-xs font-bold text-slate-800">{t.todayLog}</h4>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {Array.from({ length: totalGoal }).map((_, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center rounded-xl p-3 border transition-colors ${
                  index < glasses
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-slate-100 bg-slate-50 text-slate-300'
                }`}
              >
                <Droplets className="size-5 fill-current" />
                <span className="text-[10px] font-bold mt-1">
                  {t.glassLabel} {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
