import express from "express";
import { generate } from "random-words";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/gpt', (req, res) => {
    let n =  Math.floor(Math.random() * 100)+40;
    let text = generate({ exactly: n, join: " " })
    setTimeout(() => {
        // Code to execute after 5 seconds
        res.send(text);
    }, 2000);
});

app.listen(1002, () => {
    console.log('Server is running on port 1002');
});
