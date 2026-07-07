import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";
import { auth } from "../../firebase";
import { Dropdown, Avatar, Button, Spin, Typography } from "antd";
import { UserOutlined, CrownOutlined, LogoutOutlined, DashboardOutlined, GlobalOutlined, DownOutlined, LoginOutlined } from "@ant-design/icons";
import { useLanguage } from "../../context/LanguageContext";
import Logo from "../Logo/Logo";
import "./Navbar.css";

const { Text } = Typography;

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentLang, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const tokenResult = await getIdTokenResult(currentUser);
          setIsAdmin(tokenResult.claims.admin === true);
        } catch (error) {
          console.error("Error reading admin claims in Navbar:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleMenuClick = ({ key }) => {
    if (key === "profile") navigate("/profile");
    if (key === "dashboard") navigate("/admin");
    if (key === "super-admin") navigate("/super-admin");
    if (key === "signout") handleSignOut();
  };

  const loginText = {
    am: "Մուտք / Գրանցում",
    ru: "Вход / Регистрация",
    en: "Login / Register"
  };

  const menuLabels = {
    dashboard: { am: "Կառավարման վահանակ", ru: "Панель управления", en: "Dashboard" },
    profile: { am: "Իմ Էջը", ru: "Мой профиль", en: "My Profile" },
    superAdmin: { am: "Գլխավոր Ադմին", ru: "Супер Админ", en: "Super Admin Panel" },
    signOut: { am: "Դուրս գալ", ru: "Выйти", en: "Sign Out" }
  };

  const menuItems = [
    {
      key: "dashboard",
      label: menuLabels.dashboard[currentLang] || menuLabels.dashboard.en,
      icon: <DashboardOutlined />,
    },
    {
      key: "profile",
      label: menuLabels.profile[currentLang] || menuLabels.profile.en,
      icon: <UserOutlined />,
    },
    ...(isAdmin ? [
      {
        key: "super-admin",
        label: menuLabels.superAdmin[currentLang] || menuLabels.superAdmin.en,
        icon: <CrownOutlined style={{ color: "#d4af37" }} />,
      }
    ] : []),
    {
      type: "divider"
    },
    {
      key: "signout",
      label: menuLabels.signOut[currentLang] || menuLabels.signOut.en,
      icon: <LogoutOutlined />,
      danger: true,
    }
  ];

  const langMenuItems = [
    {
      key: "am",
      label: "AM (Հայերեն)",
    },
    {
      key: "ru",
      label: "RU (Русский)",
    },
    {
      key: "en",
      label: "EN (English)",
    },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" style={{ display: "inline-flex" }}>
          <Logo variant="horizontal" height={32} theme="gold" />
        </Link>
      </div>
      <div className="navbar-right">
        <Dropdown 
          menu={{ 
            items: langMenuItems, 
            onClick: ({ key }) => changeLanguage(key),
            selectable: true,
            selectedKeys: [currentLang]
          }} 
          trigger={["click"]} 
          placement="bottomRight"
        >
          <Button className="lang-dropdown-btn" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <GlobalOutlined />
            <span>{currentLang.toUpperCase()}</span>
            <DownOutlined style={{ fontSize: "10px" }} />
          </Button>
        </Dropdown>
        <div className="navbar-links">
          {loading ? (
            <Spin size="small" />
          ) : user ? (
            <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["click"]} placement="bottomRight">
              <div className="navbar-user-dropdown" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                <Avatar 
                  size="medium"
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: "#2c3e35" }}
                >
                  {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <Text className="navbar-email-text">{user.email}</Text>
              </div>
            </Dropdown>
          ) : (
            <Button 
              type="primary" 
              icon={<LoginOutlined />}
              onClick={() => navigate("/admin/login")} 
              className="navbar-login-btn"
            >
              {loginText[currentLang] || loginText.en}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
