import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswersCommentsRepository
  implements AnswersCommentsRepository
{
  public items: AnswerComment[] = []

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(
    answerCommentId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answersComment = this.items
      .filter((item) => item.answerId.toString() === answerCommentId)
      .slice((page - 1) * 20, page * 20)

    return answersComment
  }

  async create(AnswerComment: AnswerComment) {
    this.items.push(AnswerComment)
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
