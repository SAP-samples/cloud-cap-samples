// Add routes to UIs from imported packages
module.exports = (app) => {
  app.serve ('/bookshop') .from ('@capire/bookshop','app/vue')
  app.serve ('/reviews') .from ('@capire/reviews','app/vue')
  app.serve ('/orders') .from('@capire/orders','app/orders')
  app.serve ('/data') .from('@capire/data-viewer','app/viewer')
}
