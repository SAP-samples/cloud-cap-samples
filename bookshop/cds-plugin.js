cds.once('bootstrap',(app)=>{
  app.serve ('/bookshop') .from ('@capire/bookshop','app/vue')
})
