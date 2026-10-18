'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react';

export interface AppointmentItem {
  id: number;
  doctor: string;
  specialty: string;
  /** Appointment date in YYYY-MM-DD format */
  date: string;
  time: string;
  location: string;
  /** Kept for compatibility; Upcoming/Past display is calculated from date/time. */
  status: 'upcoming' | 'completed';
}

export const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: 1,
    doctor: 'Dr. Ramesh Sharma',
    specialty: 'Cardiologist (Heart)',
    date: '2026-10-15',
    time: '10:30 AM',
    location: 'Apollo Clinic, Sector 14',
    status: 'completed',
  },
  {
    id: 2,
    doctor: 'Dr. Sunita Verma',
    specialty: 'General Physician',
    date: '2026-10-22',
    time: '04:00 PM',
    location: 'Max Healthcare',
    status: 'upcoming',
  },
  {
    id: 3,
    doctor: 'Dr. Ankit Mehta',
    specialty: 'Eye Specialist (Ophthalmology)',
    date: '2026-09-28',
    time: '11:00 AM',
    location: 'Netra Eye Care',
    status: 'completed',
  },
];

function parseAppointmentDate(dateValue: string): Date | null {
  const value = dateValue.trim();

  // Parse ISO dates as local dates to avoid UTC timezone shifting the day.
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  // Support older entries such as "Tomorrow, 15 Oct" or "22 Oct 2026".
  const cleaned = value.replace(/^Tomorrow,\s*/i, '').trim();
  const textMatch = cleaned.match(
    /^(\d{1,2})\s+([A-Za-z]+)(?:,?\s+(\d{4}))?$/
  );

  if (textMatch) {
    const [, dayText, monthText, yearText] = textMatch;
    const monthNames = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];
    const month = monthNames.indexOf(monthText.slice(0, 3).toLowerCase());
    if (month < 0) return null;

    const year = yearText
      ? Number(yearText)
      : new Date().getFullYear();

    return new Date(year, month, Number(dayText));
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function parseAppointmentTime(timeValue: string): {
  hours: number;
  minutes: number;
} | null {
  const match = timeValue.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (hours < 1 || hours > 12 || minutes > 59) return null;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  if (meridiem === 'PM' && hours !== 12) hours += 12;

  return { hours, minutes };
}

export function getAppointmentStatus(
  appointment: Pick<AppointmentItem, 'date' | 'time'>,
  now: Date = new Date()
): 'upcoming' | 'completed' {
  const appointmentDate = parseAppointmentDate(appointment.date);
  if (!appointmentDate) return 'upcoming';

  const appointmentTime = parseAppointmentTime(appointment.time);

  if (appointmentTime) {
    appointmentDate.setHours(
      appointmentTime.hours,
      appointmentTime.minutes,
      0,
      0
    );
  }

  return appointmentDate.getTime() < now.getTime() ? 'completed' : 'upcoming';
}

const COPY: Record<
  string,
  {
    back: string;
    title: string;
    upcoming: string;
    past: string;
    empty: string;
    scheduled: string;
    visited: string;
    deleteAppointment: string;
    bookAdd: string;
    modalTitle: string;
    doctorPlaceholder: string;
    specialtyPlaceholder: string;
    datePlaceholder: string;
    timePlaceholder: string;
    locationPlaceholder: string;
    cancel: string;
    save: string;
    defaultSpecialty: string;
    defaultLocation: string;
    defaultTime: string;
  }
> = {
  en: {
    back: 'Go back',
    title: 'Doctor Appointments',
    upcoming: 'Upcoming',
    past: 'Past Visits',
    empty: 'No appointments found in this tab.',
    scheduled: 'Scheduled',
    visited: 'Past',
    deleteAppointment: 'Delete appointment',
    bookAdd: 'Book / Add Appointment',
    modalTitle: 'Add Doctor Appointment',
    doctorPlaceholder: 'Doctor Name (e.g. Dr. Gupta)',
    specialtyPlaceholder: 'Specialty (e.g. Eye Specialist)',
    datePlaceholder: 'Choose appointment date',
    timePlaceholder: 'Choose appointment time',
    locationPlaceholder: 'Clinic / Hospital Name',
    cancel: 'Cancel',
    save: 'Save',
    defaultSpecialty: 'General Checkup',
    defaultLocation: 'Clinic Visit',
    defaultTime: '10:00 AM',
  },
  hi: {
    back: 'वापस जाएँ',
    title: 'डॉक्टर अपॉइंटमेंट',
    upcoming: 'आगामी',
    past: 'पिछली मुलाकातें',
    empty: 'इस सूची में कोई अपॉइंटमेंट नहीं है।',
    scheduled: 'निर्धारित',
    visited: 'बीती हुई',
    deleteAppointment: 'अपॉइंटमेंट हटाएँ',
    bookAdd: 'अपॉइंटमेंट बुक / जोड़ें',
    modalTitle: 'डॉक्टर का अपॉइंटमेंट जोड़ें',
    doctorPlaceholder: 'डॉक्टर का नाम (जैसे: डॉ. गुप्ता)',
    specialtyPlaceholder: 'विशेषज्ञता (जैसे: आँखों के डॉक्टर)',
    datePlaceholder: 'अपॉइंटमेंट की तारीख चुनें',
    timePlaceholder: 'अपॉइंटमेंट का समय चुनें',
    locationPlaceholder: 'क्लिनिक / अस्पताल का नाम',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    defaultSpecialty: 'सामान्य जाँच',
    defaultLocation: 'क्लिनिक में मुलाकात',
    defaultTime: '10:00 AM',
  },
  mr: {
    back: 'मागे जा',
    title: 'डॉक्टरांची अपॉइंटमेंट',
    upcoming: 'आगामी',
    past: 'मागील भेटी',
    empty: 'या यादीत कोणतीही अपॉइंटमेंट नाही.',
    scheduled: 'नियोजित',
    visited: 'मागील',
    deleteAppointment: 'अपॉइंटमेंट हटवा',
    bookAdd: 'अपॉइंटमेंट बुक / जोडा',
    modalTitle: 'डॉक्टरांची अपॉइंटमेंट जोडा',
    doctorPlaceholder: 'डॉक्टरांचे नाव (उदा. डॉ. गुप्ता)',
    specialtyPlaceholder: 'विशेषज्ञता (उदा. नेत्रतज्ज्ञ)',
    datePlaceholder: 'अपॉइंटमेंटची तारीख निवडा',
    timePlaceholder: 'अपॉइंटमेंटची वेळ निवडा',
    locationPlaceholder: 'क्लिनिक / रुग्णालयाचे नाव',
    cancel: 'रद्द करा',
    save: 'जतन करा',
    defaultSpecialty: 'सामान्य तपासणी',
    defaultLocation: 'क्लिनिक भेट',
    defaultTime: '10:00 AM',
  },
  bn: {
    back: 'ফিরে যান',
    title: 'ডাক্তারের অ্যাপয়েন্টমেন্ট',
    upcoming: 'আসন্ন',
    past: 'আগের সাক্ষাৎ',
    empty: 'এই তালিকায় কোনো অ্যাপয়েন্টমেন্ট নেই।',
    scheduled: 'নির্ধারিত',
    visited: 'অতীত',
    deleteAppointment: 'অ্যাপয়েন্টমেন্ট মুছুন',
    bookAdd: 'অ্যাপয়েন্টমেন্ট বুক / যোগ করুন',
    modalTitle: 'ডাক্তারের অ্যাপয়েন্টমেন্ট যোগ করুন',
    doctorPlaceholder: 'ডাক্তারের নাম (যেমন: ডা. গুপ্ত)',
    specialtyPlaceholder: 'বিশেষজ্ঞতা (যেমন: চক্ষু বিশেষজ্ঞ)',
    datePlaceholder: 'অ্যাপয়েন্টমেন্টের তারিখ বাছুন',
    timePlaceholder: 'অ্যাপয়েন্টমেন্টের সময় বাছুন',
    locationPlaceholder: 'ক্লিনিক / হাসপাতালের নাম',
    cancel: 'বাতিল করুন',
    save: 'সংরক্ষণ করুন',
    defaultSpecialty: 'সাধারণ পরীক্ষা',
    defaultLocation: 'ক্লিনিকে সাক্ষাৎ',
    defaultTime: '10:00 AM',
  },
};

const DATE_LOCALES: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
};

