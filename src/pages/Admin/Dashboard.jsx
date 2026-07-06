import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { FaMobileAlt } from "react-icons/fa";
import InvitationForm from "./InvitationForm";
import RsvpList from "./RsvpList";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [invitations, setInvitations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [view, setView] = useState("list"); // list, create, edit, rsvps
  const [selectedId, setSelectedId] = useState(null);
  const [previewInvitationId, setPreviewInvitationId] = useState(null);

  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/admin/login");
      } else {
        setUser(currentUser);
        fetchInvitations(currentUser.uid);
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchInvitations = async (userId) => {
    const uid = userId || (auth.currentUser ? auth.currentUser.uid : null);
    if (!uid) return;
    setLoadingData(true);
    try {
      const colRef = collection(db, "invitations");
      const q = query(colRef, where("ownerId", "==", uid));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvitations(list);
    } catch (err) {
      console.error("Error fetching invitations:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Վստա՞հ եք, որ ցանկանում եք ջնջել "${id}" հրավերը: \nВы уверены, что хотите удалить приглашение "${id}"?`)) {
      return;
    }

    try {
      // Delete main invitation
      await deleteDoc(doc(db, "invitations", id));
      // Delete secrets
      await deleteDoc(doc(db, "invitationSecrets", id));
      
      // Refresh list
      fetchInvitations();
    } catch (err) {
      console.error("Error deleting invitation:", err);
      alert("Ջնջելիս սխալ տեղի ունեցավ: / Произошла ошибка при удалении.");
    }
  };

  if (loadingUser) {
    return (
      <div className="dashboard-loading">
        <p>Բեռնվում է... / Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar / Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>ԿԱՌԱՎԱՐՄԱՆ ՎԱՀԱՆԱԿ</h1>
          <p>{user?.email}</p>
        </div>
        <div className="header-right">
          {view !== "list" && (
            <button className="back-btn" onClick={() => { setView("list"); fetchInvitations(); }}>
              ← Հետ / Назад
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Ելք / Выйти
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {view === "list" && (
          <div className="list-view">
            <div className="list-header">
              <h2>Հրավերներ / Приглашения ({invitations.length})</h2>
              <button className="create-btn" onClick={() => setView("create")}>
                + Ստեղծել նոր հրավեր / Создать
              </button>
            </div>

            {loadingData ? (
              <div className="data-spinner">Բեռնվում է...</div>
            ) : invitations.length === 0 ? (
              <div className="empty-state">
                <p>Ոչ մի հրավեր դեռ չի ստեղծվել:</p>
                <p>Нет созданных приглашений.</p>
              </div>
            ) : (
              <div className="invitations-grid">
                {invitations.map((inv) => (
                  <div key={inv.id} className="invitation-card">
                    <div className="card-info">
                      <h3>{inv.eventName || inv.id}</h3>
                      <span className="slug-badge">/i/{inv.id}</span>
                      <p className="card-date">
                        Օր՝ {inv.calendar?.eventDate ? new Date(inv.calendar.eventDate).toLocaleDateString() : "Նշված չէ"}
                      </p>
                    </div>
                    <div className="card-actions">
                      <a
                        href={`/i/${inv.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-link view-live"
                      >
                        Դիտել / Просмотр
                      </a>
                      <button
                        className="action-btn rsvps"
                        onClick={() => {
                          setSelectedId(inv.id);
                          setView("rsvps");
                        }}
                      >
                        RSVP ({inv.rsvpCount || 0})
                      </button>
                      <button
                        className="action-btn edit"
                        onClick={() => {
                          setSelectedId(inv.id);
                          setView("edit");
                        }}
                      >
                        Խմբագրել / Изменить
                      </button>
                      <button
                        className="action-btn preview-btn"
                        onClick={() => setPreviewInvitationId(inv.id)}
                      >
                        <FaMobileAlt style={{ marginRight: "4px" }} /> Նախադիտում / Превью
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(inv.id)}
                      >
                        Ջնջել / Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "create" && (
          <InvitationForm
            mode="create"
            onSuccess={() => {
              setView("list");
              fetchInvitations();
            }}
            onCancel={() => setView("list")}
          />
        )}

        {view === "edit" && (
          <InvitationForm
            mode="edit"
            invitationId={selectedId}
            onSuccess={() => {
              setView("list");
              fetchInvitations();
            }}
            onCancel={() => setView("list")}
          />
        )}

        {view === "rsvps" && (
          <RsvpList
            invitationId={selectedId}
            onBack={() => setView("list")}
          />
        )}
      </main>

      {/* iPhone 17 Preview Modal */}
      {previewInvitationId && (
        <div className="preview-modal-overlay" onClick={() => setPreviewInvitationId(null)}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h3>iPhone 17 Նախադիտում / Предпросмотр iPhone 17</h3>
              <button className="preview-modal-close" onClick={() => setPreviewInvitationId(null)}>
                &times;
              </button>
            </div>
            <div className="preview-device-container">
              <div className="iphone-17-frame">
                {/* Dynamic Island */}
                <div className="dynamic-island"></div>
                {/* Screen frame */}
                <div className="iphone-screen">
                  <iframe 
                    src={`/i/${previewInvitationId}?preview=true`} 
                    title="iPhone 17 Preview"
                    className="preview-iframe"
                  />
                </div>
                {/* Side buttons */}
                <div className="iphone-btn volume-up"></div>
                <div className="iphone-btn volume-down"></div>
                <div className="iphone-btn action-button"></div>
                <div className="iphone-btn power-button"></div>
                {/* Home Indicator */}
                <div className="home-indicator"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
