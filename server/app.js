const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/shema");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = 3005;

const app = express();

mongoose.connect(
  "mongodb+srv://yskaskevich:qwe123@graphql-873qf.azure.mongodb.net/qraphQL?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);


const dbConnection = mongoose.connection;

dbConnection.on("error", err => console.log(`Connection error: ${err}`));
dbConnection.once("open", () => console.log(`Connected to DB`));

app.listen(PORT, err => {
  err ? console.log(err) : console.log("ServerStart");
});
