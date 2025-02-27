import React from "react";
import { useNavigate } from "react-router-dom";

const Doctlist = ({ doc }) => {
  const navigate = useNavigate();
  return (
    <div
      className="card p-3 m-2 "
      onClick={() => navigate(`/doctor/booking/${doc._id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="card-header bg-primary text-white">
        <h5>
          Dr. {doc.firstname} {doc.lastname}
        </h5>
      </div>
      <div className="card-body">
        <p>
          <strong>Specialization:</strong> {doc.speicialization}
        </p>
        <p>
          <strong>Experience:</strong> {doc.experience} years
        </p>
        <p>
          <strong>Phone:</strong> {doc.phone}
        </p>
        <p>
          <strong>Email:</strong> {doc.email}
        </p>
        {doc.website && (
          <p>
            <strong>Website:</strong>{" "}
            <a href={doc.website} target="_blank" rel="noopener noreferrer">
              {doc.website}
            </a>
          </p>
        )}
        <p>
          <strong>Address:</strong> {doc.address}
        </p>
        <p>
          <strong>Consultation Fee:</strong> ${doc.feespercunsaltation}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`badge ${
              doc.status === "approved" ? "bg-success" : "bg-warning"
            }`}
          >
            {doc.status}
          </span>
        </p>
        <p>
          <strong>Timings:</strong>{" "}
          {Array.isArray(doc.timings) ? doc.timings.join(", ") : doc.timings}
        </p>
      </div>
    </div>
  );
};

export default Doctlist;
