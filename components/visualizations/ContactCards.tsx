'use client';

import { useState } from 'react';
import { Contact, StartupIdea } from '@/lib/types';
import { generateIcebreaker } from '@/lib/agents';
import { Users, MessageSquare, Copy, Check, Linkedin, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactCardsProps {
  contacts: Contact[];
  idea: StartupIdea;
}

export function ContactCards({ contacts, idea }: ContactCardsProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [generatedMessages, setGeneratedMessages] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerateMessage = async (contact: Contact) => {
    setGenerating(contact.id);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const message = generateIcebreaker(contact, idea);
    setGeneratedMessages((prev) => ({ ...prev, [contact.id]: message }));
    setGenerating(null);
  };

  const copyMessage = (id: string, message: string) => {
    navigator.clipboard.writeText(message);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-background-secondary rounded-xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-accent-cyan" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">Network Targets</h3>
          <p className="text-xs text-text-muted">Contatti suggeriti per outreach</p>
        </div>
      </div>

      {/* Contact Grid */}
      <div className="grid grid-cols-2 gap-3">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background-tertiary rounded-lg border border-border p-4 hover:border-border-strong transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-white font-medium text-sm">
                {contact.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-text-primary text-sm truncate">{contact.name}</h4>
                <p className="text-xs text-text-muted truncate">{contact.role}</p>
                <p className="text-xs text-accent-blue truncate">{contact.company}</p>
              </div>
            </div>

            <p className="text-xs text-text-muted mb-3 line-clamp-2">{contact.relevance}</p>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedContact(contact);
                  if (!generatedMessages[contact.id]) {
                    handleGenerateMessage(contact);
                  }
                }}
                disabled={generating === contact.id}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-accent-purple/20 text-accent-purple text-xs font-medium hover:bg-accent-purple/30 transition-colors disabled:opacity-50"
              >
                {generating === contact.id ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <MessageSquare className="w-3 h-3" />
                )}
                Genera Messaggio
              </button>
              <button
                className="p-2 rounded-lg bg-background hover:bg-background-elevated text-text-muted hover:text-accent-blue transition-colors"
                title="Apri LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {selectedContact && generatedMessages[selectedContact.id] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedContact(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background-secondary rounded-xl border border-border p-6 max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-white font-medium">
                    {selectedContact.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{selectedContact.name}</h4>
                    <p className="text-xs text-text-muted">
                      {selectedContact.role} @ {selectedContact.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => copyMessage(selectedContact.id, generatedMessages[selectedContact.id])}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-green/20 text-accent-green text-sm font-medium hover:bg-accent-green/30 transition-colors"
                >
                  {copiedId === selectedContact.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiato!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copia
                    </>
                  )}
                </button>
              </div>

              <div className="bg-background rounded-lg border border-border p-4">
                <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                  {generatedMessages[selectedContact.id]}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => handleGenerateMessage(selectedContact)}
                  disabled={generating === selectedContact.id}
                  className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary"
                >
                  <RefreshCw className={`w-3 h-3 ${generating === selectedContact.id ? 'animate-spin' : ''}`} />
                  Rigenera
                </button>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="px-4 py-2 rounded-lg bg-background-tertiary text-text-secondary text-sm hover:bg-background-elevated transition-colors"
                >
                  Chiudi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
