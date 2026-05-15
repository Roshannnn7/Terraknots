require('dotenv').config();
const mongoose = require('mongoose');

async function checkAdmin() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/terraknots');
  console.log('Connected to local DB');
  const collection = mongoose.connection.collection('users');
  const admins = await collection.find({ role: 'admin' }).toArray();
  if (admins.length > 0) {
    console.log('Admins found:');
    admins.forEach(admin => console.log('Email:', admin.email));
    
    // Create an override if user forgot it
    console.log('\nCreating/Updating a new default admin (admin@terraknots.com / Admin@123)...');
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('Admin@123', salt);
    
    await collection.updateOne(
        { email: 'admin@terraknots.com' },
        { 
            $set: { 
                name: 'TerraKnots Admin',
                email: 'admin@terraknots.com',
                password: password,
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        },
        { upsert: true }
    );
    console.log('Created/Updated default admin account!');
  } else {
    console.log('No admin found. Creating one...');
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('Admin@123', salt);
    
    await collection.insertOne({
        name: 'TerraKnots Admin',
        email: 'admin@terraknots.com',
        password: password,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
    });
    console.log('Admin created! Email: admin@terraknots.com, Password: Admin@123');
  }
  process.exit(0);
}
checkAdmin();
