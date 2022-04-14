import User from './../User/index.js'
import Connection from './../Connection/index.js'
import Channel from './../Channel/index.js'
import Store from "./../../Store.js"

export default class {
  constructor(hooks) {
    this.channels = {}
    this._setHooks(hooks)
  }
  get channels() {
    return this._channels
  }
  set channels(channels) {
    this._channels = channels
  }
  get activeChannel() {
    let index = Object.keys(this._channels).findIndex(id => this._activeChannel)
    if (index >= 0) return Object.values(this._channels)[index]
    throw `has no channel active channel` 
  }
  set activeChannel(id) {
    this._activeChannel = id
  }
  async connect(url) {
    if (!url) throw new Error('url param is required')
    this.connection = new Connection()
    let connection = await this.connection.connect(url)
    this.user = new User(this.connection)
    return connection
  }
  subscribe(chats) {
    // Get new ids, make unique list and filter out existing channels
    const uniqueIds = Array.from(new Set(chats))    
    return Promise.all(
      uniqueIds.map(async channelId => {
        if (this.channels[channelId]) return
        const isDirect = false
        this.channels[channelId] = new Channel(
          this.connection,
          channelId,
          isDirect
        )
        return this.channels[channelId].init()
      }).filter(i => i)
    )
  }
  unsubscribe(channelId) {
    // Unsubscribe from channel
    if (this.channels[channelId]) {
      delete this.channels[channelId]
    }
  }
  _setHooks(hooks) {
    let fullHooks = hooks || {}
    if (!fullHooks?.transformMsg) fullHooks.transformMsg = (msg) => msg
    Store.hooks = fullHooks
  }
}
