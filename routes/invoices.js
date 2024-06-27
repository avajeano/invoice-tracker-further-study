const express = require("express");
const router = express.Router();
// .. goes back one folder 
const db = require("../db");

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`)
        return res.json(results.rows)
    }   catch(e) {
        return next(e)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id]);
        return res.json(results.rows)
    }   catch(e) {
        return next(e)
    }
})

// add an invoice
router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt]);
        return res.status(201).json(results.rows[0])
    }   catch(e) {
        return next(e)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt, paid } = req.body;
        let paid_date = null;
        const currResults = await db.query(`SELECT paid FROM invoices WHERE id = $1`, [id]);
        if (currResults.rows.length === 0) {
            throw new ExpressError(`not a valid invoice: ${id}`, 404)
        }

        const currPaidDate = currResults.rows[0].paid_date;
        if (!currPaidDate && paid) {
            paidDate = new Data();
        } else if (!paid) {
            paidDate = null;
        } else {
            paidDate = currPaidDate;
        }

        const results = await db.query(
            `UPDATE invoices 
            SET amt = $1, paid = $2, paid_date = $3
            WHERE id = $4
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [amt, paid, paidDate, id]);

        return res.send(results.rows)
    }   catch(e) {
        return next(e)
    }
})

// delete invoice
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`DELETE FROM invoices WHERE id=$1`, [id])
        return res.send({ status: "deleted" })
    }   catch(e) {
        return next(e)
    }
})



module.exports = router; 