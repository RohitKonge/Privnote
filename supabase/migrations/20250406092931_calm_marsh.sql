/*
  # Create notes table for private note storage

  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `content` (text, stores the note content)
      - `password` (text, optional password protection)
      - `read` (boolean, tracks if note has been read)
      - `created_at` (timestamp)
      - `expires_at` (timestamp, when the note should expire)

  2. Security
    - Enable RLS on `notes` table
    - Add policies for:
      - Anyone can create notes
      - Only unread notes can be viewed
      - Notes can only be read once
*/

CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  password text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create notes
CREATE POLICY "Anyone can create notes" 
ON notes FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow reading unread notes that haven't expired
CREATE POLICY "Only unread notes can be viewed" 
ON notes FOR SELECT 
TO anon 
USING (read = false AND (expires_at IS NULL OR expires_at > now()));

-- Allow updating read status
CREATE POLICY "Notes can be marked as read" 
ON notes FOR UPDATE 
TO anon 
USING (true) 
WITH CHECK (true);