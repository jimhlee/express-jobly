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