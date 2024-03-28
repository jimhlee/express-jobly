"use strict";

const { sqlForPartialUpdate } = require("./sql");
// const db = require("../db.js");
// const { BadRequestError, NotFoundError } = require("../expressError");
// const Company = require("../company.js");
// const {
//   commonBeforeAll,
//   commonBeforeEach,
//   commonAfterEach,
//   commonAfterAll,
// } = require("./_testCommon");

// beforeAll(commonBeforeAll);
// beforeEach(commonBeforeEach);
// afterEach(commonAfterEach);
// afterAll(commonAfterAll);

// /************************************** create */

// describe("create", function () {
//   const newCompany = {
//     handle: "new",
//     name: "New",
//     description: "New Description",
//     numEmployees: 1,
//     logoUrl: "http://new.img",
//   };


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
      Values:  [ 'New', 'New Description', 1, 'http://new.img' ]
    })
  })
});
