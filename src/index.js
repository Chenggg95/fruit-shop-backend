const express = require('express');

const app = express();
const cors = require('cors');
const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'FruitShop',
    password: 'password',
    dialect: 'postgres',
    port: 5432
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

pool.connect((error, client, release) => {
    if(error){
        return console.error('Error acquiring client', err.stack)
    }

    client.query('SELECT NOW()', (error, result) => {
        release();
        if(error){
            return console.error(
                'Error executing query', error.stack)
        }
        console.log("Connected to Database!");
    })
}) 

app.post('/savetransaction', (req, res, next) => {
    const fruitList = req.body.transaction.fruitList;
    const total = req.body.transaction.total;

    console.log("saving data");
    const insertQuery = 'INSERT INTO FRUIT_TRANSACTION (fruit_list,total) VALUES ($1::jsonb, $2::numeric)';

    const values = [JSON.stringify(fruitList), total];

    pool.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error('Error inserting transaction:', err);
          res.sendStatus(500);
          return;
        }
    console.log('Transaction inserted successfully');
    res.sendStatus(200);
    })
})

const server = app.listen(3001, function(){
    let host = server.address().address;
    let port = server.address().port;
})