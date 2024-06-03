import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachments'
import { InMemoryQuestionRepository } from '../repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from '../repositories/in-memory-question-attachments-repository'
import { InMemoryAttachmentsRepository } from '../repositories/in-memory-attachments-repository'
import { InMemoryStudentRepository } from '../repositories/in-memory-student-repository'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
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
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),

      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
    })

    expect(inMemoryQuestionRepository.items).toHaveLength(0)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
