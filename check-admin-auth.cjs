const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://jpbfprlpbiojfhshlhcp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwYmZwcmxwYmlvamZoc2hsaGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTg0NzEsImV4cCI6MjA2ODg3NDQ3MX0.POTXWKXfs8vMJkI7O7a1sXUbQwmXLm6bGwbrMnQOaDU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminAuth() {
  console.log('=== Checking Admin Authentication Setup ===\n');
  
  try {
    // Check if user_roles table exists and has data
    console.log('1. Checking user_roles table...');
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');

    if (rolesError) {
      console.error('❌ Error accessing user_roles table:', rolesError);
      console.log('This table might not exist or might have RLS policies preventing access');
    } else {
      console.log(`✅ user_roles table accessible`);
      console.log(`📊 Total user roles found: ${userRoles?.length || 0}\n`);

      if (userRoles && userRoles.length > 0) {
        console.log('📋 User Roles:');
        userRoles.forEach((role, index) => {
          console.log(`${index + 1}. User ID: ${role.user_id} | Role: ${role.role}`);
        });
        
        // Check for admin users specifically
        const adminUsers = userRoles.filter(r => r.role === 'admin');
        console.log(`\n⭐ Admin users: ${adminUsers.length}`);
        adminUsers.forEach(admin => {
          console.log(`   - User ID: ${admin.user_id}`);
        });
      } else {
        console.log('❌ No user roles found in database');
        console.log('This means no users have been assigned admin roles');
      }
    }

    // Check if profiles table has any users
    console.log('\n2. Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, created_at')
      .limit(5);

    if (profilesError) {
      console.error('❌ Error accessing profiles table:', profilesError);
    } else {
      console.log(`✅ profiles table accessible`);
      console.log(`📊 Sample profiles found: ${profiles?.length || 0}`);
      if (profiles && profiles.length > 0) {
        profiles.forEach((profile, index) => {
          console.log(`${index + 1}. ${profile.email} (${profile.first_name} ${profile.last_name})`);
        });
      }
    }

    // Test current auth status
    console.log('\n3. Checking current auth status...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Auth check error:', authError);
    } else if (user) {
      console.log(`✅ Currently authenticated as: ${user.email}`);
      
      // Check if current user has admin role
      const { data: currentUserRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
        
      if (roleError) {
        console.log(`❌ Error checking user role: ${roleError.message}`);
      } else {
        console.log(`👤 Current user role: ${currentUserRole?.role || 'No role assigned'}`);
      }
    } else {
      console.log('❌ No user currently authenticated');
      console.log('This explains why admin products page shows "Loading products"');
      console.log('User needs to log in to access admin area');
    }

  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
}

// Run the check
checkAdminAuth().catch(console.error);