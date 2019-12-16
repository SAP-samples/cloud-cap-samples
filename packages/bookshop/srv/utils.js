const diff = (obj1, obj2) =>
  Object.keys(obj1).reduce(
    (res, curr) =>
      obj1[curr] === obj2[curr] ? res : (res[curr] = obj2[curr]) && res,
    {}
  )

const queriesToUpdateDifferences = (entity, ownEntries, otherEntries) =>
  ownEntries
    .map(ownEntry => {
      const remoteAddress = otherEntries.find(otherEntry =>
        Object.keys(entity.keys).reduce(
          (res, curr) => res && otherEntry[curr] === ownEntry[curr],
          true
        )
      )
      if (remoteAddress) {
        const diff = diff(ownEntry, remoteAddress)
        if (Object.keys(diff).length) {
          return UPDATE(entity)
            .set(diff)
            .where({
              BusinessPartner: ownEntry.BusinessPartner,
              AddressID: ownEntry.AddressID
            })
        }
      }
    })
    .filter(el => el)

module.exports = { diff, queriesToUpdateDifferences }
