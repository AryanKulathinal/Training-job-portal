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


app.put('/jobs/change/:id', (req, res) => {
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

app.put('/jobs/apply', (req, res) => {
    const { user_id, job_id } = req.data;

    // Validate that both user_id and job_id are provided
    if (!user_id || !job_id) {
        return res.status(400).send('User ID and Job ID are required');
    }

    // Step 1: Fetch the job based on job_id
    const selectSql = 'SELECT APPLICANTS FROM JOBS WHERE ID = ?';
    db.query(selectSql, [job_id], (err, result) => {
        if (err) {
            return res.status(500).send('Error fetching the job');
        }

        if (result.length === 0) {
            return res.status(404).send('Job not found');
        }

        // Step 2: Parse the applicants list (assumed to be stored as a JSON array)
        let applicants;
        try {
            applicants = JSON.parse(result.APPLICANTS || '[]');
        } catch (parseError) {
            return res.status(500).send('Error parsing applicants data');
        }

        // Step 3: Append the new user_id to the applicants list (if not already added)
        if (!applicants.includes(user_id)) {
            applicants.push(user_id);
        } else {
            return res.status(400).send('User already applied for this job');
        }

        // Step 4: Update the job with the new applicants list
        const updateSql = 'UPDATE JOBS SET APPLICANTS = ? WHERE ID = ?';
        db.query(updateSql, [JSON.stringify(applicants), job_id], (err, result) => {
            if (err) {
                return res.status(500).send('Error updating the job');
            }

            res.send('User applied successfully');
        });
    });
});



app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});














