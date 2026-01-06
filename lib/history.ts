// History management for saving analyses to localStorage

import { AnalysisResult, StartupIdea, ChatMessage } from './types';

export interface SavedAnalysis {
  id: string;
  timestamp: Date;
  idea: StartupIdea;
  analysis: AnalysisResult;
  chatHistory: ChatMessage[];
  title: string; // Generated from idea
}

const HISTORY_KEY = 'venture-analyst-history';
const FAVORITES_KEY = 'venture-analyst-favorites';
const MAX_HISTORY = 10;

// Get all saved analyses
export function getAnalysisHistory(): SavedAnalysis[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    return parsed.map((item: SavedAnalysis) => ({
      ...item,
      timestamp: new Date(item.timestamp),
      chatHistory: item.chatHistory.map((msg: ChatMessage) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (e) {
    console.error('Failed to load history:', e);
    return [];
  }
}

// Save a new analysis
export function saveAnalysis(
  idea: StartupIdea,
  analysis: AnalysisResult,
  chatHistory: ChatMessage[]
): SavedAnalysis {
  const history = getAnalysisHistory();
  
  // Generate a title from the idea
  const title = generateTitle(idea);
  
  const newEntry: SavedAnalysis = {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    idea,
    analysis,
    chatHistory,
    title,
  };
  
  // Add to beginning, keep only last MAX_HISTORY
  const updated = [newEntry, ...history].slice(0, MAX_HISTORY);
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history:', e);
  }
  
  return newEntry;
}

// Delete a specific analysis
export function deleteAnalysis(id: string): void {
  const history = getAnalysisHistory();
  const updated = history.filter((item) => item.id !== id);
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete from history:', e);
  }
}

// Clear all history
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

// Generate a short title from the idea
function generateTitle(idea: StartupIdea): string {
  const text = idea.problem || idea.solution || idea.additionalContext || 'Analisi';
  
  // Take first 50 chars and clean up
  let title = text.slice(0, 50);
  
  // Try to end at a word boundary
  const lastSpace = title.lastIndexOf(' ');
  if (lastSpace > 30) {
    title = title.slice(0, lastSpace);
  }
  
  return title + (text.length > 50 ? '...' : '');
}

// ==================== FAVORITES ====================

// Get all favorites
export function getFavorites(): SavedAnalysis[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((item: SavedAnalysis) => ({
      ...item,
      timestamp: new Date(item.timestamp),
      chatHistory: item.chatHistory.map((msg: ChatMessage) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (e) {
    console.error('Failed to load favorites:', e);
    return [];
  }
}

// Add to favorites
export function addToFavorites(entry: SavedAnalysis): void {
  const favorites = getFavorites();
  
  // Check if already exists
  if (favorites.some(f => f.id === entry.id)) return;
  
  const updated = [entry, ...favorites];
  
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save favorite:', e);
  }
}

// Remove from favorites
export function removeFromFavorites(id: string): void {
  const favorites = getFavorites();
  const updated = favorites.filter((item) => item.id !== id);
  
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to remove from favorites:', e);
  }
}

// Check if is favorite
export function isFavorite(id: string): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.id === id);
}
