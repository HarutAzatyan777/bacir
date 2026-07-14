import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { Card, Button, Row, Col, Spin, Empty, Popconfirm, Typography, message, Space } from "antd";
import { 
  PlusOutlined, 
  LogoutOutlined, 
  LeftOutlined, 
  EyeOutlined, 
  EditOutlined, 
  TeamOutlined, 
  MobileOutlined, 
  DeleteOutlined 
} from "@ant-design/icons";
import InvitationForm from "./InvitationForm";
import RsvpList from "./RsvpList";
import "./Dashboard.css";

const { Title, Text } = Typography;

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
      message.error("Սխալ տեղի ունեցավ հրավերները բեռնելիս / Error fetching invitations.");
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
    try {
      // Delete main invitation
      await deleteDoc(doc(db, "invitations", id));
      // Delete secrets
      await deleteDoc(doc(db, "invitationSecrets", id));
      
      message.success("Հրավերը հաջողությամբ ջնջվեց / Invitation deleted successfully.");
      // Refresh list
      fetchInvitations();
    } catch (err) {
      console.error("Error deleting invitation:", err);
      message.error("Ջնջելիս սխալ տեղի ունեցավ: / An error occurred during deletion.");
    }
  };

  if (loadingUser) {
    return (
      <div className="dashboard-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Card bordered={false} style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <Text style={{ display: "block", marginTop: 16 }}>Բեռնվում է... / Loading dashboard...</Text>
        </Card>
      </div>
    );
  }

  if (view === "create") {
    return (
      <InvitationForm
        mode="create"
        onSuccess={() => {
          setView("list");
          fetchInvitations();
        }}
        onCancel={() => setView("list")}
      />
    );
  }

  if (view === "edit") {
    return (
      <InvitationForm
        mode="edit"
        invitationId={selectedId}
        onSuccess={() => {
          setView("list");
          fetchInvitations();
        }}
        onCancel={() => setView("list")}
      />
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar / Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <Title level={2} style={{ margin: 0 }}>ԿԱՌԱՎԱՐՄԱՆ ՎԱՀԱՆԱԿ</Title>
          <Text type="secondary">{user?.email}</Text>
        </div>
        <div className="header-right">
          <Space>
            {view !== "list" && (
              <Button 
                icon={<LeftOutlined />} 
                onClick={() => { setView("list"); fetchInvitations(); }}
              >
                Հետ / Back
              </Button>
            )}
            <Button 
              danger 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
            >
              Ելք / Logout
            </Button>
          </Space>
        </div>
      </header>

      <main className="dashboard-main">
        {view === "list" && (
          <div className="list-view">
            <div className="list-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <Title level={3} style={{ margin: 0 }}>
                Հրավերներ / Invitations ({invitations.length})
              </Title>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => setView("create")}
                style={{ backgroundColor: "#2c3e35" }}
                size="large"
              >
                Ստեղծել նոր հրավեր / Create
              </Button>
            </div>

            {loadingData ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <Spin size="large" />
                <Text style={{ display: "block", marginTop: 16 }}>Բեռնվում է... / Loading...</Text>
              </div>
            ) : invitations.length === 0 ? (
              <Card bordered={false} style={{ padding: "40px" }}>
                <Empty description={
                  <span>
                    Ոչ մի հրավեր դեռ չի ստեղծվել: / No invitations created yet.
                  </span>
                } />
              </Card>
            ) : (
              <Row gutter={[24, 24]}>
                {invitations.map((inv) => {
                  const cardImage = inv.hero?.bgMobileUrl || inv.hero?.bgDesktopUrl || inv.envelopeBgUrl;
                  const coverComponent = cardImage ? (
                    <div className="dashboard-card-bg-container" style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "12px", zIndex: 1 }}>
                      <img src={cardImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(20px) brightness(0.75)", transform: "scale(1.15)", zIndex: 1 }} />
                      <img src={cardImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 2 }} />
                    </div>
                  ) : null;
                  
                  return (
                    <Col xs={24} sm={12} md={8} key={inv.id}>
                      <Card 
                        title={<Text strong style={{ fontSize: "1.1rem" }}>{inv.eventName || inv.id}</Text>}
                        extra={<Text type="secondary" copyable={{ text: `${window.location.origin}/i/${inv.id}` }}>/i/{inv.id}</Text>}
                        bordered={false}
                        cover={coverComponent}
                        className={`invitation-card ${cardImage ? "has-background" : ""}`}
                      actions={[
                        <Button 
                          type="link" 
                          icon={<EyeOutlined />} 
                          href={`/i/${inv.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Դիտել / View"
                        />,
                        <Button 
                          type="link" 
                          icon={<TeamOutlined />} 
                          onClick={() => {
                            setSelectedId(inv.id);
                            setView("rsvps");
                          }}
                          title={`RSVP (${inv.rsvpCount || 0})`}
                        >
                          <span style={{ fontSize: "0.85rem", marginLeft: "4px" }}>{inv.rsvpCount || 0}</span>
                        </Button>,
                        <Button 
                          type="link" 
                          icon={<EditOutlined />} 
                          onClick={() => {
                            setSelectedId(inv.id);
                            setView("edit");
                          }}
                          title="Խմբագրել / Edit"
                        />,
                        <Button 
                          type="link" 
                          icon={<MobileOutlined />} 
                          onClick={() => setPreviewInvitationId(inv.id)}
                          title="Նախադիտում / Preview"
                        />,
                        <Popconfirm
                          title="Համոզվա՞ծ եք, որ ցանկանում եք ջնջել այս հրավերը: / Are you sure you want to delete this invitation?"
                          onConfirm={() => handleDelete(inv.id)}
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{ danger: true }}
                        >
                          <Button 
                            type="link" 
                            danger 
                            icon={<DeleteOutlined />} 
                            title="Ջնջել / Delete"
                          />
                        </Popconfirm>
                      ]}
                    >
                      <div className="card-info-content" style={{ minHeight: "60px" }}>
                        <p style={{ margin: 0 }}>
                          <Text type="secondary">Ամսաթիվ / Date: </Text>
                          <Text strong>
                            {inv.calendar?.eventDate ? new Date(inv.calendar.eventDate).toLocaleDateString() : "Նշված չէ / Not Set"}
                          </Text>
                        </p>
                      </div>
                    </Card>
                  </Col>
                );
              })}
              </Row>
            )}
          </div>
        )}



        {view === "rsvps" && (
          <RsvpList
            invitationId={selectedId}
            onBack={() => setView("list")}
          />
        )}
      </main>

      {/* Fixed Phone Preview — right side */}
      {previewInvitationId && (
        <div className="fixed-phone-preview">
          <button
            className="fixed-phone-close"
            onClick={() => setPreviewInvitationId(null)}
            title="Փակել"
          >
            ×
          </button>
          <div className="preview-device-container">
            <div className="iphone-17-frame">
              <div className="dynamic-island"></div>
              <div className="iphone-screen">
                <iframe
                  src={`/i/${previewInvitationId}?preview=true`}
                  title="iPhone Preview"
                  className="preview-iframe"
                  scrolling="no"
                />
              </div>
              <div className="iphone-btn volume-up"></div>
              <div className="iphone-btn volume-down"></div>
              <div className="iphone-btn action-button"></div>
              <div className="iphone-btn power-button"></div>
              <div className="home-indicator"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
