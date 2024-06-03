import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '../repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionRepository } from '../repositories/in-memory-questions-repository'
import { InMemoryAttachmentsRepository } from '../repositories/in-memory-attachments-repository'
import { InMemoryStudentRepository } from '../repositories/in-memory-student-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentRepository = new InMemoryStudentRepository()

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentRepository,
    )
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2024, 1, 12) }),
    )

    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2024, 1, 10) }),
    )

    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2024, 1, 14) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.question).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 1, 14) }),
      expect.objectContaining({ createdAt: new Date(2024, 1, 12) }),
      expect.objectContaining({ createdAt: new Date(2024, 1, 10) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionRepository.create(makeQuestion())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.question).toHaveLength(2)
  })
})
