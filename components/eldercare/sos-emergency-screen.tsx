'use client';

import React from 'react';
import { Phone, AlertCircle, X, ShieldAlert } from 'lucide-react';

interface SosEmergencyScreenProps {
  onCancel: () => void;
  language: string;
}

const COPY: Record<
  string,
  {
    close: string;
    title: string;
    message: string;
    callFamily: string;
    callDoctor: string;
    emergency112: string;
    cancel: string;
  }
> = {
  en: {
    close: 'Close emergency screen',
    title: 'Emergency Help',
    message:
      'Need immediate help? Contact your family, doctor, or emergency services.',
    callFamily: 'Call Family',
    callDoctor: 'Call Doctor',
    emergency112: 'Emergency 112',
    cancel: 'Cancel',
  },
  hi: {
    close: 'आपातकालीन स्क्रीन बंद करें',
    title: 'आपातकालीन सहायता',
    message:
      'तुरंत सहायता चाहिए? अपने परिवार, डॉक्टर या आपातकालीन सेवा से संपर्क करें।',
    callFamily: 'परिवार को कॉल करें',
    callDoctor: 'डॉक्टर को कॉल करें',
    emergency112: 'आपातकालीन सेवा 112',
    cancel: 'रद्द करें',
  },
  mr: {
    close: 'आपत्कालीन स्क्रीन बंद करा',
    title: 'आपत्कालीन मदत',
    message:
      'तातडीने मदत हवी आहे का? आपल्या कुटुंबाशी, डॉक्टरांशी किंवा आपत्कालीन सेवेशी संपर्क साधा.',
    callFamily: 'कुटुंबाला कॉल करा',
    callDoctor: 'डॉक्टरांना कॉल करा',
    emergency112: 'आपत्कालीन सेवा 112',
    cancel: 'रद्द करा',
  },
  bn: {
    close: 'জরুরি স্ক্রিন বন্ধ করুন',
    title: 'জরুরি সহায়তা',
    message:
      'তাৎক্ষণিক সাহায্য দরকার? পরিবার, ডাক্তার অথবা জরুরি পরিষেবার সঙ্গে যোগাযোগ করুন।',
    callFamily: 'পরিবারকে কল করুন',
    callDoctor: 'ডাক্তারকে কল করুন',
    emergency112: 'জরুরি পরিষেবা ১১২',
    cancel: 'বাতিল করুন',
  },
};

export function SosEmergencyScreen({
  onCancel,
  language,
}: SosEmergencyScreenProps) {
  const t = COPY[language] ?? COPY.hi;

  return (
    <div className="flex min-h-screen flex-col bg-[#fee2e2]/60 text-slate-800 p-5 select-none justify-between">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          aria-label={t.close}
          className="rounded-full bg-white/80 p-2 text-slate-500 hover:bg-white shadow-xs"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="mx-auto w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl border border-red-200 space-y-4">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 animate-bounce">
          <AlertCircle className="size-9" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
            {t.message}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <a
            href="tel:+919876543210"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs font-black text-white shadow-md hover:bg-red-700 active:scale-98 transition-all"
          >
            <Phone className="size-4" />
            {t.callFamily}
          </a>

          <a
            href="tel:+919812345678"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs font-black text-white shadow-md hover:bg-red-700 active:scale-98 transition-all"
          >
            <Phone className="size-4" />
            {t.callDoctor}
          </a>

          <a
            href="tel:112"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#b91c1c] py-3.5 text-xs font-black text-white shadow-md hover:bg-red-800 active:scale-98 transition-all"
          >
            <ShieldAlert className="size-4" />
            {t.emergency112}
          </a>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full bg-white px-8 py-2.5 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}
