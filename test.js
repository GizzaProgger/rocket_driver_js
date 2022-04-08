import Rocket from "./index.js";
let channelId = "oBkatw2j4WyMYtxrh";
(async () => {
  const driver = Rocket.driver;
  await driver.connect("wss://roket.xacademy.uz");
  await driver.user.login({
    token: "97s8-De37X3aVreFGoJnqv6n5VzWbEPBelzoslu5yAQ",
  });
})();
