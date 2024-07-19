import axios from 'axios';

export const sendWelcomeEmail = async (user: any) => {
  const { email, displayName } = user;

  try {
    const response = await axios.post('https://welcome-mail-split-buddy.onrender.com/send-welcome-email', {
      email,
      displayName,
    });
    console.log('Welcome email sent:', response.data);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};
