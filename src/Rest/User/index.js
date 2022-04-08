export default instanse => {
  return {
    info(userId) {
      return instanse.get(`/users.info?userId=${userId}`)
    }
  }
}
