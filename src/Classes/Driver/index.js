import User from './../User/index.js'
import Connection from './../Connection/index.js'
import Channel from './../Channel/index.js'
import Store from "./../../Store"

export default class {
  constructor(hooks) {
    this.channels = {}
    this._setHooks(hooks)
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
  get channels() {
    return this._channels
  }
  set channels(channels) {
    this._channels = channels
  }

  _setHooks(hooks) {
    let fullHooks = hooks || {}
    if (!fullHooks?.transformMsg) fullHooks.transformMsg = () => {}
    Store.hooks = fullHooks
  }
}
