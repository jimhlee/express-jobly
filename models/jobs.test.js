"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Company = require("./company.js");
const Job = require('./jobs.js');
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */
/*
        id,
        title,
        salary,
        equity,
        company_handle`,
*/
describe('create', function () {
  const newJob = {
    title: 'tester',
    salary: 100000,
    equity: 0.1,
    companyHandle: 'c1'
  };

  const invalidJob = {
    title: 1,
    salary: '100000',
    equity: 0.1,
    companyHandle: 'new'
  };

  test('works', async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      id: expect.any(Number),
      title: 'tester',
      salary: 100000,
      equity: '0.1',
      company_handle: 'c1'
    });
  });

  test('create job with no company', async function () {
    try {
      let job = await Job.create(invalidJob);
      throw new Error('Should not get here')
    } catch (err) {
      expect(err.detail).toEqual(
        'Key (company_handle)=(new) is not present in table "companies".');
      }
    });
});

/************************************** create */

describe('findAll', function () {

  test('works', async function () {
    const res = await Job.findAll({});

    expect(res).toEqual([
      {
        id: expect.any(Number),
        title: 'j1',
        salary: 100,
        equity: '0',
        company_handle: 'c1'
      },
      {
        id: expect.any(Number),
        title: 'j2',
        salary: 200,
        equity: '0.5',
        company_handle: 'c2'
      }
    ])
  })

  test('works with one filter param', async function () {
    const res = await Job.findAll({minSalary: 200});

    expect(res).toEqual([
      {
        id: expect.any(Number),
        title: 'j2',
        salary: 200,
        equity: '0.5',
        company_handle: 'c2'
      }
    ])
  })

  test('works with all filter params', async function () {
    const res = await Job.findAll({minSalary: 200, title: 'j', hasEquity: true});

    expect(res).toEqual([
      {
        id: expect.any(Number),
        title: 'j2',
        salary: 200,
        equity: '0.5',
        company_handle: 'c2'
      }
    ])
  })
})


/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(`${testJobIds[0]}`);
    expect(job).toEqual({
      id: expect.any(Number),
      title: 'j1',
      salary: 100,
      equity: '0',
      company_handle: 'c1'
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get("0");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/************************************** update */

describe("update", function () {
  const updateData = {
    title: "New",
    salary: 23000,
    equity: 0.3,
  };

  test("works", async function () {
    let job = await Job.update(`${testJobIds[0]}`, updateData);
    expect(job).toEqual({
      id: expect.any(Number),
      title: 'New',
      salary: 23000,
      equity: '0.3',
      company_handle: 'c1'
    });
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      title: "New",
      salary: null,
      equity: null,
    };

    let job = await Job.update(`${testJobIds[0]}`, updateDataSetNulls);
    expect(job).toEqual({
      id: expect.any(Number),
      title: 'New',
      salary: null,
      equity: null,
      company_handle: 'c1'
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.update("0", updateData);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(`${testJobIds[0]}`, {});
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  /************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(`${testJobIds[0]}`);
    const res = await db.query(
      `SELECT id FROM jobs WHERE id=${testJobIds[0]}`);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such company", async function () {
    try {
      await Job.remove("0");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});





});