# 🚨 RakshaAlert - Women Safety Platform

A comprehensive personal safety application with real-time emergency alerts and location sharing capabilities.

## 🎯 Features

### Core Functionality
- **🔐 User Authentication**: Secure registration and login system
- **📱 Emergency Alerts**: One-click emergency alert system
- **📍 Location Sharing**: Real-time GPS location sharing with emergency contacts
- **👥 Contact Management**: Add and manage up to 5 emergency contacts
- **📊 Alert History**: Track all sent emergency alerts
- **🔔 SMS Notifications**: Automated SMS alerts via Twilio integration

### Safety Features
- **Instant Location Sharing**: Google Maps integration for precise location
- **Multiple Contact Alerts**: Send alerts to all emergency contacts simultaneously
- **Time-stamped Alerts**: Include date and time in emergency messages
- **Address Resolution**: Automatic address lookup from GPS coordinates

## 🛠️ Tech Stack

### Frontend
- **Next.js 13**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Modern UI components

### Backend
- **Next.js API Routes**: RESTful API endpoints
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: Secure authentication tokens
- **Twilio**: SMS messaging service

### Additional Libraries
- **Zod**: Runtime type validation
- **bcryptjs**: Password hashing
- **Geolocation API**: Browser location services

## 📋 Prerequisites

- Node.js 18.0 or higher
- MongoDB database (local or cloud)
- Twilio account for SMS functionality

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Next.js
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Development Settings (optional)
MOCK_SMS=false
```

### 4. Configure Twilio (for SMS functionality)

1. **Create Twilio Account**: Sign up at [twilio.com](https://www.twilio.com)
2. **Get Credentials**: Find your Account SID and Auth Token in the console
3. **Buy Phone Number**: Purchase a phone number for sending SMS
4. **Verify Numbers**: For free trial, verify recipient phone numbers

### 5. Run the application
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## 📱 Usage

### Getting Started
1. **Register**: Create a new account with your details
2. **Login**: Access your dashboard
3. **Add Contacts**: Add up to 5 emergency contacts
4. **Test System**: Send a test alert to verify functionality

### Emergency Alert Process
1. **Click Alert Button**: Triggers emergency alert system
2. **Location Capture**: Automatically captures your GPS location
3. **SMS Dispatch**: Sends alerts to all emergency contacts
4. **Message Content**: Includes your location, address, and timestamp

### Sample Emergency Message
```
🚨 EMERGENCY ALERT 🚨
John Doe is in danger.
📍 Location: https://maps.google.com/?q=40.7128,-74.0060
📍 Address: 123 Main St, New York, NY
📅 Time: 1/6/2025, 3:45:23 PM
📞 Please reach out immediately.
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Contacts
- `GET /api/contacts` - Get user's contacts
- `POST /api/contacts` - Add new contact
- `DELETE /api/contacts/[id]` - Delete contact

### Alerts
- `POST /api/alerts` - Send emergency alert
- `GET /api/alerts` - Get alert history

### Testing
- `POST /api/test-sms` - Test SMS functionality

## 🧪 Development Features

### Mock SMS Mode
For development and testing without actual SMS costs:

```env
MOCK_SMS=true
```

This will:
- ✅ Simulate SMS sending
- ✅ Log message content
- ✅ Return success responses
- ❌ Not send actual SMS messages(Because of paid service)

### Phone Number Formatting
The system automatically formats phone numbers:
- Input: `9876543210` → Output: `+919876543210`
- Input: `+1234567890` → Output: `+1234567890`

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Zod schema validation
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Cross-origin request security

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  createdAt: Date
}
```

### Contacts Collection
```javascript
{
  userId: ObjectId,
  name: String,
  phone: String,
  email: String (optional),
  relation: String,
  createdAt: Date
}
```

### Alerts Collection
```javascript
{
  userId: ObjectId,
  latitude: Number,
  longitude: Number,
  address: String (optional),
  message: String,
  createdAt: Date
}
```

## 🐛 Troubleshooting

### Common Issues

**1. SMS Not Received**
- Verify phone numbers in Twilio Console (free trial)
- Check Twilio account balance
- Ensure phone number format is correct

**2. Database Connection Failed**
- Verify MongoDB URI in environment variables
- Check network connectivity
- Ensure MongoDB cluster is running

**3. Build Errors**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check for TypeScript errors: `npm run type-check`

### Environment Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart development server
npm run dev
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
- **Netlify**: Supports Next.js with serverless functions
- **Railway**: Easy database and app deployment
- **AWS/Google Cloud**: For custom server deployments

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: [your-email@example.com]

## 🔄 Version History

- **v1.0.0**: Initial release with core emergency alert functionality
- **v1.1.0**: Added SMS integration with Twilio
- **v1.2.0**: Enhanced location services and UI improvements

---

**⚠️ Disclaimer**: This application is designed to assist in emergency situations but should not be the sole means of emergency communication. Always contact local emergency services (911, 112, etc.) for immediate assistance.

**🚨 Emergency Numbers**: 
- USA: 911
- Europe: 112
- India: 108
- UK: 999

Made with ❤️ for personal safety and security.


![screencapture-localhost-3000-login-2025-07-06-03_42_42](https://github.com/user-attachments/assets/40a452bc-c66f-4336-bfbd-1fa570805d06)

![screencapture-localhost-3000-2025-07-06-03_42_53](https://github.com/user-attachments/assets/9c3129c8-0daa-4721-93d9-aab98bb3f155)

![screencapture-localhost-3000-dashboard-2025-07-06-03_56_24](https://github.com/user-attachments/assets/65986a87-5d6a-4e73-94fc-2be102424eb3)

