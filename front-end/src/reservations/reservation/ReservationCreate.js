import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function ReservationCreate() {
  const history = useHistory();

  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);
    createReservation(reservation, abortController.signal)
      .then(() =>
        history.push(`/dashboard?date=${reservation.reservation_date}`)
      )
      .catch(setError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1 className="mt-lg-4 mt-1 mb-3">Create Reservation</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="row g-3">
        <ReservationForm
          reservation={reservation}
          setReservation={setReservation}
        />
      </form>
    </main>
  );
}

export default ReservationCreate;