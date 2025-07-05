import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { z } from 'zod';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address').optional(),
  relation: z.string().min(1, 'Relation is required'),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const contacts = await Contact.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Convert MongoDB _id to id for frontend compatibility
    const formattedContacts = contacts.map(contact => ({
      ...contact,
      id: contact._id ? contact._id.toString() : undefined,
    }));

    return NextResponse.json({ contacts: formattedContacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, email, relation } = contactSchema.parse(body);

    // Check if user already has 5 contacts
    const existingContacts = await Contact.countDocuments({
      userId: decoded.userId,
    });

    if (existingContacts >= 5) {
      return NextResponse.json(
        { error: 'Maximum of 5 contacts allowed' },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      name,
      phone,
      email,
      relation,
      userId: decoded.userId,
    });

    return NextResponse.json({
      contact: {
        ...contact.toObject(),
        id: contact._id.toString(),
      },
    });
  } catch (error) {
    console.error('Create contact error:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}