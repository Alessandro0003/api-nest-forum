import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { ReadNotificationUseCase } from '../../../domain/notification/application/use-cases/read-notification'
import {
  Controller,
  Patch,
  HttpCode,
  Param,
  BadGatewayException,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotificationUseCase: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') notificationId: string,
  ) {
    const result = await this.readNotificationUseCase.execute({
      notificationId,
      recipientId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadGatewayException()
    }
  }
}
