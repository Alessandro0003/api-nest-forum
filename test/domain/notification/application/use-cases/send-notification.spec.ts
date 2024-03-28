import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { InMemoryNotificationRepository } from '../repositories/in-memory-notifications-repository'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: SendNotificationUseCase
describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be able to send notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'title-example',
      content: 'content-example',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
