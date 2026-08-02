import React from "react";

export default function ErrorState({
  message = "Something went wrong."
}) {

  return (

    <div
      className="alert alert-danger"
      role="alert"
    >
      {message}
    </div>

  );

}