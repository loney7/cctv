let count = 0;
var path = require('path'); 
var fs    = require("fs");
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static(__dirname + '/public'));



    

  app.post('/see-videos', function(req, res) {
    //console.log(req.body);
    var date = req.body.video_date;
    var pswd = req.body.pwd;
    var cam = req.body.cam;
   
    if (pswd != "flav1" && pswd != "flav2" && pswd != "flav3" && pswd!= "flav4"&& pswd != "flav5") {
      res.sendFile(path.join(__dirname+'/500.html'));
      return;
    }
    
    
    
   
      
       res.redirect('/video/' + date +"/" + pswd + "/" + cam);
      return;
    

 


    })
    

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
})

   app.get('/video/:date/:pswd/:cam', function(req, res ) {

  //console.log(req.params);
  var path = 'rec_2019-06-20_14-22.stamped.mkv';
 
  
 
  

   
    const stat =  fs.statSync(path)
    const fileSize =  stat.size
    const range =  req.headers.range
  
    if (range) {
      var parts =  range.replace(/bytes=/, "").split("-")
      var start =  parseInt(parts[0], 10)
      var end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
  
      var chunksize = (end-start)+1;
      var maxChunk = 1024 * 1024; // 1MB at a time
      if (chunksize > maxChunk) {
      end = start + maxChunk - 1;
      chunksize = (end - start) + 1;
      }
      const file =  fs.createReadStream(path, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
  
        res.writeHead(206, head)
        file.pipe(res)
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
       res.writeHead(200, head);
       fs.createReadStream(path).pipe(res);
      
    }
    
  })

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})