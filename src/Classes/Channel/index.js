import Emitter from './../Emitter/index.js'
import Store from "./../../Store.js"

export default class extends Emitter {
  constructor(connection, id, isDirect) {
    super()
    this.id = id
    this.connection = connection
    this.isDirect = isDirect
    this.msgs = []
    this.uid = null
  }
  async init() {
    await this._setUid()
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
    // TODO
    // Сделать обработку евента подписки
    this.connection.on(`subscribe:${this.roomId}`, res => {
      console.log(res)
    })
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
  async addMsg(msg) {
    if (msg.rid !== this.roomId) return
    let transformedMsg = await Store.hooks.transformMsg(msg)
    this.msgs.push(transformedMsg)
    return transformedMsg
  }
  async addMsgs(msgs) {
    for (const msg of msgs) {
      await this.addMsg(msg)
    }
  }
  async loadHistory(offset = 50, lastDate = null) {
    return new Promise((resolve, reject) => {
      this.connection.on(`loadHistory:${this.roomId}`, d => {
        this.addMsgs(d.result.messages)
        resolve(d.result.messages)
      }).error(15000, reject)
      console.log(this.roomId)
      this.connection.send({
        msg: 'method',
        method: 'loadHistory',
        event: `loadHistory:${this.roomId}`,
        params: [this.roomId, null, offset, lastDate]
      })
    })
  }
  async _setUid() {
    let response = await this.connection.rest.roomInfo({ name: this.id })
    let uid = response.data?.channel?._id
    if (uid) return this.uid = uid
    throw "error with set uid room"
  }
  get roomId() {
    return this.isDirect ? this.directRid : this.uid
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
