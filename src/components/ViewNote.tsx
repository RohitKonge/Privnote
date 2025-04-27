import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, Lock, AlertTriangle, Shield, Clock, EyeOff, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Helmet } from 'react-helmet-async';

function ViewNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    checkNote();
  }, [id]);

  // Effect to update the time remaining
  useEffect(() => {
    if (note?.expires_at || expiresAt) {
      const updateTimeLeft = () => {
        const expiryDate = new Date(note?.expires_at || expiresAt);
        const now = new Date();
        
        if (expiryDate <= now) {
          navigate('/destroyed?reason=expired');
          return;
        }
        
        const diff = expiryDate.getTime() - now.getTime();
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        let timeString = '';
        if (days > 0) {
          timeString = `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
        } else if (hours > 0) {
          timeString = `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
          timeString = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        }
        
        setTimeLeft(timeString);
      };
      
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [note, expiresAt, navigate]);

  const checkNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('password, read, expires_at')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        // Check if note has expired
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          navigate('/destroyed?reason=expired');
          return;
        }
        
        setIsPasswordProtected(!!data.password);
        if (data.read) {
          navigate('/destroyed?reason=read');
          return;
        }
        if (!data.password) {
          fetchNote();
        } else {
          // For password protected notes, store expiration time separately
          setExpiresAt(data.expires_at);
        }
      }
    } catch (error) {
      console.error('Error checking note:', error);
      setError('Note not found or already destroyed.');
    } finally {
      setLoading(false);
    }
  };

  const fetchNote = async (providedPassword?: string) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('content, expires_at')
        .eq('id', id)
        .eq(providedPassword ? 'password' : 'id', providedPassword || id)
        .single();

      if (error) throw error;

      // Check if note has expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        navigate('/destroyed?reason=expired');
        return;
      }

      if (data) {
        setNote(data);
        setInvalidPassword(false);
        // Mark as read only if the note doesn't have an expiration date
        // or if the expiration option is "after_reading"
        if (!data.expires_at) {
          await supabase
            .from('notes')
            .update({ read: true })
            .eq('id', id);
        }
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      if (providedPassword) {
        setInvalidPassword(true);
      } else {
        setError('Note not found or already destroyed.');
      }
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNote(password);
  };

  const handleProceed = () => {
    setShowWarning(false);
  };

  const copyToClipboard = async () => {
    if (note?.content) {
      try {
        await navigator.clipboard.writeText(note.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" role="status" aria-label="Loading note">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-hidden="true"></div>
        <span className="sr-only">Loading note...</span>
      </div>
    );
  }

  if (error) {
    return (
      <article className="bg-white rounded-lg shadow-xl p-6 text-center" aria-labelledby="error-title">
        <Helmet>
          <title>Note Not Found | Privnote</title>
          <meta name="description" content="The requested private note was not found or has been destroyed." />
        </Helmet>
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
        <h2 id="error-title" className="text-xl font-semibold mb-2">Note Not Found</h2>
        <p className="text-gray-600">{error}</p>
      </article>
    );
  }

  if (showWarning) {
    return (
      <article className="bg-white rounded-lg shadow-xl p-6 text-center" aria-labelledby="warning-title">
        <Helmet>
          <title>View Private Note | Privnote</title>
          <meta name="description" content="View a secure, self-destructing private note. Once viewed, the note will be permanently deleted." />
        </Helmet>
        <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" aria-hidden="true" />
        <h2 id="warning-title" className="text-xl font-semibold mb-4">⚠️ Important Warning</h2>
        <p className="text-gray-600 mb-6">
          {(note?.expires_at || expiresAt) ? (
            <>This private note will expire in {timeLeft}. You can view it now and come back to it until it expires.</>
          ) : (
            <>This private note can only be viewed once. After viewing, it will be permanently destroyed and cannot be recovered.</>
          )}
        </p>
        <button
          onClick={handleProceed}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          aria-label="Proceed to view note"
        >
          I Understand, Show the Note
        </button>
      </article>
    );
  }

  if (isPasswordProtected && !note?.content) {
    return (
      <article className="bg-white rounded-lg shadow-xl p-6" aria-labelledby="password-protected-title">
        <Helmet>
          <title>Password Protected Note | Privnote</title>
          <meta name="description" content="Enter the password to view this protected private note." />
        </Helmet>
        <div className="flex items-center gap-4 mb-6">
          <Lock className="w-6 h-6 text-blue-600" aria-hidden="true" />
          <h2 id="password-protected-title" className="text-xl font-semibold">Password Protected Note</h2>
        </div>

        {invalidPassword && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm" role="alert">
            Invalid password. Please try again.
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4" aria-label="Password protection form">
          <div className="relative">
            <label htmlFor="note-password" className="sr-only">Note Password</label>
            <input
              id="note-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter note password"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              required
              aria-label="Note password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            View Note
          </button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm text-center" role="status">
          {expiresAt ? (
            <div className="flex items-center justify-center">
              <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>This note will expire in {timeLeft}. You can view it multiple times until then.</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>This note will self-destruct after being viewed once.</span>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-lg shadow-xl p-6" aria-labelledby="note-content-title">
      <Helmet>
        <title>View Private Note | Privnote</title>
        <meta name="description" content="Viewing a secure, self-destructing private note. This note will be destroyed after reading." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Eye className="w-6 h-6 text-blue-600" aria-hidden="true" />
          <h2 id="note-content-title" className="text-xl font-semibold">Private Note</h2>
        </div>
        
        {note?.content && (
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
            aria-label={copied ? "Content copied" : "Copy note content"}
          >
            {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
            <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6 relative">
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900" role="region" aria-label="Note content">
          {note?.content}
        </pre>
      </div>

      <div 
        className={`text-center text-sm ${note?.expires_at ? 'bg-blue-50 text-blue-700' : 'text-red-500'} p-3 rounded-lg flex items-center justify-center`}
        role="status"
      >
        {note?.expires_at ? (
          <>
            <Clock className="w-4 h-4 inline mr-2" aria-hidden="true" />
            <span>This note will expire in {timeLeft}. You can view it multiple times until then.</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4 inline mr-2" aria-hidden="true" />
            <span>This note has been destroyed and cannot be accessed again.</span>
          </>
        )}
      </div>
    </article>
  );
}

export default ViewNote;