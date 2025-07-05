import { NextRequest, NextResponse } from 'next/server';
import { sendSMS } from '@/lib/twilio';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message } = await request.json();
    
    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }
    
    console.log('Testing SMS send to:', phoneNumber);
    const result = await sendSMS(phoneNumber, message);
    
    return NextResponse.json({
      success: true,
      message: 'SMS sent successfully',
      twilioResponse: {
        sid: result.sid,
        status: result.status,
      }
    });
  } catch (error) {
    console.error('Test SMS error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send SMS',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
