import React from "react";
import "./Invitations.css";

export default function Invitations() {
  return (
    <div className="invitations">
      <h2>Մեր հրավիրատոմսերի օրինակները</h2>
      <div className="gallery">
        <img src="https://via.placeholder.com/200x300?text=Wedding+Invite" alt="Wedding Invitation"/>
        <img src="https://via.placeholder.com/200x300?text=Birthday+Invite" alt="Birthday Invitation"/>
        <img src="https://via.placeholder.com/200x300?text=Engagement+Invite" alt="Engagement Invitation"/>
      </div>
    </div>
  );
}
