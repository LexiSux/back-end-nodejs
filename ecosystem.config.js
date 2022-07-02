// const envVar = require('./env.js');
const dotenv=require('dotenv');
dotenv.config();

module.exports = {
    apps : [{
      name   : process.env.NAME || "template-server",
      script : "npm",
      args   : "start",
      watch  : false,
      max_memory_restart: "2500M",
      out:"/dev/null"
    }]
  }
  