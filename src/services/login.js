import axios from 'axios'
const baseUrl = '/api/login'  // Backend login endpoint

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
