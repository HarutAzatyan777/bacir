import React, { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import { Button, message } from "antd";
import { CrownOutlined } from "@ant-design/icons";
import "./MakeMeAdminButton.css";

export default function MakeMeAdminButton() {
  const [loading, setLoading] = useState(false);

  const handleMakeAdmin = async () => {
    setLoading(true);

    try {
      const setupAdminFn = httpsCallable(functions, "setupSuperAdmin");
      const result = await setupAdminFn();

      if (result.data && result.data.success) {
        message.success("Հաջողություն / Success: " + result.data.message);
      }
    } catch (err) {
      console.error(err);
      message.error(err.message || "Սխալ տեղի ունեցավ / An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-setup-container" style={{ marginTop: 20 }}>
      <Button 
        type="dashed"
        danger
        icon={<CrownOutlined />}
        onClick={handleMakeAdmin} 
        loading={loading}
        className="make-admin-btn"
        size="large"
        block
      >
        Դառնալ Ադմինիստրատոր / Make Me Admin
      </Button>
    </div>
  );
}
