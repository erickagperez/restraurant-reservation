import React from "react";

function Buttons({ history }) {
  function cancelHandler() {
    history.goBack();
  }

  return (
    <div
      className="col-sm-auto mt-sm-0 mx-md-0 mx-sm-6 
    // formatting for x-small breakpoint
    d-grid gap-2 d-sm-block mt-4 col-6 mx-auto"
    >
      <button
        type="button"
        className="btn btn-danger col-auto mr-3"
        onClick={cancelHandler}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          className="bi bi-person-x-fill mr-2 mb-1"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"
          />
        </svg>
        Cancel
      </button>
      <button type="submit" className="btn btn-success col-auto mr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          className="bi bi-person-check-fill mr-2 mb-1"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"
          />
          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </svg>
        Submit
      </button>
    </div>
  );
}

export default Buttons;
