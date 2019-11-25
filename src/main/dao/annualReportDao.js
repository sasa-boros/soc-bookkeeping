function findOneForYear (year) {
    return new Promise((resolve, reject) => { 
        db.annualReports.findOne({year: year}, (err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        })
    })
}

function insert (doc) {
    return new Promise((resolve, reject) => { 
        db.annualReports.insert(doc, (err, newDoc) => {
            if (err) {
                reject(err)
            }
            resolve(newDoc)
        })
    })
}

function removeOneForYear (year) {
    return new Promise((resolve, reject) => { 
        db.annualReports.remove({year: year}, (err, numRemoved) => {
            if (err) {
                reject(err)
            }
            resolve(numRemoved)
        })
    })
}

module.exports = {
    findOneForYear: findOneForYear,
    insert: insert,
    removeOneForYear: removeOneForYear
}