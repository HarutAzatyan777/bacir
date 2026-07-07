import React, { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import { FaSpinner, FaFlag } from "react-icons/fa";
import "./PublishButton.css";

export default function PublishButton({ invitationId, onPublishSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePublish = async () => {
    if (!invitationId) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const publishInvitationFn = httpsCallable(functions, "publishInvitation");
      const result = await publishInvitationFn({ invitationId });

      if (result.data && result.data.success) {
        setSuccess(result.data.message || "Հրավերը հաջողությամբ հրապարակվեց:");
        if (onPublishSuccess) {
          onPublishSuccess(result.data);
        }
      }
    } catch (err) {
      console.error("Publish error:", err);
      setError(err.message || "Տեղի է ունեցել սխալ:");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="publish-button-container">
      {error && <div className="publish-status error">{error}</div>}
      {success && <div className="publish-status success">{success}</div>}
      
      <button
        onClick={handlePublish}
        disabled={loading}
        className={`publish-action-btn ${loading ? "loading" : ""}`}
      >
        <span className="btn-content">
          {loading ? (
            <>
              <FaSpinner className="spinner" size={20} />
              <span>Մշակվում է / Processing...</span>
            </>
          ) : (
            <>
              <FaFlag className="publish-icon" size={18} />
              <span>Հրապարակել / Publish (100 Coins)</span>
            </>
          )}
        </span>
      </button>
    </div>
  );
}
