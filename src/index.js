if(process.env['NODE_ENV'] == 'test') {
    module.exports = require('./development.js');
}else{
    module.exports = require('./main.js');
}