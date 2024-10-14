const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port= 3001;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'pass@word1',
    database:'mydb'

});

db.connect((err)=>{
    if(err) throw err;
    console.log('Connected to MySQL database');
});

app.get('/jobs',(req,res)=>{
    const sql = 'SELECT * FROM JOBS'
    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(result);
    });
});


// app.post('/jobs',(req,res)=>{
//     const {name,qualification,desc,vacancies} = req.body;
//     const sql= 'INSERT INTO JOBS(NAME,QUALIFICATION,DESC,VACANCIES) VALUES (?,?,?,?)';
//     const values = [name,qualification,desc,vacancies]
//     db.query(sql,values,(err,result)=>{
//         if(err) throw err;
//         res.send('Job added successfully!');
//     });
// })

app.post('/jobs', (req, res) => {
    const { name, qualification, desc, vacancies } = req.body;
    const sql = 'INSERT INTO JOBS (NAME, QUALIFICATION, DESCRIPTION, VACANCIES, APPLICANTS) VALUES (?, ?, ?, ?, ?)';
    const values = [name, qualification, desc, vacancies, JSON.stringify([])]; 
    db.query(sql, values, (err, result) => {
        if (err) throw err;
        res.send('Job added successfully!');
    });
});


app.get('/jobs/:id',(req,res)=>{
    const sql = 'SELECT * FROM JOBS WHERE ID = ?';
    db.query(sql,[req.params.id],(err,result)=>{
        if(err) throw err;
        res.send(result);
    });

});


app.put('/jobs/:id', (req, res) => {
    const { name, qualification, desc, vacancies } = req.body;
    const sql = 'UPDATE JOBS SET NAME = ?, QUALIFICATION = ?, DESCRIPTION = ?, VACANCIES = ? WHERE ID = ?';
    const values = [name, qualification, desc, vacancies, req.params.id];
    db.query(sql, values, (err, result) => {
        if (err) throw err;
        res.send('Job updated successfully!');
    });
});


app.delete('/jobs/:id',(req,res)=>{
    const sql = 'DELETE FROM JOBS WHERE ID = ?';
    db.query(sql,[req.params.id],(err,result)=>{
        if(err) throw err;
        res.send('Job deleted successfully');
    });
});

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});














