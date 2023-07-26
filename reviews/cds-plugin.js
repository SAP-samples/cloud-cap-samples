cds.once('bootstrap',(app)=>{
  app.serve ('/reviews') .from ('@capire/reviews','app/vue')
})
