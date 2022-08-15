import React from "react";
import { setReservationStatus } from "../utils/api";

function ReservationsTableButtons({
  reservation,
  loadDashboard,
  setError,
}) {
  function SeatButton({ reservation_id, status }) {
    if (status === "booked") {
      return (
        <a
          className="btn btn-primary btn-sm"
          href={`/reservations/${reservation_id}/seat`}
          role="button"
        >
          Seat
        </a>
      );
    }
    return null;
  }

  function EditReservationButton({ reservation_id }) {
    return (
      <a
        className="btn btn-secondary btn-sm col-md-8 mb-2"
        href={`/reservations/${reservation_id}/edit`}
        role="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          fill="currentColor"
          className="bi bi-pencil-square mb-1 mr-1"
          viewBox="0 0 16 16"
        >
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
          <path
            fillRule="evenodd"
            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
          />
        </svg>
        Edit
      </a>
    );
  }

  function CancelReservationButton({ reservation }) {
    return (
      <button
        type="button"
        className="btn btn-danger btn-sm col-md-8"
        data-reservation-id-cancel={reservation.reservation_id}
        onClick={() =>
          handleCancelButtonClick(reservation.reservation_id)
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          fill="currentColor"
          className="bi bi-trash mb-1 mr-1"
          viewBox="0 0 16 16"
        >
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
          <path
            fillRule="evenodd"
            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
          />
        </svg>
        Cancel
      </button>
    );
  }

  function handleCancelButtonClick(reservation_id) {
    if (
      window.confirm(
        "Do you want to cancel this reservation?"
      )
    ) {
      const abortController = new AbortController();
      setError(null);
      setReservationStatus(reservation_id, "cancelled", abortController.signal)
        .then(() => loadDashboard())
        .catch(setError);
      return () => abortController.abort();
    }
  }

  return (
    <>
      <td>
        <p data-reservation-id-status={reservation.reservation_id}>
          <b>{reservation.status}</b>
        </p>
        {reservation.status !== "booked" ? null : (
          <SeatButton
          reservation_id={reservation.reservation_id}
          status={reservation.status}
        />
        )}
      </td>
      <td>
        {reservation.status === "cancelled" ||
        reservation.status === "finished" ? null : (
          <>
            <EditReservationButton
              reservation_id={reservation.reservation_id}
            />
            <CancelReservationButton reservation={reservation} />
          </>
        )}
      </td>
    </>
  );
}

export default ReservationsTableButtons;
