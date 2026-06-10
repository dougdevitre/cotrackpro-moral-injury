import { useCallback, useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import type { CustomHabit, PracticePlan, ScoreProfile, View } from "./types";
import { Nav } from "./components/Nav";
import { Home } from "./components/Home";
import { CourseHub } from "./components/CourseHub";
import { ReflectFlow } from "./components/ReflectFlow";
import { DecideHub } from "./components/DecideHub";
import { PracticeHub } from "./components/PracticeHub";
import { RulesReference } from "./components/RulesReference";
import { LongView } from "./components/LongView";
import { CommitDeclaration } from "./components/CommitDeclaration";
import { ShareStudio } from "./components/ShareStudio";
import { Onboarding } from "./components/Onboarding";
import { About } from "./components/About";
import { Footer } from "./components/Footer";
import { hasCustomHabit } from "./lib/practice";
import {
  hasConsent,
  hasWelcomed,
  loadPlan,
  markWelcomed,
  savePlan,
  setConsent,
  storageAvailable,
} from "./lib/storage";

const EMPTY_PLAN: PracticePlan = { commitments: [], habitIds: [], customHabits: [] };

export default function App() {
  const [view, setView] = useState<View>("home");
  const [profile, setProfile] = useState<ScoreProfile | null>(null);
  const [toast, setToast] = useState("");

  // First-run onboarding + the role it captures (for prefilling modules).
  const [welcomed, setWelcomed] = useState<boolean>(() => hasWelcomed());
  const [roleId, setRoleId] = useState<string | null>(null);

  function dismissOnboarding() {
    markWelcomed();
    setWelcomed(true);
  }

  // Opt-in, on-device-only persistence.
  const [persist, setPersistState] = useState<boolean>(() => storageAvailable() && hasConsent());
  const [plan, setPlan] = useState<PracticePlan>(() => loadPlan() ?? EMPTY_PLAN);

  // Persist on change when the user has opted in.
  useEffect(() => {
    if (persist) savePlan(plan);
  }, [plan, persist]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  // Scroll to top on top-level navigation.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const onToast = useCallback((msg: string) => setToast(msg), []);
  const handleProfile = useCallback((p: ScoreProfile) => setProfile(p), []);

  const addLeverageHabit = useCallback(
    (habit: CustomHabit) => {
      setPlan((p) => (hasCustomHabit(p, habit) ? p : { ...p, customHabits: [...p.customHabits, habit] }));
      setToast("Added to your practice plan");
    },
    []
  );

  function setPersist(on: boolean) {
    setPersistState(on);
    setConsent(on, on ? plan : undefined);
    onToast(on ? "Plan will be kept on this device" : "Saved plan cleared from this device");
  }

  return (
    <div className="mi-root">
      <a className="mi-skip" href="#main-content">
        Skip to content
      </a>
      <Nav view={view} onNavigate={setView} />
      <main id="main-content" className="mi-wrap">
        {view === "home" && <Home onNavigate={setView} />}

        {view === "course" && <CourseHub onNavigate={setView} onToast={onToast} />}

        {view === "reflect" && (
          <ReflectFlow
            onComplete={handleProfile}
            onToast={onToast}
            onGoToPractice={() => setView("practice")}
          />
        )}

        {view === "decide" && <DecideHub />}

        {view === "standards" && <RulesReference />}

        {view === "longview" && <LongView plan={plan} onAddHabit={addLeverageHabit} />}

        {view === "commit" && <CommitDeclaration onToast={onToast} />}

        {view === "share" && (
          <ShareStudio profile={profile} defaultRoleId={roleId} onToast={onToast} />
        )}

        {view === "about" && <About />}

        {view === "practice" && (
          <PracticeHub
            profile={profile}
            plan={plan}
            setPlan={setPlan}
            persist={persist}
            setPersist={setPersist}
            onToast={onToast}
          />
        )}
      </main>
      <Footer onNavigate={setView} />
      {toast && <div className="mi-toast">{toast}</div>}
      {!welcomed && (
        <Onboarding
          onPick={(rid, v) => {
            if (rid) setRoleId(rid);
            dismissOnboarding();
            setView(v);
          }}
          onSkip={dismissOnboarding}
        />
      )}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
