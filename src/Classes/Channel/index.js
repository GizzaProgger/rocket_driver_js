import Emitter from './../Emitter/index.js'

export default class extends Emitter {
  constructor(connection, id, isDirect) {
    super()
    this.id = id
    this.connection = connection
    this.isDirect = isDirect
    this.msgs = []
  }
  async init() {
    this.connection.on('changed', data => {
      if (data.collection !== 'stream-room-messages') return
      let msgs = data.fields.args
      let currentMsgs = msgs.filter(msg => msg.rid === this.roomId)
      if (!currentMsgs) return
      this.addMsgs(msgs)
      this.emit('message', currentMsgs)
    })
    if (this.isDirect) await this.setDirectRid()
    this.msgs = []
    this.subscribe()
  }
  async setDirectRid() {
    let r = await this.connection.rest.info(this.id)
    let username = r?.data?.user?.username
    if (!username) return
    this.directUsername = username
    return new Promise((resolve, reject) => {
      this.connection.on('createDirectMessage', d => {
        if (!d.result.usernames.includes(this.directUsername)) return
        this.directRid = d.result.rid
        return resolve(this.directRid)
      }).error(15000, reject)
      this.connection.send({
        msg: 'method',
        method: 'createDirectMessage',
        event: 'createDirectMessage',
        params: [username]
      })
    })
  }
  subscribe() {
    this.connection.send({
      msg: 'sub',
      name: 'stream-room-messages',
      event: `subscribe:${this.roomId}`,
      params: [this.roomId, false]
    })
  }
  sendMessage(message, files = []) {
    let rid = this.isDirect ? this.directRid : this.id
    return this.connection.rest.sendMessage({
      files,
      msg: message,
      rid
    })
  }
  addMsg(msg) {
    if (msg.rid !== this.roomId) return
    this.msgs.push(msg)
  }
  addMsgs(msgs) {
    msgs.forEach(msg => this.addMsg(msg))
  }
  async loadHistory(offset = 50, lastDate = null) {
    return new Promise((resolve, reject) => {
      let id = this.isDirect ? this.directRid : this.id
      console.log('load')
      this.connection.on(`loadHistory:${this.roomId}`, d => {
        this.addMsgs(d.result.messages)
        resolve(d.result.messages)
      }).error(15000, reject)
      this.connection.send({
        msg: 'method',
        method: 'loadHistory',
        event: `loadHistory:${this.roomId}`,
        params: [id, null, offset, lastDate]
      })
    })
  }
  get roomId() {
    return this.isDirect ? this.directRid : this.id
  }
  get msgs() {
    return this._msgs.sort(
      (a, b) => +new Date(a.ts.$date) - +new Date(b.ts.$date)
    )
  }
  set msgs(msgs) {
    this._msgs = msgs
  }
}
