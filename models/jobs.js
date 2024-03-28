'use strict';

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for jobs */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   *  data should be {title, salary, equity, companyHandle}
   *
   * Returns {id, title, salary, equity, company_handle}
   */
  static async create({ title, salary, equity, companyHandle }) {

    const result = await db.query(`
      INSERT INTO jobs (
        title,
        salary,
        equity,
        company_handle
        )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        title,
        salary,
        equity,
        company_handle`,
      [title, salary, equity, companyHandle],
    );
    const job = result.rows[0];

    return job;
  }

  /** Finds all companies */
  static async findAll(query = {}) {
    const result = await db.query(query);
    return result.rows;
  }

  /** Given a job id, return data about job
   *
   * Returns {id, title, salary, equity, company_handle}
   *
   throws NotFoundError if job not found
   */
  static async get(id) {
    const result = await db.query(`
      SELECT id,
             title,
             salary,
             equity,
             company_handle
      FROM jobs
      WHERE id = $1`,
      [id]);

    if (!result.rows[0]) {
      throw new NotFoundError('Job not found');
    }

    return result.rows[0];
  }

  /** Update job data with 'data'
   *
   * This is a "partial update" --- doesn't need to contain every field
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {id, title, salary, equity, company_handle}
   *
   * Throws NotFoundError if not Found
   */
  static async update(id, data) {
    if (data.id || data.companyHandle) {
      throw new BadRequestError('Cannot update id or company handle');
    }
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `
      UPDATE jobs
      SET ${setCols}
      WHERE id = ${idVarIdx}
      RETURNING
          id,
          title,
          salary,
          equity,
          company_handle`;

    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    return job;
  }

  /** Delete given job from database
   *
   * Throws NotFoundError if company not found.
   */
  static async remove(id) {
    const result = await db.query(`
        DELETE
        FROM jobs
        WHERE id = $1
        RETURNING id`, [id]);

    const job = result.rows[0];
    if (!job) {
      throw new NotFoundError('Job not found');
    }
  }
}

module.exports = Job;