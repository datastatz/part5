const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset the database before each test
    await request.post('http://localhost:3003/api/testing/reset')

    // Create a test user
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password123'
      }
    })

    // Open the app
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').fill('testuser')
      await page.getByRole('textbox', { name: 'Password' }).fill('password123')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').fill('testuser')
      await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Log in
      await page.getByRole('textbox').fill('testuser')
      await page.getByRole('textbox', { name: 'Password' }).fill('password123')
      await page.getByRole('button', { name: 'Login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('Title').fill('Playwright Testing')
      await page.getByPlaceholder('Author').fill('Test Author')
      await page.getByPlaceholder('Url').fill('https://playwright.dev')
      await page.getByRole('button', { name: 'save' }).click()

      await expect(page.getByText('Playwright Testing - Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('Title').fill('Like Test Blog')
      await page.getByPlaceholder('Author').fill('Tester')
      await page.getByPlaceholder('Url').fill('https://test.com')
      await page.getByRole('button', { name: 'save' }).click()

      // Click "view" to show likes
      await page.getByText('Like Test Blog - Tester').getByRole('button', { name: 'view' }).click()
      await page.getByText('Likes: 0').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('Likes: 1')).toBeVisible()
    })

    test('user can delete a blog they created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('Title').fill('Delete Me')
      await page.getByPlaceholder('Author').fill('Test User')
      await page.getByPlaceholder('Url').fill('https://delete.com')
      await page.getByRole('button', { name: 'save' }).click()

      // Click "view" to show delete button
      await page.getByText('Delete Me - Test User').getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Delete Me - Test User')).not.toBeVisible()
    })

    test('only the creator sees the delete button', async ({ page, request, browser }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('Title').fill('Hidden Delete')
      await page.getByPlaceholder('Author').fill('Tester')
      await page.getByPlaceholder('Url').fill('https://hidden.com')
      await page.getByRole('button', { name: 'save' }).click()

      // Log out
      await page.getByRole('button', { name: 'Logout' }).click()

      // Create a second user
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Another User',
          username: 'anotheruser',
          password: 'testpass'
        }
      })

      // Log in as the second user
      const context = await browser.newContext()
      const newPage = await context.newPage()
      await newPage.goto('http://localhost:5173')
      await newPage.getByRole('textbox').fill('anotheruser')
      await newPage.getByRole('textbox', { name: 'Password' }).fill('testpass')
      await newPage.getByRole('button', { name: 'Login' }).click()

      // Check that delete button is NOT visible
      await newPage.getByText('Hidden Delete - Tester').getByRole('button', { name: 'view' }).click()
      await expect(newPage.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are sorted by likes', async ({ page }) => {
      // Create two blogs
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('Title').fill('Least Liked')
      await page.getByPlaceholder('Author').fill('Author 1')
      await page.getByPlaceholder('Url').fill('https://1.com')
      await page.getByRole('button', { name: 'save' }).click()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('Title').fill('Most Liked')
      await page.getByPlaceholder('Author').fill('Author 2')
      await page.getByPlaceholder('Url').fill('https://2.com')
      await page.getByRole('button', { name: 'save' }).click()

      // Like the second blog twice
      await page.getByText('Most Liked - Author 2').getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      // Check that "Most Liked" appears before "Least Liked"
      const blogs = await page.locator('.blog').allTextContents()
      expect(blogs[0]).toContain('Most Liked')
      expect(blogs[1]).toContain('Least Liked')
    })
  })
})
