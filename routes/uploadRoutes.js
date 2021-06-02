const AWS = require("aws-sdk");
const keys = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");
const uuid = require("uuid/v1");

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey
});

module.exports = app => {
  app.get("/api/upload", requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "my-blog-bucket-123", // this is a fake name, i don't have the bucket on amazon, this is just for wiring code.
        ContentType: "image/jpeg",
        key
      },
      (err, url) => res.send({ key, url })
    );
  });
};
