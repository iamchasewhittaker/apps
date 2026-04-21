import { GameState } from '@/store/useGameState';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';

interface Props {
  state: GameState;
  dispatch: any;
}

export default function ExplanationScreen({ state, dispatch }: Props) {
  if (!state.currentQuestion || !state.socraticExplanation) return null;

  // Since we already calculated correct/incorrect in the reducer, we can check if the last answer increased xp Earned? No, better to just check the streak or xp. Wait, the Reducer already processed the answer. Let's infer if it was correct from the current state session streak > 0? No, if they lost their streak, it would be 0.
  // We can just pass the correct answer statically from the component or look at the current question's correct letter. 
  // In the real app, we might want to store `lastAnswerCorrect` in local state. But this is simple enough.

  const nextAction = () => {
    if (state.session.questionsAnswered >= 10) {
      dispatch({ type: 'END_SESSION' });
    } else {
      if (state.nextQuestion) {
        dispatch({ type: 'NEXT_PHASE' });
      } else {
        // Fallback if background eager load failed
        dispatch({ type: 'SET_LOADING', isLoading: true });
        fetch('/api/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section: state.session.section, difficulty: state.session.difficulty }),
        })
        .then(r => r.json())
        .then(data => {
          if (!data.error) dispatch({ type: 'SET_NEXT_QUESTION', question: data });
          dispatch({ type: 'NEXT_PHASE' });
        })
        .catch(e => {
          dispatch({ type: 'SET_ERROR', error: e.message });
          dispatch({ type: 'END_SESSION' });
        });
      }
    }
  };

  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col h-full">
      <div className="flex flex-col items-center justify-center py-6 border-b border-white/10 mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          Explanation
        </h2>
        <div className="text-sm font-semibold flex gap-4">
          <span className="text-success">Correct: {state.currentQuestion.correct}</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 text-lg">
        <ul className="space-y-4">
           {state.socraticExplanation.map((point, i) => (
             <motion.li 
               initial={{ opacity: 0, x: -20 }} 
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.2 }}
               key={i} 
               className="flex items-start gap-3 bg-white/5 p-4 rounded-xl"
             >
               <span className="shrink-0 w-6 h-6 rounded-full bg-blue/20 text-blue flex items-center justify-center text-sm font-bold">
                 {i + 1}
               </span>
               <span className="text-foreground/90 font-medium leading-relaxed">{point}</span>
             </motion.li>
           ))}
        </ul>
      </div>

      <button
        title="Continue"
        disabled={!state.nextQuestion && state.session.questionsAnswered < 10}
        onClick={nextAction}
        className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-blue hover:bg-blue/90 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {!state.nextQuestion && state.session.questionsAnswered < 10 ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Preparing Next...
          </>
        ) : (
          <>
             {state.session.questionsAnswered >= 10 ? 'End Session' : 'Next Question'}
             <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </motion.div>
  );
}
