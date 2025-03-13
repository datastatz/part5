import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([]) 
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null) 
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setBlogs([])
    setMessage('Logged out successfully')
    setTimeout(() => setMessage(null), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
      blogService.getAll().then(blogs => setBlogs(blogs))

      setMessage(`Welcome ${user.name}!`)
      setTimeout(() => setMessage(null), 5000)
    } catch (exception) {
      setMessage('Wrong credentials')
      setTimeout(() => setMessage(null), 5000)
    }
  }

  // Simplified handleCreateBlog function (receives blog from BlogForm)
  const handleCreateBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))

      setMessage(`A new blog "${blogObject.title}" by ${blogObject.author} added!`)
      setTimeout(() => setMessage(null), 5000)
    } catch (error) {
      setMessage('Error adding blog')
      setTimeout(() => setMessage(null), 5000)
    }
  }

 
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            Username:
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password:
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>

      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
