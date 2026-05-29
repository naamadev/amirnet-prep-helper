import { google } from 'googleapis';
import { envConfig } from '../utils/envConfig';

function getOAuth2Client(accessToken: string, refreshToken: string) {
  const client = new google.auth.OAuth2(
    envConfig.google.clientId,
    envConfig.google.clientSecret,
    envConfig.google.callbackUrl
  );
  client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
  return client;
}

const DAY_NAMES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

function buildRrule(daysOfWeek: string): string {
  if (daysOfWeek === 'daily') return 'RRULE:FREQ=DAILY';
  const days = daysOfWeek.split(',').map((d) => DAY_NAMES[parseInt(d)]).join(',');
  return `RRULE:FREQ=WEEKLY;BYDAY=${days}`;
}

export async function createReminderEvent(
  accessToken: string,
  refreshToken: string,
  hour: number,
  minute: number,
  durationMins: number,
  daysOfWeek: string
): Promise<string> {
  const auth = getOAuth2Client(accessToken, refreshToken);
  const calendar = google.calendar({ version: 'v3', auth });

  const start = new Date();
  start.setHours(hour, minute, 0, 0);
  if (start <= new Date()) start.setDate(start.getDate() + 1);

  const end = new Date(start.getTime() + durationMins * 60 * 1000);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const event = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: '📖 Study Amirnet Vocabulary',
      description: `Vocabulary study session – ${durationMins} minutes`,
      start: { dateTime: start.toISOString(), timeZone: tz },
      end: { dateTime: end.toISOString(), timeZone: tz },
      recurrence: [buildRrule(daysOfWeek)],
      reminders: {
        useDefault: false,
        overrides: [{ method: 'popup', minutes: 5 }],
      },
    },
  });

  return event.data.id ?? '';
}

export async function deleteCalendarEvent(
  accessToken: string,
  refreshToken: string,
  eventId: string
): Promise<void> {
  const auth = getOAuth2Client(accessToken, refreshToken);
  const calendar = google.calendar({ version: 'v3', auth });
  await calendar.events.delete({ calendarId: 'primary', eventId }).catch(() => {});
}
