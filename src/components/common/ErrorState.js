import React from "react";

export default function ErrorState({ message = "Something went wrong" }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
      {message}
    </div>
  );
}