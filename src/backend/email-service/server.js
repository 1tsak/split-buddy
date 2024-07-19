


const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

sgMail.setApiKey("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");

app.use(cors());
app.use(express.json());

app.post('/send-welcome-email', async (req, res) => {
  const { email, displayName } = req.body;

  const msg = {
    to: email,
    from: 'vasoyaprince14@gmail.com',
    subject: 'Welcome to Split Buddy!',
    test:"hello from split buddy apxp",
    html: `
      <p>Hello ${displayName || "User"},</p>
      <p>Welcome to Split Buddy! You have successfully signed up.</p>
      <p>Start managing and splitting bills effortlessly with Split Buddy!</p>
    `,
  };

  try {
   const mail= await sgMail.send(msg);
   console.log(mail)
    res.status(200).send('Welcome email sent');
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).send('Failed to send welcome email');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
