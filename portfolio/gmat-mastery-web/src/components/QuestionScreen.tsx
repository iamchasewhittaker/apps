import { GameState } from '@/store/useGameState';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert } from 'lucide-react';

interface Props {
  state: GameState;
  dispatch: any;
}

export default function QuestionScreen({ state, dispatch }: Props) {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!selectedLetter) submitAnswer(null);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const submitAnswer = async (answer: string | null) => {
    dispatch({ type: 'SET_LOADING', isLoading: true });
    
    // XP Calculation based on difficulty
    let xp = 0;
    const isCorrect = answer === state.currentQuestion?.correct;
    if (isCorrect) {
      if (state.session.difficulty === 'Easy') xp = 10;
      if (state.session.difficulty === 'Medium') xp = 25;
      if (state.session.difficulty === 'Hard') xp = 50;
      if (state.session.streak >= 2) xp *= 2; // Streak bonus active on 3rd in a row (stored streak handles it, simplifying here to just > 2 means this makes it 3)
    }

    dispatch({ type: 'ANSWER_SUBMITTED', isCorrect, xpGained: xp });
    
    // Fetch Explanation
    try {
      const res = await fetch('/api/generate-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: state.currentQuestion?.question,
          studentAnswer: answer || 'Did not answer in time',
          correctAnswer: state.currentQuestion?.correct,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      dispatch({ type: 'SET_EXPLANATION', explanation: data.bullets });
      
      // Eager fetch NEXT question in background
      fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: state.session.section, difficulty: state.session.difficulty }),
      })
      .then(r => r.json())
      .then(nextData => {
        if (!nextData.error) dispatch({ type: 'SET_NEXT_QUESTION', question: nextData });
      })
      .catch(console.error);

    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', error: e.message || 'Explanation failed.' });
      dispatch({ type: 'SET_EXPLANATION', explanation: ['Error generating explanation.', 'Please check logs.', 'Proceed to next item.'] });
    }
  };

  if (!state.currentQuestion) return null;

  const min = Math.floor(timeLeft / 60);
  const sec = String(timeLeft % 60).padStart(2, '0');
  const isDanger = timeLeft <= 30;

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-blue px-3 py-1 bg-blue/10 rounded-full">
          {state.currentQuestion.topic}
        </span>
        <div className={`flex items-center gap-2 font-mono text-xl ${isDanger ? 'text-danger animate-pulse' : 'text-white'}`}>
          <Clock className="w-5 h-5" />
          {min}:{sec}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
        <p className="text-lg leading-relaxed whitespace-pre-wrap font-medium">
          {state.currentQuestion.question}
        </p>
      </div>

      <div className="space-y-3 mt-auto">
        {Object.entries(state.currentQuestion.options).map(([letter, text]) => (
          <button
            key={letter}
            title={`Select Option ${letter}`}
            onClick={() => setSelectedLetter(letter)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selectedLetter === letter
                ? 'bg-blue/20 border-blue text-white shadow-md'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-foreground'
            }`}
          >
            <span className="font-bold mr-3 inline-block w-6 text-center text-foreground/50">{letter}.</span>
            {text as React.ReactNode}
          </button>
        ))}
      </div>

      <button
        title="Submit Answer"
        disabled={!selectedLetter || state.isLoading}
        onClick={() => submitAnswer(selectedLetter)}
        className="mt-6 w-full py-4 bg-white text-black font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all active:scale-[0.98]"
      >
        SUBMIT
      </button>
    </motion.div>
  );
}
