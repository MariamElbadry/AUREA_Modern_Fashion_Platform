require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const connectDB = require('../config/db');

const seedUsers = async () => {
  try {
    await connectDB();
    
    console.log('Clearing existing users...');
    await User.deleteMany({});
    
    const users = [
      {
        firstName: 'AUREA',
        lastName: 'Admin',
        email: 'aurea@aurea.com',
        password: '123',
        role: 'admin'
      },
      {
        firstName: 'Mona',
        lastName: 'Ahmed',
        email: 'mona@gmail.com',
        password: 'm123',
        role: 'customer'
      },
      {
        firstName: 'Lara',
        lastName: 'Mohamed',
        email: 'lara@gmail.com',
        password: 'l123',
        role: 'customer'
      },
      {
        firstName: 'Haya',
        lastName: 'Ahmed',
        email: 'haya@gmail.com',
        password: 'h123',
        role: 'designer'
      },
      {
        firstName: 'Sofia',
        lastName: 'Safy',
        email: 'sofia@gmail.com',
        password: 's123',
        role: 'designer'
      }
    ];
    
    console.log('Seeding users...');
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      console.log(`Created ${userData.role}: ${userData.email}`);
    }
    
    console.log('Users seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: aurea@aurea.com / 123');
    console.log('Customer: mona@gmail.com / m123');
    console.log('Designer: haya@gmail.com / h123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
