import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'

interface FetchRecentTopicsUseCaseRequest {
  page: number
}

type FetchRecentTopicsUseCaseResponse = Either<null, { question: Question[] }>

export class FetchRecentTopicsUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentTopicsUseCaseRequest): Promise<FetchRecentTopicsUseCaseResponse> {
    const question = await this.questionRepository.findManyRecent({ page })

    return right({ question })
  }
}
