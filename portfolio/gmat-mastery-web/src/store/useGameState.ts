import { useReducer, useEffect, createContext, useContext } from 'react';

export type ScreenState = 'landing' | 'question' | 'explanation' | 'summary';
export type GmatSection = 'Quantitative' | 'Verbal' | 'DataSufficiency' | 'RC_CR' | 'Shuffle';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ConfidenceLevel = 'guessed' | 'knew' | null;

export interface Question {
  question: string;
  options: { A: string; B: string; C: string; D: string; E: string };
  correct: string;
  topic: string;
  explanation: string;
}

export interface GameState {
  screen: ScreenState;
  session: {
    section: GmatSection;
    difficulty: Difficulty;
    questionsAnswered: number;
    questionsCorrect: number;
    xpEarned: number;
    streak: number;
    guessCount: number;
    knewCount: number;
  };
  player: {
    totalXP: number;
    level: number;
    levelTitle: string;
    dailyStreak: number;
  };
  topicPerformance: Record<GmatSection, { correct: number; total: number }>;
  currentQuestion: Question | null;
  nextQuestion: Question | null; // Eager load
  socraticExplanation: string[] | null;
  expertTip: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GameState = {
  screen: 'landing',
  session: {
    section: 'Shuffle',
    difficulty: 'Medium',
    questionsAnswered: 0,
    questionsCorrect: 0,
    xpEarned: 0,
    streak: 0,
    guessCount: 0,
    knewCount: 0,
  },
  player: {
    totalXP: 0,
    level: 1,
    levelTitle: 'Applicant',
    dailyStreak: 0,
  },
  topicPerformance: {
    Quantitative: { correct: 0, total: 0 },
    Verbal: { correct: 0, total: 0 },
    DataSufficiency: { correct: 0, total: 0 },
    RC_CR: { correct: 0, total: 0 },
    Shuffle: { correct: 0, total: 0 },
  },
  currentQuestion: null,
  nextQuestion: null,
  socraticExplanation: null,
  expertTip: null,
  isLoading: false,
  error: null,
};

type Action =
  | { type: 'START_SESSION'; section: GmatSection; difficulty: Difficulty }
  | { type: 'SET_CURRENT_QUESTION'; question: Question }
  | { type: 'SET_NEXT_QUESTION'; question: Question }
  | { type: 'ANSWER_SUBMITTED'; isCorrect: boolean; xpGained: number; confidence: ConfidenceLevel }
  | { type: 'SET_EXPLANATION'; explanation: string[]; expertTip?: string }
  | { type: 'NEXT_PHASE' }
  | { type: 'END_SESSION' }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'LOAD_STATE'; state: GameState };

const calculateLevel = (xp: number) => {
  if (xp >= 1500) return { level: 6, title: 'Partner' };
  if (xp >= 1000) return { level: 5, title: 'VP' };
  if (xp >= 600) return { level: 4, title: 'Manager' };
  if (xp >= 300) return { level: 3, title: 'Associate' };
  if (xp >= 100) return { level: 2, title: 'Analyst' };
  return { level: 1, title: 'Applicant' };
};

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'LOAD_STATE':
      return {
        ...initialState,
        ...action.state,
        session: { ...initialState.session, ...action.state.session },
        screen: 'landing',
        currentQuestion: null,
        socraticExplanation: null,
        expertTip: null,
        isLoading: false,
        error: null,
      };
    case 'START_SESSION':
      return {
        ...state,
        screen: 'question',
        session: { ...initialState.session, section: action.section, difficulty: action.difficulty },
        currentQuestion: null,
        nextQuestion: null,
        socraticExplanation: null,
        expertTip: null,
        error: null,
      };
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestion: action.question, isLoading: false };
    case 'SET_NEXT_QUESTION':
      return { ...state, nextQuestion: action.question };
    case 'ANSWER_SUBMITTED':
      const newXp = state.player.totalXP + action.xpGained;
      const newLevel = calculateLevel(newXp);
      return {
        ...state,
        screen: 'explanation',
        session: {
          ...state.session,
          questionsAnswered: state.session.questionsAnswered + 1,
          questionsCorrect: state.session.questionsCorrect + (action.isCorrect ? 1 : 0),
          xpEarned: state.session.xpEarned + action.xpGained,
          streak: action.isCorrect ? state.session.streak + 1 : 0,
          guessCount: state.session.guessCount + (action.confidence === 'guessed' ? 1 : 0),
          knewCount: state.session.knewCount + (action.confidence === 'knew' ? 1 : 0),
        },
        player: { ...state.player, totalXP: newXp, ...newLevel },
        topicPerformance: {
          ...state.topicPerformance,
          [state.session.section]: {
            correct: state.topicPerformance[state.session.section].correct + (action.isCorrect ? 1 : 0),
            total: state.topicPerformance[state.session.section].total + 1,
          },
        },
      };
    case 'SET_EXPLANATION':
      return { ...state, socraticExplanation: action.explanation, expertTip: action.expertTip ?? null, isLoading: false };
    case 'NEXT_PHASE':
      if (state.screen === 'explanation') {
        const nextQ = state.nextQuestion;
        return {
          ...state,
          screen: 'question',
          currentQuestion: nextQ,
          nextQuestion: null,
          socraticExplanation: null,
          expertTip: null,
        };
      }
      return state;
    case 'END_SESSION':
      return { ...state, screen: 'summary' };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'SET_ERROR':
      return { ...state, error: action.error, isLoading: false };
    default:
      return state;
  }
}

export function useGameReducer() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gmat_mastery_state');
    if (saved) {
      try {
        dispatch({ type: 'LOAD_STATE', state: JSON.parse(saved) });
      } catch (e) {
        console.error('Failed to parse local storage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gmat_mastery_state', JSON.stringify(state));
  }, [state]);

  return { state, dispatch };
}
