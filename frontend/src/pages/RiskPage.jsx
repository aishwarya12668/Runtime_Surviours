import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const QUESTIONS = [
  {
    id: "ageGroup",
    text: "What is your age group?",
    options: [
      { label: "Under 30", score: 0 },
      { label: "30-39", score: 1 },
      { label: "40-49", score: 2 },
      { label: "50-59", score: 3 },
      { label: "60 or above", score: 4 },
    ],
  },
  {
    id: "familyHistory",
    text: "Do you have a family history of breast cancer?",
    options: [
      { label: "No family history", score: 0 },
      { label: "Distant relative", score: 1 },
      { label: "First-degree relative (mother/sister)", score: 3 },
      { label: "Multiple family members", score: 4 },
    ],
  },
  {
    id: "biopsyHistory",
    text: "Have you ever had a breast biopsy?",
    options: [
      { label: "No", score: 0 },
      { label: "Yes, with benign result", score: 1 },
      { label: "Yes, with atypical cells", score: 3 },
    ],
  },
  {
    id: "hormoneTherapy",
    text: "Have you used hormone replacement therapy?",
    options: [
      { label: "Never", score: 0 },
      { label: "Less than 5 years", score: 1 },
      { label: "More than 5 years", score: 2 },
    ],
  },
  {
    id: "lifestyle",
    text: "Which describes your lifestyle best?",
    options: [
      { label: "Active, healthy diet, no alcohol", score: 0 },
      { label: "Moderately active", score: 1 },
      { label: "Sedentary, regular alcohol use", score: 3 },
    ],
  },
  {
    id: "breastChanges",
    text: "Have you noticed any breast changes?",
    options: [
      { label: "No changes", score: 0 },
      { label: "Minor changes (tenderness)", score: 2 },
      { label: "Lump or significant change", score: 5 },
    ],
  },
];

const resultForScore = (score) => {
  if (score <= 5) {
    return {
      level: "Low",
      suggestions: [
        "Continue yearly clinical screening and monthly self-checks.",
        "Maintain active lifestyle and balanced diet.",
      ],
    };
  }
  if (score <= 10) {
    return {
      level: "Moderate",
      suggestions: [
        "Schedule a consultation with an oncologist or breast specialist.",
        "Consider earlier mammogram/ultrasound based on doctor advice.",
      ],
    };
  }
  return {
    level: "High",
    suggestions: [
      "Book an urgent specialist consultation as soon as possible.",
      "Do not delay diagnostic imaging and follow-up tests.",
      "Seek immediate care if symptoms worsen suddenly.",
    ],
  };
};

export default function RiskPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const question = QUESTIONS[current];
  const progress = ((current + 1) / QUESTIONS.length) * 100;

  const score = useMemo(
    () =>
      Object.values(answers).reduce((sum, answer) => {
        if (!answer) return sum;
        return sum + answer.score;
      }, 0),
    [answers]
  );

  const result = resultForScore(score);

  useEffect(() => {
    if (!showResult) return;
    localStorage.setItem(
      "nivaraRiskAssessment",
      JSON.stringify({
        level: result.level,
        score,
        suggestions: result.suggestions,
        updatedAt: new Date().toISOString(),
      })
    );
  }, [showResult, result.level, result.suggestions, score]);

  const selectAnswer = (option) => {
    setAnswers((prev) => ({ ...prev, [question.id]: option }));
  };

  const next = () => {
    if (!answers[question.id]) return;
    if (current === QUESTIONS.length - 1) {
      setShowResult(true);
      return;
    }
    setCurrent((prev) => prev + 1);
  };

  const back = () => {
    if (current === 0) return;
    setCurrent((prev) => prev - 1);
  };

  const restart = () => {
    setCurrent(0);
    setAnswers({});
    setShowResult(false);
  };

  return (
    <div className="page">
      <div className="container list-stack">
        <h1 className="page-title">Risk Screening</h1>
        <p className="page-subtitle">Answer a few questions to assess your breast cancer risk.</p>

        <div className="panel" style={{ maxWidth: "860px", margin: "0 auto" }}>
          {!showResult ? (
            <>
              <p className="muted">Question {current + 1} of {QUESTIONS.length}</p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <h3>{question.text}</h3>

              <div className="list-stack">
                {question.options.map((option) => {
                  const isSelected = answers[question.id]?.label === option.label;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => selectAnswer(option)}
                      className={`option-card ${isSelected ? "selected" : ""}`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: "0.7rem", marginTop: "1rem" }}>
                <button className="btn secondary-btn" type="button" onClick={back} disabled={current === 0}>
                  Previous
                </button>
                <button className="btn" type="button" onClick={next} disabled={!answers[question.id]}>
                  {current === QUESTIONS.length - 1 ? "Show Result" : "Next Question"}
                </button>
              </div>
            </>
          ) : (
            <div className="list-stack">
              <h3>Your Risk Level: {result.level}</h3>
              <p className="muted">Screening score: {score}</p>
              <div className="panel">
                <strong>Suggestions</strong>
                <ul style={{ marginBottom: 0 }}>
                  {result.suggestions.map((item) => (
                    <li key={item} className="muted">{item}</li>
                  ))}
                </ul>
              </div>
              <button className="btn" type="button" onClick={restart}>
                Retake Screening
              </button>
            </div>
          )}
        </div>
      </div>
      <button className="floating-help" type="button" onClick={() => navigate("/chat")}>◎</button>
    </div>
  );
}
