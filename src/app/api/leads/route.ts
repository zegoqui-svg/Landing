import { NextRequest, NextResponse } from 'next/server';
import { leadSchema } from '@/src/lib/validation';
import { leadNotification } from '@/src/lib/notifications';
import { saveLead } from '@/src/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate with Zod
    const result = leadSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          errors: result.error.flatten().fieldErrors,
          message: 'Datos de lead inválidos'
        },
        { status: 400 }
      );
    }

    const leadData = result.data;
    const timestamp = new Date();
    const leadId = `lead_${timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`;

    const lead = {
      id: leadId,
      timestamp,
      source: 'landing_page',
      data: {
        ...leadData,
        createdAt: timestamp.toISOString(),
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
      status: 'pending' as const,
    };

    // Save to database (Firestore, Supabase, or memory fallback)
    let dbResult;
    try {
      dbResult = await saveLead(lead);
      console.log('[LEAD] Saved to:', dbResult.db);
    } catch (dbError) {
      console.error('[DB_ERROR]', dbError);
      // Continue - we still notify and return success
    }

    // Send notifications (Slack/Discord/Email)
    try {
      await leadNotification(lead);
    } catch (notifyError) {
      console.error('[NOTIFICATION_ERROR]', notifyError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Lead capturado exitosamente',
      db: dbResult?.db || 'unknown',
    });

  } catch (error) {
    console.error('[LEAD_API_ERROR]', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Protected admin endpoint - should add auth
  return NextResponse.json({
    message: 'Use POST to create leads',
    docs: '/api/leads accepts POST requests with { name, phone, email?, service, preferredDate?, preferredTime? }',
  });
}
