const express = require('express'); 

const app = express(); 
app.use((req, res, next)=>{
    console.log('sisii');
    next();
})

app.use((req, res, next) => {
    res.status(201);
    next();
}); 

app.use((req, res, next) => {
    res.json({message: 'ok'});
    next();
})

app.use((req, res) => {
    console.log("success");
})

module.exports = app; 

