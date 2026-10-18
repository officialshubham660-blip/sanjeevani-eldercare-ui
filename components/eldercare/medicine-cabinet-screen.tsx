'use client';

import React, { useState } from 'react';
import { ArrowLeft, Pill, Plus, Trash2 } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

interface MedicineCabinetScreenProps {
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  onBack: () => void;
  language: string;
}

const COPY: Record<
  string,
  {
    back: string;
    title: string;
    currentMedicines: string;
    reminders: string;
    clearAll: string;
    empty: string;
    defaultDosage: string;
    taken: string;
    take: string;
    removeMedicine: string;
    addNewMedicine: string;
    medicineName: string;
    dosagePlaceholder: string;
    save: string;
    cancel: string;
    addMedicine: string;
    reminderStatus: string;
  }
> = {
  en: {
    back: 'Go back',
    title: 'Medicine Cabinet',
    currentMedicines: 'Current Medicines',
    reminders: 'Reminders',
    clearAll: 'Clear All',
    empty: 'No medicines added yet.',
    defaultDosage: '1 tablet',
    taken: 'Taken',
    take: 'Take',
    removeMedicine: 'Remove medicine',
    addNewMedicine: 'Add New Medicine',
    medicineName: 'Medicine Name',
    dosagePlaceholder: 'Dosage (e.g. 1 Tablet)',
    save: 'Save',
    cancel: 'Cancel',
    addMedicine: 'Add Medicine',
    reminderStatus: 'Daily medicine alerts are active.',
  },
  hi: {
    back: 'वापस जाएँ',
    title: 'दवा अलमारी',
    currentMedicines: 'वर्तमान दवाइयाँ',
    reminders: 'याद दिलाने की सूचनाएँ',
    clearAll: 'सब हटाएँ',
    empty: 'अभी तक कोई दवा नहीं जोड़ी गई है।',
    defaultDosage: '1 गोली',
    taken: 'ले ली',
    take: 'लें',
    removeMedicine: 'दवा हटाएँ',
    addNewMedicine: 'नई दवा जोड़ें',
    medicineName: 'दवा का नाम',
    dosagePlaceholder: 'खुराक (जैसे: 1 गोली)',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    addMedicine: 'दवा जोड़ें',
    reminderStatus: 'दवाइयों के दैनिक अलर्ट चालू हैं।',
  },
  mr: {
    back: 'मागे जा',
    title: 'औषधांचा कप्पा',
    currentMedicines: 'सध्याची औषधे',
    reminders: 'आठवणी',
    clearAll: 'सर्व हटवा',
    empty: 'अद्याप कोणतेही औषध जोडलेले नाही.',
    defaultDosage: '१ गोळी',
    taken: 'घेतले',
    take: 'घ्या',
    removeMedicine: 'औषध हटवा',
    addNewMedicine: 'नवीन औषध जोडा',
    medicineName: 'औषधाचे नाव',
    dosagePlaceholder: 'मात्रा (उदा. १ गोळी)',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    addMedicine: 'औषध जोडा',
    reminderStatus: 'औषधांसाठीचे दैनिक अलर्ट सुरू आहेत.',
  },
  bn: {
    back: 'ফিরে যান',
    title: 'ওষুধের ক্যাবিনেট',
    currentMedicines: 'বর্তমান ওষুধ',
    reminders: 'স্মরণবার্তা',
    clearAll: 'সব মুছুন',
    empty: 'এখনও কোনো ওষুধ যোগ করা হয়নি।',
    defaultDosage: '১টি ট্যাবলেট',
    taken: 'খেয়েছেন',
    take: 'খান',
    removeMedicine: 'ওষুধ সরান',
    addNewMedicine: 'নতুন ওষুধ যোগ করুন',
    medicineName: 'ওষুধের নাম',
    dosagePlaceholder: 'মাত্রা (যেমন: ১টি ট্যাবলেট)',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল করুন',
    addMedicine: 'ওষুধ যোগ করুন',
    reminderStatus: 'প্রতিদিনের ওষুধের সতর্কবার্তা চালু আছে।',
  },
};

export function MedicineCabinetScreen({
  medicines,
  setMedicines,
  onBack,
  language,
}: MedicineCabinetScreenProps) {
  const t = COPY[language] ?? COPY.hi;

  const [activeTab, setActiveTab] = useState<'current' | 'reminders'>(
    'current'
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime] = useState('8:00 AM');

  const handleAddMedicine = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMed: Medicine = {
      id: Date.now().toString(),
      name: newName,
      dosage: newDosage || t.defaultDosage,
      time: newTime,
      taken: false,
    };

    setMedicines([...medicines, newMed]);
    setNewName('');
    setNewDosage('');
    setShowAddForm(false);
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter((medicine) => medicine.id !== id));
  };

  const handleClearAll = () => {
    setMedicines([]);
  };

  const handleToggleTake = (id: string) => {
    setMedicines(
      medicines.map((medicine) =>
        medicine.id === id
          ? { ...medicine, taken: !medicine.taken }
          : medicine
      )
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

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4 space-y-4">
        <div className="flex items-center justify-between bg-slate-200/70 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'current'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.currentMedicines} ({medicines.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reminders')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'reminders'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.reminders}
          </button>
        </div>

        {activeTab === 'current' && (
          <div className="space-y-3">
            {medicines.length > 0 && (
              <div className="flex justify-end px-1">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 active:scale-95 transition-all"
                >
                  <Trash2 className="size-3.5" />
                  <span>{t.clearAll}</span>
                </button>
              </div>
            )}

            {medicines.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center space-y-2">
                <Pill className="size-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-400">{t.empty}</p>
              </div>
            ) : (
              medicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shrink-0">
                      <Pill className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 leading-tight">
                        {medicine.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500">
                        {medicine.dosage}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                        {medicine.time}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleTake(medicine.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all active:scale-95 ${
                        medicine.taken
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {medicine.taken ? t.taken : t.take}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteMedicine(medicine.id)}
                      aria-label={t.removeMedicine}
                      title={t.removeMedicine}
                      className="flex size-8 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 active:scale-95 transition-all"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {showAddForm ? (
              <form
                onSubmit={handleAddMedicine}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
              >
                <h4 className="text-xs font-black text-slate-900 uppercase">
                  {t.addNewMedicine}
                </h4>

                <input
                  type="text"
                  placeholder={t.medicineName}
                  aria-label={t.medicineName}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:outline-emerald-600"
                />

                <input
                  type="text"
                  placeholder={t.dosagePlaceholder}
                  aria-label={t.dosagePlaceholder}
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:outline-emerald-600"
                />

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-emerald-700 py-2 text-xs font-bold text-white hover:bg-emerald-800 active:scale-95"
                  >
                    {t.save}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 active:scale-95"
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="w-full rounded-2xl bg-emerald-700 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800 active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="size-4" />
                <span>{t.addMedicine}</span>
              </button>
            )}
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-4 text-center text-xs font-medium text-slate-500">
            {t.reminderStatus}
          </div>
        )}
      </main>
    </div>
  );
}
