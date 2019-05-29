async function getEntitiesByDate (entity, startDate, endDate, isSorted) {
  if (isSorted) {
    return entity.find({ 'date': { '$gte': startDate, '$lt': endDate } }).sort({ 'date': 1 }).exec()
  } else {
    return entity.find({ 'date': { '$gte': startDate, '$lt': endDate } }).exec()
  }
}

module.exports = {
  getEntitiesByDate: getEntitiesByDate
}
