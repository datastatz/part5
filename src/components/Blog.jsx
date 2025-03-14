import { useState } from 'react'  // Import useState
import blogService from '../services/blogs'


const Blog = ({ blog, updateBlogLikes }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div className="blog">
      <div className="blog-preview">
        {blog.title} {blog.author} 
        <button onClick={toggleVisibility}>{visible ? 'Hide' : 'View'}</button>
      </div>

      {visible && (
        <div className="blog-details">
          <p>{blog.url}</p>
          <p>
            Likes: {blog.likes}
            <button>Like</button>
          </p>
          <p>Added by {blog.user?.name || 'Unknown'}</p>
        </div>
      )}
    </div>
  )
}


export default Blog
