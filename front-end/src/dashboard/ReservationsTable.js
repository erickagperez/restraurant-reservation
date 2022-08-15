import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { formatAsTime } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsTableButtons from "./ReservationsTableButtons";

function ReservationsTable({ reservations, setReservations }) {
  const location = useLocation();
  const [error, setError] = useState(null);

  const reservationsTableRows = reservations.map((reservation) => {
    if (
      location.pathname === "/dashboard" &&
      (reservation.status === "finished" || reservation.status === "cancelled")
    ) {
      return null;
    }
    return (
      <tr key={reservation.reservation_id}>
        <th scope="row">{formatAsTime(reservation.reservation_time)}</th>
        {location.pathname === "/search" ? (
          <td>{reservation.reservation_date}</td>
        ) : null}
        <td>{reservation.reservation_id}</td>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.people}</td>
        {<ReservationsTableButtons
          reservation={reservation}
          setReservations={setReservations}
          setError={setError}
        />}
      </tr>
    );
  });

  if (reservations && !reservations.length) {
    return (
      <div className="alert alert-warning py-3" role="alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="bi bi-patch-exclamation-fill mb-1 mr-1"
          viewBox="0 0 16 16"
        >
          <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </svg>
        No reservations found.
      </div>
    );
  }
  return (
    <>
      <ErrorAlert error={error} />
      <div className="table-responsive">
        <table className="table table-info table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th scope="col">Reservation Time</th>
              {location.pathname === "/search" ? (
                <th scope="col">Reservation Date</th>
              ) : null}
              <th scope="col">Reservation ID</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Party Size</th>
              <th scope="col">Reservation Status</th>
              <th scope="col">Reservation Options</th>
            </tr>
          </thead>
          <tbody>{reservationsTableRows}</tbody>
        </table>
      </div>
    </>
  );
}

export default ReservationsTable;
