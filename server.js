var connect = require('connect');
var serveStatic = require('serve-static');

connect()
// .use(function(req, res){
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:8000/");
//     res.end(connect.static(__dirname));
//     console.log('xxxxx');
//  })
.use(serveStatic(__dirname))
.listen(8000);
