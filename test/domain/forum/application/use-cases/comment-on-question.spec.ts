import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '../repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionRepository } from '../repositories/in-memory-questions-repository'
import { InMemoryQuestionCommentsRepository } from '../repositories/in-memory-question-comments-repository'
import { InMemoryAttachmentsRepository } from '../repositories/in-memory-attachments-repository'
import { InMemoryStudentRepository } from '../repositories/in-memory-student-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment On Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()

    inMemoryStudentRepository = new InMemoryStudentRepository()

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentRepository,
    )

    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentRepository,
    )

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Comment text',
    })

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'Comment text',
    )
  })
})
