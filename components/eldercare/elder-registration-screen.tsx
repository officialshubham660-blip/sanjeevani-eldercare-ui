'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Plus,
  X,
  Trash2,
} from 'lucide-react';
import { Logo } from './logo';
import { setStoredProfile } from './state-store';

interface ElderRegistrationScreenProps {
  language: string;
  onBack: () => void;
  onNext: () => void;
}

interface FamilyMember {
  id: number;
  name: string;
  relation: string;
  phone: string;
}

const COPY: Record<
  string,
  {
    back: string;
    subtitle: string;
    title: string;
    desc: string;
    nameLabel: string;
    namePlace: string;
    ageLabel: string;
    agePlace: string;
    genderLabel: string;
    genderFemale: string;
    genderMale: string;
    genderOther: string;
    phoneLabel: string;
    phonePlace: string;
    cityLabel: string;
    cityPlace: string;
    medLabel: string;
    medPlace: string;
    familyTitle: string;
    addMember: string;
    submitBtn: string;
    modalTitle: string;
    modalNameLabel: string;
    modalNamePlace: string;
    modalRelationLabel: string;
    relSon: string;
    relDaughter: string;
    relSpouse: string;
    relDaughterInLaw: string;
    relCaregiver: string;
    modalPhoneLabel: string;
    modalPhonePlace: string;
    cancel: string;
    modalAdd: string;
    removeMember: string;
  }
