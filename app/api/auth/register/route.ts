import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, signToken } from '@/lib/auth';
import { z } from 'zod';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export async function POST(request: NextRequest) {
  try {
    // In development mode, if MongoDB is not available, return a mock response
    if (process.env.NODE_ENV === 'development') {
      try {
        await connectDB();
      } catch (dbError) {
        console.warn('Database connection failed, using mock response for development');
        
        const body = await request.json();
        const { name, email, password, phone } = registerSchema.parse(body);
        
        // Return a mock successful registration response
        return NextResponse.json({
          user: {
            id: 'mock-user-id',
            name,
            email,
            phone,
          },
          token: 'mock-jwt-token',
        });
      }
    } else {
      await connectDB();
    }
    
    const body = await request.json();
    const { name, email, password, phone } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Generate JWT token
    const token = signToken({ userId: user._id.toString(), email: user.email });

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}