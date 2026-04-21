import { GameState, GmatSection, Difficulty } from '@/store/useGameState';
import { useState } from 'react';
import { Flame, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const SECTIONS: GmatSection[] = ['Quantitative', 'Verbal', 'DataSufficiency', 'RC_CR', 'Shuffle'];
const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

interface Props {
  state: GameState;
  dispatch: any;
}

export default function LandingScreen({ state, dispatch }: Props) {
  const [selectedSection, setSelectedSection] = useState<GmatSection>(state.session.section);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(state.session.difficulty);

  const startSession = async () => {
    dispatch({ type: 'START_SESSION', section: selectedSection, difficulty: selectedDifficulty });
    dispatch({ type: 'SET_LOADING', isLoading: true });
    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: selectedSection, difficulty: selectedDifficulty }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      dispatch({ type: 'SET_CURRENT_QUESTION', question: data });
    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', error: e.message || 'Failed to start session.' });
      dispatch({ type: 'LOAD_STATE', state }); // Reset
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue" />
            Lvl {state.player.level}: {state.player.levelTitle}
          </h2>
          <p className="text-sm text-foreground/70">{state.player.totalXP} XP Total</p>
        </div>
        <div className="text-right flex items-center gap-2">
          <Flame className={`w-6 h-6 ${state.player.dailyStreak > 0 ? 'text-gold fill-gold/20' : 'text-foreground/30'}`} />
          <span className="text-lg font-bold">{state.player.dailyStreak}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Section</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SECTIONS.map((sec) => (
              <button
                key={sec}
                title={sec}
                onClick={() => setSelectedSection(sec)}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  selectedSection === sec
                    ? 'bg-blue text-white shadow-lg ring-2 ring-blue/50'
                    : 'bg-white/5 hover:bg-white/10 text-foreground'
                }`}
              >
                {sec.replace('_', '/')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Select Difficulty</h3>
          <div className="flex gap-2">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                title={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 text-foreground'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        title="Start Session"
        onClick={startSession}
        disabled={state.isLoading}
        className="mt-4 w-full py-4 bg-gold hover:bg-gold/90 text-black font-bold rounded-xl shadow-lg hover:shadow-gold/20 transition-all active:scale-[0.98]"
      >
        START DAILY QUEST
      </button>
    </motion.div>
  );
}
