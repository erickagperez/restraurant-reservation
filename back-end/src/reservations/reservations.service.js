const knex = require("../db/connection");

//Creates reservations
function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdReservation) => createdReservation[0]);
}

//Lists reservation date
function list(reservationDate) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: reservationDate })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

//Checks if reservation exists
function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

//Updates reservations
function update(updatedStatus) {
  return knex("reservations")
    .select("status")
    .where({ reservation_id: updatedStatus.reservation_id })
    .update(updatedStatus, "*")
    .then((updatedRecord) => updatedRecord[0]);
}

//Searches reservations
function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}


module.exports = {
  create,
  list,
  read,
  update,
  search
};
