// Quick database check script
// Run with: node check-database.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n========================================');
console.log('🔍 CHECKING DATABASE SETUP');
console.log('========================================\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ ERROR: Environment variables not found!');
  console.log('\nMake sure .env.local exists with:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=your-url');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key\n');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...\n`);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  const tables = ['profiles', 'clients', 'freelancers', 'jobs', 'proposals', 'contracts'];
  const results = {};

  console.log('📋 Checking if tables exist...\n');

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });

      if (error) {
        if (error.message.includes('does not exist') || error.code === '42P01') {
          results[table] = { exists: false, error: 'Table does not exist' };
          console.log(`   ❌ ${table} - NOT FOUND`);
        } else {
          results[table] = { exists: false, error: error.message };
          console.log(`   ❌ ${table} - ERROR: ${error.message}`);
        }
      } else {
        results[table] = { exists: true, count: data?.length || 0 };
        console.log(`   ✅ ${table} - EXISTS`);
      }
    } catch (err) {
      results[table] = { exists: false, error: err.message };
      console.log(`   ❌ ${table} - ERROR: ${err.message}`);
    }
  }

  console.log('\n========================================');
  console.log('📊 SUMMARY');
  console.log('========================================\n');

  const existingTables = Object.entries(results).filter(([_, v]) => v.exists).length;
  const missingTables = tables.length - existingTables;

  console.log(`   Tables Found: ${existingTables}/${tables.length}`);
  console.log(`   Tables Missing: ${missingTables}\n`);

  if (missingTables > 0) {
    console.log('⚠️  ACTION REQUIRED!\n');
    console.log('Your database is NOT set up yet. You need to:');
    console.log('\n1. Go to: https://supabase.com');
    console.log('2. Click "SQL Editor" in the sidebar');
    console.log('3. Open the file: DATABASE_SETUP.md');
    console.log('4. Copy ALL the SQL code (inside the ```sql block)');
    console.log('5. Paste into Supabase SQL Editor');
    console.log('6. Click "Run" (or press Ctrl/Cmd + Enter)');
    console.log('7. Wait for "Success. No rows returned"');
    console.log('8. Run this script again to verify\n');
    console.log('📖 See QUICK_START_DATABASE.md for step-by-step guide');
  } else {
    console.log('🎉 SUCCESS! All tables exist!');
    console.log('\nYour database is ready. You can now:');
    console.log('   • Register new users');
    console.log('   • Login with existing users');
    console.log('   • Create jobs, proposals, contracts');
    console.log('\nRun: npm run dev');
    console.log('Then go to: http://localhost:3000/register\n');
  }

  console.log('========================================\n');
}

checkTables().catch(console.error);
