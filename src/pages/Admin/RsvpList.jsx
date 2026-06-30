import React, { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import "./RsvpList.css";

export default function RsvpList({ invitationId, onBack }) {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (invitationId) {
      fetchRsvps();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitationId]);

  const fetchRsvps = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "invitations", invitationId, "responses"),
        orderBy("submittedAt", "desc")
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRsvps(list);
    } catch (err) {
      console.error("Error fetching RSVPs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = rsvps.reduce(
    (acc, curr) => {
      if (curr.attendance === "yes") {
        acc.attending += 1;
        acc.totalGuests += curr.guests || 1;
      } else {
        acc.declined += 1;
      }
      return acc;
    },
    { attending: 0, declined: 0, totalGuests: 0 }
  );

  const exportToCSV = () => {
    const headers = [
      "Անուններ / Имена",
      "Ներկայություն / Присутствие",
      "Հյուրերի քանակ / Гостей",
      "Հրավիրող / Приглашен",
      "Ամսաթիվ / Дата"
    ];

    const rows = rsvps.map((r) => [
      r.names ? r.names.join(", ") : "",
      r.attendance === "yes" ? "Այո / Да" : "Ոչ / Нет",
      r.guests || 1,
      r.invitedBy || "",
      r.submittedAt ? new Date(r.submittedAt).toLocaleString() : ""
    ]);

    // Use UTF-8 BOM to ensure Excel opens Armenian and Russian letters correctly
    const csvString = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvString], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rsvps_${invitationId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="rsvp-loading">Բեռնվում է...</div>;
  }

  return (
    <div className="rsvp-container">
      <div className="rsvp-header-row">
        <h3>RSVP Պատասխաններ / Ответы ({rsvps.length})</h3>
        <div className="rsvp-actions">
          <button className="export-btn" onClick={exportToCSV} disabled={rsvps.length === 0}>
            Արտահանել Excel (CSV) / Экспорт
          </button>
          <button className="back-btn-secondary" onClick={onBack}>
            ← Հետ / Назад
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stats-card">
          <h4>Մասնակցում են / Придут</h4>
          <span className="stats-number positive">{stats.attending}</span>
          <p>խումբ / групп</p>
        </div>
        <div className="stats-card">
          <h4>Ընդհանուր հյուրեր / Всего гостей</h4>
          <span className="stats-number highlight">{stats.totalGuests}</span>
          <p>հոգի / человек</p>
        </div>
        <div className="stats-card">
          <h4>Չեն մասնակցում / Не придут</h4>
          <span className="stats-number negative">{stats.declined}</span>
          <p>խումբ / групп</p>
        </div>
      </div>

      {/* RSVP List Table */}
      {rsvps.length === 0 ? (
        <div className="empty-rsvps">
          <p>Առայժմ ոչ մի պատասխան չկա:</p>
          <p>Ответов пока нет.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="rsvp-table">
            <thead>
              <tr>
                <th>Անուններ / Имена</th>
                <th>Ներկայություն / Присутствие</th>
                <th>Քանակ / Кол-во</th>
                <th>Հրավիրող / Кем приглашен</th>
                <th>Ամսաթիվ / Дата</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.map((r) => (
                <tr key={r.id} className={r.attendance === "yes" ? "row-attending" : "row-declined"}>
                  <td className="guest-names">
                    {r.names ? r.names.map((name, i) => (
                      <span key={i} className="guest-name-badge">{name}</span>
                    )) : "-"}
                  </td>
                  <td>
                    <span className={`status-badge ${r.attendance === "yes" ? "yes" : "no"}`}>
                      {r.attendance === "yes" ? "Այո / Да" : "Ոչ / Нет"}
                    </span>
                  </td>
                  <td className="guest-count">{r.guests || 1}</td>
                  <td className="invited-by">{r.invitedBy}</td>
                  <td className="submit-date">
                    {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
