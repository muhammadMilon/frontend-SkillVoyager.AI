

import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MessageSquare, Shield, Clock, Send, PlusCircle,
  LifeBuoy, Zap, Star, MoreVertical, AlertCircle, CheckCircle,
  AlertTriangle, Loader2, User, Calendar, Tag, Search,
  Cpu, Activity, Globe, Info, ArrowRight,
  Command, Wifi, Layout, Minimize2, Maximize2, Edit2, Trash2, X, Upload, Image as ImageIcon,
} from 'lucide-react';
import { AuthContext } from '../../providers/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

/* ── Custom Styles ── */
const Styles = () => (
  <style>{`
    .helpdesk-glass {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .teal-glow {
      box-shadow: 0 0 20px rgba(20, 184, 166, 0.15);
    }
    .neural-input {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(20, 184, 166, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: white;
    }
    .neural-input:focus {
      outline: none;
      border-color: #14b8a6;
      box-shadow: 0 0 15px rgba(20, 184, 166, 0.1);
      background: rgba(20, 184, 166, 0.02);
    }
    .neural-input option {
      background: #0a1624;
      color: white;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes pulse-teal {
      0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(20, 184, 166, 0); }
      100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0); }
    }
    .status-pulse { animation: pulse-teal 2s infinite; }
    .ticket-reply-input {
      background: rgba(0,0,0,0.25);
      border: 1px solid rgba(255,255,255,0.07);
      color: white;
      transition: border 0.2s;
    }
    .ticket-reply-input:focus {
      outline: none;
      border-color: #14b8a6;
    }
    .ticket-reply-input::placeholder { color: rgba(255,255,255,0.25); }
    .img-preview-thumb {
      width: 72px;
      height: 72px;
      object-fit: cover;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
      cursor: pointer;
    }
  `}</style>
);

/* ── Priority helpers ── */
const priorityConfig = {
  Low:    { color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: <CheckCircle size={13}/> },
  Medium: { color: '#f5d060', bg: 'rgba(245,208,96,0.12)',  icon: <AlertTriangle size={13}/> },
  High:   { color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: <AlertCircle size={13}/> },
};

const statusConfig = {
  Open:        { color: '#14b8a6', label: 'Open' },
  'In Progress':{ color: '#f5d060', label: 'In Progress' },
  Resolved:    { color: '#10b981', label: 'Resolved' },
  Closed:      { color: '#64748b', label: 'Closed' },
};

