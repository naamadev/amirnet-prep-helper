import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createReminderEvent, deleteCalendarEvent } from '../services/calendarService';
import { BadRequestError, NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export const remindersController = {
  getReminder: async (req: Request, res: Response): Promise<void> => {
    const user = req.user as { id: number };
    const reminder = await prisma.reminder.findFirst({
      where: { userId: user.id, isActive: true },
    });
    res.json({ reminder: reminder ?? null });
  },

  setReminder: async (req: Request, res: Response): Promise<void> => {
    const user = req.user as { id: number };
    const { hour, minute, durationMins = 10, daysOfWeek = 'daily' } = req.body;

    if (hour == null || minute == null) {
      throw new BadRequestError('hour and minute are required');
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser?.googleAccessToken || !dbUser?.googleRefreshToken) {
      throw new BadRequestError('Google Calendar access not available. Please log in again.');
    }

    const existing = await prisma.reminder.findFirst({ where: { userId: user.id, isActive: true } });
    if (existing) {
      if (existing.calendarEventId) {
        await deleteCalendarEvent(dbUser.googleAccessToken, dbUser.googleRefreshToken, existing.calendarEventId);
      }
      await prisma.reminder.update({ where: { id: existing.id }, data: { isActive: false } });
    }

    const calendarEventId = await createReminderEvent(
      dbUser.googleAccessToken,
      dbUser.googleRefreshToken,
      hour,
      minute,
      durationMins,
      daysOfWeek
    );

    const reminder = await prisma.reminder.create({
      data: { userId: user.id, calendarEventId, hour, minute, durationMins, daysOfWeek, isActive: true },
    });

    res.json({ reminder });
  },

  deleteReminder: async (req: Request, res: Response): Promise<void> => {
    const user = req.user as { id: number };
    const reminder = await prisma.reminder.findFirst({ where: { userId: user.id, isActive: true } });

    if (!reminder) throw new NotFoundError('No active reminder found');

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (reminder.calendarEventId && dbUser?.googleAccessToken && dbUser?.googleRefreshToken) {
      await deleteCalendarEvent(dbUser.googleAccessToken, dbUser.googleRefreshToken, reminder.calendarEventId);
    }

    await prisma.reminder.update({ where: { id: reminder.id }, data: { isActive: false } });
    res.json({ message: 'Reminder deleted' });
  },
};
