'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  Bell,
  Activity,
  Mic,
} from 'lucide-react';
import { TalkBackProvider, useTalkBack } from './talkback-provider';
import { MedicineAlarmModal } from './medicine-alarm-modal';
import { FallDetectionModal } from './fall-detection-modal';
import { VoiceAssistantModal } from './voice-assistant-modal';
import { WelcomeScreen } from './welcome-screen';
import { ElderRegistrationScreen } from './elder-registration-screen';
import { VisuallyImpairedRegistrationScreen } from './visually-impaired-registration-screen';
import { VoiceFormScreen } from './voice-form-screen';
import { LoginScreen } from './login-screen';
import { ActualLoginScreen } from './actual-login-screen';
import { DashboardScreen } from './dashboard-screen';
import { PrescriptionScannerScreen } from './prescription-scanner-screen';
import { PrescriptionResultScreen } from './prescription-result-screen';
import { MedicineCabinetScreen } from './medicine-cabinet-screen';
import {
  AppointmentsScreen,
  INITIAL_APPOINTMENTS,
  type AppointmentItem,
} from './appointments-screen';
import { WaterTrackerScreen } from './water-tracker-screen';
import { DailyWellbeingScreen } from './daily-wellbeing-screen';
import {
  FamilyHubScreen,
  type EmergencyContact,
} from './family-hub-screen';
import { SosEmergencyScreen } from './sos-emergency-screen';

const SCREENS = [
  { id: 1, label: '1. Welcome' },
  { id: '2A', label: '2A. Elder Reg' },
  { id: 3, label: '3. Visually Imp' },
  { id: 4, label: '4. Voice Reg' },
  { id: 5, label: '5. Account Creation' },
  { id: 16, label: '16. Actual Login' },
  { id: 6, label: '6. Dashboard' },
  { id: 8, label: '8. Scanner' },
  { id: 9, label: '9. AI Result' },
  { id: 10, label: '10. Medicines' },
  { id: 11, label: '11. Appointments' },
  { id: 12, label: '12. Water' },
  { id: 13, label: '13. Wellbeing' },
  { id: 14, label: '14. Family Hub' },
  { id: 15, label: '15. SOS' },
] as const;

type ScreenId =
  | 1
  | '2A'
  | 3
  | 4
  | 5
  | 16
  | 6
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;

