const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// used to read the request body req.*
app.use(bodyParser.json());
app.use(cors());

// get all stock's from the database
app.get('/stocks', function (req, res) {
        let db = new sqlite3.Database('stocks.db');

        db.all('SELECT * FROM stocks', function (err, rows) {
            if (err) {
                res.sendStatus(err.status);
            }
            else {
                res.send(rows);
            }
        });

        db.close();
    }
);

// get one single last stock from the database
app.get('/stocks/last', function (req, res) {
    let db = new sqlite3.Database('stocks.db');

    db.get('SELECT * FROM stocks ORDER BY id DESC LIMIT 1', function (err, row) {
        if (err) {
            res.sendStatus(err.status)
        }
        else {
            if (row) {
                res.send(row);
            }
            else {
                res.send({});
            }
        }
    });

    db.close();
});

// get one single stock by id from the database
app.get('/stocks/:id', function (req, res) {
    let db = new sqlite3.Database('stocks.db');

    db.get('SELECT * FROM stocks WHERE id = ?', req.params.id, function (err, row) {
        if (err) {
            res.sendStatus(err.status)
        }
        else {
            res.send(row);
        }
    });

    db.close();
});

// add a stock to the database
app.post('/stocks', function (req, res) {
    let db = new sqlite3.Database('stocks.db');

    db.run("INSERT INTO stocks (stocks) VALUES (?)", req.body.stocks, function (err) {
        if (err) {
            res.sendStatus(err.status);
        }
        else {
            res.sendStatus(201);
        }
    });

    db.close();
});

// update a stock in the database
app.put('/stocks/:id', function (req, res) {
    let db = new sqlite3.Database('stocks.db');

    db.run("UPDATE stocks SET stocks = ? WHERE id = ?", [req.body.stocks, req.params.id], function (err) {
        if (err) {
            res.sendStatus(err.status);
        }
        else {
            res.sendStatus(200);
        }
    });

    db.close();
});

// delete specific stock from the database
app.delete('/stocks/:id', function (req, res) {
    let db = new sqlite3.Database('stocks.db');

    db.run("DELETE FROM stocks WHERE id = ?", req.params.id, function (err) {
        if (err) {
            res.sendStatus(err.status);
        }
        else {
            res.sendStatus(200);
        }
    });

    db.close();
});

// make sure to run the app with `node app.js` command
app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});
