DROP DATABASE IF EXISTS biztime;

CREATE DATABASE biztime;

\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS company_industry;

CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL
);

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text,
    industries_code text REFERENCES industries(code)
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE company_industry (
    companies_code TEXT NOT NULL REFERENCES companies(code),
    industries_code TEXT NOT NULL REFERENCES industries(code),
    PRIMARY KEY(companies_code, industries_code)
);

INSERT INTO industries (code, industry)
VALUES ('tech', 'technology');

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.', 'tech'),
         ('ibm', 'IBM', 'Big blue.', 'tech');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);
