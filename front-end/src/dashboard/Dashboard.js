import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";
import DateButtons from "./DateButtons"
import ReservationsTable from "./ReservationsTable";
import TablesList from "./TablesList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservationDate, setReservationDate] = useState(date);

  const query = useQuery();
  const queryDate = query.get("date");

  useEffect(() => {
    if (queryDate) {
      setReservationDate(queryDate);
    }
  }, [queryDate]);

  useEffect(loadDashboard, [reservationDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: reservationDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1 className="mt-lg-4 mt-1 mb-3">Dashboard</h1>
      <h4 className="mb-1">Reservations for Date: {reservationDate}</h4>
      <DateButtons reservationDate={reservationDate} />
      <ErrorAlert error={reservationsError} />
      <ReservationsTable
        reservations={reservations}
        loadDashboard={loadDashboard}
      />
      <TablesList loadDashboard={loadDashboard} />
    </main>
  );
}

export default Dashboard;
