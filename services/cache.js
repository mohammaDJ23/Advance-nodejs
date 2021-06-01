const mongoose = require("mongoose");
const redis = require("redis");
const { promisify } = require("util");
const keys = require("../config/keys");

const exec = mongoose.Query.prototype.exec;

const client = redis.createClient(keys.redisUrl);

client.hget = promisify(client.hget);

mongoose.Query.prototype.catche = function (options = {}) {
  this._isCatched = true;
  this._hashKey = JSON.stringify(options.key || "");

  // with this return code here we can chin catche method to other methods like find, sort, ...

  return this;
};

// exec mothods run last function, means after all methods likes: find, sort, limit, ...

mongoose.Query.prototype.exec = async function () {
  if (!this._isCatched) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  const cachedValue = await client.hget(this._hashKey, key);

  if (cachedValue) {
    const document = JSON.parse(cachedValue);

    return Array.isArray(document)
      ? document.map(doc => new this.model(doc))
      : new this.model(document);
  }

  const results = await exec.apply(this, arguments);

  client.hset(this._hashKey, key, JSON.stringify(results));

  return results;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
