import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeleteCommentAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { InMemoryAnswersCommentsRepository } from '../repositories/in-memory-answers-comments-repository'

let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository
let sut: DeleteCommentAnswerUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository()

    sut = new DeleteCommentAnswerUseCase(inMemoryAnswersCommentsRepository)
  })

  it('should be able to delete answer comment ', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswersCommentsRepository.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    })

    expect(inMemoryAnswersCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryAnswersCommentsRepository.create(answerComment)

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
