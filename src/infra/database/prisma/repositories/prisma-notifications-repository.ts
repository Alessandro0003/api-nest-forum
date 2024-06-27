import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { PrismaNotificationsMapper } from '../mappers/prisma-notifications-mapper'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

@Injectable()
export class PrismaNotificationsRepository implements NotificationRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    })

    if (!notification) {
      return null
    }

    return PrismaNotificationsMapper.toDomain(notification)
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationsMapper.toPrisma(notification)

    await this.prisma.notification.create({
      data,
    })
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationsMapper.toPrisma(notification)

    await this.prisma.notification.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
