
async function run() {
  try {
    // Generate a valid token first
    const jwt = require('./src/utils/jwt');
    const token = jwt.generateAccessToken({ _id: '60d5ecb8b392cb331c234567', role: 'user' });

    const response = await fetch('http://localhost:3000/api/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('Success GET:', data);
  } catch (err) {
    console.error(err);
  }
}

run();
