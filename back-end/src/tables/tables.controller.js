const service = require("./tables.service");
const { read } = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * Start of Middleware
 */

//Checks required fields for tables
function validateTableProperties(req, _res, next) {
  const { data: { table_name, capacity } = {} } = req.body;
  let errorMessage;

  if (!req.body.data) errorMessage = "Data is missing.";
  else if (!table_name || table_name.length <= 1)
    errorMessage = "table_name must be longer than one character.";
  else if (typeof capacity !== "number" || !capacity)
    errorMessage = "capacity must be at least one.";

  if (errorMessage) {
    return next({
      status: 400,
      message: errorMessage,
    });
  }

  next();
}

//Checks reservation data
async function validateReservation(req, res, next) {
  const data = req.body.data;
  if (!data) {
    next({
      status: 400,
      message: "Data is missing.",
    });
  }

  const { reservation_id } = data;
  if (!reservation_id) {
    next({
      status: 400,
      message: "Missing reservation_id.",
    });
  }

  const reservation = await read(reservation_id);
  if (!reservation) {
    next({
      status: 404,
      message: `Reservation ${reservation_id} cannot be found.`,
    });
  }
  res.locals.reservation = reservation;
  return next();
}

//Checks if table exists
async function validateTable(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);

  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ${table_id} does not exist.`,
  });
}

//Checks table requirements
function validateTableRequirements(_req, res, next) {
  const { capacity, reservation_id } = res.locals.table;

  if (reservation_id) {
    next({
      status: 400,
      message: "Table is occupied.",
    });
  } else if (res.locals.reservation.people > capacity) {
    next({
      status: 400,
      message: `Table capacity is too small for your party.`,
    });
  }
  return next();
}

//Checks if table is occupied
function isTableOccupied(_req, res, next) {
  if (!res.locals.table.reservation_id) {
    next({
      status: 400,
      message: "Table not occupied.",
    });
  }
  next();
}

//Check reservation status
function validateReservationStatus(_req, res, next) {
  if (res.locals.reservation.status === "seated") {
    next({
      status: 400,
      message: `Reservation has already been seated.`,
    });
  }
  return next();
}

/**
 * End of Middleware
 */

//Create table
async function create(req, res) {
  const newtable = {
    ...req.body.data,
  };
  const createdtable = await service.create(newtable);
  res.status(201).json({ data: createdtable });
}

//Lists tables
async function list(_req, res) {
  const data = await service.list();
  res.json({ data });
}

//Updates table and reservation status
async function update(_req, res) {
  const { table } = res.locals;
  const { reservation_id } = res.locals.reservation;

  const updatedTable = { table_id: table.table_id, reservation_id: reservation_id };
  const data = await service.update({ table_id: table.table_id, reservation_id: reservation_id });
  res.json({ data });
}

async function reservationIsFinished(_req, res) {
  const data = await service.reservationIsFinished(res.locals.table);
  res.json({ data });
}

module.exports = {
  create: [validateTableProperties, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  update: [
    asyncErrorBoundary(validateReservation),
    validateReservationStatus,
    asyncErrorBoundary(validateTable),
    validateTableRequirements,
    asyncErrorBoundary(update),
  ],
  finish: [
    asyncErrorBoundary(validateTable),
    isTableOccupied,
    asyncErrorBoundary(reservationIsFinished),
  ],
};
