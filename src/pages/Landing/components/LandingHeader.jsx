import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import Logo from "../../../components/Logo/Logo";
import { Dropdown, Button } from "antd";
import { GlobalOutlined, DownOutlined } from "@ant-design/icons";
import "./LandingHeader.css";

export default function LandingHeader({ t }) {
  const { currentLang, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const clickCountRef = useRef(0);

  const handleLogoClick = () => {
    clickCountRef.current += 1;
    if (clickCountRef.current >= 7) {
      navigate("/admin");
      clickCountRef.current = 0;
    }
  };

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
    <header className="landing-header">
      <div className="logo-section" onClick={handleLogoClick} style={{ cursor: "pointer", display: "inline-flex" }}>
        <Logo variant="horizontal" height={32} theme="gold" />
      </div>
      <div className="nav-actions">
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
          <Button className="lang-dropdown-btn" icon={<GlobalOutlined />}>
            <span style={{ marginRight: 6 }}>{currentLang.toUpperCase()}</span> <DownOutlined style={{ fontSize: "10px" }} />
          </Button>
        </Dropdown>
      </div>
    </header>
  );
}
