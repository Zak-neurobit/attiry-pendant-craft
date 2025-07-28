const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = 'https://jpbfprlpbiojfhshlhcp.supabase.co';
// Note: This is using the anon key, which might not have permissions to modify user_roles
// For production, you'd need the service role key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwYmZwcmxwYmlvamZoc2hsaGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTg0NzEsImV4cCI6MjA2ODg3NDQ3MX0.POTXWKXfs8vMJkI7O7a1sXUbQwmXLm6bGwbrMnQOaDU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAdminUser() {
  console.log('=== Setting Up Admin User ===\n');
  
  try {
    // Check if we have any existing users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name');

    if (profilesError) {
      console.error('❌ Error accessing profiles:', profilesError);
      return;
    }

    console.log(`Found ${profiles?.length || 0} existing users:`);
    profiles?.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.email} (${profile.first_name} ${profile.last_name})`);
    });

    if (!profiles || profiles.length === 0) {
      console.log('\n❌ No users found. Please create a user account first through the website.');
      console.log('1. Go to /signup on the website');
      console.log('2. Create an account');
      console.log('3. Then run this script again to make that user an admin');
      return;
    }

    // Try to make the first user an admin
    const firstUser = profiles[0];
    console.log(`\nAttempting to make ${firstUser.email} an admin...`);

    const { data: insertData, error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: firstUser.id,
        role: 'admin'
      });

    if (insertError) {
      console.error('❌ Error creating admin role:', insertError);
      
      if (insertError.message.includes('new row violates row-level security policy')) {
        console.log('\n💡 RLS Policy Issue:');
        console.log('The user_roles table has Row Level Security enabled.');
        console.log('You need to either:');
        console.log('1. Temporarily disable RLS on user_roles table in Supabase dashboard');
        console.log('2. Or use the service role key (not anon key) for this operation');
        console.log('3. Or manually add the admin role through Supabase dashboard');
        
        console.log('\n🔧 Manual Solution:');
        console.log('1. Go to Supabase Dashboard > Table Editor > user_roles');
        console.log('2. Insert a new row:');
        console.log(`   - user_id: ${firstUser.id}`);
        console.log(`   - role: admin`);
        console.log('3. Save the row');
      }
    } else {
      console.log('✅ Successfully created admin role!');
      console.log(`👤 ${firstUser.email} is now an admin`);
      
      // Verify the role was created
      const { data: verifyData, error: verifyError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', firstUser.id);
        
      if (verifyError) {
        console.log('❌ Error verifying admin role:', verifyError);
      } else {
        console.log('✅ Admin role verified:', verifyData);
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the setup
setupAdminUser().catch(console.error);