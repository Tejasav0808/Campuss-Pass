import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dmsaxayaevskfalfyveh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtc2F4YXlhZXZza2ZhbGZ5dmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MDg1NjMsImV4cCI6MjA5MzE4NDU2M30.kMMHcrS-XcA85RETLoSt0mB5mgCB0U38Za4NacfbrPw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignup() {
  const email = `test.student.${Date.now()}@mru.ac.in`;
  console.log('Trying to sign up:', email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'Password123!',
    options: {
      data: {
        name: 'Test Student',
        role: 'student',
      }
    }
  });

  console.log('Result:');
  console.log(error ? error : 'Success!');
}

testSignup();
