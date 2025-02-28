// src/middleware/track-usage.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}
@Injectable()
export class TrackUsageMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = (req.user as any)?.id; // Temporary workaround

    if (userId) {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      const currentYear = new Date().getFullYear();

      // Check if the user has a usage record for this month
      let usage = await this.prisma.usage.findFirst({
        where: {
          userId: userId,
          month: currentMonth,
          year: currentYear,
        },
      });

      if (!usage) {
        usage = await this.prisma.usage.create({
          data: {
            userId,
            month: currentMonth,
            year: currentYear,
            callsMade: 0,
          },
        });
      }

      // Increment the usage count
      if (usage.callsMade < 100) {
        await this.prisma.usage.update({
          where: { id: usage.id },
          data: { callsMade: usage.callsMade + 1 },
        });
      } else {
        // Prevent further calls if the limit is reached (optional)
        return res.status(429).json({
          message: 'API call limit reached for this month',
        });
      }
    }

    next();
  }
}
