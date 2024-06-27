process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany;
beforeEach(async () => {
    const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ('ava', 'ava llc.', 'nyc based co.') RETURNING code, name, description`);
    testCompany = result.rows[0]
})

afterEach(async () => {
    await db.query(`DELETE FROM companies`)
})

afterAll(async () => {
    await db.end()
})

describe("is company added to the database", () => {
    test("create company", () => {
        console.log(testCompany);
        expect(1).toBe(1);
    })
})

describe("GET /companies", () => {
    test("get list of companies", async () => {
        const res = await request(app).get('/companies')
        expect(res.body).toEqual([testCompany])
    })
})