interface AppointmentsScreenProps {
  onBack: () => void;
  appointments: AppointmentItem[];
  setAppointments: React.Dispatch<React.SetStateAction<AppointmentItem[]>>;
  language: string;
}

export function AppointmentsScreen({
  onBack,
  appointments,
  setAppointments,
  language,
}: AppointmentsScreenProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showModal, setShowModal] = useState(false);

  const [doctor, setDoctor] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  const t = COPY[language] ?? COPY.hi;
  const dateLocale = DATE_LOCALES[language] ?? DATE_LOCALES.hi;

  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!doctor.trim() || !date) return;

    const newAppointment: AppointmentItem = {
      id: Date.now(),
      doctor: doctor.trim(),
      specialty: specialty.trim() || t.defaultSpecialty,
      date,
      time: time
        ? new Date(`2000-01-01T${time}`).toLocaleTimeString(dateLocale, {
            hour: '2-digit',
            minute: '2-digit',
          })
        : t.defaultTime,
      location: location.trim() || t.defaultLocation,
      status: 'upcoming',
    };

    setAppointments((previous) => [newAppointment, ...previous]);

    setDoctor('');
    setSpecialty('');
    setDate('');
    setTime('');
    setLocation('');
    setShowModal(false);
    setActiveTab('upcoming');
  };

  const handleDelete = (id: number) => {
    setAppointments((previous) =>
      previous.filter((appointment) => appointment.id !== id)
    );
  };

  const now = new Date();

  const filtered = appointments.filter((item) => {
    const status = getAppointmentStatus(item, now);
    return activeTab === 'upcoming'
      ? status === 'upcoming'
      : status === 'completed';
  });

  const formatDate = (dateValue: string) => {
    const parsed = parseAppointmentDate(dateValue);

    if (!parsed) return dateValue;

    return new Intl.DateTimeFormat(dateLocale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(parsed);
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
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-200/80 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.upcoming}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('past')}
            className={`rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === 'past'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.past}
          </button>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-400">
              {t.empty}
            </div>
          ) : (
            filtered.map((item) => {
              const status = getAppointmentStatus(item, now);

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xs font-black text-slate-900">
                        {item.doctor}
                      </h3>
                      <p className="text-[11px] font-semibold text-emerald-700">
                        {item.specialty}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          status === 'upcoming'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {status === 'upcoming' ? t.scheduled : t.visited}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        aria-label={`${t.deleteAppointment}: ${item.doctor}`}
                        title={t.deleteAppointment}
                        className="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-slate-400 shrink-0" />
                      <span>{item.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="size-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800 active:scale-98 transition-all"
        >
          <Plus className="size-4" />
          {t.bookAdd}
        </button>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900">{t.modalTitle}</h3>
            <form onSubmit={handleAdd} className="space-y-2.5">
              <input
                type="text"
                required
                placeholder={t.doctorPlaceholder}
                aria-label={t.doctorPlaceholder}
                value={doctor}
                onChange={(event) => setDoctor(event.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
              />
              <input
                type="text"
                placeholder={t.specialtyPlaceholder}
                aria-label={t.specialtyPlaceholder}
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  required
                  aria-label={t.datePlaceholder}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="min-w-0 rounded-xl border border-slate-200 p-2.5 text-xs"
                />
                <input
                  type="time"
                  aria-label={t.timePlaceholder}
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="min-w-0 rounded-xl border border-slate-200 p-2.5 text-xs"
                />
              </div>
              <input
                type="text"
                placeholder={t.locationPlaceholder}
                aria-label={t.locationPlaceholder}
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
