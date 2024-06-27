const express = require("express");
const router = express.Router();
const db = require("../db");

// get list of all industries with associated companies 
router.get('/', async (req, res, next) => {
    try{
        const results = await db.query(`SELECT * FROM company_industry`);
        return res.json(results.rows)
    }   catch(e) {
        return next(e)
    }
})

// add an industry
router.post('/', async (req, res, next) => {
    try {
        const { code, industry } = req.body;
        const results = await db.query(`INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry`, [code, industry]);
        return res.status(201).json(results.rows[0])
    }   catch(e) {
        return next(e)
    }
})

module.exports = router;