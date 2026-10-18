'use client';

import React from 'react';
import {
  Pill,
  Droplets,
  Calendar,
  Users,
  Camera,
  AlertOctagon,
  Heart,
  Mic,
  ChevronRight,
  Activity,
} from 'lucide-react';

interface DashboardScreenProps {
  language: string;
  waterCount: number;
  medicineCount: number;
  appointmentText: string;
  contactsCount: number;
  onOpenVoice: () => void;
  onNavigate: (screenId: any) => void;
}

const COPY: Record<
  string,
  {
    saathi: string;
    emergency: string;
    emergencySubtitle: string;
    aiVision: string;
    drugGuard: string;
    scanPrescription: string;
    scanSubtitle: string;
    medicinesLeft: string;
    medicineLeft: string;
    medicineCabinet: string;
    glasses: string;
    waterTracker: string;
    noAppointments: string;
    upcomingAppointment: string;
    upcomingAppointments: string;
    appointments: string;
    contactsLinked: string;
    familyHub: string;
    dailyCheckIn: string;
    feelingToday: string;
  }
> = {
  en: {
    saathi: 'Saathi',
    emergency: 'EMERGENCY SOS',
    emergencySubtitle: 'Instantly alert family and doctor',
    aiVision: 'AI Health Vision',
    drugGuard: 'Drug Conflict Guard',
    scanPrescription: 'Scan Doctor Prescription',
    scanSubtitle: 'Check medicine name, expiry date & safety',
    medicinesLeft: 'Medicines Left',
    medicineLeft: 'Medicine Left',
    medicineCabinet: 'Medicine Cabinet',
    glasses: 'Glasses',
    waterTracker: 'Water Tracker',
    noAppointments: 'No Appointments',
    upcomingAppointment: 'Upcoming Appointment',
    upcomingAppointments: 'Upcoming Appointments',
    appointments: 'Appointments',
    contactsLinked: 'Contacts Linked',
    familyHub: 'Family Hub',
    dailyCheckIn: 'Daily Health Check-in',
    feelingToday: 'How are you feeling today?',
  },
  hi: {
    saathi: 'साथी',
    emergency: 'आपातकालीन SOS',
    emergencySubtitle: 'परिवार और डॉक्टर को तुरंत सूचित करें',
    aiVision: 'AI स्वास्थ्य जाँच',
    drugGuard: 'दवा सुरक्षा जाँच',
    scanPrescription: 'डॉक्टर का पर्चा स्कैन करें',
    scanSubtitle: 'दवा का नाम, एक्सपायरी और सुरक्षा जाँचें',
    medicinesLeft: 'दवाइयाँ बाकी',
    medicineLeft: 'दवाई बाकी',
    medicineCabinet: 'दवा अलमारी',
    glasses: 'गिलास',
    waterTracker: 'पानी ट्रैकर',
    noAppointments: 'कोई अपॉइंटमेंट नहीं',
    upcomingAppointment: 'आगामी अपॉइंटमेंट',
    upcomingAppointments: 'आगामी अपॉइंटमेंट',
    appointments: 'अपॉइंटमेंट',
    contactsLinked: 'संपर्क जुड़े हैं',
    familyHub: 'परिवार केंद्र',
    dailyCheckIn: 'दैनिक स्वास्थ्य जाँच',
    feelingToday: 'आज आप कैसा महसूस कर रहे हैं?',
  },
  mr: {
    saathi: 'साथी',
    emergency: 'आपत्कालीन SOS',
    emergencySubtitle: 'कुटुंबीयांना आणि डॉक्टरांना त्वरित कळवा',
    aiVision: 'AI आरोग्य तपासणी',
    drugGuard: 'औषध सुरक्षितता तपासणी',
    scanPrescription: 'डॉक्टरांचे प्रिस्क्रिप्शन स्कॅन करा',
    scanSubtitle: 'औषधाचे नाव, एक्सपायरी आणि सुरक्षितता तपासा',
    medicinesLeft: 'औषधे शिल्लक',
    medicineLeft: 'औषध शिल्लक',
    medicineCabinet: 'औषध कपाट',
    glasses: 'ग्लास',
    waterTracker: 'पाणी ट्रॅकर',
    noAppointments: 'अपॉइंटमेंट नाहीत',
    upcomingAppointment: 'आगामी अपॉइंटमेंट',
    upcomingAppointments: 'आगामी अपॉइंटमेंट्स',
    appointments: 'अपॉइंटमेंट्स',
    contactsLinked: 'संपर्क जोडले आहेत',
    familyHub: 'कुटुंब केंद्र',
    dailyCheckIn: 'दैनिक आरोग्य तपासणी',
    feelingToday: 'आज तुम्हाला कसे वाटत आहे?',
  },
  bn: {
    saathi: 'সাথী',
    emergency: 'জরুরি SOS',
    emergencySubtitle: 'পরিবার ও ডাক্তারকে সঙ্গে সঙ্গে জানান',
    aiVision: 'AI স্বাস্থ্য পরীক্ষা',
    drugGuard: 'ওষুধের নিরাপত্তা পরীক্ষা',
    scanPrescription: 'ডাক্তারের প্রেসক্রিপশন স্ক্যান করুন',
    scanSubtitle: 'ওষুধের নাম, মেয়াদ ও নিরাপত্তা পরীক্ষা করুন',
    medicinesLeft: 'টি ওষুধ বাকি',
    medicineLeft: 'টি ওষুধ বাকি',
    medicineCabinet: 'ওষুধের ক্যাবিনেট',
    glasses: 'গ্লাস',
    waterTracker: 'জল ট্র্যাকার',
    noAppointments: 'কোনও অ্যাপয়েন্টমেন্ট নেই',
    upcomingAppointment: 'টি আসন্ন অ্যাপয়েন্টমেন্ট',
    upcomingAppointments: 'টি আসন্ন অ্যাপয়েন্টমেন্ট',
    appointments: 'অ্যাপয়েন্টমেন্ট',
    contactsLinked: 'টি যোগাযোগ যুক্ত',
    familyHub: 'পরিবার কেন্দ্র',
    dailyCheckIn: 'দৈনিক স্বাস্থ্য পরীক্ষা',
    feelingToday: 'আজ আপনার কেমন লাগছে?',
  },
};

