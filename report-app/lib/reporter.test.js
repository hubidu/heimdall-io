const { test } = require('ava')
const path = require('path')
const reporter = require('./reporter')

test('it should return a test data model', async t => {
    const model = await reporter(path.join(__dirname, '_fixtures'))

    t.truthy(model)
    t.is(model.length, 2)
    t.is(model[0].title, 'versicherungs-center-flow -- Gehe zu CHECK24')
    t.is(model[0].runs.length, 2)
    t.truthy(model[0].runs[0].path)
    t.truthy(model[0].runs[0].screenshots)
    // console.log(model[0])
    // console.log(model[0].runs[0].screenshots[0])
    t.is(model[1].title, 'versicherungs-center-flow -- Kunden können Fremdverträge hinzufügen, das CET Team kann diese veröffentlichen, Kunden können Vertragsdetails einsehen und Verträge löschen')
    t.is(model[1].runs.length, 2)
})
