const express = require("express");
const slugify = require("slugify");
const router = express.Router();
// .. goes back one folder 
const db = require("../db");

// get list of all companies 
router.get('/', async (req, res, next) => {
    try{
        const results = await db.query(`SELECT * FROM companies`);
        return res.json(results.rows)
    }   catch(e) {
        return next(e)
    }
})

// get one company and corresponding invoices based on company code
router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const companyResults = await db.query(`SELECT * FROM companies WHERE code=$1`, [code]);
        if (companyResults.rows.length === 0) {
            return res.status(404).json({ error: "company not found" });
        }
        const invoiceResults = await db.query(`SELECT id FROM invoices WHERE comp_code=$1`, [code])
        const company = companyResults.rows[0];
        company.invoices = invoiceResults.rows.map(invoice => invoice.id);

        return res.json({ company });
    }   catch(e) {
        return next(e)
    }
})

// add a company
router.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const code = slugify(name, {lower: true});
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name description`, [code, name, description]);
        return res.status(201).json(results.rows[0])
    }   catch(e) {
        return next(e)
    }
})

router.put('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description, industries_code } = req.body;
        const results = await db.query(`UPDATE companies SET name=$1, description=$2, industries_code=$3 WHERE code=$4 RETURNING code, name, description, industries_code`, [name, description, industries_code, code]);
        return res.send(results.rows)
    }   catch(e) {
        return next(e)
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`DELETE FROM companies WHERE code=$1`, [code])
        return res.send({ status: "deleted" })
    }   catch(e) {
        return next(e)
    }
})

module.exports = router; 