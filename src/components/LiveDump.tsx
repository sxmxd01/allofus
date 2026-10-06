import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SquadMember, LiveDumpItem } from '../types';
import { supabaseMocks } from '../lib/supabase';
import { sounds } from '../utils/sound';
import {
  Send,
  Tag as TagIcon,
  MessageSquare,
  Check,
  Sparkles,
  AlertCircle,
  Pencil,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';
import { JennyLoadingState } from './JennyMascot';

interface LiveDumpProps {
  activeUsername: SquadMember;
  displayName?: string;
  avatarUrl?: string;
}

const TAGS = [
  '#Sports',
  '#Awards',
  '#People',
  '#International',
  '#National',
  '#Misc',
] as const;

type DumpTag = typeof TAGS[number];

const USER_COLORS: Record<string, string> = {
  Avni: '#06b6d4',     // Cyan
  Sadvitha: '#a855f7', // Purple
  Samad: '#22c55e',    // Green
  Shourya: '#f59e0b',  // Amber
};

const DEFAULT_USER_COLOR = '#a1a1aa';

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const LiveDump: React.FC<LiveDumpProps> = ({
  activeUsername,
  displayName,
}) => {
  const [messages, setMessages] = useState<LiveDumpItem[]>([]);
  const [selectedTag, setSelectedTag] = useState<DumpTag | null>(null);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTag, setFilterTag] = useState<string>('All');
  const [tagErrorShake, setTagErrorShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit State (any user can edit any dump)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingTag, setEditingTag] = useState<DumpTag>('#Misc');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete State (any user can delete any dump)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  // 1. Strict Query into live_dumps using supabaseMocks client
  const fetchDumps = useCallback(async () => {
    try {
      const { data, error } = await supabaseMocks
        .from('live_dumps')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        setErrorMessage(`Live Dump database notice: ${error.message}`);
      } else if (data) {
        setMessages(data as LiveDumpItem[]);
        setErrorMessage(null);
      }
    } catch (err: any) {
      setErrorMessage(`Connection error: ${err?.message || 'Failed to fetch live dumps.'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Initial fetch & Supabase Real-time Subscription (INSERT, UPDATE, DELETE)
  useEffect(() => {
    fetchDumps();

    const channel = supabaseMocks
      .channel('realtime:live_dumps_stream')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'live_dumps' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as LiveDumpItem;
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
            setTimeout(() => scrollToBottom(true), 50);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as LiveDumpItem;
            setMessages((prev) =>
              prev.map((m) => (m.id === updated.id ? updated : m))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as any)?.id;
            if (deletedId) {
              setMessages((prev) => prev.filter((m) => m.id !== deletedId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabaseMocks.removeChannel(channel);
    };
  }, [fetchDumps, scrollToBottom]);

  // Scroll to bottom when messages finish initial load
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToBottom(false);
    }
  }, [isLoading, scrollToBottom]);

  // Adjust input textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedTag) {
      setTagErrorShake(true);
      setTimeout(() => setTagErrorShake(false), 800);
      return;
    }
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  // Adjust edit textarea height dynamically
  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingContent(e.target.value);
    if (editTextareaRef.current) {
      editTextareaRef.current.style.height = 'auto';
      editTextareaRef.current.style.height = `${Math.min(editTextareaRef.current.scrollHeight, 180)}px`;
    }
  };

  // 3. Strict INSERT into live_dumps
  const handleSend = async () => {
    if (!selectedTag) {
      setTagErrorShake(true);
      setTimeout(() => setTagErrorShake(false), 800);
      return;
    }

    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;

    sounds.playCorrect();
    setIsSending(true);
    setErrorMessage(null);

    const newId = generateUUID();
    const newItem: LiveDumpItem = {
      id: newId,
      user_name: activeUsername,
      tag: selectedTag,
      content: trimmed,
      created_at: new Date().toISOString(),
    };

    // Optimistically update local message list
    setMessages((prev) => [...prev, newItem]);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setTimeout(() => {
      scrollToBottom(true);
    }, 50);

    try {
      const { data, error } = await supabaseMocks
        .from('live_dumps')
        .insert([
          {
            id: newId,
            user_name: activeUsername,
            tag: selectedTag,
            content: trimmed,
            created_at: newItem.created_at,
          },
        ])
        .select();

      if (error) {
        // Fallback retry without explicit ID
        const retry = await supabaseMocks
          .from('live_dumps')
          .insert([
            {
              user_name: activeUsername,
              tag: selectedTag,
              content: trimmed,
              created_at: newItem.created_at,
            },
          ])
          .select();

        if (retry.error) {
          setErrorMessage(`Failed to save to live_dumps table: ${retry.error.message}`);
        } else if (retry.data && retry.data[0]) {
          const persisted = retry.data[0] as LiveDumpItem;
          setMessages((prev) => prev.map((m) => (m.id === newId ? persisted : m)));
        }
      } else if (data && data[0]) {
        const persisted = data[0] as LiveDumpItem;
        setMessages((prev) => prev.map((m) => (m.id === newId ? persisted : m)));
      }
    } catch (err: any) {
      setErrorMessage(`Live Dump insert failed: ${err?.message || 'Database error'}`);
    } finally {
      setIsSending(false);
    }
  };

  // 4. Start Editing (Any user can edit any dump)
  const handleStartEdit = (msg: LiveDumpItem) => {
    sounds.playClick();
    setDeleteConfirmId(null);
    setEditingId(msg.id);
    setEditingContent(msg.content);
    setEditingTag((TAGS.includes(msg.tag as any) ? msg.tag : '#Misc') as DumpTag);
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.focus();
        editTextareaRef.current.style.height = 'auto';
        editTextareaRef.current.style.height = `${Math.min(editTextareaRef.current.scrollHeight, 180)}px`;
      }
    }, 50);
  };

  const handleCancelEdit = () => {
    sounds.playClick();
    setEditingId(null);
    setEditingContent('');
  };

  // Save Edit (Any user can save changes to any dump)
  const handleSaveEdit = async (id: string) => {
    const trimmed = editingContent.trim();
    if (!trimmed || isSavingEdit) return;

    sounds.playCorrect();
    setIsSavingEdit(true);
    setErrorMessage(null);

    // Optimistic update
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, content: trimmed, tag: editingTag } : m
      )
    );
    setEditingId(null);

    try {
      const { error } = await supabaseMocks
        .from('live_dumps')
        .update({
          content: trimmed,
          tag: editingTag,
        })
        .eq('id', id);

      if (error) {
        setErrorMessage(`Failed to update dump: ${error.message}`);
        fetchDumps();
      }
    } catch (err: any) {
      setErrorMessage(`Edit error: ${err?.message || 'Failed to update dump'}`);
      fetchDumps();
    } finally {
      setIsSavingEdit(false);
    }
  };

  // 5. Delete (Any user can delete any dump)
  const handlePromptDelete = (id: string) => {
    sounds.playClick();
    setEditingId(null);
    setDeleteConfirmId(id);
  };

  const handleCancelDelete = () => {
    sounds.playClick();
    setDeleteConfirmId(null);
  };

  const handleConfirmDelete = async (id: string) => {
    sounds.playClick();
    setIsDeletingId(id);
    setDeleteConfirmId(null);

    // Optimistic deletion
    setMessages((prev) => prev.filter((m) => m.id !== id));

    try {
      const { error } = await supabaseMocks
        .from('live_dumps')
        .delete()
        .eq('id', id);

      if (error) {
        setErrorMessage(`Failed to delete dump: ${error.message}`);
        fetchDumps();
      }
    } catch (err: any) {
      setErrorMessage(`Delete error: ${err?.message || 'Failed to delete dump'}`);
      fetchDumps();
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (isToday) {
        return timeStr;
      }
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} • ${timeStr}`;
    } catch {
      return 'Recent';
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filterTag === 'All') return true;
    return m.tag === filterTag;
  });

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 flex flex-col min-h-[calc(100vh-140px)] w-full overflow-x-hidden font-sans">
      {/* Error banner if database table throws notice */}
      {errorMessage && (
        <div className="my-2 p-2.5 bg-rose-950/40 border border-rose-500/80 rounded-lg text-rose-300 text-xs flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-muted hover:text-main underline cursor-pointer text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header bar: Filter by tag & Status */}
      <div className="flex items-center justify-between pb-3 pt-1 border-b border-border text-xs shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-accent" />
          <span className="font-semibold text-main tracking-wide">Live Dump</span>
          <span className="text-[11px] text-muted font-mono hidden sm:inline">
            ({messages.length} knowledge drops)
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" title="Realtime active" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-[55%] sm:max-w-none">
          <button
            onClick={() => setFilterTag('All')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors shrink-0 cursor-pointer ${
              filterTag === 'All'
                ? 'bg-hover text-main border border-border'
                : 'text-muted hover:text-main'
            }`}
          >
            All
          </button>
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setFilterTag(t)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors shrink-0 cursor-pointer ${
                filterTag === t
                  ? 'bg-hover text-main border border-border'
                  : 'text-muted hover:text-main'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Continuous Chat Stream */}
      <div className="flex-1 py-4 space-y-3.5 overflow-y-auto">
        {isLoading ? (
          <div className="py-16">
            <JennyLoadingState
              message="Connecting to Live Dump..."
              submessage="Listening for messages on Supabase realtime"
            />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-16 text-center text-xs text-muted space-y-2">
            <Sparkles className="w-5 h-5 text-muted mx-auto" />
            <p>No dumps found for this tag yet. Drop the first update below!</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const userColor = USER_COLORS[msg.user_name] || DEFAULT_USER_COLOR;
            const isMe = msg.user_name === activeUsername;
            const isEditingThis = editingId === msg.id;
            const isConfirmingDelete = deleteConfirmId === msg.id;

            return (
              <div
                key={msg.id}
                className="rounded-lg p-3 sm:p-4 bg-panel hover:bg-hover border border-border transition-all"
                style={{
                  borderLeft: `3px solid ${userColor}`,
                }}
              >
                {/* Top Row: User Name • Time • Tag • Action Buttons (Edit / Delete for all users) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: userColor }}
                    />
                    <span
                      className="font-semibold text-xs tracking-tight"
                      style={{ color: userColor }}
                    >
                      {isMe ? (displayName || msg.user_name) : msg.user_name}
                      {isMe && <span className="text-[10px] text-muted ml-1 font-normal">(you)</span>}
                    </span>
                    <span className="text-muted/60">•</span>
                    <span className="text-[11px] font-mono text-muted">
                      {formatTimestamp(msg.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Tag Pill */}
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-medium border"
                      style={{
                        borderColor: `${userColor}50`,
                        color: userColor,
                        backgroundColor: `${userColor}10`,
                      }}
                    >
                      {msg.tag}
                    </span>

                    {/* Edit button (Available to all users) */}
                    {!isEditingThis && !isConfirmingDelete && (
                      <button
                        onClick={() => handleStartEdit(msg)}
                        className="p-1 rounded text-muted hover:text-accent hover:bg-background border border-transparent hover:border-border transition-colors cursor-pointer"
                        title="Edit this live dump"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Delete button (Available to all users) */}
                    {!isEditingThis && !isConfirmingDelete && (
                      <button
                        onClick={() => handlePromptDelete(msg.id)}
                        className="p-1 rounded text-muted hover:text-rose-400 hover:bg-background border border-transparent hover:border-border transition-colors cursor-pointer"
                        title="Delete this live dump"
                      >
                        {isDeletingId === msg.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Delete Confirmation Bar */}
                {isConfirmingDelete && (
                  <div className="my-2 p-2 bg-rose-950/40 border border-rose-500/80 rounded-lg flex items-center justify-between gap-2 text-xs font-sans">
                    <span className="text-rose-200">Delete this dump?</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleConfirmDelete(msg.id)}
                        className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                      <button
                        onClick={handleCancelDelete}
                        className="px-2 py-0.5 bg-panel border border-border text-muted hover:text-main rounded text-[11px] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Body Content / Inline Editing Form */}
                {isEditingThis ? (
                  <div className="pt-2.5 space-y-2">
                    {/* Tag Selector for Edit */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                      <span className="text-[11px] text-muted font-mono shrink-0 mr-1">Tag:</span>
                      {TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setEditingTag(tag)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors shrink-0 cursor-pointer ${
                            editingTag === tag
                              ? 'bg-accent text-black font-semibold'
                              : 'bg-background hover:bg-hover text-muted hover:text-main border border-border'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {/* Textarea for Edit */}
                    <textarea
                      ref={editTextareaRef}
                      value={editingContent}
                      onChange={handleEditChange}
                      rows={2}
                      className="w-full bg-background border border-accent/80 focus:outline-none rounded-lg p-2.5 text-xs sm:text-sm font-reading font-serif text-main placeholder:text-muted/60 leading-relaxed resize-none"
                    />

                    {/* Actions for Edit */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSavingEdit}
                        className="px-2.5 py-1 rounded text-xs text-muted hover:text-main bg-background border border-border hover:bg-hover transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>

                      <button
                        onClick={() => handleSaveEdit(msg.id)}
                        disabled={!editingContent.trim() || isSavingEdit}
                        style={{ background: 'var(--accent-gradient, var(--accent))' }}
                        className="px-3 py-1 rounded text-xs text-black font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        {isSavingEdit ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3 stroke-[3]" />
                        )}
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Content Display */
                  <div className="pt-2 font-reading font-serif text-sm sm:text-base text-main leading-relaxed break-words whitespace-pre-wrap">
                    {msg.content}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Sticky Mobile-First Input Area */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border pt-3 pb-4 z-20 space-y-2.5">
        {/* Row 1: 6 Pill-shaped buttons for tags (#Sports, #Awards, #People, #International, #National, #Misc) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted px-0.5">
            <span className="flex items-center gap-1">
              <TagIcon className="w-3 h-3 text-accent" />
              <span>Topic Tag</span>
            </span>
            {selectedTag && (
              <span className="text-accent font-medium">Selected: {selectedTag}</span>
            )}
          </div>

          <div
            className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 transition-transform ${
              tagErrorShake ? 'translate-x-1 ring-1 ring-rose-500 rounded-md p-1' : ''
            }`}
          >
            {TAGS.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedTag(tag);
                    if (textareaRef.current) {
                      textareaRef.current.focus();
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all shrink-0 cursor-pointer min-h-[30px] flex items-center gap-1 ${
                    isSelected
                      ? 'bg-accent text-black font-semibold shadow-xs'
                      : 'bg-panel hover:bg-hover text-main border border-border'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Multiline auto-expanding text input + subtle Send button */}
        <div className="flex items-end gap-2 bg-panel border border-border focus-within:border-accent rounded-xl p-2 transition-colors">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={!selectedTag}
            placeholder={
              selectedTag
                ? `Write facts or legal updates for ${selectedTag} (Enter to send)...`
                : 'Select a tag above (#Sports, #Awards, etc.) to start typing...'
            }
            className={`w-full bg-transparent resize-none focus:outline-none text-xs sm:text-sm font-reading font-serif text-main placeholder:text-muted/60 placeholder:font-sans p-1.5 max-h-36 overflow-y-auto leading-relaxed ${
              !selectedTag ? 'cursor-not-allowed opacity-60' : ''
            }`}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!selectedTag || !inputText.trim() || isSending}
            style={{ background: 'var(--accent-gradient, var(--accent))' }}
            className="px-3.5 py-2 hover:opacity-90 disabled:opacity-30 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0 min-h-[36px] flex items-center gap-1.5 shadow-xs"
            title="Send knowledge drop (Enter)"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveDump;
