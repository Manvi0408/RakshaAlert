import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.warn('Twilio credentials are not properly configured');
}

const client = twilio(accountSid, authToken);

// Function to format phone number to international format
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with country code, add +
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  
  // If it's a 10-digit Indian number, add +91
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // If it already has +, return as is
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Default: add + if it looks like it has country code
  if (cleaned.length > 10) {
    return `+${cleaned}`;
  }
  
  return phone;
}

export async function sendSMS(to: string, message: string) {
  try {
    const formattedPhone = formatPhoneNumber(to);
    
    console.log('Sending SMS to:', formattedPhone);
    console.log('From:', twilioPhoneNumber);
    console.log('Message:', message);
    
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedPhone,
    });
    
    console.log('SMS sent successfully:', result.sid);
    return result;
  } catch (error) {
    console.error('SMS sending error:', error);
    throw error;
  }
}

export async function sendWhatsApp(to: string, message: string) {
  try {
    const formattedPhone = formatPhoneNumber(to);
    
    console.log('Sending WhatsApp to:', formattedPhone);
    
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:${formattedPhone}`,
    });
    
    console.log('WhatsApp sent successfully:', result.sid);
    return result;
  } catch (error) {
    console.error('WhatsApp sending error:', error);
    throw error;
  }
}

export default client;
