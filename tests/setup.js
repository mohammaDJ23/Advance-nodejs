// jest can't run the server codes
// this is for what code should be run before run our test by jest
// to recegnize our server code
// you should add some code to package.json
// see jest command

jest.setTimeout(30000);

require("../models/User");

const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
