const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://jpbfprlpbiojfhshlhcp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwYmZwcmxwYmlvamZoc2hsaGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTg0NzEsImV4cCI6MjA2ODg3NDQ3MX0.POTXWKXfs8vMJkI7O7a1sXUbQwmXLm6bGwbrMnQOaDU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAdminStatus() {
  try {
    console.log('🔍 Checking admin status and database tables...\n');

    // 1. Check if required tables exist
    console.log('📋 Checking database tables:');
    
    // Check user_roles table
    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_roles')
      .select('*')
      .limit(1);
    
    if (userRolesError) {
      console.log('❌ user_roles table:', userRolesError.message);
    } else {
      console.log('✅ user_roles table: exists');
    }

    // Check site_settings table
    const { data: siteSettings, error: siteSettingsError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1);
    
    if (siteSettingsError) {
      console.log('❌ site_settings table:', siteSettingsError.message);
    } else {
      console.log('✅ site_settings table: exists');
    }

    // Check security_audit_log table
    const { data: auditLog, error: auditError } = await supabase
      .from('security_audit_log')
      .select('*')
      .limit(1);
    
    if (auditError) {
      console.log('❌ security_audit_log table:', auditError.message);
    } else {
      console.log('✅ security_audit_log table: exists');
    }

    console.log('\n👥 Checking users and admin roles:');

    // 2. Check all users in auth.users (requires auth context)
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError || !authData.session) {
      console.log('ℹ️  No active session - please log in to check your admin role');
      
      // Try to get all users in user_roles table instead
      const { data: allRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (!rolesError && allRoles) {
        console.log(`📊 Found ${allRoles.length} user roles in database:`);
        allRoles.forEach(role => {
          console.log(`   - User ID: ${role.user_id}, Role: ${role.role}`);
        });
      }
    } else {
      const user = authData.session.user;
      console.log(`👤 Current user: ${user.email} (ID: ${user.id})`);
      
      // Check current user's role
      const { data: currentUserRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (roleError) {
        console.log('❌ No role assigned to current user');
        console.log('💡 You need admin role to use AI features');
      } else {
        console.log(`🔑 Your role: ${currentUserRole.role}`);
        if (currentUserRole.role === 'admin') {
          console.log('✅ You have admin access!');
        } else {
          console.log('❌ You need admin role for AI features');
        }
      }
    }

    console.log('\n🔧 Testing edge functions:');

    // 3. Test ai-ping function
    const { data: pingData, error: pingError } = await supabase.functions.invoke('ai-ping');
    
    if (pingError) {
      console.log('❌ ai-ping function error:', pingError.message);
    } else {
      console.log('✅ ai-ping function:', pingData?.success ? 'working' : 'not configured');
    }

    // 4. Check for OpenAI API key in site_settings
    const { data: openaiKey, error: keyError } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'openai_api_key')
      .single();
    
    if (keyError) {
      console.log('❌ No OpenAI API key configured');
    } else {
      console.log('✅ OpenAI API key is configured');
    }

    console.log('\n🏁 Summary:');
    console.log('1. Make sure you have admin role assigned');
    console.log('2. Ensure edge functions are deployed');
    console.log('3. Configure OpenAI API key through the admin panel');

  } catch (error) {
    console.error('Error checking admin status:', error);
  }
}

// Run if called directly
if (require.main === module) {
  checkAdminStatus();
}

module.exports = { checkAdminStatus };