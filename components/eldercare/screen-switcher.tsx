"use client";

import React, { useState } from "react";

// Sub-screen module imports
import * as ActualLoginScreenModule from "./actual-login-screen";
import * as AppointmentsScreenModule from "./appointments-screen";
import * as DailyWellbeingScreenModule from "./daily-wellbeing-screen";
import * as DashboardScreenModule from "./dashboard-screen";
import * as ElderRegistrationScreenModule from "./elder-registration-screen";
import * as FallDetectionModalModule from "./fall-detection-modal";
import * as FamilyHubScreenModule from "./family-hub-screen";
import * as LoginScreenModule from "./login-screen";
import * as MedicineAlarmModalModule from "./medicine-alarm-modal";
import * as MedicineCabinetScreenModule from "./medicine-cabinet-screen";
import * as PrescriptionResultScreenModule from "./prescription-result-screen";
import * as PrescriptionScannerScreenModule from "./prescription-scanner-screen";
import * as SosEmergencyScreenModule from "./sos-emergency-screen";
import * as VisuallyImpairedRegistrationScreenModule from "./visually-impaired-registration-screen";
import * as VoiceAssistantModalModule from "./voice-assistant-modal";
import * as VoiceFormScreenModule from "./voice-form-screen";

// Dynamic component resolver for named and default exports
function resolveComponent(mod: any) {
  return mod.default || Object.values(mod).find((val) => typeof val === "function") || (() => null);
}

const ActualLoginScreen = resolveComponent(ActualLoginScreenModule);
const AppointmentsScreen = resolveComponent(AppointmentsScreenModule);
const DailyWellbeingScreen = resolveComponent(DailyWellbeingScreenModule);
const DashboardScreen = resolveComponent(DashboardScreenModule);
const ElderRegistrationScreen = resolveComponent(ElderRegistrationScreenModule);
const FallDetectionModal = resolveComponent(FallDetectionModalModule);
const FamilyHubScreen = resolveComponent(FamilyHubScreenModule);
const LoginScreen = resolveComponent(LoginScreenModule);
const MedicineAlarmModal = resolveComponent(MedicineAlarmModalModule);
const MedicineCabinetScreen = resolveComponent(MedicineCabinetScreenModule);
const PrescriptionResultScreen = resolveComponent(PrescriptionResultScreenModule);
const PrescriptionScannerScreen = resolveComponent(PrescriptionScannerScreenModule);
const SosEmergencyScreen = resolveComponent(SosEmergencyScreenModule);
const VisuallyImpairedRegistrationScreen = resolveComponent(VisuallyImpairedRegistrationScreenModule);
const VoiceAssistantModal = resolveComponent(VoiceAssistantModalModule);
const VoiceFormScreen = resolveComponent(VoiceFormScreenModule);

export default function ScreenSwitcher() {
  const [currentScreen, setCurrentScreen] = useState<string>("dashboard");
  const [scannedData, setScannedData] = useState<{ mode: "prescription" | "strip_expiry"; text: string }>({
    mode: "strip_expiry",
    text: "",
  });

  // Safe universal mock props passed down to prevent missing prop crashes
  const mockProps = {
    language: "en",
    appointmentText: "2 upcoming appointments",
    waterCount: 3,
    medicineCount: 4,
    contactsCount: 2,
    scanMode: scannedData.mode,
    ocrText: scannedData.text,
    isOpen: true,
    onScanComplete: (mode: "prescription" | "strip_expiry", text: string) => {
      console.log("OCR scan completed:", mode, text);
      setScannedData({ mode, text });
      setCurrentScreen("prescriptionResult");
    },
    onBack: () => setCurrentScreen("dashboard"),
    onClose: () => setCurrentScreen("dashboard"),
    onOpenVoice: () => setCurrentScreen("voiceAssistant"),
    onSaveToCabinet: () => {
      alert("Saved to medicine cabinet!");
      setCurrentScreen("medicineCabinet");
    },
    onNavigate: (screen: string) => {
      if (screens[screen]) {
        setCurrentScreen(screen);
      } else {
        console.warn(`Screen ${screen} not mapped`);
      }
    },
  };

  const screens: Record<string, { label: string; Component: React.ComponentType<any> }> = {
    dashboard: { label: "Dashboard", Component: DashboardScreen },
    prescriptionScanner: { label: "Prescription Scanner", Component: PrescriptionScannerScreen },
    prescriptionResult: { label: "Prescription Result", Component: PrescriptionResultScreen },
    medicineCabinet: { label: "Medicine Cabinet", Component: MedicineCabinetScreen },
    appointments: { label: "Appointments", Component: AppointmentsScreen },
    dailyWellbeing: { label: "Daily Wellbeing", Component: DailyWellbeingScreen },
    familyHub: { label: "Family Hub", Component: FamilyHubScreen },
    login: { label: "Login", Component: LoginScreen },
    actualLogin: { label: "Actual Login", Component: ActualLoginScreen },
    elderRegistration: { label: "Elder Registration", Component: ElderRegistrationScreen },
    visuallyImpairedRegistration: { label: "Visually Impaired Registration", Component: VisuallyImpairedRegistrationScreen },
    voiceForm: { label: "Voice Form", Component: VoiceFormScreen },
    sosEmergency: { label: "SOS Emergency", Component: SosEmergencyScreen },
    medicineAlarm: { label: "Medicine Alarm Modal", Component: MedicineAlarmModal },
    voiceAssistant: { label: "Voice Assistant Modal", Component: VoiceAssistantModal },
    fallDetection: { label: "Fall Detection Modal", Component: FallDetectionModal },
  };

  const ActiveComponent = screens[currentScreen]?.Component;

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-300 bg-white/95 px-6 py-3 shadow-xs backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <span className="font-bold tracking-tight text-slate-800">
            Sanjeevani Elder Care
          </span>

          <div className="flex items-center gap-3">
            <label htmlFor="screen-select" className="text-xs font-semibold uppercase text-slate-500">
              Active Screen:
            </label>
            <select
              id="screen-select"
              value={currentScreen}
              onChange={(e) => setCurrentScreen(e.target.value)}
              className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-800 shadow-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            >
              {Object.entries(screens).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Screen Render Container */}
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          {ActiveComponent ? <ActiveComponent {...mockProps} /> : <p className="text-center text-slate-500">Screen not found.</p>}
        </div>
      </main>
    </div>
  );
}