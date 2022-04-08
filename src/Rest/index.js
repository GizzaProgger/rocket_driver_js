import axios from 'axios'

import Channel from './Channel/index.js'
import User from './User/index.js'

export default ({ token, userId, url }) => {
  axios.defaults.baseURL = url
  const instance = axios.create({
    baseUrl: url,
    headers: {
      'X-Auth-Token': token,
      'X-User-Id': userId
    }
  })
  return {
    ...Channel(instance),
    ...User(instance)
  }
}
