import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";
import MakeMeAdminButton from "../Admin/MakeMeAdminButton";
import { Card, Avatar, Button, Input, Tag, Spin, Typography, message } from "antd";
import { CopyOutlined, DashboardOutlined, CrownOutlined, UserOutlined } from "@ant-design/icons";
import "./UserProfile.css";

const { Title, Text, Paragraph } = Typography;

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Auth State check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Redirect to login if not authenticated
        navigate("/admin/login");
      } else {
        setUser(currentUser);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. Real-time listener for user profile document
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    
    // Connect to the Firestore /users/{uid} document using onSnapshot
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          // Fallback if user document does not exist yet (e.g. newly created via Google)
          setProfileData({
            coins: 100, // starting balance default
            plan: "Free"
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to user document:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="profile-container">
        <Card className="profile-card loading-card" bordered={false}>
          <Spin size="large" />
          <Text style={{ marginTop: 16, display: "block" }}>
            Բեռնվում է / Loading profile...
          </Text>
        </Card>
      </div>
    );
  }

  const coins = profileData?.coins ?? 0;
  const plan = profileData?.plan || "Free";
  const showWelcomeGift = coins === 100; // Starting amount welcome badge

  const handleCopyLink = () => {
    const referralLink = `${window.location.origin}/admin/login?ref=${user.uid}`;
    navigator.clipboard.writeText(referralLink);
    message.success("Հղումը պատճենվեց / Link copied to clipboard!");
  };

  const referralLink = `${window.location.origin}/admin/login?ref=${user.uid}`;

  return (
    <div className="profile-container">
      <Card className="profile-card" bordered={false}>
        <div className="profile-header">
          <Avatar 
            size={72} 
            icon={<UserOutlined />} 
            className="profile-avatar-icon"
            style={{ backgroundColor: "#2c3e35", verticalAlign: "middle" }}
          >
            {user.email ? user.email.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
            Անձնական Էջ / User Profile
          </Title>
          <Text type="secondary" className="profile-email">
            {user.email}
          </Text>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Սակագնային Փաթեթ / Active Plan</span>
            <Tag 
              color={plan === "Premium" ? "gold" : "default"}
              icon={plan === "Premium" ? <CrownOutlined /> : null}
              className="plan-tag"
            >
              {plan === "Premium" ? "Premium" : "Free"}
            </Tag>
          </div>

          <div className="detail-item coins-section">
            <span className="detail-label">Հաշվեկշիռ / Coin Balance</span>
            <div className="coins-display">
              <span className="coins-value">{coins}</span>
              <span className="coins-label">Coins</span>
            </div>
            {showWelcomeGift && (
              <div className="welcome-gift-badge">
                🎉 Welcome Gift: 100 Starting Coins!
              </div>
            )}
          </div>
        </div>

        <div className="referral-section">
          <Title level={5} style={{ margin: 0, color: "#2c3e35" }}>
            Հրավիրիր ընկերոջ / Invite a Friend
          </Title>
          <Paragraph className="referral-desc" style={{ marginTop: 8, marginBottom: 4, fontSize: "0.85rem", color: "#556b5e" }}>
            Կիսվիր այս հղումով ընկերներիդ հետ։ Երբ նրանք գրանցվեն և հրապարակեն իրենց առաջին հրավերը, 
            և՛ դու, և՛ քո ընկերը կստանաք <strong>+50 Coins</strong> որպես նվեր:
          </Paragraph>
          <Paragraph className="referral-desc-en" style={{ marginBottom: 16, fontSize: "0.85rem", color: "#718096" }}>
            Share this link with your friends. When they sign up and publish their first invitation, 
            both you and your friend will receive <strong>+50 Coins</strong>!
          </Paragraph>
          
          <Input 
            size="large"
            readOnly 
            value={referralLink} 
            className="referral-link-input"
            addonAfter={
              <Button 
                type="text" 
                icon={<CopyOutlined />} 
                onClick={handleCopyLink}
                style={{ border: "none", background: "transparent", boxShadow: "none" }}
              >
                Copy
              </Button>
            }
          />
        </div>

        <MakeMeAdminButton />

        <div className="profile-footer">
          <Button 
            type="primary" 
            icon={<DashboardOutlined />} 
            onClick={() => navigate("/admin")} 
            className="profile-action-btn"
            size="large"
            block
          >
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
