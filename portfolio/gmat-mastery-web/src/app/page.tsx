'use client';

import { useGameReducer } from '@/store/useGameState';
import LandingScreen from '@/components/LandingScreen';
import QuestionScreen from '@/components/QuestionScreen';
import ExplanationScreen from '@/components/ExplanationScreen';
import SummaryScreen from '@/components/SummaryScreen';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { state, dispatch } = useGameReducer();

  const renderScreen = () => {
    switch (state.screen) {
      case 'landing':
        return <LandingScreen state={state} dispatch={dispatch} />;
      case 'question':
        return <QuestionScreen state={state} dispatch={dispatch} />;
      case 'explanation':
        return <ExplanationScreen state={state} dispatch={dispatch} />;
      case 'summary':
        return <SummaryScreen state={state} dispatch={dispatch} />;
      default:
        return <LandingScreen state={state} dispatch={dispatch} />;
    }
  };

  return (
    <main className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4">
      {state.error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-danger text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {state.error}
          <button onClick={() => dispatch({ type: 'SET_ERROR', error: '' })} className="ml-4 font-bold">&times;</button>
        </div>
      )}
      
      {state.isLoading && state.screen !== 'question' && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-40">
          <Loader2 className="w-12 h-12 text-gold animate-spin" />
        </div>
      )}
      
      <div className="w-full max-w-2xl bg-panel rounded-2xl shadow-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden ring-1 ring-white/10">
        {renderScreen()}
      </div>
    </main>
  );
}
