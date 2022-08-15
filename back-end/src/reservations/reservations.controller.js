const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { as } = require("../db/connection");

/**
 * Start of Middleware
 */

//Checks required data fields for reservations
function validateReservationDataProperties(req, _res, next) {
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      people,
      reservation_date,
      reservation_time,
      status,
    } = {},
  } = req.body;
  let errorMessage;

  if (!req.body.data) errorMessage = "Data is missing.";
  else if (!first_name) errorMessage = "Reservation must include a first_name.";
  else if (!last_name) errorMessage = "Reservation must include a last_name.";
  else if (!mobile_number)
    errorMessage = "Reservation must include a mobile_number.";
  else if (typeof people !== "number" || !people)
    errorMessage = "Reservation must include number of people.";
  else if (!reservation_date || !reservation_date.match(/\d{4}-\d{2}-\d{2}/))
    errorMessage = "Reservation must include event reservation_date.";
  else if (!reservation_time || !reservation_time.match(/\d{2}:\d{2}/))
    errorMessage = "Reservation must include event reservation_time.";
  else if (status === "seated") errorMessage = "Reservation is seated.";
  else if (status === "finished") errorMessage = "Reservation is finished.";

  if (errorMessage) {
    next({
      status: 400,
      message: errorMessage,
    });
  }

  next();
}

//Checks if reservation exists
async function validateReservationId(req, res, next) {
  const { reservation_id } = req.params;
  const reservationData = await service.read(reservation_id);

  if (reservationData) {
    res.locals.reservation = reservationData;
    return next();
  }

  next({
    status: 404,
    message: `Reservation ${reservation_id} does not exist.`,
  });
}

//Checks reservations day
//If reservation is made on a Tuesday or a past date, reservation will not submit
function validateReservationFutureDate(req, _res, next) {
  let { reservation_date } = req.body.data;
  reservation_date = new Date(reservation_date);
  const todaysDate = new Date();
  const checkDay = reservation_date.toUTCString();
  let errorMessage;

  if (reservation_date < todaysDate)
    errorMessage = "Please select a future date.";
  if (checkDay.includes("Tue")) {
    errorMessage = "We are closed on Tuesdays. Please select a future date.";
  }

  if (errorMessage) {
    return next({
      status: 400,
      message: errorMessage,
    });
  }
  next();
}

//Checks reservations time
//If reservation is outside business hours, reservation will not submit
function validateReservationTimeFrame(req, _res, next) {
  const { reservation_time } = req.body.data;

  if (reservation_time < "10:30" || reservation_time > "21:30") {
    return next({
      status: 400,
      message:
        "We are closed at the time you selected. Please select a different time.",
    });
  }
  next();
}

//Checks reservation status
async function validateStatus(req, res, next) {
  const update = req.body.data;
  const { status } = update;
  const validStatus = ["booked", "seated", "finished", "cancelled"];

  if (!validStatus.includes(status)) {
    next({
      status: 400,
      message: "unknown status",
    });
  }
  if (res.locals.reservation.status === "finished") {
    next({
      status: 400,
      message: "A finished reservation cannot be updated.",
    });
  }
  res.locals.update = status;
  return next();
}

/**
 * End of Middleware
 */

//Create reservation
async function create(req, res) {
  const newReservation = {
    ...req.body.data,
  };
  const createdReservation = await service.create(newReservation);
  res.status(201).json({ data: createdReservation });
}

//Lists reservations
async function list(req, res) {
  const { date, mobile_number } = req.query;
  if (date) {
    const data = await service.list(date);
    res.json({ data });
  } else if (mobile_number) {
    const data = await service.search(mobile_number);
    res.json({ data });
  }
}

//Lists reservations
function read(_req, res) {
  res.json({ data: res.locals.reservation });
}

//Updates reservation status
async function updateStatus(_req, res) {
  const data = await service.update({
    reservation_id: res.locals.reservation.reservation_id,
    status: res.locals.update,
  });
  res.json({ data });
}

//Updates entire reservation
async function update (req, res) {
  const data = await service.update(req.body.data);
  res.json({ data });
};

module.exports = {
  create: [
    validateReservationDataProperties,
    validateReservationFutureDate,
    validateReservationTimeFrame,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(validateReservationId), read],
  status: [
    asyncErrorBoundary(validateReservationId),
    validateStatus,
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(validateReservationId),
    validateReservationDataProperties,
    validateReservationFutureDate,
    validateReservationTimeFrame,
    validateStatus,
    asyncErrorBoundary(update),
  ],
};
