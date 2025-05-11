const express = require("express");
const app = express();
const PORT = 3000;

const bodyParser = require("body-parser");

app.use(bodyParser.json());

// GLOBAL VARIABLES
const envelopes = [
  { id: 1, title: "Groceries", budget: 1100 },
  { id: 2, title: "Restaurants", budget: 450 },
];

let totalBudget = 0;

// CREATE ENVELOPE
app.post("/envelopes", (req, res) => {
  const { title, budget } = req.body;
  if (envelopes.some((obj) => Object.values(obj).includes(title))) {
    return res
      .status(400)
      .send({ msg: "Envelope with that title already exists." });
  }
  const id = envelopes[envelopes.length - 1].id + 1;
  envelopes.push({ id, title, budget });
  totalBudget += budget;
  console.log(envelopes);
  res.send({ msg: "Envelope created.", id: id });
});

// GET ALL ENVELOPES
app.get("/envelopes", (req, res) => {
  res.send(envelopes);
});

// GET ENVELOPE BY ID
app.get("/envelopes/:id", (req, res) => {
  const { id } = req.params;
  res.send(envelopes.find((envelope) => envelope.id == id));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
