const express = require("express");
const app = express();
const PORT = 3000;
const {
  getEnvelopes,
  createEnvelope,
  getEnvelopeById,
  updateEnvelopeBudget,
  postDebit,
  postCredit,
  deleteEnvelope,
  transfer,
} = require("./controllers/envelopes");

const bodyParser = require("body-parser");

app.use(bodyParser.json());

// CREATE ENVELOPE
app.post("/envelopes", async (req, res) => {
  const { title, budget } = req.body;
  const newEnvelope = await createEnvelope(title, budget);
  res.send({ msg: "Envelope created.", newEnvelope });
});

// GET ALL ENVELOPES
app.get("/envelopes", async (req, res) => {
  const envelopes = await getEnvelopes();
  res.json(envelopes);
});

// GET ENVELOPE BY ID
app.get("/envelopes/:id", async (req, res) => {
  const { id } = req.params;
  const envelope = await getEnvelopeById(id);
  res.json(envelope);
});

// UPDATE ENVELOPE BUDGET
app.put("/envelopes/:id/budget/:amount", async (req, res) => {
  const { id, amount } = req.params;
  const data = await updateEnvelopeBudget(id, amount);
  if (!data) {
    return res.status(400).send({ msg: "Envelope not found." });
  }
  res.json(data);
});

// POST DEBIT TO ENVELOPE
app.post("/envelopes/:id/debit/:amount", async (req, res) => {
  const { id, amount } = req.params;
  const data = await postDebit(id, amount);
  if (!data) {
    return res.status(400).send({ msg: "Envelope not found." });
  }
  res.json(data);
});

// POST CREDIT TO ENVELOPE
app.post("/envelopes/:id/credit/:amount", async (req, res) => {
  const { id, amount } = req.params;
  const data = await postCredit(id, amount);
  if (!data) {
    return res.status(400).send({ msg: "Envelope not found." });
  }
  res.json(data);
});

// DELETE ENVELOPE
app.delete("/envelopes/:id", async (req, res) => {
  const { id } = req.params;
  const data = await deleteEnvelope(id);
  if (!data) {
    return res.status(400).send({ msg: "Envelope not found." });
  }
  res.json(data);
});

// TRANSFER BETWEEN ENVELOPES
app.post("/envelopes/transfer/:from/:to", async (req, res) => {
  const { from, to } = req.params;
  const { amount } = req.headers;
  if (!amount) {
    return res.status(400).send({ msg: "No amount provided." });
  }
  const fromEnvelope = await getEnvelopeById(from);
  const toEnvelope = await getEnvelopeById(to);
  console.log(fromEnvelope, toEnvelope);
  if (!fromEnvelope || !toEnvelope) {
    return res.status(400).send({ msg: "Invalid envelope(s) provided" });
  }
  await postDebit(from, amount);
  await postCredit(to, amount);
  res.send({ fromEnvelope, toEnvelope });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
