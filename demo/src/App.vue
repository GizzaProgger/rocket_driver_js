<template>
  <div id="app">
    
  </div>
</template>

<style>

</style>

<script>
import Rocket from "./../../index"
export default {
  async mounted() {
    let channelId = "G2ZfiPo6zk8exPG9Z";
    const driver = Rocket.driver;
    const functions = {
      async getUsers() {
        return [
          
        ]
      }
    }
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
