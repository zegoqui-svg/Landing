import { NextRequest, NextResponse } from 'next/server';
import { getLeads, Lead } from '@/src/lib/db';

// Report generation endpoint - called by Vercel Cron
export async function GET(request: NextRequest) {
  try {
    // Verify it's a cron job (Vercel sets this header)
    const isCron = request.headers.get('x-vercel-signature') || 
                   request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`;

    // Allow if no auth required in dev, or if properly authenticated
    if (process.env.NODE_ENV === 'production' && !isCron && !process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get leads from the last 7 days
    const allLeads = await getLeads(1000);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentLeads = allLeads.filter(lead => 
      new Date(lead.timestamp) >= sevenDaysAgo
    );

    // Generate statistics
    const stats = generateStats(recentLeads);

    // Generate HTML report
    const htmlReport = generateHTMLReport(stats, recentLeads);

    // Send email via Resend
    const emailSent = await sendReportEmail(htmlReport, stats);

    return NextResponse.json({
      success: emailSent,
      generated: new Date().toISOString(),
      period: {
        from: sevenDaysAgo.toISOString(),
        to: new Date().toISOString(),
      },
      stats,
      leadsCount: recentLeads.length,
      emailSent,
    });

  } catch (error) {
    console.error('[CRON_REPORT_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Report generation failed' },
      { status: 500 }
    );
  }
}

interface ReportStats {
  totalLeads: number;
  byService: Record<string, number>;
  topServices: Array<{ service: string; count: number }>;
  leadsList: Array<{ name: string; phone: string; email?: string; service: string; date: string }>;
}

function generateStats(leads: Lead[]): ReportStats {
  const byService: Record<string, number> = {};
  
  leads.forEach(lead => {
    const serviceName = formatServiceName(lead.data.service);
    byService[serviceName] = (byService[serviceName] || 0) + 1;
  });

  const topServices = Object.entries(byService)
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const leadsList = leads
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .map(lead => ({
      name: lead.data.name,
      phone: lead.data.phone,
      email: lead.data.email,
      service: formatServiceName(lead.data.service),
      date: new Date(lead.timestamp).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

  return {
    totalLeads: leads.length,
    byService,
    topServices,
    leadsList,
  };
}

function formatServiceName(serviceId: string): string {
  const names: Record<string, string> = {
    'reductivos': 'Tratamientos Reductivos',
    'maderoterapia': 'Maderoterapia',
    'levantamiento-gluteos': 'Levantamiento de Glúteos',
    'tecnicas-colombianas': 'Técnicas Colombianas',
    'post-operatorio': 'Post-operatorio',
    'drenaje-linfatico': 'Drenaje Linfático',
    'faciales': 'Faciales',
    'masaje-relajante': 'Masaje Relajante',
    'masaje-descontracturante': 'Masaje Descontracturante',
  };
  return names[serviceId] || serviceId;
}

function generateHTMLReport(stats: ReportStats, leads: Lead[]): string {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const weekEnd = new Date();

  const serviceRows = stats.topServices.map(s => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${s.service}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-weight: bold;">${s.count}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${Math.round((s.count / stats.totalLeads) * 100)}%</td>
    </tr>
  `).join('');

  const leadRows = stats.leadsList.map(l => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${l.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${l.phone}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${l.email || '—'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${l.service}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${l.date}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
  
  <div style="background: linear-gradient(135deg, #C17767 0%, #7D8A74 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">📊 Reporte Semanal SILUEL</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">
      ${weekStart.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })} — ${weekEnd.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
    </p>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px;">
    
    <!-- Summary Cards -->
    <div style="display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 150px; background: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <div style="font-size: 48px; color: #C17767; font-weight: bold;">${stats.totalLeads}</div>
        <div style="color: #666; font-size: 14px;">Leads Totales</div>
      </div>
      <div style="flex: 1; min-width: 150px; background: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <div style="font-size: 48px; color: #7D8A74; font-weight: bold;">${Object.keys(stats.byService).length}</div>
        <div style="color: #666; font-size: 14px;">Servicios Solicitados</div>
      </div>
      <div style="flex: 1; min-width: 150px; background: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <div style="font-size: 48px; color: #3D3D3D; font-weight: bold;">${stats.topServices[0]?.count || 0}</div>
        <div style="color: #666; font-size: 14px;">Servicio #1</div>
      </div>
    </div>
    
    <!-- Top Services -->
    <div style="background: white; padding: 25px; border-radius: 10px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <h2 style="color: #3D3D3D; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #C17767; padding-bottom: 10px;">
        🏆 Servicios Más Solicitados
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 12px; text-align: left;">Servicio</th>
            <th style="padding: 12px; text-align: center;">Cantidad</th>
            <th style="padding: 12px; text-align: left;">% del Total</th>
          </tr>
        </thead>
        <tbody>
          ${serviceRows || '<tr><td colspan="3" style="padding: 20px; text-align: center; color: #999;">Sin datos esta semana</td></tr>'}
        </tbody>
      </table>
    </div>
    
    <!-- Lead List -->
    <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <h2 style="color: #3D3D3D; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #7D8A74; padding-bottom: 10px;">
        📋 Detalle de Leads
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 12px; text-align: left;">Nombre</th>
            <th style="padding: 12px; text-align: left;">Teléfono</th>
            <th style="padding: 12px; text-align: left;">Email</th>
            <th style="padding: 12px; text-align: left;">Servicio</th>
            <th style="padding: 12px; text-align: left;">Fecha</th>
          </tr>
        </thead>
        <tbody>
          ${leadRows || '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #999;">Sin leads esta semana</td></tr>'}
        </tbody>
      </table>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 12px; margin: 0;">
        Generado automáticamente por SILUEL Bot • ${new Date().toLocaleString('es-MX')}
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

async function sendReportEmail(htmlContent: string, stats: ReportStats): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.log('[EMAIL] Resend not configured, skipping email. Report data:', JSON.stringify(stats));
    return false;
  }

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const subject = `[SILUEL] Reporte Semanal - ${stats.totalLeads} leads (${weekStart.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })} — ${new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })})`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'reports@siluel.com',
        to: process.env.RESEND_TO_EMAIL || 'zegoqui@gmail.com',
        subject,
        html: htmlContent,
      }),
    });

    if (response.ok) {
      console.log('[EMAIL] Report sent successfully');
      return true;
    } else {
      console.error('[EMAIL] Failed to send report:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('[EMAIL] Error sending report:', error);
    return false;
  }
}
