'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Phone, UserCheck, Heart } from 'lucide-react';

interface LoginScreenProps {
  language: string;
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
  onContinueGuest: () => void;
}

const COPY: Record<
  string,
  {
    title: string;
    subtitle: string;
    labelId: string;
    placeholderId: string;
    labelPass: string;
    placeholderPass: string;
    signUp: string;
    showPassword: string;
    hidePassword: string;
    or: string;
    guest: string;
    hasAccount: string;
    loginLink: string;
  }
> = {
  en: {
    title: 'Create Account',
    subtitle:
      'Sign up for your Sanjeevani account to stay healthy and connected',
    labelId: 'Mobile Number or Email',
    placeholderId: 'Enter mobile number or email',
    labelPass: 'Set Password',
    placeholderPass: 'Create password',
    signUp: 'Sign Up',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    or: 'OR',
    guest: 'Continue as Guest',
    hasAccount: 'Already have an account?',
    loginLink: 'Login here',
  },
  hi: {
    title: 'खाता बनाएँ',
    subtitle: 'स्वस्थ और जुड़े रहने के लिए अपना संजीवनी खाता बनाएँ',
    labelId: 'मोबाइल नंबर या ईमेल',
    placeholderId: 'मोबाइल नंबर या ईमेल दर्ज करें',
    labelPass: 'पासवर्ड सेट करें',
    placeholderPass: 'पासवर्ड बनाएँ',
    signUp: 'साइन अप करें',
    showPassword: 'पासवर्ड दिखाएँ',
    hidePassword: 'पासवर्ड छिपाएँ',
    or: 'या',
    guest: 'गेस्ट के रूप में जारी रखें',
    hasAccount: 'क्या आपका पहले से खाता है?',
    loginLink: 'यहाँ लॉगिन करें',
  },
  mr: {
    title: 'खाते तयार करा',
    subtitle:
      'निरोगी आणि संपर्कात राहण्यासाठी तुमचे संजीवनी खाते तयार करा',
    labelId: 'मोबाइल नंबर किंवा ईमेल',
    placeholderId: 'मोबाइल नंबर किंवा ईमेल टाका',
    labelPass: 'पासवर्ड सेट करा',
    placeholderPass: 'पासवर्ड तयार करा',
    signUp: 'साइन अप करा',
    showPassword: 'पासवर्ड दाखवा',
    hidePassword: 'पासवर्ड लपवा',
    or: 'किंवा',
    guest: 'पाहुणे म्हणून पुढे जा',
    hasAccount: 'तुमचे खाते आधीपासून आहे का?',
    loginLink: 'येथे लॉगिन करा',
  },
  bn: {
    title: 'অ্যাকাউন্ট তৈরি করুন',
    subtitle:
      'সুস্থ ও সংযুক্ত থাকতে আপনার সঞ্জীবনী অ্যাকাউন্টে সাইন আপ করুন',
    labelId: 'মোবাইল নম্বর বা ইমেল',
    placeholderId: 'মোবাইল নম্বর বা ইমেল লিখুন',
    labelPass: 'পাসওয়ার্ড সেট করুন',
    placeholderPass: 'পাসওয়ার্ড তৈরি করুন',
    signUp: 'সাইন আপ করুন',
    showPassword: 'পাসওয়ার্ড দেখান',
    hidePassword: 'পাসওয়ার্ড লুকান',
    or: 'অথবা',
    guest: 'অতিথি হিসেবে চালিয়ে যান',
    hasAccount: 'আপনার কি আগে থেকেই অ্যাকাউন্ট আছে?',
    loginLink: 'এখানে লগইন করুন',
  },
};

export function LoginScreen({
  language,
  onLoginSuccess,
  onGoToRegister,
  onContinueGuest,
}: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const t = COPY[language] ?? COPY.hi;

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!identifier.trim() || !password.trim()) return;

    try {
      localStorage.setItem(
        'user_session',
        JSON.stringify({
          user: identifier,
          loggedInAt: Date.now(),
        })
      );
    } catch (error) {
      console.error(error);
    }

    onLoginSuccess();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] text-slate-800 pb-10 select-none">
      <header className="flex items-center justify-center border-b border-slate-200 bg-white px-4 py-4 shadow-xs">
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
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-5 pt-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-500 font-medium">
            Sign up for your Sanjeevani account to stay healthy and connected
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          <div>
            <label
              htmlFor="signup-identifier"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              {t.labelId}
            </label>
            <div className="relative">
              <input
                id="signup-identifier"
                type="text"
                required
                placeholder={t.placeholderId}
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
              <Phone
                aria-hidden="true"
                className="absolute right-3.5 top-3.5 size-4 text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Set Password</label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Create password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-11 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? t.hidePassword : t.showPassword}
                className="absolute right-3 top-3 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-emerald-700 active:scale-[0.99]"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] font-bold text-slate-400">{t.or}</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={onContinueGuest}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 active:scale-[0.99]"
        >
          <UserCheck className="size-4" />
          {t.guest}
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onGoToRegister}
              className="font-bold text-emerald-700 hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
