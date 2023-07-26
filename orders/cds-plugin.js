cds.once('bootstrap',(app)=>{
  app.serve ('/orders') .from('@capire/orders','app/orders')
})
