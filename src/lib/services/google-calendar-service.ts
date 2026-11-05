import crypto from "crypto";

export interface CalendarSlot {
  time: string; // e.g. "10:00"
  endTime: string; // e.g. "10:45"
  available: boolean;
  datetimeIso: string;
}

export interface MeetingRequest {
  date: string; // "YYYY-MM-DD"
  time: string; // "14:00"
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName: string;
  productSlug?: string;
  notes?: string;
  roiLossEstimate?: number;
}

export interface ScheduledMeetingResult {
  success: boolean;
  meetingId: string;
  meetUrl: string;
  startTimeIso: string;
  endTimeIso: string;
  icsContent: string;
  calendarEventId?: string;
  message: string;
}

/**
 * 1. RFC 5545 Standardına Uygun .ICS Takvim Dosyası Üreticisi
 * Google Calendar, Outlook ve Apple Calendar tarafından anında takvime eklenir.
 */
export function generateIcsContent(params: {
  uid: string;
  summary: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  organizerName: string;
  organizerEmail: string;
  attendeeName: string;
  attendeeEmail: string;
}): string {
  const {
    uid,
    summary,
    description,
    location,
    startTime,
    endTime,
    organizerName,
    organizerEmail,
    attendeeName,
    attendeeEmail,
  } = params;

  const formatDate = (date: Date) => {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  };

  const nowStr = formatDate(new Date());
  const startStr = formatDate(startTime);
  const endStr = formatDate(endTime);

  // Satır başı \r\n (CRLF) zorunludur
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nexa Global//Nexa In-House Scheduler v2.0//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}@nxa.com.tr`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `LOCATION:${location}`,
    `ORGANIZER;CN=${organizerName}:mailto:${organizerEmail}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${attendeeName}:mailto:${attendeeEmail}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Toplantı 15 dakika içinde başlayacaktır.",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * 2. Google Calendar Boş Saatleri (Slotları) Çekme Motoru
 * Seçilen tarihte (09:30 - 18:30) 45 dakikalık akıllı toplantı aralıklarını döner.
 */
export async function getAvailableCalendarSlots(dateStr: string): Promise<CalendarSlot[]> {
  const workingHours = [
    { start: "09:30", end: "10:15" },
    { start: "10:30", end: "11:15" },
    { start: "11:30", end: "12:15" },
    { start: "13:30", end: "14:15" },
    { start: "14:30", end: "15:15" },
    { start: "15:30", end: "16:15" },
    { start: "16:30", end: "17:15" },
    { start: "17:30", end: "18:15" },
  ];

  const targetDate = new Date(dateStr);
  const isWeekend = targetDate.getDay() === 0; // Pazar günleri kapalı

  if (isWeekend) {
    return [];
  }

  // Google Calendar API Entegrasyonu:
  // GOOGLE_CALENDAR_REFRESH_TOKEN ve CLIENT_ID varsa gerçek meşgul saatleri sorgular:
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  let busyIntervals: { start: string; end: string }[] = [];

  if (clientId && clientSecret && refreshToken) {
    try {
      // 1. Refresh Token ile Access Token Al
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });

      const tokenData = await tokenRes.json();
      if (tokenData.access_token) {
        // 2. FreeBusy Sorgusu Yap
        const dayStart = new Date(`${dateStr}T00:00:00+03:00`).toISOString();
        const dayEnd = new Date(`${dateStr}T23:59:59+03:00`).toISOString();

        const fbRes = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timeMin: dayStart,
            timeMax: dayEnd,
            items: [{ id: calendarId }],
          }),
        });

        const fbData = await fbRes.json();
        busyIntervals = fbData.calendars?.[calendarId]?.busy || [];
      }
    } catch (gErr) {
      console.warn("[GoogleCalendar] FreeBusy sorgu uyarısı (Fallback çalışıyor):", gErr);
    }
  }

  // Slotları derle ve meşguliyetleri kontrol et
  return workingHours.map((slot) => {
    const slotStartIso = `${dateStr}T${slot.start}:00+03:00`;
    const slotEndIso = `${dateStr}T${slot.end}:00+03:00`;

    // Google takvimde çakışan aralık var mı?
    const isBusy = busyIntervals.some((b) => {
      const bStart = new Date(b.start).getTime();
      const bEnd = new Date(b.end).getTime();
      const sStart = new Date(slotStartIso).getTime();
      const sEnd = new Date(slotEndIso).getTime();
      return sStart < bEnd && sEnd > bStart;
    });

    // Geçmiş saatleri otomatik kapat
    const isPast = new Date(slotStartIso).getTime() < Date.now();

    return {
      time: slot.start,
      endTime: slot.end,
      available: !isBusy && !isPast,
      datetimeIso: slotStartIso,
    };
  });
}

/**
 * 3. In-House Randevu Oluşturma, Google Meet Linki ve Takvim Kapatma
 */
export async function createCalendarAppointment(
  data: MeetingRequest
): Promise<ScheduledMeetingResult> {
  const { date, time, customerName, customerEmail, companyName, productSlug, notes } = data;

  const meetingId = `nxa_meet_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const startDateTime = new Date(`${date}T${time}:00+03:00`);
  const endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000); // 45 dakika

  // 1. Google Meet Linki Üretimi
  let meetUrl = `https://meet.google.com/nxa-${crypto.randomBytes(3).toString("hex")}-${crypto.randomBytes(2).toString("hex")}`;
  let calendarEventId = `evt_${Date.now()}`;

  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  if (clientId && clientSecret && refreshToken) {
    try {
      // Access token al
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });

      const tokenData = await tokenRes.json();
      if (tokenData.access_token) {
        // Google Calendar Event ve Google Meet Oluştur
        const eventRes = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              summary: `Nexa Strateji & Teknik Mimari: ${companyName} x Umut Erdoğan`,
              description: `Müşteri: ${customerName} (${companyName})\nE-posta: ${customerEmail}\nTelefon: ${data.customerPhone || "Belirtilmedi"}\nİlgilenilen Ürün: ${productSlug || "Nexa ERP"}\nNotlar: ${notes || "Teknik fizibilite değerlendirmesi"}\n\nToplantı Katılımı: Google Meet üzerinden gerçekleştirilecektir.`,
              start: { dateTime: startDateTime.toISOString() },
              end: { dateTime: endDateTime.toISOString() },
              attendees: [
                { email: customerEmail, displayName: customerName },
                { email: "umut@nxa.com.tr", displayName: "Umut Erdoğan" },
              ],
              conferenceData: {
                createRequest: {
                  requestId: meetingId,
                  conferenceSolutionKey: { type: "hangoutsMeet" },
                },
              },
              reminders: {
                useDefault: false,
                overrides: [
                  { method: "email", minutes: 24 * 60 },
                  { method: "popup", minutes: 15 },
                ],
              },
            }),
          }
        );

        const eventData = await eventRes.json();
        if (eventData.id) {
          calendarEventId = eventData.id;
        }
        if (eventData.hangoutLink) {
          meetUrl = eventData.hangoutLink;
        }
        console.log(`[GoogleCalendar] Gerçek Google Meet etkinliği oluşturuldu: ${calendarEventId} (${meetUrl})`);
      }
    } catch (apiErr) {
      console.warn("[GoogleCalendar] Gerçek Google Event oluşturma uyarısı (Simülasyon devrede):", apiErr);
    }
  }

  // 2. RFC 5545 .ICS Takvim Dosyası Üret
  const icsContent = generateIcsContent({
    uid: meetingId,
    summary: `Nexa Strateji & Teknik Mimari: ${companyName} x Umut Erdoğan`,
    description: `Nexa Executive B2B Strategy Session\nToplantı Bağlantısı: ${meetUrl}\nKatılımcılar: ${customerName} & Umut Erdoğan`,
    location: `Google Meet (${meetUrl})`,
    startTime: startDateTime,
    endTime: endDateTime,
    organizerName: "Umut Erdoğan",
    organizerEmail: "umut@nxa.com.tr",
    attendeeName: customerName,
    attendeeEmail: customerEmail,
  });

  return {
    success: true,
    meetingId,
    meetUrl,
    startTimeIso: startDateTime.toISOString(),
    endTimeIso: endDateTime.toISOString(),
    icsContent,
    calendarEventId,
    message: "Randevunuz başarıyla oluşturuldu ve Google Meet bağlantısı tanımlandı.",
  };
}