/* ─────────────────────────────────────────────────────────
   TicketCard – full implementation
───────────────────────────────────────────────────────── */
const TicketCard = ({ ticket, fetchTickets }) => {
  const { user, dbUser } = useContext(AuthContext);

  const [expanded,        setExpanded]        = useState(false);
  const [showReply,       setShowReply]        = useState(false);
  const [replyText,       setReplyText]        = useState('');
  const [replyAttachment, setReplyAttachment]  = useState('');
  const [uploadingImg,    setUploadingImg]     = useState(false);
  const [submitting,      setSubmitting]       = useState(false);

  const [editingCommentId,  setEditingCommentId]  = useState(null);
  const [editCommentText,   setEditCommentText]   = useState('');
  const [editAttachment,    setEditAttachment]    = useState('');
  const [savingEdit,        setSavingEdit]        = useState(false);

  const [lightboxSrc, setLightboxSrc] = useState(null);

  const isAdmin = dbUser?.role === 'admin';
  const isOwner = user?.uid === ticket.userId;
  const canReply = isAdmin || isOwner;

  const pCfg = priorityConfig[ticket.priority] || priorityConfig.Medium;
  const sCfg = statusConfig[ticket.status]     || statusConfig.Open;

  /* ── compress image ── */
  const compressImage = (base64) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 1200;
        if (width > height && width > maxDim) { height *= maxDim / width; width = maxDim; }
        else if (height > maxDim)             { width *= maxDim / height; height = maxDim; }
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });

  const handleImageUpload = (e, cb) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const compressed = await compressImage(reader.result);
        cb(compressed);
        toast.success('Image ready!');
      } catch { toast.error('Image processing failed.'); }
      finally   { setUploadingImg(false); }
    };
    reader.readAsDataURL(file);
  };

  /* ── submit reply → POST /api/tickets/:id/comments ── */
  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() && !replyAttachment) {
      toast.error('Write a reply or attach an image.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/api/tickets/${ticket._id}/comments`, {
        userId:     user.uid,
        userName:   dbUser?.displayName || user.displayName || 'User',
        userAvatar: user.photoURL || '',
        text:       replyText,
        attachment: replyAttachment,
        isAdmin,
      });
      if (res.data.success) {
        toast.success('Reply sent!');
        setReplyText('');
        setReplyAttachment('');
        setShowReply(false);
        fetchTickets();
      } else {
        toast.error(res.data.message || 'Failed to send reply.');
      }
    } catch (err) {
      console.error('Reply error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to send reply.');
    }
    finally { setSubmitting(false); }
  };

  /* ── delete ticket → PATCH /:id with status='Deleted' fallback, or backend add DELETE ── */
  const handleDeleteTicket = async () => {
    if (!window.confirm('Delete this ticket?')) return;
    try {
      // Backend has no DELETE route yet — use PATCH to mark deleted OR filter on frontend
      // Best: add DELETE route to backend. For now we use PATCH to set status='Closed'
      // If you add DELETE route later, swap to: axios.delete(`${API_BASE}/api/tickets/${ticket._id}`, { data: { userId: user.uid, isAdmin } })
      const res = await axios.patch(`${API_BASE}/api/tickets/${ticket._id}`, {
        status: 'Closed',
        userId: user.uid,
        isAdmin,
        _deleted: true,
      });
      if (res.data.success) {
        toast.success('Ticket closed/deleted.');
        fetchTickets();
      } else {
        toast.error(res.data.message || 'Could not delete ticket.');
      }
    } catch (err) {
      console.error('Delete ticket error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Could not delete ticket.');
    }
  };

  /* ── delete comment → PATCH /:id { action:'deleteComment', commentId } ── */
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await axios.patch(`${API_BASE}/api/tickets/${ticket._id}`, {
        action:    'deleteComment',
        commentId,
        userId:    user.uid,
        isAdmin,
      });
      if (res.data.success) {
        toast.success('Comment deleted.');
        fetchTickets();
      } else {
        toast.error(res.data.message || 'Could not delete comment.');
      }
    } catch (err) {
      console.error('Delete comment error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Could not delete comment.');
    }
  };

  /* ── start edit ── */
  const startEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.text || '');
    setEditAttachment(comment.attachment || '');
  };

  /* ── save edit → PATCH /:id { action:'editComment', commentId, text } ── */
  const handleSaveEdit = async (commentId) => {
    setSavingEdit(true);
    try {
      const res = await axios.patch(`${API_BASE}/api/tickets/${ticket._id}`, {
        action:     'editComment',
        commentId,
        text:       editCommentText,
        attachment: editAttachment,
        userId:     user.uid,
        isAdmin,
      });
      if (res.data.success) {
        toast.success('Comment updated.');
        setEditingCommentId(null);
        fetchTickets();
      } else {
        toast.error(res.data.message || 'Could not update comment.');
      }
    } catch (err) {
      console.error('Edit comment error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Could not update comment.');
    }
    finally { setSavingEdit(false); }
  };

  /* ── update status → PATCH /:id { status } ── */
  const handleStatusChange = async (newStatus) => {
    try {
      const res = await axios.patch(`${API_BASE}/api/tickets/${ticket._id}`, {
        status: newStatus,
        isAdmin,
      });
      if (res.data.success) {
        toast.success(`Status → ${newStatus}`);
        fetchTickets();
      } else {
        toast.error(res.data.message || 'Status update failed.');
      }
    } catch (err) {
      console.error('Status error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Status update failed.');
    }
  };

  // Backend uses 'comments' field name (not 'replies')
  const comments = ticket.comments || ticket.replies || [];

  return (
    <>
      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={() => setLightboxSrc(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
              onClick={() => setLightboxSrc(null)}
            >
              <X size={20} />
            </button>
            <img
              src={lightboxSrc}
              alt="full"
              className="max-w-[90vw] max-h-[88vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Card ── */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-[#14b8a633] transition-all"
      >
        {/* Header Row */}
        <div
          className="flex items-start gap-4 p-5 sm:p-7 cursor-pointer select-none"
          onClick={() => setExpanded((v) => !v)}
        >
          {/* Avatar */}
          <div className="shrink-0 w-10 h-10 rounded-2xl bg-[#14b8a6]/20 flex items-center justify-center overflow-hidden">
            {ticket.userAvatar
              ? <img src={ticket.userAvatar} alt="" className="w-full h-full object-cover" />
              : <User size={18} className="text-[#14b8a6]" />
            }
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-base truncate">{ticket.title}</span>
              {/* Priority badge */}
              <span
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                style={{ color: pCfg.color, background: pCfg.bg }}
              >
                {pCfg.icon} {ticket.priority}
              </span>
              {/* Status badge */}
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                style={{ color: sCfg.color, background: `${sCfg.color}18` }}
              >
                {sCfg.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1"><User size={11}/>{ticket.userName || 'User'}</span>
              <span className="flex items-center gap-1"><Tag size={11}/>{ticket.category}</span>
              <span className="flex items-center gap-1">
                <Calendar size={11}/>
                {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '—'}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={11}/>{comments.length} replies
              </span>
            </div>
          </div>

          {/* Expand indicator */}
          <div className="shrink-0 mt-0.5">
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-500">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Expanded Body */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-5 sm:px-7 pb-7 space-y-6 border-t border-white/[0.04] pt-5">

                {/* Original message */}
                <div className="bg-black/20 rounded-2xl p-5">
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {ticket.content || <span className="italic text-slate-600">No description provided.</span>}
                  </p>
                  {ticket.attachment && (
                    <img
                      src={ticket.attachment}
                      alt="attachment"
                      className="img-preview-thumb mt-4"
                      onClick={() => setLightboxSrc(ticket.attachment)}
                    />
                  )}
                </div>

                {/* Admin: change status */}
                {isAdmin && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">Change Status:</span>
                    {Object.keys(statusConfig).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          ticket.status === s
                            ? 'bg-[#14b8a6] text-black'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Comments / Replies */}
                {comments.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Replies</h4>
                    {comments.map((c) => {
                      const isCommentOwner = user?.uid === c.userId;
                      const canEdit   = isCommentOwner || isAdmin;
                      const canDelete = isCommentOwner || isAdmin;
                      const editing   = editingCommentId === c._id;

                      return (
                        <div
                          key={c._id}
                          className={`flex gap-3 ${c.isAdmin ? 'flex-row-reverse' : ''}`}
                        >
                          {/* Avatar */}
                          <div className="shrink-0 w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                            {c.userAvatar
                              ? <img src={c.userAvatar} alt="" className="w-full h-full object-cover" />
                              : <User size={14} className="text-slate-400" />
                            }
                          </div>

                          <div className={`flex-1 space-y-2 ${c.isAdmin ? 'items-end' : 'items-start'} flex flex-col`}>
                            {/* Name + time */}
                            <div className={`flex items-center gap-2 ${c.isAdmin ? 'flex-row-reverse' : ''}`}>
                              <span className="text-[11px] font-black text-slate-400">{c.userName || 'User'}</span>
                              {c.isAdmin && (
                                <span className="px-2 py-0.5 rounded-full bg-[#14b8a6]/15 text-[#14b8a6] text-[9px] font-black uppercase tracking-widest">Admin</span>
                              )}
                              <span className="text-[10px] text-slate-600">
                                {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                              </span>
                            </div>

                            {/* Bubble */}
                            {editing ? (
                              <div className="w-full space-y-3">
                                <textarea
                                  className="w-full ticket-reply-input rounded-2xl px-4 py-3 text-sm resize-y min-h-[80px]"
                                  value={editCommentText}
                                  onChange={(e) => setEditCommentText(e.target.value)}
                                />
                                {/* Edit image */}
                                <div className="flex items-center gap-3">
                                  <label className="cursor-pointer px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:border-white/30 flex items-center gap-2">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleImageUpload(e, setEditAttachment)}
                                      disabled={uploadingImg}
                                    />
                                    {uploadingImg ? <Loader2 size={14} className="animate-spin"/> : <Upload size={14}/>}
                                    Change image
                                  </label>
                                  {editAttachment && (
                                    <button onClick={() => setEditAttachment('')} className="text-red-400 text-xs font-bold flex items-center gap-1">
                                      <X size={12}/> Remove
                                    </button>
                                  )}
                                </div>
                                {editAttachment && (
                                  <img src={editAttachment} alt="preview" className="img-preview-thumb" onClick={() => setLightboxSrc(editAttachment)}/>
                                )}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSaveEdit(c._id)}
                                    disabled={savingEdit}
                                    className="px-5 py-2 rounded-xl bg-[#14b8a6] text-black text-xs font-black uppercase tracking-widest disabled:opacity-50"
                                  >
                                    {savingEdit ? 'Saving…' : 'Save'}
                                  </button>
                                  <button
                                    onClick={() => setEditingCommentId(null)}
                                    className="px-5 py-2 rounded-xl bg-white/5 text-slate-400 text-xs font-black uppercase tracking-widest"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                  c.isAdmin
                                    ? 'bg-[#14b8a6]/15 text-[#14b8a6]'
                                    : 'bg-white/[0.04] text-slate-300'
                                }`}
                              >
                                {c.text && <p className="whitespace-pre-wrap">{c.text}</p>}
                                {c.attachment && (
                                  <img
                                    src={c.attachment}
                                    alt="attachment"
                                    className="img-preview-thumb mt-3"
                                    onClick={() => setLightboxSrc(c.attachment)}
                                  />
                                )}
                              </div>
                            )}

                            {/* Edit / Delete buttons */}
                            {!editing && (canEdit || canDelete) && (
                              <div className="flex items-center gap-2 mt-0.5">
                                {canEdit && (
                                  <button
                                    onClick={() => startEdit(c)}
                                    className="flex items-center gap-1 text-[10px] font-black text-slate-600 hover:text-[#14b8a6] transition-colors"
                                  >
                                    <Edit2 size={11}/> Edit
                                  </button>
                                )}
                                {canDelete && (
                                  <button
                                    onClick={() => handleDeleteComment(c._id)}
                                    className="flex items-center gap-1 text-[10px] font-black text-slate-600 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 size={11}/> Delete
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Reply Form */}
                {canReply && (
                  <div>
                    {!showReply ? (
                      <button
                        onClick={() => setShowReply(true)}
                        className="flex items-center gap-2 text-xs font-black text-[#14b8a6] uppercase tracking-widest hover:brightness-125 transition-all"
                      >
                        <MessageSquare size={14}/> Add Reply
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 bg-black/20 rounded-2xl p-5"
                      >
                        <textarea
                          className="w-full ticket-reply-input rounded-2xl px-4 py-3 text-sm resize-y min-h-[90px]"
                          placeholder="Write your reply…"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />

                        {/* Image attach */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <label
                            className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                              replyAttachment
                                ? 'border-[#14b8a6]/40 text-[#14b8a6] bg-[#14b8a6]/10'
                                : 'border-white/10 text-slate-400 hover:border-white/30'
                            }`}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, setReplyAttachment)}
                              disabled={uploadingImg}
                            />
                            {uploadingImg ? <Loader2 size={14} className="animate-spin"/> : <Upload size={14}/>}
                            {replyAttachment ? 'Image Ready' : 'Attach Image'}
                          </label>
                          {replyAttachment && (
                            <>
                              <img
                                src={replyAttachment}
                                alt="preview"
                                className="img-preview-thumb"
                                onClick={() => setLightboxSrc(replyAttachment)}
                              />
                              <button onClick={() => setReplyAttachment('')} className="text-red-400 hover:text-red-500">
                                <X size={16}/>
                              </button>
                            </>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={handleReply}
                            disabled={submitting || uploadingImg}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#14b8a6] text-black text-xs font-black uppercase tracking-widest disabled:opacity-50 hover:brightness-110 transition-all"
                          >
                            {submitting ? <Loader2 size={14} className="animate-spin"/> : <Send size={14}/>}
                            {submitting ? 'Sending…' : 'Send'}
                          </button>
                          <button
                            onClick={() => { setShowReply(false); setReplyText(''); setReplyAttachment(''); }}
                            className="px-6 py-3 rounded-xl bg-white/5 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Delete Ticket */}
                {(isOwner || isAdmin) && (
                  <div className="flex justify-end pt-2 border-t border-white/[0.04]">
                    <button
                      onClick={handleDeleteTicket}
                      className="flex items-center gap-1.5 text-[11px] font-black text-slate-600 hover:text-red-400 transition-colors uppercase tracking-widest"
                    >
                      <Trash2 size={12}/> Delete Ticket
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

/* ─────────────────────────────────────────────────────────
   HelpDeskPage
───────────────────────────────────────────────────────── */
const HelpDeskPage = () => {
  const { user, dbUser } = useContext(AuthContext);
  const [tickets,      setTickets]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showModal,    setShowModal]    = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery,  setSearchQuery]  = useState('');

  const [newTicket, setNewTicket] = useState({
    title: '', category: 'General', priority: 'Medium', content: '', attachment: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const [serverPing,  setServerPing]  = useState(null);
  const [pingLoading, setPingLoading] = useState(true);

  useEffect(() => { fetchTickets(); }, [activeFilter]);

  useEffect(() => {
    const measure = async () => {
      setPingLoading(true);
      const t0 = Date.now();
      try {
        await axios.get(`${API_BASE}/api/tickets?limit=1`);
        setServerPing(Date.now() - t0);
      } catch { setServerPing(null); }
      finally   { setPingLoading(false); }
    };
    measure();
    const interval = setInterval(measure, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTickets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = activeFilter !== 'All' ? { category: activeFilter } : {};
      const res = await axios.get(`${API_BASE}/api/tickets`, { params });
      if (res.data.success) setTickets(res.data.tickets || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  const compressImage = (base64) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 1200;
        if (width > height && width > maxDim) { height *= maxDim / width; width = maxDim; }
        else if (height > maxDim)             { width *= maxDim / height; height = maxDim; }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });

  const handleImageUpload = async (e, cb) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try { const c = await compressImage(reader.result); cb(c); toast.success('Image ready!'); }
      catch { toast.error('Failed to process image.'); }
      finally { setUploadingImage(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.title.trim() || (!newTicket.content.trim() && !newTicket.attachment)) {
      return toast.error('Please provide a subject and description/image.');
    }
    try {
      const res = await axios.post(`${API_BASE}/api/tickets`, {
        ...newTicket,
        userId:     user.uid,
        userName:   dbUser?.displayName || user.displayName || 'Voyager',
        userAvatar: user.photoURL || '',
      });
      if (res.data.success) {
        toast.success('Ticket created!');
        setShowModal(false);
        setNewTicket({ title: '', category: 'General', priority: 'Medium', content: '', attachment: '' });
        fetchTickets();
      }
    } catch { toast.error('Failed to submit ticket.'); }
  };

  const categories = ['All', 'General', 'Technical', 'Courses', 'Billing', 'Feature Request'];
  const priorities  = ['Low', 'Medium', 'High'];

  const filteredTickets = tickets.filter((t) =>
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#040d18] text-white selection:bg-[#14b8a6]/30 overflow-x-hidden">
      <Styles />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#14b8a622,transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#14b8a611] blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-[160px] pb-12 sm:pb-24 relative z-10">

        {/* Hero */}
        <section className="mb-12 sm:mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-[#14b8a611] border border-[#14b8a622] mb-6"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#14b8a6]">Support Center</span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
            Help <span className="text-[#14b8a6]">Desk</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium px-2">
            Your central hub for technical support. Get instant help from AI or submit a ticket.
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
          {[
            { label: 'System Status', val: 'Online',  icon: <Wifi size={16}/>,     color: '#14b8a6' },
            { label: 'Open Tickets',  val: tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length, icon: <Activity size={16}/>, color: '#f5d060' },
            { label: 'Total Tickets', val: tickets.length, icon: <Cpu size={16}/>, color: '#818cf8' },
            { label: 'Resolved',      val: tickets.length > 0 ? Math.round((tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length / tickets.length) * 100) + '%' : '—', icon: <Globe size={16}/>, color: '#10b981' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/5 p-5 sm:p-6 rounded-3xl teal-glow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-2xl bg-white/[0.03] flex items-center justify-center" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight">{stat.val}</div>
            </motion.div>
          ))}
        </section>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Left – Tickets */}
          <div className="lg:col-span-8 space-y-6">

            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/[0.02] border border-white/5 p-4 sm:p-5 rounded-3xl">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      activeFilter === cat ? 'bg-[#14b8a6] text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-72 mt-2 sm:mt-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16}/>
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-[#14b8a6]/50 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Create Quick Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => setShowModal(true)}
              className="group cursor-pointer bg-gradient-to-r from-[#14b8a611] to-transparent border border-[#14b8a622] rounded-3xl sm:rounded-[40px] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#14b8a605] -skew-x-12 translate-x-12 group-hover:translate-x-0 transition-all duration-700"/>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#14b8a6] flex items-center justify-center text-black shadow-lg shrink-0">
                <Plus size={32}/>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter mb-2">Create New Ticket</h2>
                <p className="text-slate-400 text-sm">Submit your inquiry to our support team</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[#14b8a6] font-black uppercase text-xs tracking-widest">
                Open Ticket <ArrowRight size={18}/>
              </div>
            </motion.div>

            {/* Tickets Feed */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 text-[#14b8a6] animate-spin"/>
                  <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Loading Tickets…</span>
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                  <Info size={48} className="mx-auto mb-4 text-slate-700"/>
                  <h3 className="text-xl font-black text-slate-600">No Tickets Found</h3>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredTickets.map((ticket) => (
                    <TicketCard key={ticket._id} ticket={ticket} fetchTickets={fetchTickets}/>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Right – Support Info Panel */}
          <div className="lg:col-span-4 space-y-4">

            {/* Server Health Card */}
            <div className="helpdesk-glass rounded-3xl overflow-hidden border border-[#14b8a622] sticky top-24 space-y-4 p-6">

              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/[0.05]">
                <div className="w-10 h-10 rounded-2xl bg-[#14b8a6]/15 flex items-center justify-center">
                  <Activity size={20} className="text-[#14b8a6]"/>
                </div>
                <div>
                  <h3 className="font-black tracking-tight">System Health</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Metrics</p>
                </div>
              </div>

              {/* Server Ping */}
              <div className="bg-black/20 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Server Response</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${pingLoading ? 'bg-yellow-400' : serverPing === null ? 'bg-red-400' : serverPing < 300 ? 'bg-[#14b8a6]' : serverPing < 700 ? 'bg-yellow-400' : 'bg-red-400'} status-pulse`}/>
                    <span className={`text-[10px] font-black ${pingLoading ? 'text-yellow-400' : serverPing === null ? 'text-red-400' : serverPing < 300 ? 'text-[#14b8a6]' : serverPing < 700 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {pingLoading ? 'Measuring…' : serverPing === null ? 'Offline' : serverPing < 300 ? 'Excellent' : serverPing < 700 ? 'Good' : 'Slow'}
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-black tracking-tight">
                  {pingLoading ? (
                    <span className="flex items-center gap-2 text-slate-500"><Loader2 size={20} className="animate-spin"/> —</span>
                  ) : serverPing === null ? (
                    <span className="text-red-400">Offline</span>
                  ) : (
                    <span>{serverPing}<span className="text-sm font-bold text-slate-500 ml-1">ms</span></span>
                  )}
                </div>
                {/* Ping bar */}
                {!pingLoading && serverPing !== null && (
                  <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((serverPing / 1000) * 100, 100)}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${serverPing < 300 ? 'bg-[#14b8a6]' : serverPing < 700 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    />
                  </div>
                )}
              </div>

              {/* Ticket breakdown */}
              <div className="space-y-3">
                {[
                  { label: 'Open',        count: tickets.filter(t => t.status === 'Open').length,        color: '#14b8a6' },
                  { label: 'In Progress', count: tickets.filter(t => t.status === 'In Progress').length, color: '#f5d060' },
                  { label: 'Resolved',    count: tickets.filter(t => t.status === 'Resolved').length,    color: '#10b981' },
                  { label: 'Closed',      count: tickets.filter(t => t.status === 'Closed').length,      color: '#64748b' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[11px] font-bold mb-1.5">
                      <span className="text-slate-400">{item.label}</span>
                      <span style={{ color: item.color }}>{item.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: tickets.length > 0 ? `${(item.count / tickets.length) * 100}%` : '0%' }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Resolution rate */}
              <div className="bg-black/20 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 flex items-center justify-center shrink-0">
                  <CheckCircle size={24} className="text-[#10b981]"/>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Resolution Rate</p>
                  <p className="text-2xl font-black">
                    {tickets.length > 0
                      ? Math.round((tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length / tickets.length) * 100)
                      : 0}%
                  </p>
                </div>
              </div>

              {/* Tips */}
              <div className="space-y-2 pt-2 border-t border-white/[0.05]">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Support Tips</p>
                {[
                  { icon: <Zap size={12}/>, text: 'Attach screenshots for faster resolution' },
                  { icon: <Shield size={12}/>, text: 'Set priority correctly to help us triage' },
                  { icon: <Clock size={12}/>, text: 'Response time: usually within 24 hours' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-slate-500 text-xs">
                    <span className="text-[#14b8a6] mt-0.5 shrink-0">{tip.icon}</span>
                    <span>{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Create Ticket Modal ── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-[#0a1624] border border-[#14b8a622] w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl sm:rounded-[40px]"
            >
              <div className="p-6 sm:p-10 lg:p-12">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">Create Ticket</h2>
                    <p className="text-xs font-black text-slate-500 mt-1">Support Request</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                  >
                    <X size={26}/>
                  </button>
                </div>

                <form onSubmit={handleCreateTicket} className="space-y-8">
                  {/* Subject + Priority */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-slate-500 mb-3">SUBJECT</label>
                      <input
                        type="text"
                        className="w-full neural-input rounded-2xl px-6 py-4 text-base"
                        placeholder="Brief issue summary…"
                        value={newTicket.title}
                        onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 mb-3">PRIORITY</label>
                      <select
                        className="w-full neural-input rounded-2xl px-6 py-4 text-base appearance-none cursor-pointer"
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      >
                        {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-3">CATEGORY</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.slice(1).map((cat) => (
                        <button
                          key={cat} type="button"
                          onClick={() => setNewTicket({ ...newTicket, category: cat })}
                          className={`px-6 py-3 rounded-2xl text-xs font-black border transition-all ${
                            newTicket.category === cat
                              ? 'bg-[#14b8a6] text-black border-[#14b8a6]'
                              : 'border-white/10 hover:border-white/30 text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-3">DESCRIPTION</label>
                    <textarea
                      className="w-full neural-input rounded-2xl px-6 py-5 h-40 resize-y min-h-[140px] text-sm"
                      placeholder="Describe your issue in detail…"
                      value={newTicket.content}
                      onChange={(e) => setNewTicket({ ...newTicket, content: e.target.value })}
                    />
                  </div>

                  {/* Attachment */}
                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-3">ATTACHMENT (OPTIONAL)</label>
                    <div className="flex items-center gap-4 flex-wrap">
                      <label className={`cursor-pointer flex-1 sm:flex-none px-6 py-4 rounded-2xl border flex items-center justify-center gap-3 transition-all text-sm font-medium ${
                        newTicket.attachment
                          ? 'bg-[#14b8a6]/10 border-[#14b8a6]/30 text-[#14b8a6]'
                          : 'border-white/10 hover:border-white/30 text-slate-300'
                      }`}>
                        <input
                          type="file" accept="image/*" className="hidden"
                          onChange={(e) => handleImageUpload(e, (url) => setNewTicket({ ...newTicket, attachment: url }))}
                          disabled={uploadingImage}
                        />
                        {uploadingImage ? <Loader2 size={18} className="animate-spin"/> : <Upload size={18}/>}
                        <span>{uploadingImage ? 'Compressing…..' : 'Attach Screenshot'}</span>
                      </label>
                      {newTicket.attachment && (
                        <button type="button" onClick={() => setNewTicket({ ...newTicket, attachment: '' })} className="text-red-400 hover:text-red-500 p-2">
                          <X size={20}/>
                        </button>
                      )}
                    </div>
                    {newTicket.attachment && (
                      <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 max-w-[260px]">
                        <img src={newTicket.attachment} alt="preview" className="w-full h-auto"/>
                      </div>
                    )}
                  </div>

                  <button
                    disabled={uploadingImage || !newTicket.title.trim()}
                    className={`w-full py-5 rounded-2xl font-black text-base uppercase tracking-widest transition-all ${
                      uploadingImage || !newTicket.title.trim()
                        ? 'bg-slate-600 cursor-not-allowed text-slate-400'
                        : 'bg-[#14b8a6] hover:brightness-110 text-black'
                    }`}
                  >
                    {uploadingImage ? 'Processing…' : 'Submit Ticket'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpDeskPage;