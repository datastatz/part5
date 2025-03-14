import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders blog title and author but not URL or likes by default', () => {
  const blog = {
    title: 'React Testing with Vitest',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5
  }

  render(<Blog blog={blog} />)

  // Check that title and author are visible
  expect(screen.getByText('React Testing with Vitest John Doe')).toBeDefined()

  // Check that URL and likes are NOT present by default
  const details = screen.queryByText('https://example.com')
  expect(details).toBeNull()

  const likes = screen.queryByText('Likes: 5')
  expect(likes).toBeNull()
})
