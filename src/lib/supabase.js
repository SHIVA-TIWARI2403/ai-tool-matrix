import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aljlnisvrveuwlishgyv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsamxuaXN2cnZldXdsaXNoZ3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNjIwNTQsImV4cCI6MjEwODkzODA1NH0.d3g45738VxcaNuP-7zkzhlqGSlrDb_pQBVCJAK5cuHM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sign In with Google
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + window.location.pathname
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Sign In with Email Magic Link
 */
export async function signInWithEmail(email) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + window.location.pathname
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Sign Out
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Save Newsletter Subscriber to Supabase Database
 */
export async function subscribeNewsletter(email) {
  const { data, error } = await supabase
    .from('ai_tool_subscribers')
    .insert([{ email }])
    .select();
  if (error) {
    if (error.code === '23505') {
      return { success: true, message: 'Already subscribed!' };
    }
    throw error;
  }
  return { success: true, data };
}

/**
 * Submit Tool to Supabase Database
 */
export async function submitToolToDb(toolData) {
  const { data, error } = await supabase
    .from('ai_tool_submissions')
    .insert([{
      name: toolData.name,
      category: toolData.category,
      pricing_type: toolData.pricingType,
      starting_price: toolData.startingPrice,
      free_tier_details: toolData.freeTierDetails,
      website_url: toolData.websiteUrl,
      tagline: toolData.tagline,
      creator_email: toolData.creatorEmail || null,
      status: 'pending'
    }])
    .select();
  if (error) throw error;
  return data;
}

/**
 * Fetch All Submissions for Admin
 */
export async function fetchSubmissions() {
  const { data, error } = await supabase
    .from('ai_tool_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * Fetch All Subscribers for Admin
 */
export async function fetchSubscribers() {
  const { data, error } = await supabase
    .from('ai_tool_subscribers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
