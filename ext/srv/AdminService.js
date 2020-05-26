module.exports = cds.service.impl(function(){

  this.before(['CREATE','UPDATE'],'Books', req => {  //> ....
    const book = req.data
    if (book.stock < 10 && book.discount > 0.5) {
      req.error('Hey, da sind so wenig übrig, die wollen wir nicht zu billig verticken')
    }
  })

})
