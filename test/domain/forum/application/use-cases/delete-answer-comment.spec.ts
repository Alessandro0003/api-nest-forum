import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeleteCommentAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { InMemoryAnswerCommentsRepository } from '../repositories/in-memory-answers-comments-repository'
import { InMemoryStudentRepository } from '../repositories/in-memory-student-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: DeleteCommentAnswerUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentRepository,
    )

    sut = new DeleteCommentAnswerUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete answer comment ', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryAnswerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
