'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Plus,
  Trash2,
} from 'lucide-react';

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
}

interface FamilyHubScreenProps {
  onBack: () => void;
  language: string;
  emergencyContacts: EmergencyContact[];
  setEmergencyContacts: React.Dispatch<
    React.SetStateAction<EmergencyContact[]>
  >;
}

const COPY: Record<
  string,
  {
    back: string;
    title: string;
    heading: string;
    namePlaceholder: string;
    contactName: string;
    relationshipPlaceholder: string;
    relationship: string;
    phonePlaceholder: string;
    phoneNumber: string;
    addContact: string;
    callContact: string;
    whatsappMessage: string;
    deleteContact: string;
    empty: string;
  }
> = {
  en: {
    back: 'Go back',
    title: 'Family Hub',
    heading: 'Emergency Contacts',
    namePlaceholder: 'Name',
    contactName: 'Contact name',
    relationshipPlaceholder: 'Relationship (e.g. Daughter)',
    relationship: 'Relationship',
    phonePlaceholder: 'Phone number',
    phoneNumber: 'Phone number',
    addContact: 'Add Emergency Contact',
    callContact: 'Call contact',
    whatsappMessage: 'Message contact on WhatsApp',
    deleteContact: 'Delete contact',
    empty: 'No emergency contacts added yet.',
  },
  hi: {
    back: 'वापस जाएँ',
    title: 'परिवार केंद्र',
    heading: 'आपातकालीन संपर्क',
    namePlaceholder: 'नाम',
    contactName: 'संपर्क का नाम',
    relationshipPlaceholder: 'रिश्ता (जैसे: बेटी)',
    relationship: 'रिश्ता',
    phonePlaceholder: 'फ़ोन नंबर',
    phoneNumber: 'फ़ोन नंबर',
    addContact: 'आपातकालीन संपर्क जोड़ें',
    callContact: 'संपर्क को कॉल करें',
    whatsappMessage: 'WhatsApp पर संदेश भेजें',
    deleteContact: 'संपर्क हटाएँ',
    empty: 'अभी तक कोई आपातकालीन संपर्क नहीं जोड़ा गया है।',
  },
  mr: {
    back: 'मागे जा',
    title: 'कुटुंब केंद्र',
    heading: 'आपत्कालीन संपर्क',
    namePlaceholder: 'नाव',
    contactName: 'संपर्काचे नाव',
    relationshipPlaceholder: 'नाते (उदा. मुलगी)',
    relationship: 'नाते',
    phonePlaceholder: 'फोन नंबर',
    phoneNumber: 'फोन नंबर',
    addContact: 'आपत्कालीन संपर्क जोडा',
    callContact: 'संपर्काला कॉल करा',
    whatsappMessage: 'WhatsApp वर संदेश पाठवा',
    deleteContact: 'संपर्क हटवा',
    empty: 'अद्याप कोणताही आपत्कालीन संपर्क जोडलेला नाही.',
  },
  bn: {
    back: 'ফিরে যান',
    title: 'পরিবার কেন্দ্র',
    heading: 'জরুরি যোগাযোগ',
    namePlaceholder: 'নাম',
    contactName: 'যোগাযোগের নাম',
    relationshipPlaceholder: 'সম্পর্ক (যেমন: মেয়ে)',
    relationship: 'সম্পর্ক',
    phonePlaceholder: 'ফোন নম্বর',
    phoneNumber: 'ফোন নম্বর',
    addContact: 'জরুরি যোগাযোগ যোগ করুন',
    callContact: 'যোগাযোগকে কল করুন',
    whatsappMessage: 'WhatsApp-এ বার্তা পাঠান',
    deleteContact: 'যোগাযোগ মুছুন',
    empty: 'এখনও কোনো জরুরি যোগাযোগ যোগ করা হয়নি।',
  },
};

export function FamilyHubScreen({
  onBack,
  language,
  emergencyContacts,
  setEmergencyContacts,
}: FamilyHubScreenProps) {
  const t = COPY[language] ?? COPY.hi;

  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleAddContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = contactName.trim();
    const phone = contactPhone.trim();

    if (!name || !phone) return;

    setEmergencyContacts((previous) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        role: contactRole.trim(),
        phone,
      },
      ...previous,
    ]);

    setContactName('');
    setContactRole('');
    setContactPhone('');
  };

  const handleDeleteContact = (id: string) => {
    setEmergencyContacts((previous) =>
      previous.filter((contact) => contact.id !== id)
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 pb-10 select-none">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 shadow-xs sticky top-0 z-10">
        <button
          type="button"
          onClick={onBack}
          aria-label={t.back}
          className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
        >
          <ArrowLeft className="size-5" />
        </button>

        <h1 className="text-base font-black text-slate-900 tracking-tight">
          {t.title}
        </h1>

        <div className="size-9" />
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-5 space-y-4">
        <section className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
            {t.heading}
          </h2>

          <form
            onSubmit={handleAddContact}
            className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs"
          >
            <input
              type="text"
              required
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              placeholder={t.namePlaceholder}
              aria-label={t.contactName}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <input
              type="text"
              value={contactRole}
              onChange={(event) => setContactRole(event.target.value)}
              placeholder={t.relationshipPlaceholder}
              aria-label={t.relationship}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <input
              type="tel"
              required
              value={contactPhone}
              onChange={(event) => setContactPhone(event.target.value)}
              placeholder={t.phonePlaceholder}
              aria-label={t.phoneNumber}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              disabled={!contactName.trim() || !contactPhone.trim()}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="size-4" />
              {t.addContact}
            </button>
          </form>

          {emergencyContacts.length > 0 ? (
            <div className="space-y-2">
              {emergencyContacts.map((contact) => {
                const whatsappNumber = contact.phone.replace(/\D/g, '');

                return (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate text-xs font-bold text-slate-900">
                        {contact.name}
                      </h3>

                      {contact.role && (
                        <p className="truncate text-[10px] text-slate-500 font-medium">
                          {contact.role}
                        </p>
                      )}

                      <p className="text-[10px] text-slate-500">
                        {contact.phone}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <a
                        href={`tel:${contact.phone}`}
                        aria-label={t.callContact}
                        className="flex size-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      >
                        <Phone className="size-4" />
                      </a>

                      <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t.whatsappMessage}
                        className="flex size-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      >
                        <MessageSquare className="size-4" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDeleteContact(contact.id)}
                        aria-label={t.deleteContact}
                        title={t.deleteContact}
                        className="flex size-8 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-xs text-slate-400 font-medium">
              {t.empty}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
