const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = user => {
  const sessionObject = {
    passport: {
      user: user._id.toString()
    }
  };

  // convert session to info of object

  // const Buffer = require("safe-buffer").Buffer;
  // const session = "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjBhNjJlMTY3OTg0M2YxNTFjMGZkN2JkIn19";
  // const object = Buffer.from(session, "base64").toString("utf8");
  // console.log(object)

  const session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");
  const sig = keygrip.sign(`session=${session}`);

  return { session, sig };
};