export function DashboardScreen({
  language,
  waterCount,
  medicineCount,
  appointmentText,
  contactsCount,
  onOpenVoice,
  onNavigate,
}: DashboardScreenProps) {
  const t = COPY[language] ?? COPY.hi;
  const upcomingCount = Number(appointmentText.match(/\d+/)?.[0] ?? 0);

  let appointmentLabel = t.noAppointments;

  if (upcomingCount > 0) {
    if (language === 'en') {
      appointmentLabel =
        `${upcomingCount} ` +
        (upcomingCount === 1
          ? t.upcomingAppointment
          : t.upcomingAppointments);
    } else if (language === 'hi') {
      appointmentLabel = `${upcomingCount} ${t.upcomingAppointments}`;
    } else if (language === 'mr') {
      appointmentLabel =
        `${upcomingCount} ` +
        (upcomingCount === 1
          ? t.upcomingAppointment
          : t.upcomingAppointments);
    } else {
      appointmentLabel = `${upcomingCount}${t.upcomingAppointments}`;
    }
  }

  const medicineLabel =
    language === 'en'
      ? `${medicineCount} ${
          medicineCount === 1 ? t.medicineLeft : t.medicinesLeft
        }`
      : `${medicineCount} ${t.medicinesLeft}`;

  const contactsLabel =
    language === 'bn'
      ? `${contactsCount}${t.contactsLinked}`
      : `${contactsCount} ${t.contactsLinked}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] text-slate-800 pb-12 select-none">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 shadow-xs sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <Heart className="size-5 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-tight">
              Sanjeevani
            </h1>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              ElderCare+
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenVoice}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 active:scale-95 transition-all"
        >
          <Mic className="size-4" />
          <span>{t.saathi}</span>
        </button>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-5 space-y-4">
        <button
          type="button"
          onClick={() => onNavigate(15)}
          className="w-full rounded-3xl bg-red-600 p-4 text-white shadow-lg hover:bg-red-700 active:scale-98 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/20">
              <AlertOctagon className="size-7" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-black tracking-wide leading-tight">
                {t.emergency}
              </h2>
              <p className="text-xs font-medium text-red-100">
                {t.emergencySubtitle}
              </p>
            </div>
          </div>
          <ChevronRight className="size-6 text-white/80" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate(8)}
          className="w-full rounded-3xl bg-blue-600 p-5 text-white shadow-md hover:bg-blue-700 active:scale-98 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
              {t.aiVision}
            </span>
            <span className="text-xs font-bold text-blue-100">
              {t.drugGuard}
            </span>
          </div>

          <div className="flex items-center gap-3.5 text-left">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm shrink-0">
              <Camera className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-black leading-tight">
                {t.scanPrescription}
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                {t.scanSubtitle}
              </p>
            </div>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onNavigate(10)}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 active:scale-98 transition-all text-left min-h-[120px]"
          >
            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Pill className="size-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-slate-400">
                {medicineLabel}
              </span>
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                {t.medicineCabinet}
              </h3>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(12)}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 active:scale-98 transition-all text-left min-h-[120px]"
          >
            <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <Droplets className="size-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-slate-400">
                {waterCount} / 8 {t.glasses}
              </span>
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                {t.waterTracker}
              </h3>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(11)}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 active:scale-98 transition-all text-left min-h-[120px]"
          >
            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Calendar className="size-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-slate-400">
                {appointmentLabel}
              </span>
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                {t.appointments}
              </h3>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(14)}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 active:scale-98 transition-all text-left min-h-[120px]"
          >
            <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <Users className="size-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-slate-400">
                {contactsLabel}
              </span>
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                {t.familyHub}
              </h3>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigate(13)}
          className="w-full flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 active:scale-98 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <Activity className="size-5" />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-black text-slate-900">
                {t.dailyCheckIn}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {t.feelingToday}
              </p>
            </div>
          </div>
          <ChevronRight className="size-5 text-slate-400" />
        </button>
      </main>
    </div>
  );
}
