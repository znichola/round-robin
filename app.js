import express from 'express';
const app = express();
const port = 5555;

app.get('/', (req, res) => {
    res.send("Hellow Chess")
});

app.listen(port, () => {
    console.log(`Round Robin app is listening on port ${port}`);
});

