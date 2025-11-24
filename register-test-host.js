// Quick script to register a test host via API
// Run with: node register-test-host.js

const testHost = {
  email: "ewan.sptc@gmail.com",
  password: "pass1234",
  firstName: "Ewan",
  lastName: "Test",
  phone: "+57 123 456 7890",
  country: "Colombia",
  city: "Bogotá",
  dateOfBirth: "1990-01-01"
};

console.log('🚀 Registering test host...');
console.log('Email:', testHost.email);
console.log('Password:', testHost.password);

fetch('http://localhost:3000/api/host/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testHost)
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('✅ SUCCESS! Host registered:', data.userId);
    console.log('\nYou can now log in at: http://localhost:3000/host/login');
    console.log('Email:', testHost.email);
    console.log('Password:', testHost.password);
  } else {
    console.error('❌ ERROR:', data.error);
  }
})
.catch(error => {
  console.error('❌ REQUEST FAILED:', error.message);
});
