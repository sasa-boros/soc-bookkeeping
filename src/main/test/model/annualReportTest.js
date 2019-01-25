const annualReport = require('../../model/annualReport')
const assert = require('assert')

describe('Annual report test', function () {
    before(async function () {

        /*
         {
      "amount": 1,
      "amountText": "jedan",
      "date": "2019-01-16T00:00:00.000Z",
      "firstAmount": 1,
      "firstPart": "I",
      "firstPos": "1",
      "municipalityPresident": "Predsednik",
      "payed": "Platio",
      "reason": "Razlog",
      "received": "Primio",
      "secondAmount": 0,
      "secondPart": "I",
      "secondPos": "1",
      "town": "sfa",
    }
    */

   annualReport.findAndSortEntitiesPerMonth = jest.fn(function(year, monthOrdinal, sortingOrder, entity) {


   })


    })

    it('Should return valid annual report', async function () {
        annualReportObj = await annualReport.getAnnualReport(2018)
        console.log(annualReportObj)

        assert.equal(annualReportObj.year, 2018)
        assert.equal(annualReportObj.pages.length, 12)
    })
})