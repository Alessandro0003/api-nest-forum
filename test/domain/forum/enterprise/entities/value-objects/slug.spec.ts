import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

test('it should be able to create slug from text', () => {
  const slug = Slug.createFromText('Example question title')

  expect(slug.value).toEqual('example-question-title')
})
