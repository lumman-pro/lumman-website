-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the chats table
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  chat_duration INTEGER DEFAULT 0,
  chat_name TEXT DEFAULT 'New Conversation',
  chat_summary TEXT,
  chat_transcription TEXT,
  deleted BOOLEAN DEFAULT false,
  
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only view their own chats
CREATE POLICY "Users can view own chats" ON public.chats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own chats
CREATE POLICY "Users can insert own chats" ON public.chats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own chats
CREATE POLICY "Users can update own chats" ON public.chats
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own chats
CREATE POLICY "Users can delete own chats" ON public.chats
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a welcome chat for new users
  INSERT INTO public.chats (user_id, chat_name, chat_summary, chat_transcription)
  VALUES (
    NEW.id,
    'Welcome to Lumman',
    'This is your first conversation with Luke. Click the "Talk to Luke" button to start a new conversation.',
    'Luke: Welcome to Lumman. How can I help you today?'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
