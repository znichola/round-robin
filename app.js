import express from 'express';
import path from 'path';

const app = express();
const port = 5555;

app.use(express.json());

app.use((req, res, next) => {
console.log(`[${new Date().toISOString()}] ${req.hostname} ${req.method} ${req.url}`);
next();
})

// sets 
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/hello', (req, res) => {
    res.send("Hello Chess")
});

// Handle 404 errors (Page Not Found)
app.use((req, res, next) => {
    res.status(404).json({message: "Not found"});
});

// listen with app on the port
app.listen(port, () => {
    console.log(`Round Robin app is listening on port ${port}`);
});

