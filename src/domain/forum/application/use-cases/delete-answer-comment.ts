import { right, left, Either } from '@/core/either'
import { AnswersCommentsRepository } from '../repositories/answers-comments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteCommentAnswerUseCaseRequest {
  authorId: string
  answerCommentId: string
}

type DeleteCommentAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteCommentAnswerUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswersCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteCommentAnswerUseCaseRequest): Promise<DeleteCommentAnswerUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answerCommentsRepository.delete(answerComment)

    return right(null)
  }
}
