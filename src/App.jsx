import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'  // Import Notification component
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([]) 
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null) 
  const [message, setMessage] = useState(null)  // State for notifications

  // New state for creating a blog
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token) // Set token for authentication
      blogService.getAll().then(blogs => setBlogs(blogs)) // Fetch blogs
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setBlogs([]) // Clear blogs after logout
    setMessage('Logged out successfully') // Show message
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
      blogService.setToken(user.token) // Set token
      blogService.getAll().then(blogs => setBlogs(blogs)) // Fetch blogs

      setMessage(`Welcome ${user.name}!`) // Success message
      setTimeout(() => setMessage(null), 5000)
    } catch (exception) {
      setMessage('Wrong credentials') // ❌ Error message
      setTimeout(() => setMessage(null), 5000)
    }
  }

  // Function to handle creating a new blog
  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: newTitle,
        author: newAuthor,
        url: newUrl
      }
      
      const createdBlog = await blogService.create(newBlog) // Send to backend
      setBlogs(blogs.concat(createdBlog)) // Update state to include new blog

      // Success message
      setMessage(`A new blog "${newTitle}" by ${newAuthor} added!`)
      setTimeout(() => setMessage(null), 5000)

      // Clear form fields after successful creation
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    } catch (error) {
      setMessage('Error adding blog') // Error message
      setTimeout(() => setMessage(null), 5000)
    }
  }

  // If no user is logged in, show only the login form
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} /> {/* Show notifications */}
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

  // Show blogs & form to create new blog
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} /> {/*  Show notifications */}
      <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>

      {/* Form to create a new blog */}
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          title: <input type="text" value={newTitle} onChange={({ target }) => setNewTitle(target.value)} />
        </div>
        <div>
          author: <input type="text" value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} />
        </div>
        <div>
          url: <input type="text" value={newUrl} onChange={({ target }) => setNewUrl(target.value)} />
        </div>
        <button type="submit">create</button>
      </form>

      {/* Display list of blogs */}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
