import requests
import json

# Your Supabase project details
SUPABASE_URL = "https://jpbfprlpbiojfhshlhcp.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwYmZwcmxwYmlvamZoc2hsaGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTg0NzEsImV4cCI6MjA2ODg3NDQ3MX0.POTXWKXfs8vMJkI7O7a1sXUbQwmXLm6bGwbrMnQOaDU"

# Read the SQL file
with open('fix-profile-creation.sql', 'r', encoding='utf-8') as f:
    sql_content = f.read()

print("Applying database fix...")

# Split SQL into individual statements
statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip() and not stmt.strip().startswith('--')]

headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
}

success_count = 0
total_statements = len(statements)

for i, statement in enumerate(statements, 1):
    if statement:
        print(f"Executing statement {i}/{total_statements}...")
        
        try:
            # Try to execute the SQL statement
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
                headers=headers,
                json={"sql": statement},
                timeout=30
            )
            
            if response.status_code == 200:
                print(f"✓ Statement {i} executed successfully")
                success_count += 1
            else:
                print(f"✗ Statement {i} failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"✗ Statement {i} error: {str(e)}")

print(f"\nCompleted: {success_count}/{total_statements} statements executed successfully")

if success_count == total_statements:
    print("🎉 Database fix applied successfully!")
    print("You can now try signing up again - the profile creation should work.")
else:
    print("⚠️ Some statements failed. Please check the errors above.")