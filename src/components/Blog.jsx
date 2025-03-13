import { useState } from 'react'  // Import useState
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlogLikes }) => {
  const [visible, setVisible] = useState(false)  // Now useState is available

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    try {
      await blogService.updateLikes(blog.id, updatedBlog)
      updateBlogLikes(blog.id, updatedBlog) // Call function from App.jsx
    } catch (error) {
      console.error("Error updating likes:", error)
    }
  }

  return (
    <div>
      <div>
        {blog.title} {blog.author} 
        <button onClick={toggleVisibility}>
          {visible ? 'Hide' : 'View'}
        </button>
      </div>

      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            Likes: {blog.likes} 
            <button onClick={handleLike}>Like</button>
          </p>
          <p>Added by {blog.user?.name || 'Unknown'}</p>
        </div>
      )}
    </div>
  )
}

export default Blog
