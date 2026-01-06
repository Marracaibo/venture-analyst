import { create } from 'zustand';
import { 
  AnalysisState, 
  ChatMessage, 
  AgentLog, 
  StartupIdea, 
  AnalysisResult,
  AgentType 
} from './types';
import { generateId } from './utils';
import { SavedAnalysis, getAnalysisHistory, saveAnalysis, deleteAnalysis, getFavorites, addToFavorites, removeFromFavorites } from './history';

interface StoreState extends AnalysisState {
  // History
  analysisHistory: SavedAnalysis[];
  favorites: SavedAnalysis[];
  currentSavedId: string | null; // ID of current analysis if saved
  // Follow-up mode
  followUpMode: boolean;
  
  // Actions
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addAgentLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
  updateAgentLog: (id: string, updates: Partial<AgentLog>) => void;
  setCurrentIdea: (idea: StartupIdea | null) => void;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setCurrentAgent: (agent: AgentType | null) => void;
  setAnalysisProgress: (progress: number) => void;
  setClarificationNeeded: (needed: boolean, questions?: string[]) => void;
  clearAgentLogs: () => void;
  reset: () => void;
  startNewIdea: () => void; // Reset but keep history
  // History actions
  loadHistory: () => void;
  saveToHistory: () => void;
  loadFromHistory: (id: string) => void;
  deleteFromHistory: (id: string) => void;
  // Favorites
  loadFavorites: () => void;
  toggleFavorite: () => void;
  removeFavorite: (id: string) => void;
  // Follow-up
  setFollowUpMode: (enabled: boolean) => void;
}

const initialState: AnalysisState & { analysisHistory: SavedAnalysis[]; favorites: SavedAnalysis[]; currentSavedId: string | null; followUpMode: boolean } = {
  currentIdea: null,
  currentAnalysis: null,
  chatMessages: [],
  agentLogs: [],
  isAnalyzing: false,
  currentAgent: null,
  analysisProgress: 0,
  clarificationNeeded: false,
  clarificationQuestions: [],
  analysisHistory: [],
  favorites: [],
  currentSavedId: null,
  followUpMode: false,
};

export const useStore = create<StoreState>((set) => ({
  ...initialState,

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        },
      ],
    })),

  addAgentLog: (log) =>
    set((state) => ({
      agentLogs: [
        ...state.agentLogs,
        {
          ...log,
          id: generateId(),
          timestamp: new Date(),
        },
      ],
    })),

  updateAgentLog: (id, updates) =>
    set((state) => ({
      agentLogs: state.agentLogs.map((log) =>
        log.id === id ? { ...log, ...updates } : log
      ),
    })),

  setCurrentIdea: (idea) => set({ currentIdea: idea }),

  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

  setCurrentAgent: (agent) => set({ currentAgent: agent }),

  setAnalysisProgress: (progress) => set({ analysisProgress: progress }),

  setClarificationNeeded: (needed, questions = []) =>
    set({
      clarificationNeeded: needed,
      clarificationQuestions: questions,
    }),

  clearAgentLogs: () => set({ agentLogs: [] }),

  reset: () => set(initialState),
  
  // History actions
  loadHistory: () => {
    const history = getAnalysisHistory();
    set({ analysisHistory: history });
  },
  
  saveToHistory: () => {
    set((state) => {
      if (state.currentIdea && state.currentAnalysis) {
        const saved = saveAnalysis(state.currentIdea, state.currentAnalysis, state.chatMessages);
        return { 
          analysisHistory: [saved, ...state.analysisHistory].slice(0, 10),
          currentSavedId: saved.id,
          followUpMode: true // Enable follow-up after saving
        };
      }
      return {};
    });
  },
  
  loadFromHistory: (id: string) => {
    set((state) => {
      const entry = state.analysisHistory.find((h) => h.id === id) || state.favorites.find((h) => h.id === id);
      if (entry) {
        return {
          currentIdea: entry.idea,
          currentAnalysis: entry.analysis,
          chatMessages: entry.chatHistory,
          currentSavedId: entry.id,
          followUpMode: true,
          isAnalyzing: false,
          analysisProgress: 100,
        };
      }
      return {};
    });
  },
  
  deleteFromHistory: (id: string) => {
    deleteAnalysis(id);
    set((state) => ({
      analysisHistory: state.analysisHistory.filter((h) => h.id !== id),
    }));
  },
  
  // Start new idea without full reset - keeps history
  startNewIdea: () => {
    set((state) => ({
      currentIdea: null,
      currentAnalysis: null,
      chatMessages: [],
      agentLogs: [],
      isAnalyzing: false,
      currentAgent: null,
      analysisProgress: 0,
      clarificationNeeded: false,
      clarificationQuestions: [],
      currentSavedId: null,
      followUpMode: false,
      // Keep history and favorites
      analysisHistory: state.analysisHistory,
      favorites: state.favorites,
    }));
  },
  
  // Favorites
  loadFavorites: () => {
    const favorites = getFavorites();
    set({ favorites });
  },
  
  toggleFavorite: () => {
    set((state) => {
      if (!state.currentSavedId || !state.currentIdea || !state.currentAnalysis) return {};
      
      const isFav = state.favorites.some(f => f.id === state.currentSavedId);
      
      if (isFav) {
        // Remove from favorites
        removeFromFavorites(state.currentSavedId);
        return {
          favorites: state.favorites.filter(f => f.id !== state.currentSavedId),
        };
      } else {
        // Add to favorites
        const entry: SavedAnalysis = {
          id: state.currentSavedId,
          timestamp: new Date(),
          idea: state.currentIdea,
          analysis: state.currentAnalysis,
          chatHistory: state.chatMessages,
          title: state.currentIdea.problem?.slice(0, 50) || 'Analisi',
        };
        addToFavorites(entry);
        return {
          favorites: [entry, ...state.favorites],
        };
      }
    });
  },
  
  removeFavorite: (id: string) => {
    removeFromFavorites(id);
    set((state) => ({
      favorites: state.favorites.filter(f => f.id !== id),
    }));
  },
  
  setFollowUpMode: (enabled: boolean) => set({ followUpMode: enabled }),
}));