function ScreenSwitcherContent() {
  const [active, setActive] = useState<ScreenId>(1);
  const { isEnabled } = useTalkBack();

  const [language, setLanguage] = useState<string>('hi');
  const [waterCount, setWaterCount] = useState<number>(0);

  const [medicines, setMedicines] = useState<
    Array<{
      id: string;
      name: string;
      dosage: string;
      time: string;
      taken: boolean;
    }>
  >([
    {
      id: '1',
      name: '5545475',
      dosage: '6',
      time: '8:00 AM',
      taken: false,
    },
  ]);

  const [appointments, setAppointments] =
    useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);
  const [contactsCount, setContactsCount] = useState<number>(0);

  const upcomingAppointmentCount = appointments.filter(
    (appointment) => appointment.status === 'upcoming'
  ).length;

  const appointmentText =
    upcomingAppointmentCount === 0
      ? 'Koi Appointment Nahi'
      : `${upcomingAppointmentCount} Upcoming ${
          upcomingAppointmentCount === 1 ? 'Appointment' : 'Appointments'
        }`;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (!isEnabled) return;

    const audioGuides: Record<string, string> = {
      '1': 'Namaste! Sanjeevani Elder Care mein aapka swagat hai.',
      '2A': 'Elder registration screen.',
      '3': 'Visually impaired registration screen.',
      '4': 'Voice form khul gaya hai.',
      '5': 'Account creation screen.',
      '16': 'Login screen.',
      '6': 'Dashboard. Yahan aapki saari health details aur updates hain.',
      '8': 'Prescription scanner camera open ho gaya hai.',
      '9': 'Prescription result screen.',
      '10': 'Medicine cabinet screen.',
      '11': 'Doctor appointments screen.',
      '12': 'Water tracker screen.',
      '13': 'Daily wellbeing screen.',
      '14': 'Family hub khul gaya hai.',
      '15': 'Emergency SOS screen.',
    };

    const message = audioGuides[String(active)];

    if (
      message &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window
    ) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = language === 'en' ? 'en-US' : 'hi-IN';
      utterance.rate = 0.9;

      const timer = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [active, isEnabled, language]);

  const [showDevPanel, setShowDevPanel] = useState(false);
  const [activeScanMode, setActiveScanMode] = useState<
    'prescription' | 'strip_expiry'
  >('strip_expiry');
  const [showAlarm, setShowAlarm] = useState(false);
  const [showFallModal, setShowFallModal] = useState(false);
  const [showVoiceSaathi, setShowVoiceSaathi] = useState(false);

  useEffect(() => {
    let lastZ = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc || acc.z === null) return;

      const deltaZ = Math.abs((acc.z || 0) - lastZ);
      lastZ = acc.z || 0;

      if (deltaZ > 25) {
        setShowFallModal(true);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, []);

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-slate-50 shadow-2xl border-x border-slate-200">
      <div className="hidden sticky top-2 z-40 flex items-center justify-between px-3 pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowVoiceSaathi(true)}
            className="flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-black text-white shadow-lg hover:bg-emerald-700 transition-all border border-emerald-400 active:scale-95"
            title="Open Voice Assistant Saathi"
          >
            <Mic className="size-3" />
            <span>Saathi</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAlarm(true)}
            className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-[11px] font-black text-slate-950 shadow-lg hover:bg-amber-400 transition-all border border-amber-300 active:scale-95"
          >
            <Bell className="size-3 fill-current" />
            <span>Alarm</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFallModal(true)}
            className="flex items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-[11px] font-black text-white shadow-lg hover:bg-red-700 transition-all border border-red-400 active:scale-95"
          >
            <Activity className="size-3" />
            <span>Fall</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowDevPanel(!showDevPanel)}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-slate-900/90 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg hover:bg-slate-950 transition-all border border-white/20 active:scale-95"
        >
          <Layers className="size-3.5 text-emerald-400" />
          <span>Screen: {active}</span>
          {showDevPanel ? (
            <ChevronUp className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )}
        </button>
      </div>

      {showDevPanel && (
        <div className="sticky top-11 z-40 mx-3 mb-2 rounded-2xl bg-slate-900/95 p-3 text-white shadow-2xl backdrop-blur-md border border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-1.5">
            <span>Direct Jump to Any Screen</span>
            <span className="text-emerald-400">15 Screens Active</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
            {SCREENS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActive(s.id as ScreenId);
                  setShowDevPanel(false);
                }}
                className={`rounded-xl px-2.5 py-1.5 text-left text-[11px] font-semibold transition-all ${
                  active === s.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1">
        {active === 1 && (
          <WelcomeScreen
            language={language}
            setLanguage={setLanguage}
            onSelectElderly={() => setActive(5)}
            onSelectVisuallyImpaired={() => setActive(3)}
          />
        )}

        {active === '2A' && (
          <ElderRegistrationScreen
            language={language}
            onBack={() => setActive(5)}
            onNext={() => setActive(6)}
          />
        )}

        {active === 3 && (
          <VisuallyImpairedRegistrationScreen
            onBack={() => setActive(1)}
            onContinue={(mode) => {
              if (mode === 'voice') setActive(4);
              else setActive(5);
            }}
          />
        )}

        {active === 4 && (
          <VoiceFormScreen
            language={language}
            onBack={() => setActive(3)}
            onSubmitSuccess={() => setActive(6)}
          />
        )}

        {active === 5 && (
          <LoginScreen
            language={language}
            onLoginSuccess={() => setActive('2A')}
            onContinueGuest={() => setActive('2A')}
            onGoToRegister={() => setActive(16)}
          />
        )}

        {active === 16 && (
          <ActualLoginScreen
            language={language}
            onLoginSuccess={() => setActive(6)}
            onContinueGuest={() => setActive(6)}
            onGoToRegister={() => setActive(5)}
          />
        )}

        {active === 6 && (
          <DashboardScreen
            language={language}
            waterCount={waterCount}
            medicineCount={medicines.length}
            appointmentText={appointmentText}
            contactsCount={contactsCount}
            onOpenVoice={() => setShowVoiceSaathi(true)}
            onNavigate={(id) => setActive(id)}
          />
        )}

        {active === 8 && (
          <PrescriptionScannerScreen
            language={language}
            onBack={() => setActive(6)}
            onScanComplete={(mode) => {
              setActiveScanMode(mode);
              setActive(9);
            }}
          />
        )}

        {active === 9 && (
          <PrescriptionResultScreen
            language={language}
            scanMode={activeScanMode}
            onBack={() => setActive(8)}
            onSaveToCabinet={() => {
              setActive(10);
            }}
          />
        )}

        {active === 10 && (
          <MedicineCabinetScreen
            language={language}
            medicines={medicines}
            setMedicines={setMedicines}
            onBack={() => setActive(6)}
          />
        )}

        {active === 11 && (
          <AppointmentsScreen
            appointments={appointments}
            setAppointments={setAppointments}
            onBack={() => setActive(6)}
          />
        )}

        {active === 12 && (
          <WaterTrackerScreen
            language={language}
            waterCount={waterCount}
            setWaterCount={setWaterCount}
            onBack={() => setActive(6)}
          />
        )}

        {active === 13 && (
          <DailyWellbeingScreen
            language={language}
            onBack={() => setActive(6)}
          />
        )}

        {active === 14 && (
          <FamilyHubScreen
            language={language}
            onBack={() => setActive(6)}
          />
        )}

        {active === 15 && (
          <SosEmergencyScreen
            language={language}
            onCancel={() => setActive(6)}
          />
        )}
      </div>

      {showAlarm && (
        <MedicineAlarmModal
          medicineName="Paracetamol 500 mg"
          dosage="1 tablet (After Lunch)"
          onTake={() => setShowAlarm(false)}
          onSnooze={() => setShowAlarm(false)}
        />
      )}

      <FallDetectionModal
        isOpen={showFallModal}
        onCancel={() => setShowFallModal(false)}
      />

      <VoiceAssistantModal
        isOpen={showVoiceSaathi}
        onClose={() => setShowVoiceSaathi(false)}
        onActionTrigger={(action) => {
          if (action === 'SOS_TRIGGERED') setActive(15);
          if (action === 'MEDICINE_TAKEN') setActive(10);
          if (action === 'WATER_ADDED') {
            setWaterCount((prev) => prev + 1);
          }
        }}
      />
    </div>
  );
}

export function ScreenSwitcher() {
  return (
    <TalkBackProvider>
      <ScreenSwitcherContent />
    </TalkBackProvider>
  );
}
