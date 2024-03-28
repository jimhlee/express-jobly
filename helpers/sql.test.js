"use strict";

const { sqlForPartialUpdate } = require("./sql");

// TODO: test for zero, one and many
describe("sqlForPartialUpdate", function () {
  test("returns { 'SQL query string', [array of variables] }", function () {
    const dataToUpdate = {
      name: "New",
      description: "New Description",
      numEmployees: 1,
      logoUrl: "http://new.img"
    };
    const jsToSql = {
      numEmployees: "num_employees",
      logoUrl: "logo_url",
    };
    let partialSQL = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(partialSQL).toEqual({
      setCols: `"name"=$1, "description"=$2, "num_employees"=$3, "logo_url"=$4`,
      values:  [ 'New', 'New Description', 1, 'http://new.img' ]
    })
  })

  test('Throws BadRequest error if empty', function () {
    try {
      let partialSQL = sqlForPartialUpdate({}, {});
      // throw a custom error here to check for correct error
      // new error should be generic
    } catch (err) {
      expect(err.message).toEqual('No data')
    }
  })
});
