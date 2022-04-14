import axios from 'axios'

export default instanse => {
  return {
    fileUpload(file, rid) {
      let formData = new FormData()
      formData.append('file', file)
      // send formData via axios
      return axios.post(`/rooms.upload/${rid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...instanse.defaults.headers
        }
      })
    },
    async sendMessage({ msg, rid, files }) {
      const attachments = []
      if (files) {
        const res = await Promise.all(files.map(f => this.fileUpload(f, rid)))
        if (res[0] && res[0].status == 200) {
          attachments.push(res[0].data.message.attachments)
        }
      }
      let q = {
        channel: rid,
        attachments: attachments
      }
      if (msg) q.text = msg
      if (msg) {
        return instanse.post('/chat.postMessage', q)
      }
    },
    async createChannel(name, members = [], readOnly = false) {
      const q = {
        name,
        members,
        readOnly
      }
      try {
        let promise = await instanse.post('/channels.create', q)
        return promise
      } catch (error) {
        return error
      }
    },
    roomInfo({ rid = "", name = "" }) {
      let q = `roomId=${rid}&roomName=${name}`
      return instanse.get(`/channels.info?${q}`)
    }
  }
}