> = {
  en: {
    back: 'Go back',
    subtitle: 'Elder Profile Setup',
    title: 'Tell Us About Yourself',
    desc: 'This helps us customize reminders and emergency contacts.',
    nameLabel: 'Full Name',
    namePlace: 'e.g. Shanti Devi',
    ageLabel: 'Age (Years)',
    agePlace: 'e.g. 72',
    genderLabel: 'Gender',
    genderFemale: 'Female',
    genderMale: 'Male',
    genderOther: 'Other',
    phoneLabel: 'Mobile Number',
    phonePlace: '+91 98765 43210',
    cityLabel: 'City / Location',
    cityPlace: 'e.g. Delhi NCR',
    medLabel: 'Known Health Conditions',
    medPlace: 'e.g. BP, Diabetes, Arthritis',
    familyTitle: 'Emergency Family Contacts (Screen 2B)',
    addMember: 'Add Member',
    submitBtn: 'Save & Continue to Login',
    modalTitle: '2B. Add Family Member',
    modalNameLabel: 'Full Name',
    modalNamePlace: 'e.g. Pooja Sharma',
    modalRelationLabel: 'Relationship',
    relSon: 'Son',
    relDaughter: 'Daughter',
    relSpouse: 'Spouse',
    relDaughterInLaw: 'Daughter-in-law',
    relCaregiver: 'Caregiver',
    modalPhoneLabel: 'Phone Number',
    modalPhonePlace: '+91 98123 45678',
    cancel: 'Cancel',
    modalAdd: 'Add Member',
    removeMember: 'Remove family member',
  },
  hi: {
    back: 'वापस जाएँ',
    subtitle: 'बुजुर्ग प्रोफ़ाइल सेटअप',
    title: 'अपने बारे में बताइए',
    desc: 'इससे हमें रिमाइंडर और आपातकालीन संपर्कों को आपके अनुसार बनाने में मदद मिलती है।',
    nameLabel: 'पूरा नाम',
    namePlace: 'जैसे: शांति देवी',
    ageLabel: 'आयु (वर्ष)',
    agePlace: 'जैसे: 72',
    genderLabel: 'लिंग',
    genderFemale: 'महिला',
    genderMale: 'पुरुष',
    genderOther: 'अन्य',
    phoneLabel: 'मोबाइल नंबर',
    phonePlace: '+91 98765 43210',
    cityLabel: 'शहर / स्थान',
    cityPlace: 'जैसे: दिल्ली एनसीआर',
    medLabel: 'ज्ञात स्वास्थ्य स्थितियाँ',
    medPlace: 'जैसे: बीपी, मधुमेह, गठिया',
    familyTitle: 'आपातकालीन पारिवारिक संपर्क (स्क्रीन 2B)',
    addMember: 'सदस्य जोड़ें',
    submitBtn: 'सहेजें और लॉगिन पर आगे बढ़ें',
    modalTitle: '2B. परिवार का सदस्य जोड़ें',
    modalNameLabel: 'पूरा नाम',
    modalNamePlace: 'जैसे: पूजा शर्मा',
    modalRelationLabel: 'रिश्ता',
    relSon: 'बेटा',
    relDaughter: 'बेटी',
    relSpouse: 'पति/पत्नी',
    relDaughterInLaw: 'बहू',
    relCaregiver: 'देखभाल करने वाला',
    modalPhoneLabel: 'फ़ोन नंबर',
    modalPhonePlace: '+91 98123 45678',
    cancel: 'रद्द करें',
    modalAdd: 'सदस्य जोड़ें',
    removeMember: 'परिवार का सदस्य हटाएँ',
  },
  mr: {
    back: 'मागे जा',
    subtitle: 'ज्येष्ठ नागरिक प्रोफाइल सेटअप',
    title: 'तुमच्याबद्दल सांगा',
    desc: 'यामुळे आम्हाला आठवणी आणि आपत्कालीन संपर्क तुमच्यानुसार सेट करता येतील.',
    nameLabel: 'पूर्ण नाव',
    namePlace: 'उदा. शांती देवी',
    ageLabel: 'वय (वर्षे)',
    agePlace: 'उदा. ७२',
    genderLabel: 'लिंग',
    genderFemale: 'स्त्री',
    genderMale: 'पुरुष',
    genderOther: 'इतर',
    phoneLabel: 'मोबाइल नंबर',
    phonePlace: '+91 98765 43210',
    cityLabel: 'शहर / ठिकाण',
    cityPlace: 'उदा. दिल्ली एनसीआर',
    medLabel: 'माहित असलेल्या आरोग्याच्या समस्या',
    medPlace: 'उदा. रक्तदाब, मधुमेह, संधिवात',
    familyTitle: 'आपत्कालीन कौटुंबिक संपर्क (स्क्रीन 2B)',
    addMember: 'सदस्य जोडा',
    submitBtn: 'जतन करा आणि लॉगिनकडे पुढे जा',
    modalTitle: '2B. कुटुंबातील सदस्य जोडा',
    modalNameLabel: 'पूर्ण नाव',
    modalNamePlace: 'उदा. पूजा शर्मा',
    modalRelationLabel: 'नाते',
    relSon: 'मुलगा',
    relDaughter: 'मुलगी',
    relSpouse: 'जोडीदार',
    relDaughterInLaw: 'सून',
    relCaregiver: 'काळजीवाहक',
    modalPhoneLabel: 'फोन नंबर',
    modalPhonePlace: '+91 98123 45678',
    cancel: 'रद्द करा',
    modalAdd: 'सदस्य जोडा',
    removeMember: 'कुटुंबातील सदस्य हटवा',
  },
  bn: {
    back: 'ফিরে যান',
    subtitle: 'প্রবীণ প্রোফাইল সেটআপ',
    title: 'আপনার সম্পর্কে বলুন',
    desc: 'এতে আপনার জন্য স্মরণবার্তা ও জরুরি যোগাযোগ সাজাতে আমাদের সুবিধা হবে।',
    nameLabel: 'পুরো নাম',
    namePlace: 'যেমন: শান্তি দেবী',
    ageLabel: 'বয়স (বছর)',
    agePlace: 'যেমন: ৭২',
    genderLabel: 'লিঙ্গ',
    genderFemale: 'মহিলা',
    genderMale: 'পুরুষ',
    genderOther: 'অন্যান্য',
    phoneLabel: 'মোবাইল নম্বর',
    phonePlace: '+91 98765 43210',
    cityLabel: 'শহর / অবস্থান',
    cityPlace: 'যেমন: দিল্লি এনসিআর',
    medLabel: 'পরিচিত স্বাস্থ্য সমস্যা',
    medPlace: 'যেমন: রক্তচাপ, ডায়াবেটিস, বাত',
    familyTitle: 'জরুরি পারিবারিক যোগাযোগ (স্ক্রিন 2B)',
    addMember: 'সদস্য যোগ করুন',
    submitBtn: 'সংরক্ষণ করে লগইনে এগিয়ে যান',
    modalTitle: '2B. পরিবারের সদস্য যোগ করুন',
    modalNameLabel: 'পুরো নাম',
    modalNamePlace: 'যেমন: পূজা শর্মা',
    modalRelationLabel: 'সম্পর্ক',
    relSon: 'ছেলে',
    relDaughter: 'মেয়ে',
    relSpouse: 'স্বামী/স্ত্রী',
    relDaughterInLaw: 'পুত্রবধূ',
    relCaregiver: 'যত্নকারী',
    modalPhoneLabel: 'ফোন নম্বর',
    modalPhonePlace: '+91 98123 45678',
    cancel: 'বাতিল করুন',
    modalAdd: 'সদস্য যোগ করুন',
    removeMember: 'পরিবারের সদস্য সরান',
  },
};

