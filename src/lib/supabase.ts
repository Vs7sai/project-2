import { createClient } from '@supabase/supabase-js';
import { supabaseConfig, getEnvironmentStatus } from './env';

const envStatus = getEnvironmentStatus();

let supabase: any;

if (!envStatus.hasSupabase) {
  console.warn('⚠️ Supabase environment variables are not properly configured. Some features may not work.');
  console.warn('Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  console.warn('See docs/ENVIRONMENT_SETUP.md for setup instructions.');
  // Create a mock client to prevent app crashes
  supabase = null;
} else {
  try {
    supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
    supabase = null;
  }
}

export { supabase };

export const submitKycDetails = async (
  userId: string,
  data: {
    personalInfo: {
      fullName: string;
      dob: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      phone: string;
      email: string;
    };
    idInfo: {
      type: string;
      number: string;
    };
    bankDetails: {
      bankName: string;
      accountNumber: string;
      ifscCode: string;
      accountHolderName: string;
    };
  }
) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your Supabase environment variables.');
  }

  const { error } = await supabase
    .from('kyc_details')
    .upsert({
      user_id: userId,
      full_name: data.personalInfo.fullName,
      dob: data.personalInfo.dob,
      address: data.personalInfo.address,
      city: data.personalInfo.city,
      state: data.personalInfo.state,
      pincode: data.personalInfo.pincode,
      phone: data.personalInfo.phone,
      id_type: data.idInfo.type,
      id_number: data.idInfo.number,
      bank_name: data.bankDetails.bankName,
      account_number: data.bankDetails.accountNumber,
      ifsc_code: data.bankDetails.ifscCode,
      account_holder_name: data.bankDetails.accountHolderName,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error submitting KYC details:', error);
    throw error;
  }
};

export const joinContest = async (userId: string, contestId: string, portfolioId: string) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your Supabase environment variables.');
  }

  const { error } = await supabase
    .from('contests_participants')
    .insert({
      contest_id: contestId,
      user_id: userId,
      portfolio_id: portfolioId
    });

  if (error) {
    console.error('Error joining contest:', error);
    throw error;
  }
};

export const getKycStatus = async (userId: string) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your Supabase environment variables.');
  }

  const { data, error } = await supabase
    .from('kyc_details')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching KYC status:', error);
    throw error;
  }

  return data;
};