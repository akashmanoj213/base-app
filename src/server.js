const http = require('http');

//load environment variables from .env
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ override: "true"});
}

const app = require('./app');

const port = parseInt(process.env.PORT) || 8080;

const server = http.createServer(app);

console.log("PORT:", process.env.PORT);
console.log("VERIFY_TOKEN:", process.env.VERIFY_TOKEN);
console.log("BEARER_TOKEN:", process.env.BEARER_TOKEN);


server.listen(port, () => console.log(`App listening on port: ${port}...`));