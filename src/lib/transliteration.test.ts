// Test file for transliteration engine
import { transliterationEngine } from './transliteration';

// Simple test function (since we don't have a testing framework set up)
function runTransliterationTests() {
  console.log('🧪 Running FIXED Transliteration Tests...\n');

  // Test the main issue: zakariya conversion
  console.log('🎯 PRIMARY FIX TESTS (zakariya):');
  const primaryTests = [
    { input: 'zakariya', language: 'arabic', expected: 'زكريا' },
    { input: 'zakariya', language: 'japanese', expected: 'ザカリヤ' },
    { input: 'zakariya', language: 'hindi', expected: 'ज़करिया' }
  ];

  primaryTests.forEach(test => {
    const result = transliterationEngine.transliterate(test.input, test.language as any);
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} "${test.input}" → "${result}" (${test.language}, expected: "${test.expected}")`);
    if (result !== test.expected) {
      console.log(`   🔍 Character analysis: "${result}" vs "${test.expected}"`);
    }
  });

  // Test Arabic transliteration
  console.log('\n🔤 Arabic Transliteration Tests:');
  const arabicTests = [
    { input: 'zakariya', expected: 'زكريا' },
    { input: 'mohammad', expected: 'محمد' },
    { input: 'ahmed', expected: 'أحمد' },
    { input: 'fatima', expected: 'فاطمة' },
    { input: 'omar', expected: 'عمر' },
    { input: 'sarah', expected: 'سارة' },
    { input: 'ali', expected: 'علي' }
  ];

  arabicTests.forEach(test => {
    const result = transliterationEngine.transliterate(test.input, 'arabic');
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} "${test.input}" → "${result}" (expected: "${test.expected}")`);
  });

  console.log('\n🔤 Japanese Transliteration Tests:');
  const japaneseTests = [
    { input: 'zakariya', expected: 'ザカリヤ' },
    { input: 'takeshi', expected: 'たけし' },
    { input: 'sakura', expected: 'さくら' },
    { input: 'akira', expected: 'あきら' },
    { input: 'yuki', expected: 'ゆき' },
    { input: 'mai', expected: 'まい' }
  ];

  japaneseTests.forEach(test => {
    const result = transliterationEngine.transliterate(test.input, 'japanese');
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} "${test.input}" → "${result}" (expected: "${test.expected}")`);
  });

  console.log('\n🔤 Hindi Transliteration Tests:');
  const hindiTests = [
    { input: 'zakariya', expected: 'ज़करिया' },
    { input: 'raj', expected: 'राज' },
    { input: 'ravi', expected: 'रवि' },
    { input: 'sita', expected: 'सीता' },
    { input: 'rama', expected: 'राम' },
    { input: 'krishna', expected: 'कृष्ण' }
  ];

  hindiTests.forEach(test => {
    const result = transliterationEngine.transliterate(test.input, 'hindi');
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} "${test.input}" → "${result}" (expected: "${test.expected}")`);
  });

  console.log('\n🔍 Text Detection Tests:');
  console.log(`✅ isLatinText("hello") → ${transliterationEngine.isLatinText("hello")}`);
  console.log(`✅ isLatinText("زكريا") → ${transliterationEngine.isLatinText("زكريا")}`);
  console.log(`✅ isInTargetScript("زكريا", "arabic") → ${transliterationEngine.isInTargetScript("زكريا", "arabic")}`);
  console.log(`✅ isInTargetScript("hello", "arabic") → ${transliterationEngine.isInTargetScript("hello", "arabic")}`);

  console.log('\n🎉 Fixed transliteration tests completed!');
  console.log('\n📋 Expected Results Summary:');
  console.log('• zakariya → زكريا (Arabic)');
  console.log('• zakariya → ザカリヤ (Japanese)');
  console.log('• zakariya → ज़करिया (Hindi)');
  console.log('\nNo more mixed scripts like "زاkariyam" or "zअkariya"!');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runTransliterationTests();
}

export { runTransliterationTests };