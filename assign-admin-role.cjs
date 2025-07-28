const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://jpbfprlpbiojfhshlhcp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwYmZwcmxwYmlvamZoc2hsaGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTg0NzEsImV4cCI6MjA2ODg3NDQ3MX0.POTXWKXfs8vMJkI7O7a1sXUbQwmXLm6bGwbrMnQOaDU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function assignAdminRole() {
  try {
    console.log('🔧 Setting up admin user...\n');

    // First, we need to get all users (requires direct database access)
    // Since we can't directly access auth.users, let's check if there are any profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, email')
      .limit(10);

    if (profilesError) {
      console.log('❌ Error accessing profiles:', profilesError.message);
      console.log('\n💡 To assign admin role, you need to:');
      console.log('1. Log in to your website first');
      console.log('2. Run this script again');
      console.log('3. Or manually assign admin role in Supabase dashboard');
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.log('❌ No user profiles found');
      console.log('\n💡 Please:');
      console.log('1. Sign up/log in to your website first');
      console.log('2. This will create your profile');
      console.log('3. Then run this script again');
      return;
    }

    console.log(`👥 Found ${profiles.length} user profiles:`);
    profiles.forEach((profile, index) => {
      console.log(`   ${index + 1}. Email: ${profile.email || 'N/A'}, ID: ${profile.user_id}`);
    });

    // Assign admin role to the first user (or all users for testing)
    for (const profile of profiles) {
      try {
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: profile.user_id,
            role: 'admin',
            created_at: new Date().toISOString()
          });

        if (roleError) {
          console.log(`❌ Failed to assign admin role to ${profile.email || profile.user_id}:`, roleError.message);
        } else {
          console.log(`✅ Admin role assigned to ${profile.email || profile.user_id}`);
        }
      } catch (error) {
        console.log(`❌ Error assigning role to ${profile.email || profile.user_id}:`, error.message);
      }
    }

    console.log('\n🔍 Verifying admin roles...');
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');

    if (rolesError) {
      console.log('❌ Error checking roles:', rolesError.message);
    } else {
      console.log(`✅ Total roles assigned: ${roles.length}`);
      roles.forEach(role => {
        console.log(`   - User: ${role.user_id}, Role: ${role.role}`);
      });
    }

    console.log('\n🎉 Admin setup complete! You can now:');
    console.log('1. Log in to your website');
    console.log('2. Access the admin panel');
    console.log('3. Configure OpenAI API key in AI Settings');

  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
}

// Run if called directly
if (require.main === module) {
  assignAdminRole();
}

module.exports = { assignAdminRole };