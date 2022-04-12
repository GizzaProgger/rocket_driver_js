<template>
  <div id="app">
    
  </div>
</template>

<style>

</style>

<script>
import Rocket from "../../src/index"
export default {
  async mounted() {
    let channelId = "7XmkPFEABg6TS49En";
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
    const driver = new Rocket(hooks);
    await driver.connect("wss://roket.xacademy.uz");
    await driver.user.login({
      token: "97s8-De37X3aVreFGoJnqv6n5VzWbEPBelzoslu5yAQ",
    });
    await driver.subscribe([channelId])
    // driver.channels[channelId].loadHistory(300).then(() => {
    //   console.log('loaded')
    // }).catch(console.log)
  }
}
</script>
