import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Contact from "@/models/Contact";
import Alert from "@/models/Alert";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { sendSMS, sendWhatsApp } from "@/lib/twilio";
import { z } from "zod";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

const alertSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { latitude, longitude, address, message } = alertSchema.parse(body);

    // Get user details
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's contacts
    const contacts = await Contact.find({ userId: decoded.userId });

    if (contacts.length === 0) {
      return NextResponse.json(
        { error: "No emergency contacts found. Please add contacts first." },
        { status: 400 }
      );
    }

    // Create alert record
    const alert = await Alert.create({
      userId: user._id.toString(),
      latitude,
      longitude,
      address,
      message: message || "Emergency alert",
    });

    // Prepare alert message
    const alertMessage = `🚨 EMERGENCY ALERT 🚨
${user.name} is in danger.
📍 Location: https://maps.google.com/?q=${latitude},${longitude}
${address ? `📍 Address: ${address}` : ""}
📅 Time: ${new Date().toLocaleString()}
📞 Please reach out immediately.`;

    console.log(`Sending alerts to ${contacts.length} contacts for user: ${user.name}`);

    // Send alerts to all contacts
    const alertResults = [];
    for (const contact of contacts) {
      try {
        console.log(`Sending alert to ${contact.name} (${contact.phone})`);
        const result = await sendSMS(contact.phone, alertMessage);
        alertResults.push({
          contact: contact.name,
          phone: contact.phone,
          status: 'sent',
          messageId: result.sid,
        });
      } catch (error) {
        console.error(`Failed to send alert to ${contact.name} (${contact.phone}):`, error);
        alertResults.push({
          contact: contact.name,
          phone: contact.phone,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = alertResults.filter(r => r.status === 'sent').length;
    const failedCount = alertResults.filter(r => r.status === 'failed').length;

    console.log(`Alert sending completed: ${successCount} successful, ${failedCount} failed`);

    return NextResponse.json({
      alert: {
        ...alert.toObject(),
        id: alert._id.toString(),
      },
      message: `Emergency alert sent to ${successCount} out of ${contacts.length} contacts`,
      contactsNotified: successCount,
      totalContacts: contacts.length,
      results: alertResults,
    });
  } catch (error) {
    console.error("Send alert error:", error);
    return NextResponse.json(
      { error: "Failed to send alert" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const alerts = await Alert.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Convert MongoDB _id to id for frontend compatibility
    const formattedAlerts = alerts.map((alert: any) => ({
      ...alert,
      id: alert._id.toString(),
    }));

    return NextResponse.json({ alerts: formattedAlerts });
  } catch (error) {
    console.error("Get alerts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}
