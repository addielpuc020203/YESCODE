import * as functions from "firebase-functions";
import express from "express"; // Asegúrate de tener esta importación correcta
import { addEntryHandler, getallEntries, deleteEntry, updateEntry } from "./entryController";

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.status(200).send('hey there!'));
app.post('/entries', addEntryHandler);
app.get('/entries', getallEntries)
app.patch('/entries/entryId', updateEntry)
app.delete('/entries/entryId', deleteEntry)

export const api = functions.https.onRequest(app);
