function findAll () {
    return new Promise((resolve, reject) => { 
        db.paymentSlips.find({}, (err, docs) => {
            if (err) {
                reject(err)
            }
            resolve(docs)
        })
    })
}

function findAllSortByDateAsc () {
    return new Promise((resolve, reject) => { 
        db.paymentSlips.find({}).sort({ 'date': 1 }).exec((err, docs) => {
            if (err) {
                reject(err)
            }
            resolve(docs)
        })
    })
}

function findBetweenDates (startDate, endDate) {
    return new Promise((resolve, reject) => { 
        db.paymentSlips.find({ 'date': { '$gte': startDate, '$lt': endDate } }, (err, docs) => {
            if (err) {
                reject(err)
            }
            resolve(docs)
        })
    })
}

function findBetweenDatesSortAsc (startDate, endDate) {
    return new Promise((resolve, reject) => { 
        db.paymentSlips.find({ 'date': { '$gte': startDate, '$lt': endDate } }).sort({ 'date': 1 }).exec((err, docs) => {
            if (err) {
                reject(err)
            }
            resolve(docs)
        })
    })
}

function insert (doc) {
    return new Promise((resolve, reject) => { 
        db.paymentSlips.insert(doc, (err, newDoc) => {
            if (err) {
                reject(err)
            }
            resolve(newDoc)
        })
    })
}

function removeById (id) {
    return new Promise((resolve, reject) => { 
        db.paymentSlips.remove({ _id: id }, {}, (err, numRemoved) => {
            if (err) {
                reject(err)
            }
            resolve(numRemoved)
        })
    })
}

function removeManyByIds (ids) {
    return new Promise((resolve, reject) => { 
        db.paymentSlips.remove({ _id: { $in : ids }}, {multi: true}, (err, numRemoved) => {
            if (err) {
                reject(err)
            }
            resolve(numRemoved)
        })
    })
}

function updateById (id, doc) {
    return new Promise((resolve, reject) => { 
        db.paymentSlips.update({ _id: id }, doc, (err, numReplaced) => {
            if (err) {
                reject(err)
            }
            resolve(numReplaced)
        })
    })
}

module.exports = {
    findAll: findAll,
    findAllSortByDateAsc: findAllSortByDateAsc,
    findBetweenDates: findBetweenDates,
    findBetweenDatesSortAsc: findBetweenDatesSortAsc,
    insert: insert,
    removeById: removeById,
    removeManyByIds: removeManyByIds,
    updateById: updateById
}