require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function resetAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas!');
    
    const collection = mongoose.connection.collection('users');
    
    // First, let's see what users exist
    const users = await collection.find({}).toArray();
    console.log(`Found ${users.length} users in the database.`);
    users.forEach(u => console.log(`- Email: ${u.email}, Role: ${u.role}`));
    
    // Force create/update admin
    const email = 'admin@terraknots.com';
    const rawPassword = 'TerraKnots@2025';
    console.log(`\nSetting password for ${email} to: ${rawPassword}`);
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    
    const result = await collection.updateOne(
        { email: email },
        { 
            $set: { 
                name: 'TerraKnots Admin',
                email: email,
                password: hashedPassword,
                role: 'admin',
                updatedAt: new Date()
            },
            $setOnInsert: {
                createdAt: new Date()
            }
        },
        { upsert: true }
    );
    
    console.log('Update result:', result);
    console.log('\n✅ Admin account forcefully reset! Please login with:');
    console.log('Email:', email);
    console.log('Password:', rawPassword);
    
  } catch (error) {
    console.error('\n❌ Error connecting or updating:', error.message);
  } finally {
    process.exit(0);
  }
}

resetAdmin();
