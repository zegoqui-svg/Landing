// Notification service for lead capture
// Supports Slack, Discord, and Email (Resend/SendGrid)

interface Lead {
  id: string;
  timestamp: Date;
  source: string;
  data: {
    name: string;
    email?: string;
    phone: string;
    service: string;
    preferredDate?: string;
    preferredTime?: string;
    notes?: string;
    createdAt: string;
    userAgent?: string;
  };
  status: string;
}

// Configuration - set these environment variables
const config = {
  // Slack Webhook (optional)
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || '',
  
  // Discord Webhook (optional)
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
  
  // Resend API (optional)
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'leads@siluel.com',
  resendToEmail: process.env.RESEND_TO_EMAIL || 'gomezelsa806@gmail.com',
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatServiceName(serviceId: string): string {
  const serviceNames: Record<string, string> = {
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
  return serviceNames[serviceId] || serviceId;
}

export async function leadNotification(lead: Lead): Promise<void> {
  const { name, phone, service, email, preferredDate, preferredTime, notes } = lead.data;
  
  const notificationPromises: Promise<void>[] = [];

  // Discord notification
  if (config.discordWebhookUrl) {
    notificationPromises.push(sendDiscordNotification(lead));
  }

  // Slack notification  
  if (config.slackWebhookUrl) {
    notificationPromises.push(sendSlackNotification(lead));
  }

  // Email notification
  if (config.resendApiKey) {
    notificationPromises.push(sendEmailNotification(lead));
  }

  // Wait for all (fire and forget)
  await Promise.allSettled(notificationPromises);
}

async function sendDiscordNotification(lead: Lead): Promise<void> {
  const { name, phone, service, email, preferredDate, preferredTime, notes } = lead.data;
  
  const embed = {
    title: '🎟️ Nuevo Lead Capturado',
    color: 0xC17767, // brand terracotta
    fields: [
      { name: '👤 Nombre', value: name, inline: true },
      { name: '📞 Teléfono', value: phone, inline: true },
      { name: '📧 Email', value: email || 'No proporcionado', inline: true },
      { name: '💆 Servicio', value: formatServiceName(service), inline: true },
      ...(preferredDate ? [{ name: '📅 Fecha Preferida', value: preferredDate, inline: true }] : []),
      ...(preferredTime ? [{ name: '⏰ Hora Preferida', value: preferredTime, inline: true }] : []),
      ...(notes ? [{ name: '📝 Notas', value: notes, inline: false }] : []),
    ],
    footer: { text: `SILUEL • Lead ID: ${lead.id}` },
    timestamp: lead.timestamp.toISOString(),
  };

  await fetch(config.discordWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] }),
  });
}

async function sendSlackNotification(lead: Lead): Promise<void> {
  const { name, phone, service, email, preferredDate, preferredTime, notes } = lead.data;
  
  // Slack block kit requires specific structure
  const payload = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🎟️ Nuevo Lead Capturado', emoji: true } as const,
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn' as const, text: `*Nombre:*\n${name}` },
          { type: 'mrkdwn' as const, text: `*Teléfono:*\n${phone}` },
          { type: 'mrkdwn' as const, text: `*Servicio:*\n${formatServiceName(service)}` },
          { type: 'mrkdwn' as const, text: `*Email:*\n${email || 'No proporcionado'}` },
        ],
      },
      ...(preferredDate || preferredTime ? [{
        type: 'section' as const,
        fields: [
          ...(preferredDate ? [{ type: 'mrkdwn' as const, text: `*Fecha:*\n${preferredDate}` }] : []),
          ...(preferredTime ? [{ type: 'mrkdwn' as const, text: `*Hora:*\n${preferredTime}` }] : []),
        ],
      }] : []),
      ...(notes ? [{
        type: 'section' as const,
        text: { type: 'mrkdwn' as const, text: `*Notas:*\n${notes}`, emoji: true as const },
      }] : []),
      {
        type: 'context' as const,
        elements: [
          { type: 'mrkdwn' as const, text: `SILUEL • ${lead.id} • ${formatDate(lead.timestamp)}` },
        ],
      },
    ],
  };

  await fetch(config.slackWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

async function sendEmailNotification(lead: Lead): Promise<void> {
  const { name, phone, service, email, preferredDate, preferredTime, notes } = lead.data;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #C17767; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">🎟️ Nuevo Lead - SILUEL</h1>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Nombre:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Teléfono:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${email || 'No proporcionado'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Servicio:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${formatServiceName(service)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Fecha Preferida:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${preferredDate || 'No especificada'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Hora Preferida:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${preferredTime || 'No especificada'}</td>
          </tr>
          ${notes ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Notas:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${notes}</td>
          </tr>
          ` : ''}
        </table>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Lead ID: ${lead.id}<br>
          Fecha: ${formatDate(lead.timestamp)}
        </p>
      </div>
    </div>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.resendFromEmail,
      to: config.resendToEmail,
      subject: `🎟️ Nuevo Lead: ${name} - ${formatServiceName(service)}`,
      html,
    }),
  });
}
