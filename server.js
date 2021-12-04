// creates local and heroku port
const PORT = process.env.PORT || 3001;
// file save
const fs = require('fs');
// path's for using index and notes html
const path = require('path');
// uses npm express
const express = require('express');
const app = express();
// creates .json in db for each note
const allNotes = require('./db/db.json');
// uses express to parse data and gives access to public folder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// gets json database
app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});
// gets index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
// gets notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
// for any other URL paths send to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
// creates new note in an array and adds it to database
function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}
// posts new note to api
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});
// deletes note in array
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}
// deletes from api
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});
// initiates port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});