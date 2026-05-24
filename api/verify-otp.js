import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for OTP storage
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    // Look up the OTP in Supabase
    const { data: otpRecords, error: fetchError } = await supabase
      .from('otps')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('Failed to fetch OTP:', fetchError);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (!otpRecords || otpRecords.length === 0) {
      return res.status(400).json({ success: false, message: 'No OTP requested for this email' });
    }

    const storedOtp = otpRecords[0];

    // Check if expired
    if (new Date() > new Date(storedOtp.expires_at)) {
      // Clean up expired OTP
      await supabase.from('otps').delete().eq('id', storedOtp.id);
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Verify OTP
    if (storedOtp.otp === otp) {
      // Success! Clean up the used OTP
      await supabase.from('otps').delete().eq('id', storedOtp.id);
      return res.json({ success: true, message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
