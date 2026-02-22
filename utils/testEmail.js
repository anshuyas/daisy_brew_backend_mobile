require('dotenv').config({ path: './config/config.env' });
const sendEmail = require('./sendEmail');

sendEmail({
  to: 'anshuyasayaju17@gmail.com',
  subject: 'Test Email',
  html: '<h1>Test</h1><p>If you get this, SMTP works!</p>'
})
  .then(() => console.log('Email sent'))
  .catch(err => console.error('Email error:', err));

  console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);