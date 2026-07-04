import { useEffect, useMemo, useState } from "react";
import type { Answers, Role, ScoreProfile } from "../types";
import { itemsForRole } from "../data/itemSet";
import { computeScores } from "../lib/scoring";
import { interpret } from "../lib/interpret";
import { Intro } from "./Intro";
import { RoleSelect } from "./RoleSelect";
import { Assessment } from "./Assessment";
import { Results } from "./Results";

type SubStage = "intro" | "role" | "assess" | "results";

interface Props {
  onComplete: (profile: ScoreProfile) => void;
  onToast: (msg: string) => void;
  onGoToPractice: () => void;
}

export function ReflectFlow({ onComplete, onToast, onGoToPractice }: Props) {
  const [stage, setStage] = useState<SubStage>("intro");
  const [role, setRole] = useState<Role | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const items = useMemo(() => itemsForRole(role?.id ?? null), [role]);

  const scores = useMemo(
    () => (stage === "results" ? computeScores(items, answers) : null),
    [stage, items, answers]
  );
  const reading = useMemo(() => (scores ? interpret(scores, role) : null), [scores, role]);

  // Lift the profile up once results are computed, so Practice can tailor to it.
  useEffect(() => {
    if (scores) onComplete({ scores, roleId: role?.id ?? null });
  }, [scores, role, onComplete]);

  function handleAnswer(value: number) {
    const id = items[index].id;
    setAnswers((a) => ({ ...a, [id]: value }));
  }
  function next() {
    if (index < items.length - 1) setIndex(index + 1);
    else setStage("results");
  }
  function prev() {
    if (index > 0) setIndex(index - 1);
    else setStage("role");
  }
  function restart() {
    setAnswers({});
    setRole(null);
    setIndex(0);
    setStage("intro");
  }

  async function copySummary(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      onToast("Result summary copied");
    } catch {
      onToast("Copy failed — select & copy manually");
    }
  }

  return (
    <>
      {/* The intro carries the visible <h1>; later steps lead with section
          headings, so provide one stable page heading for those states. */}
      {stage !== "intro" && <h1 className="mi-sr-only">Moral Injury Self-Reflection</h1>}

      {stage === "intro" && <Intro onBegin={() => setStage("role")} />}

      {stage === "role" && (
        <RoleSelect
          selected={role}
          onSelect={setRole}
          onBack={() => setStage("intro")}
          onNext={() => {
            setIndex(0);
            setStage("assess");
          }}
        />
      )}

      {stage === "assess" && items.length > 0 && (
        <Assessment
          items={items}
          index={index}
          answers={answers}
          onAnswer={handleAnswer}
          onPrev={prev}
          onNext={next}
        />
      )}

      {stage === "results" && scores && reading && (
        <Results
          scores={scores}
          reading={reading}
          role={role}
          onCopy={copySummary}
          onRestart={restart}
          onGoToPractice={onGoToPractice}
        />
      )}
    </>
  );
}
