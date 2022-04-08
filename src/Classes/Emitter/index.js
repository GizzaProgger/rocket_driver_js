export default class {
  constructor() {
    this.events = {}
    this.queue = []
  }
  on(eventName, fn) {
    if (!this.events[eventName]) this.events[eventName] = []
    const eventId = +new Date()
    // Пушим евент в список евентов
    this.events[eventName].push({ fn, id: eventId })
    // Пушим в очередь, чтобы потом определить евент был вызван или нет
    this.queue.push(eventId)
    let self = this
    return {
      // Если евент ниразу небыл вызван за timeout, то вызывается callback
      error(timeout, callback) { self.error(eventId, timeout, callback) }
    }
  }
  emit(eventName, data) {
    const event = this.events[eventName]
    if (!event) { return }
    event.forEach(o => {
      // Вызываем функцию
      o.fn.call(null, data)
      // Удаляем евент из очереди
      this.queue = this.queue.filter(id => id != o.id)
    })
  }
  error(eventId, timeout, callback) {
    setTimeout(() => {
      let eventInQueue = this.queue.find(id => id === eventId);
      if (eventInQueue) return;
      callback(eventId)
    }, timeout)
  }
}
