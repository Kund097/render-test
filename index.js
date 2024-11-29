const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true,
    },
    {
        id: 2,
        content: "Browser can execute only javaScript",
        important: false,
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true,
    },
];

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>");
    console.log(request.url, "in hello world");
});

app.get("/api/notes", (request, response) => {
    response.json(notes);
    console.log(request.url, "in api");
});

app.get("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find((note) => note.id === id);

    if (note) {
        response.json(note);
    } else {
        response.sendStatus(404);
    }
});

app.delete("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter((note) => note.id != id);
    response.sendStatus(204);
});

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
    return maxId + 1;
};

app.post("/api/notes", (request, response) => {
    const body = request.body;

    if (!body.content) {
        return response.status(400).json({ error: "content missing" });
    }
    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId(),
    };

    notes = [...notes, note];
    response.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
