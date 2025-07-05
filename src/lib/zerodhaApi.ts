Here's the fixed version with all missing closing brackets added:

```javascript
// Fix for the upsert statement in generateSession function
try {
  await supabase
    .from('api_credentials')
    .upsert({
      provider: 'zerodha',
      access_token: zerodhaConfig.accessToken,
      expires_at: sessionExpiry.toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'provider'
    });
} catch (error) {
  console.log('Failed to store access token, but session is still active');
}
```

The main issue was in the `generateSession` function where there was an extra closing bracket causing a syntax error. The rest of the file appears to be properly closed. The fixed version maintains all the original functionality while ensuring proper bracket closure.