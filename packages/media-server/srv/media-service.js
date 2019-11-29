module.exports = (srv) => {

    var loki = require('lokijs');
    var db = new loki('DB');
    var mediaDB= db.addCollection("Media");
    var Readable = require('stream').Readable;
    var PassThroughStream = require('stream').PassThrough;

    srv.before('CREATE', 'Media', (req) => {
        var obj = mediaDB.insert({media: ""});
        req.data.id=obj.$loki;
    })

    srv.on ('UPDATE', 'Media', async (req,next) => {
        try{ 
            var url = req._.req.path;
            if (url.indexOf("content")>0) {
                const id = req.data.id; 
                var obj = mediaDB.get(id);
                if(obj==null) {
                    req.reject(404,"No record found for the ID");
                    return;
                }
                var stream = new PassThroughStream();
                let chunks = [];
                stream.on('data',  (chunk) => {
                    chunks.push(chunk);
                });
                stream.on('end',  () =>{
                    obj.media = Buffer.concat(chunks).toString('base64');
                    mediaDB.update(obj);
                });
                req.data.content.pipe(stream);
            }  else return next()
        }catch(error){
            req.reject(404,"Media DB error")
            console.log(error)
            return 
        }
    }) 

    srv.on("READ","Media", (req,next)=>{
        try{
            var url = req._.req.path;
            if (url.indexOf("content")>0) {
                const id = req.data.id; 
                if(mediaDB.get(id)==null) {
                    req.reject(404,"Media not found for the ID");
                    return ;
                }
                var decodedMedia  = new Buffer( mediaDB.get(id).media.split(';base64,').pop(), 'base64');
                return _formatResult(decodedMedia);
            }
            else return next()  //> delegate to next/default handlers
        }catch(error){
            req.reject(404,"Media DB error")
            return 
        }
      })  

      srv.on("DELETE","Media", (req,next)=>{
        try{
            const id = req.data.id; 
            var obj=mediaDB.get(id);
            if(obj!=null) {
                mediaDB.remove(obj)
            }
            return next()  //> delegate to next/default handlers
        }catch(error){
            req.reject(404,"Media DB error ")
        }
      })  

    function _formatResult (decodedMedia)  {
        var readable= new Readable
        var result = new Array()
        readable.push(decodedMedia)
        readable.push(null) 
        result.push({value:readable})
        return result 
      }

  }