// Twilio SMS utility
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const fromNumber = process.env.TWILIO_FROM_NUMBER || '';

let client = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

async function sendSMS(to, body) {
  if (!client) throw new Error('Twilio API keys not set');
  return client.messages.create({
    body,
    from: fromNumber,
    to,
  });
}

module.exports = { sendSMS };
