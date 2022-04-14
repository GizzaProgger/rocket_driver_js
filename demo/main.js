// import Driver from "/index.js"
const Driver = window.Driver
let channelId = "test112";
let getUserInfo = (chatId) => {
  return {
    name: "Sample user",
    avatar: "https://www.vokrug.tv/pic/person/2/b/f/4/2bf448098b7badf3b37e87c510da29bc.jpeg"
  }
}
const hooks = {
  async transformMsg(msg) {
    let transformedMsg = msg
    let user = getUserInfo(msg.u._id)
    transformedMsg.u.name = user.name
    transformedMsg.u.avatar = user.avatar
    return transformedMsg
  }
}
const driver = new Driver(hooks);
await driver.connect("wss://chat.edu.chicaga.ru");
await driver.user.login({
  login: "newuser-53",
  password: "$2y$10$qeasfnOPzQF1Slpo0oqQUOJUuNRVGxE9DFPPKHBcd1YUEWwPeMqSu"
});
let channel = await driver.user.createChannel(channelId)
await driver.subscribe([channelId])
driver.activeChannel = channelId
await driver.activeChannel.sendMessage("test")
await driver.channels[channelId].loadHistory(300)
console.log(driver.activeChannel.msgs)