import Emitter from './../Emitter/index.js'
import REST from './../../Rest/index.js'

export default class extends Emitter {
  connect(url) {
    return new Promise((res, reject) => {
      this.url = url
      this.websocket = new WebSocket(`${url}/websocket`)
      this.websocket.onerror = e => {
        reject()
        throw new Error(e)
      }
      this.websocket.onmessage = e => {
        try {
          let data = JSON.parse(e.data)
          // console.log(data)
          // Обрабатываем все сообщения, которые пришли от Рокета
          if (data.error) {
            console.error(data.error)
          }
          if (data?.id) this.genereteEvent(data)
          if (data.msg === 'error') {
            console.error('Error with Rocketchat. Msg:', data.reason)
          }
          if (data.msg === 'connected') {
            this.session = data.session
            res()
          }
          if (data.msg === 'ping') {
            this.websocket.send(
              JSON.stringify({
                msg: 'pong'
              })
            )
          }
        } catch (error) {
          reject(error)
        }
      }
      this.websocket.onopen = () => {
        this.send({
          msg: 'connect',
          version: '1',
          support: ['1']
        })
      }
    }).catch(error => {
      console.error(error)
    })
  }
  send(data) {
    // Check for socket is ready for mitigate errors
    if (this.websocket.readyState) {
      this.websocket.send(
        JSON.stringify({
          ...data,
          id: `${data.event}|${Math.floor(Math.random() * 1000000).toString()}`
        })
      )
    }
  }
  genereteEvent(msg) {
    if (!msg || !msg?.id?.split) return
    let eventName = msg.id.split('|')[0]
    // Если событие генерировали мы, то мы генерируем событие, которое сами указали
    if (eventName && msg.id.split('|').length >= 2) this.emit(eventName, msg)
    // Если есть сообщение, то генерирем событие с таким названием
    else if (msg.msg) this.emit(msg.msg, msg)
    // Если ничего из этого нет, то гененерируем дефолтное событие
    else this.emit('default', msg)
  }
  initREST({ token, userId }) {
    this.rest = REST({
      token,
      userId,
      url: `${this.url.replace('ws', 'http')}/api/v1/`
    })
    console.log('rest is inited')
  }
}
