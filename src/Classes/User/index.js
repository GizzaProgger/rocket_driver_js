import sha256 from "js-sha256"

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
      }).error(15000, rej)
      if (authData.token) {
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
      } else if (authData.login) {
        this.connection.send({
          msg: 'method',
          event: 'login',
          method: 'login',
          params: [
            {
              user: { username: authData.login },
              password: {
                digest: sha256.sha256(authData.password),
                algorithm: "sha-256"
              }
            }
          ]
        })
      }
    })
  }
  createChannel(name, members = [], readOnly = false) {
    return this.connection.rest.createChannel(name, members, readOnly)
  }
}
