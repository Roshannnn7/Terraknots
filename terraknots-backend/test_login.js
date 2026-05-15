const axios = require('axios');

async function testLogin() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@terraknots.com',
            password: 'TerraKnots@2025'
        });
        console.log('Login successful!', response.data);
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
    }
}

testLogin();
