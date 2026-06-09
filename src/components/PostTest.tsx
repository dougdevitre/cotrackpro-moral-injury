import { useState } from "react";
import type { TestQuestion, TestResult } from "../types";
import { gradeTest } from "../lib/courseProgress";

interface Props {
  questions: TestQuestion[];
  threshold: number;
  onResult: (r: TestResult) => void;
}

export function PostTest({ questions, threshold, onResult }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<TestResult | null>(null);

  const allAnswered = questions.every((q) => typeof answers[q.id] === "number");

  function grade() {
    const r = gradeTest(questions, answers, threshold);
    setResult(r);
    onResult(r);
  }
  function retake() {
    setAnswers({});
    setResult(null);
  }

  return (
    <div>
      {questions.map((q, qi) => {
        const chosen = answers[q.id];
        const isWrong = result && chosen !== q.correctIndex;
        return (
          <div className="mi-q-block" key={q.id}>
            <p className="mi-q" style={{ fontSize: 17 }}>
              {qi + 1}. {q.prompt}
            </p>
            <div className="mi-q-opts">
              {q.options.map((o, oi) => {
                const sel = chosen === oi;
                const showCorrect = result && oi === q.correctIndex;
                return (
                  <button
                    key={oi}
                    className={
                      "mi-q-opt" +
                      (sel ? " sel" : "") +
                      (showCorrect ? " correct" : "") +
                      (result && sel && !showCorrect ? " wrong" : "")
                    }
                    disabled={!!result}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
            {result && (
              <p className={"mi-q-exp" + (isWrong ? " wrong" : "")}>
                {isWrong ? "Not quite. " : "Correct. "}
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      {!result ? (
        <button className="mi-btn" disabled={!allAnswered} onClick={grade}>
          Submit answers
        </button>
      ) : (
        <div className="mi-card" style={{ marginTop: 8 }}>
          <p className="mi-h2" style={{ fontSize: 20, margin: 0 }}>
            {result.passed ? "Passed" : "Not yet passed"} — {result.correct}/{result.total} (
            {Math.round(result.pct * 100)}%)
          </p>
          <p className="mi-p" style={{ margin: "8px 0 12px" }}>
            {result.passed
              ? "You met the passing threshold. You can continue to the evaluation and certificate."
              : `The passing threshold is ${Math.round(threshold * 100)}%. Review the explanations above and try again.`}
          </p>
          {!result.passed && (
            <button className="mi-btn ghost" onClick={retake}>
              Retake the check
            </button>
          )}
        </div>
      )}
    </div>
  );
}
