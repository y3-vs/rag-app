// Verification script to check environment variables
const requiredVars = [
  'OPENROUTER_API_KEY',
  'OPENROUTER_MODEL',
  'OPENROUTER_BASE_URL',
];

console.log('Environment Variable Verification:');
console.log('==================================\n');

requiredVars.forEach((varName) => {
  const value = process.env[varName];
  const status = value && value !== 'your_openrouter_api_key_here' 
    ? '✅ SET' 
    : '⚠️  NOT SET OR PLACEHOLDER';
  console.log(`${varName}: ${status}`);
  if (value) {
    console.log(`  └─ Value: ${varName === 'OPENROUTER_API_KEY' ? '***' + value.slice(-4) : value}`);
  }
});

console.log('\n==================================');
console.log('Note: Update .env.local with your actual OpenRouter API key');
console.log('Get it from: https://openrouter.ai/');
