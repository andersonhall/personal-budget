const db = require("../db");

const createEnvelope = async (title, budget) => {
  try {
    await db
      .query("INSERT INTO envelopes (title, budget) VALUES ($1, $2)", [
        title,
        budget,
      ])
      .then((results) => results.rows[0]);
  } catch (err) {
    console.log(err);
  }
};

const getEnvelopes = async () => {
  try {
    const envelopes = await db
      .query("SELECT * FROM envelopes")
      .then((results) => results.rows);
    return envelopes;
  } catch (err) {
    console.log(err);
  }
};

const getEnvelopeById = async (id) => {
  try {
    const envelope = await db
      .query("SELECT * FROM envelopes WHERE id = $1", [id])
      .then((results) => results.rows[0]);
    return envelope;
  } catch (err) {
    console.log(err);
  }
};

const updateEnvelopeBudget = async (id, amount) => {
  try {
    const envelope = await db.query("SELECT * FROM envelopes WHERE id = $1", [
      id,
    ]);
    if (!envelope) {
      return false;
    }
    const updatedEnvelope = await db.query(
      "UPDATE envelopes SET budget = $1 WHERE id = $2 RETURNING *",
      [parseFloat(amount), id]
    );
    return updatedEnvelope.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const postDebit = async (id, amount) => {
  try {
    const envelope = await db.query("SELECT * FROM envelopes WHERE id = $1", [
      id,
    ]);
    if (!envelope) {
      return false;
    }
    const updatedEnvelope = await db.query(
      "UPDATE envelopes SET budget = (budget - $1) WHERE id = $2 RETURNING *",
      [parseFloat(amount), id]
    );
    return updatedEnvelope.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const postCredit = async (id, amount) => {
  try {
    const envelope = await db.query("SELECT * FROM envelopes WHERE id = $1", [
      id,
    ]);
    if (!envelope) {
      return false;
    }
    const updatedEnvelope = await db.query(
      "UPDATE envelopes SET budget = (budget + $1) WHERE id = $2 RETURNING *",
      [parseFloat(amount), id]
    );
    return updatedEnvelope.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const deleteEnvelope = async (id) => {
  try {
    const envelope = await db.query("SELECT * FROM envelopes WHERE id = $1", [
      id,
    ]);
    if (!envelope) {
      return false;
    }
    const updatedEnvelope = await db.query(
      "DELETE FROM envelopes WHERE id = $1",
      [id]
    );
    return getEnvelopes();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getEnvelopes,
  createEnvelope,
  getEnvelopeById,
  updateEnvelopeBudget,
  postDebit,
  postCredit,
  deleteEnvelope,
};
