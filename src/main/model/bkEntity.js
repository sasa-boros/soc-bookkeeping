function assignAnnualReportValues () {
  var self = this
  return new Promise(function (resolve, reject) {
    return self.find({}).sort({ 'date': 1 }).lean().exec().then(async function (bkEntities) {
      for (let i = 0; i < bkEntities.length; i++) {
        const bkEntity = bkEntities[i]

        bkEntity.ordinal = i + 1
        bkEntity.annualReportPage = bkEntity.date.getMonth() + 1
        await updateBkEntity(self, bkEntity)
      }
      resolve()
    }).catch((err) => {
      console.error(err.message)
      reject(err)
    })
  })
}

function updateBkEntity (self, bkEntity) {
  return new Promise(function (resolve, reject) {
    self.findByIdAndUpdate(bkEntity._id, bkEntity, function (err) {
      if (err) {
        console.error(err.message)
        reject(err)
      }
      console.log(bkEntity)
      resolve()
    })
  })
}

function preSave (entity) {
  const currentDate = new Date()
  entity.updated_at = currentDate
  entity.created_at = currentDate
}

function preFindOneAndUpdate (entity) {
  const currentDate = new Date()
  entity._update.updated_at = currentDate
}

module.exports = {
  assignAnnualReportValues: assignAnnualReportValues,
  preSave: preSave,
  preFindOneAndUpdate: preFindOneAndUpdate
}
