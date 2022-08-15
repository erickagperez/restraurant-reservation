import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Buttons from "./Buttons";

function TableCreate() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [table, setTable] = useState({
    table_name: "",
    capacity: "",
  });

  function changeHandler({ target: { name, value } }) {
    setTable((previousTable) => ({
      ...previousTable,
      [name]: value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);
    createTable(table, abortController.signal)
      .then(() => history.push("/"))
      .catch(setError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1 className="mt-lg-4 mt-1 mb-3">Create Table</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler}>
        <div className="col-md-6 col-xl-4 mb-3 pl-1">
          <label htmlFor="table_name" className="form-label">
            Table Name:
          </label>
          <input
            id="table_name"
            name="table_name"
            type="text"
            className="form-control"
            aria-describedby="table_nameHelpBlock"
            onChange={changeHandler}
            value={table.table_name}
          />
          <div id="table_nameHelpBlock" className="form-text">
            Table name must be at least 2 characters long.
          </div>
        </div>
        <div className="col-md-6 col-xl-4 mb-3 pl-1">
          <label htmlFor="capacity" className="form-label">
            Capacity:
          </label>
          <input
            id="capacity"
            name="capacity"
            type="text"
            className="form-control"
            aria-describedby="capacityHelpBlock"
            onChange={changeHandler}
            value={table.capacity}
          />
          <div id="capacityHelpBlock" className="form-text">
            Table capacity must be at least 1.
          </div>
        </div>
        <div className="col-md-6 col-xl-4 col-auto">
          <Buttons history={history} />
        </div>
      </form>
    </main>
  );
}

export default TableCreate;
