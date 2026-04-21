import { GameState } from '@/store/useGameState';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Target, RefreshCw } from 'lucide-react';

interface Props {
  state: GameState;
  dispatch: any;
}

export default function SummaryScreen({ state, dispatch }: Props) {
  const accuracy = state.session.questionsAnswered > 0 
    ? Math.round((state.session.questionsCorrect / state.session.questionsAnswered) * 100) 
    : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 items-center py-6 text-center">
      <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mb-2">
        <Trophy className="w-12 h-12 text-gold" />
      </div>

      <h2 className="text-3xl font-bold text-white">Session Complete</h2>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center">
          <TrendingUp className="w-6 h-6 text-success mb-2" />
          <span className="text-sm text-foreground/70 uppercase font-bold tracking-wider">XP Earned</span>
          <span className="text-2xl font-black text-white">+{state.session.xpEarned}</span>
        </div>
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center">
          <Target className="w-6 h-6 text-blue mb-2" />
          <span className="text-sm text-foreground/70 uppercase font-bold tracking-wider">Accuracy</span>
          <span className="text-2xl font-black text-white">{accuracy}%</span>
        </div>
      </div>

      <div className="w-full max-w-sm bg-white/5 p-6 rounded-xl border border-white/10 mt-2">
        <h3 className="text-sm uppercase font-bold tracking-wider text-foreground/70 mb-4">Level Progress</h3>
        <div className="flex justify-between items-end mb-2">
          <span className="font-bold text-white text-xl">Lvl {state.player.level}: {state.player.levelTitle}</span>
          <span className="text-sm font-semibold text-gold">{state.player.totalXP} XP</span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-3">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((state.player.totalXP / 1500) * 100, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-gold h-3 rounded-full" 
          />
        </div>
      </div>

      <button
        title="Play Again"
        onClick={() => dispatch({ type: 'LOAD_STATE', state: { ...state, screen: 'landing' } })}
        className="mt-6 flex gap-2 items-center justify-center w-full max-w-sm py-4 border-2 border-white/20 hover:border-white/40 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
      >
        <RefreshCw className="w-5 h-5" />
        Return Home
      </button>
    </motion.div>
  );
}
