import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Resend API key not configured' },
        { status: 500 }
      );
    }

    // Send welcome email to the user
    const { data: welcomeData, error: welcomeError } = await resend.emails.send({
      from: 'Lili <onboarding@yourdomain.com>', // Replace with your verified domain
      to: [email],
      subject: "Welcome to the Creator's Toolkit Beta",
      html: `
        <h2>Thanks for joining the beta!</h2>
        <p>Hi ${name || 'there'},</p>
        <p>You're now on the list for early access to our creator's toolkit platform.</p>
        <p>We're building tools that actually help creators make things:</p>
        <ul>
          <li>Text upgrade & clarity tools</li>
          <li>Color palette generation</li>
          <li>Headline workshops</li>
          <li>Idea mixers & concept clarity</li>
          <li>And more launching soon</li>
        </ul>
        <p>You'll be the first to know when we open up access.</p>
        <p>— Lili</p>
        <hr />
        <p style="font-size: 12px; color: #666;">
          You signed up via the Visitor Console at ${new Date().toLocaleDateString()}
        </p>
      `,
    });

    if (welcomeError) {
      console.error('Error sending welcome email:', welcomeError);
      return NextResponse.json(
        { error: 'Failed to send welcome email' },
        { status: 500 }
      );
    }

    // Send notification to yourself
    await resend.emails.send({
      from: 'Beta Signups <onboarding@yourdomain.com>',
      to: ['your-email@example.com'], // Replace with your email
      subject: `New Beta Signup: ${name || email}`,
      html: `
        <h3>New beta signup!</h3>
        <p><strong>Name:</strong> ${name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully signed up for beta access',
    });
  } catch (error) {
    console.error('Error in beta signup:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process signup' },
      { status: 500 }
    );
  }
}

