import React from "react";
import { listReservations } from "../../utils/api";

function Form({
  phoneNumber,
  setphoneNumber,
  setFoundReservations,
  setError,
}) {
  function changeHandler({ target: { name, value } }) {
    setphoneNumber(() => ({
      [name]: value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);
    listReservations(phoneNumber, abortController.signal)
      .then(setFoundReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  return (
    <form onSubmit={submitHandler}>
      <div className="row">
        <label htmlFor="mobile_number" className="col-5 col-sm-auto col-form-label pl-3 pr-1 pr-sm-2 pt-2 pt-sm-2">
          <h5>Mobile Number:</h5>
        </label>
        <div className="col-7 pl-0 pt-2 pt-sm-1 col-md-6 col-lg-5 col-xl-4">
          <input
            id="mobile_number"
            name="mobile_number"
            type="text"
            className="form-control"
            placeholder="Enter a customer's phone number"
            onChange={changeHandler}
            value={phoneNumber.mobile_number}
          />
        </div>
        <div className="col-12 col-sm-auto pt-2 pt-sm-1">
        <div className="d-flex align-center justify-content-end">
          <button type="submit" className="btn btn-info">
            Find
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              className="bi bi-search ml-2 mb-1"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </button>
        </div>
        </div>
      </div>
    </form>
  );
}

export default Form;
