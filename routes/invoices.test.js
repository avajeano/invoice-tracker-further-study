process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany;
beforeEach(async () => {
    const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ('ava', 'ava llc.', 'nyc based co.') RETURNING code, name, description`);
    testCompany = result.rows[0]
})
let testInvoice;
beforeEach(async () => {
    const result = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ('ava', 200000) RETURNING id, comp_code, amt, paid`);
    testInvoice = result.rows[0]
})

afterEach(async () => {
    await db.query(`DELETE FROM invoices`)
})

afterEach(async () => {
    await db.query(`DELETE FROM companies`)
})

afterAll(async () => {
    await db.end()
})

describe("is invoice added to the database", () => {
    test("create invoice", () => {
        console.log(testInvoice);
        expect(1).toBe(1);
    })
})

describe("GET /invoices", () => {
    test("get list of invoices", async () => {
        const res = await request(app).get('/invoices')
        expect(res.statusCode).toBe(200)
    })
})