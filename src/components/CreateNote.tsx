import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Clock, Send, Copy, Check, AlertCircle, Eye, EyeOff, Timer } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

function CreateNote() {
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noteLink, setNoteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [expirationOption, setExpirationOption] = useState('after_reading');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if passwords match when password is provided
    if (password && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    setLoading(true);

    // Calculate expiration time based on selected option
    let expiresAt = null;
    if (expirationOption === '1_hour') {
      expiresAt = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString();
    } else if (expirationOption === '24_hours') {
      expiresAt = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();
    } else if (expirationOption === '7_days') {
      expiresAt = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (expirationOption === '30_days') {
      expiresAt = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            content,
            password: password || null,
            read: false,
            expires_at: expiresAt
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        // Get the base URL, handling potential Netlify deployments
        let baseUrl = window.location.origin;
        
        // For Netlify deployments, make sure we're using the correct base path
        if (baseUrl.includes('netlify.app') || baseUrl.includes('netlify.com') || baseUrl.includes('privnote.tech')) {
          // Remove any trailing slashes
          baseUrl = baseUrl.replace(/\/$/, '');
        }
        
        const link = `${baseUrl}/note/${data[0].id}`;
        setNoteLink(link);
      }
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(noteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get expiration message based on the option
  const getExpirationMessage = () => {
    switch (expirationOption) {
      case 'after_reading':
        return 'This note will self-destruct after being read once';
      case '1_hour':
        return 'This note will self-destruct 1 hour after creation';
      case '24_hours':
        return 'This note will self-destruct 24 hours after creation';
      case '7_days':
        return 'This note will self-destruct 7 days after creation';
      case '30_days':
        return 'This note will self-destruct 30 days after creation';
      default:
        return 'This note will self-destruct after being read once';
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <Shield className="w-6 h-6 text-blue-600" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Create a Private Note</h2>
      </div>

      {!noteLink ? (
        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Create private note form">
          <div>
            <label htmlFor="noteContent" className="sr-only">Note Content</label>
            <textarea
              id="noteContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your private note here..."
              className="w-full h-48 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
              required
              aria-label="Note content"
            />
          </div>

          {/* Password Protection Section */}
          <section className="space-y-4" aria-labelledby="password-protection">
            <div className="flex items-center gap-2 mb-2" id="password-protection">
              <Clock className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <span className="text-sm font-medium">Optional Password Protection</span>
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="Enter a password to encrypt the note"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                aria-label="Password for note encryption"
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
            
            {password && (
              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="Confirm password"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  required={!!password}
                  aria-label="Confirm password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
            )}
            
            {passwordError && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{passwordError}</span>
              </div>
            )}
          </section>

          {/* Expiration Options Section */}
          <section className="space-y-4" aria-labelledby="expiration-options">
            <div className="flex items-center gap-2 mb-2" id="expiration-options">
              <Timer className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <span className="text-sm font-medium">Self-Destruct Timer</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3" role="radiogroup" aria-label="Note expiration options">
              <label className={`flex items-center p-3 rounded-lg border ${expirationOption === 'after_reading' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} cursor-pointer`}>
                <input
                  type="radio"
                  name="expiration"
                  value="after_reading"
                  checked={expirationOption === 'after_reading'}
                  onChange={() => setExpirationOption('after_reading')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <span className="block text-sm font-medium text-gray-900">After reading</span>
                  <span className="block text-xs text-gray-500">Destroys once read</span>
                </div>
              </label>
              
              <label className={`flex items-center p-3 rounded-lg border ${expirationOption === '1_hour' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} cursor-pointer`}>
                <input
                  type="radio"
                  name="expiration"
                  value="1_hour"
                  checked={expirationOption === '1_hour'}
                  onChange={() => setExpirationOption('1_hour')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <span className="block text-sm font-medium text-gray-900">1 hour</span>
                  <span className="block text-xs text-gray-500">Destroys after 1 hour</span>
                </div>
              </label>
              
              <label className={`flex items-center p-3 rounded-lg border ${expirationOption === '24_hours' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} cursor-pointer`}>
                <input
                  type="radio"
                  name="expiration"
                  value="24_hours"
                  checked={expirationOption === '24_hours'}
                  onChange={() => setExpirationOption('24_hours')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <span className="block text-sm font-medium text-gray-900">24 hours</span>
                  <span className="block text-xs text-gray-500">Destroys after 24 hours</span>
                </div>
              </label>
              
              <label className={`flex items-center p-3 rounded-lg border ${expirationOption === '7_days' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} cursor-pointer`}>
                <input
                  type="radio"
                  name="expiration"
                  value="7_days"
                  checked={expirationOption === '7_days'}
                  onChange={() => setExpirationOption('7_days')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <span className="block text-sm font-medium text-gray-900">7 days</span>
                  <span className="block text-xs text-gray-500">Destroys after 7 days</span>
                </div>
              </label>
              
              <label className={`flex items-center p-3 rounded-lg border ${expirationOption === '30_days' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} cursor-pointer`}>
                <input
                  type="radio"
                  name="expiration"
                  value="30_days"
                  checked={expirationOption === '30_days'}
                  onChange={() => setExpirationOption('30_days')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <span className="block text-sm font-medium text-gray-900">30 days</span>
                  <span className="block text-xs text-gray-500">Destroys after 30 days</span>
                </div>
              </label>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading || content.length === 0 || (password.length > 0 && !confirmPassword)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={loading ? 'Creating note...' : 'Create private note'}
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {loading ? 'Creating...' : 'Create Private Note'}
          </button>
        </form>
      ) : (
        <section className="space-y-6" aria-label="Note created successfully">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Share this private link with the recipient:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={noteLink}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-900"
                aria-label="Generated private note link"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                aria-label={copied ? 'Link copied' : 'Copy link to clipboard'}
              >
                {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600" role="alert">
            <p className="mb-2">⚠️ Important:</p>
            <ul className="space-y-1">
              <li>• {getExpirationMessage()}</li>
              <li>• The link can only be used once</li>
              <li>• After viewing, the note cannot be recovered</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setNoteLink('');
              setContent('');
              setPassword('');
              setConfirmPassword('');
              setPasswordError('');
              setExpirationOption('after_reading');
            }}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
            aria-label="Create another note"
          >
            <Shield className="w-4 h-4" aria-hidden="true" />
            Create Another Note
          </button>
        </section>
      )}
    </article>
  );
}

export default CreateNote;