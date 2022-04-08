export default class {
  constructor(connection) {
    this.connection = connection
  }
  setToken(token) {
    this.token = token
  }
  async login(authData) {
    return new Promise((res, rej) => {
      if (!authData.token && !authData.login) {
        console.error('auth data is not valid')
        return rej()
      }
      if (authData.token) {
        this.connection.on('login', data => {
          if (data.result.token) {
            this.connection.initREST({
              token: data.result.token,
              userId: data.result.id
            })
            return res()
          }
          if (data.error) console.log('Error with loggin: ', error)
          rej(data)
        })
        this.connection.send({
          msg: 'method',
          event: 'login',
          method: 'login',
          params: [
            {
              resume: authData.token
            }
          ]
        })
      }
    })
  }
}
