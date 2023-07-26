cds.once('bootstrap',(app)=>{
  app.serve ('/data') .from('@capire/data-viewer','app/viewer')
})
