import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

// ✅ Function to set the authentication token
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

// ✅ Function to fetch all blogs
const getAll = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(baseUrl, config)
  return response.data
}

// ✅ Function to create a new blog (with authentication)
const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

export default { getAll, create, setToken }
