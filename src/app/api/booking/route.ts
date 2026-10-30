import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionAdmin, logAudit } from '@/lib/auth';

export async function GET() {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const enquiries = await prisma.bookingEnquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(enquiries);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.fullName || !body.phone || !body.eventType || !body.eventDate || !body.city) {
      return NextResponse.json(
        { error: 'Name, Phone, Event Type, Event Date, and City are required.' },
        { status: 400 }
      );
    }

    // Generate unique reference number
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `MKN-${year}-${randomSuffix}`;

    const enquiry = await prisma.bookingEnquiry.create({
      data: {
        referenceId,
        fullName: body.fullName,
        phone: body.phone,
        whatsapp: body.whatsapp || body.phone,
        email: body.email || null,
        eventType: body.eventType,
        eventDate: body.eventDate,
        city: body.city,
        venue: body.venue || 'To be decided',
        audienceSize: body.audienceSize || null,
        budget: body.budget || null,
        specialRequirements: body.specialRequirements || null,
        status: 'NEW',
      },
    });

    // Fetch site settings to get official WhatsApp number
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });
    const targetWhatsapp = settings?.whatsappNumber || '9990739614';

    // Format WhatsApp enquiry message
    const waText = `🚩 *जय श्री राम! जय माता दी!* 🚩
*गायक मुन्ना कुमार निराला जी - कार्यक्रम बुकिंग अनुरोध*

📌 *संदर्भ संख्या (Ref ID):* ${referenceId}
👤 *आयोजक का नाम:* ${body.fullName}
📱 *संपर्क नंबर:* ${body.phone}
💬 *व्हाट्सएप:* ${body.whatsapp || body.phone}
🎶 *कार्यक्रम का प्रकार:* ${body.eventType}
📅 *कार्यक्रम तिथि:* ${body.eventDate}
📍 *स्थान व शहर:* ${body.venue || ''}, ${body.city}
👥 *अनुमानित उपस्थिति:* ${body.audienceSize || '200-500'}
💰 *अनुमानित बजट:* ${body.budget || 'चर्चा अनुसार'}
📝 *विशेष विवरण:* ${body.specialRequirements || 'कृपया संपर्क करें'}

कृपया कार्यक्रम की पुष्टि एवं आगे की प्रक्रिया हेतु संपर्क करें। सादर धन्यवाद!`;

    const encodedText = encodeURIComponent(waText);
    const whatsappUrl = `https://wa.me/91${targetWhatsapp}?text=${encodedText}`;

    return NextResponse.json({
      success: true,
      referenceId,
      enquiryId: enquiry.id,
      whatsappUrl,
    });
  } catch (err: any) {
    console.error('Booking submission error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

