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
        const differences = diff(ownEntry, remoteAddress)
        if (Object.keys(differences).length) {
          return UPDATE(entity)
            .set(differences)
            .where(
              Object.keys(entity.keys).reduce(
                (res, curr) => (res[curr] = ownEntry[curr]) && res,
                {}
              )
            )
        }
      }
    })
    .filter(el => el)

module.exports = { diff, queriesToUpdateDifferences }
