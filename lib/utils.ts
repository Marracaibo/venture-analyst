import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatCurrency(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  }
  return `$${value}`;
}

export function getAgentColor(agent: string): string {
  const colors: Record<string, string> = {
    orchestrator: '#8b5cf6',
    market: '#3b82f6',
    growth: '#22c55e',
    project: '#f97316',
    devil: '#ef4444',
  };
  return colors[agent] || '#71717a';
}

export function getAgentName(agent: string): string {
  const names: Record<string, string> = {
    orchestrator: 'Orchestrator',
    market: 'Market Analyst',
    growth: 'Growth Hacker',
    project: 'Project Manager',
    devil: "Devil's Advocate",
  };
  return names[agent] || agent;
}

export function getAgentEmoji(agent: string): string {
  const emojis: Record<string, string> = {
    orchestrator: '🎯',
    market: '📊',
    growth: '🚀',
    project: '🗓️',
    devil: '👿',
  };
  return emojis[agent] || '🤖';
}

export function getVerdictInfo(verdict: 'green' | 'yellow' | 'red'): { color: string; label: string; emoji: string } {
  const info: Record<string, { color: string; label: string; emoji: string }> = {
    green: { color: '#22c55e', label: 'Promettente', emoji: '🟢' },
    yellow: { color: '#eab308', label: 'Cauto', emoji: '🟡' },
    red: { color: '#ef4444', label: 'Problematico', emoji: '🔴' },
  };
  return info[verdict];
}

export function getSeverityColor(severity: 'critical' | 'high' | 'medium'): string {
  const colors: Record<string, string> = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
  };
  return colors[severity];
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    validation: '#8b5cf6',
    marketing: '#3b82f6',
    product: '#22c55e',
    sales: '#f97316',
  };
  return colors[category] || '#71717a';
}
