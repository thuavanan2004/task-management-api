const express = require("express");
const cors = require('cors')
const env = require("dotenv");
env.config();
const bodyParser = require('body-parser')
const database = require("./config/database");
const app = express();
database.connect();
const routeApiV1 = require("./v1/routes/index");
const port = process.env.PORT;

app.use(cors())
// Cáu hình body Parser
app.use(bodyParser.json());
routeApiV1(app);

app.listen(port, () => {
    console.log(`App đang lắng nghe cổng ${port} `)
})