export function ElderRegistrationScreen({
  language,
  onBack,
  onNext,
}: ElderRegistrationScreenProps) {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('female');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');

  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [fmName, setFmName] = useState('');
  const [fmRelation, setFmRelation] = useState('Son');
  const [fmPhone, setFmPhone] = useState('');

  const t = COPY[language] ?? COPY.hi;

  const relationLabels: Record<string, string> = {
    Son: t.relSon,
    Daughter: t.relDaughter,
    Spouse: t.relSpouse,
    'Daughter-in-law': t.relDaughterInLaw,
    Caregiver: t.relCaregiver,
  };

  const handleAddMember = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fmName.trim() || !fmPhone.trim()) return;

    setFamilyMembers((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: fmName.trim(),
        relation: fmRelation,
        phone: fmPhone.trim(),
      },
    ]);

    setFmName('');
    setFmPhone('');
    setShowFamilyModal(false);
  };

  const handleRemoveMember = (id: number) => {
    setFamilyMembers((previous) =>
      previous.filter((member) => member.id !== id)
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStoredProfile({
      name: fullName.trim() || 'Shanti Devi',
      age: age.trim() || '72',
      city: city.trim() || 'Delhi',
      avatar: gender === 'male' ? '👴' : '👵',
    });

    onNext();
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

        <Logo size="sm" />
        <div className="w-10" />
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-5 pt-6 space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-700">
            {t.subtitle}
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">
            {t.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="elder-full-name"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              {t.nameLabel}
            </label>
            <div className="relative">
              <input
                id="elder-full-name"
                type="text"
                required
                placeholder={t.namePlace}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <User
                aria-hidden="true"
                className="absolute right-3.5 top-3.5 size-4 text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="elder-age"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                {t.ageLabel}
              </label>
              <input
                id="elder-age"
                type="number"
                required
                placeholder={t.agePlace}
                value={age}
                onChange={(event) => setAge(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="elder-gender"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                {t.genderLabel}
              </label>
              <select
                id="elder-gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="female">{t.genderFemale}</option>
                <option value="male">{t.genderMale}</option>
                <option value="other">{t.genderOther}</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="elder-phone"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              {t.phoneLabel}
            </label>
            <div className="relative">
              <input
                id="elder-phone"
                type="tel"
                required
                placeholder={t.phonePlace}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Phone
                aria-hidden="true"
                className="absolute right-3.5 top-3.5 size-4 text-slate-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="elder-city"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              {t.cityLabel}
            </label>
            <div className="relative">
              <input
                id="elder-city"
                type="text"
                required
                placeholder={t.cityPlace}
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <MapPin
                aria-hidden="true"
                className="absolute right-3.5 top-3.5 size-4 text-slate-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="elder-medical-conditions"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              {t.medLabel}
            </label>
            <input
              id="elder-medical-conditions"
              type="text"
              placeholder={t.medPlace}
              value={medicalConditions}
              onChange={(event) => setMedicalConditions(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-black text-slate-900">
                {t.familyTitle}
              </label>
              <button
                type="button"
                onClick={() => setShowFamilyModal(true)}
                className="flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
              >
                <Plus className="size-3.5" />
                {t.addMember}
              </button>
            </div>

            <div className="space-y-2">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {member.name} ({relationLabels[member.relation] ?? member.relation})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {member.phone}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id)}
                    aria-label={t.removeMember}
                    title={t.removeMember}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-700 py-3.5 text-xs font-black text-white shadow-md hover:bg-emerald-800 active:scale-98 transition-all tracking-wide"
          >
            {t.submitBtn}
          </button>
        </form>
      </main>

      {showFamilyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">
                {t.modalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowFamilyModal(false)}
                aria-label={t.cancel}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label
                  htmlFor="family-member-name"
                  className="block text-[11px] font-bold text-slate-700 mb-1"
                >
                  {t.modalNameLabel}
                </label>
                <input
                  id="family-member-name"
                  type="text"
                  required
                  placeholder={t.modalNamePlace}
                  value={fmName}
                  onChange={(event) => setFmName(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="family-member-relation"
                  className="block text-[11px] font-bold text-slate-700 mb-1"
                >
                  {t.modalRelationLabel}
                </label>
                <select
                  id="family-member-relation"
                  value={fmRelation}
                  onChange={(event) => setFmRelation(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                >
                  <option value="Son">{t.relSon}</option>
                  <option value="Daughter">{t.relDaughter}</option>
                  <option value="Spouse">{t.relSpouse}</option>
                  <option value="Daughter-in-law">{t.relDaughterInLaw}</option>
                  <option value="Caregiver">{t.relCaregiver}</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="family-member-phone"
                  className="block text-[11px] font-bold text-slate-700 mb-1"
                >
                  {t.modalPhoneLabel}
                </label>
                <input
                  id="family-member-phone"
                  type="tel"
                  required
                  placeholder={t.modalPhonePlace}
                  value={fmPhone}
                  onChange={(event) => setFmPhone(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFamilyModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow"
                >
                  {t.modalAdd}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
