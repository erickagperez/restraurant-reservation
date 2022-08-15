const knex = require("../db/connection");

//Creates tables
function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdReservation) => createdReservation[0]);
}

//Lists table name
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

//Checks if table exists
function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

//Updates table and reservation status
async function update({ reservation_id, table_id }) {
  const transaction = await knex.transaction();
  return transaction("reservations")
    .where({ reservation_id })
    .update({ status: "seated" }, "*")
    .then(() =>
      transaction("tables")
        .where({ table_id })
        .update({ reservation_id }, "*")
        .then((results) => results[0])
    )
    .then(transaction.commit)
    .then(() => results)
    .catch(transaction.rollback);
}

async function reservationIsFinished({ reservation_id, table_id }) {
  const transaction = await knex.transaction();
  return transaction("reservations")
    .where({ reservation_id })
    .update({ status: "finished" })
    .then(() =>
      transaction("tables")
        .where({ table_id })
        .update({ reservation_id: null }, "*")
        .then((results) => results[0])
    )
    .then(transaction.commit)
    .then(() => results)
    .catch(transaction.rollback);
}

module.exports = {
  create,
  list,
  read,
  update,
  reservationIsFinished,
};
