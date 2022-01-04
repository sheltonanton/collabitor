import "./index.css";

if(process.env['NODE_ENV'] == 'test') {
    module.exports = require('./development.js');
}else{
    require('./main.js');
}