import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { collection, getDocs } from "firebase/firestore";
import { auth, db, functions } from "../../firebase";
import { Card, Table, Tag, Input, Button, Popconfirm, Tabs, Spin, Typography, message } from "antd";
import { SafetyCertificateOutlined, CrownOutlined, UserOutlined } from "@ant-design/icons";
import "./SuperAdminDashboard.css";

const { Title, Text, Paragraph } = Typography;

export default function SuperAdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  
  // Data States
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  
  // Loading States
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // stores userUid or invitationId

  // Coin Adjustment inputs state
  const [coinAdjustments, setCoinAdjustments] = useState({}); // { uid: amount }

  const navigate = useNavigate();

  // 1. Verify admin claims on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/admin/login");
        setAuthLoading(false);
        return;
      }

      try {
        const idTokenResult = await getIdTokenResult(user, true);
        if (idTokenResult.claims.admin === true) {
          setIsAdmin(true);
          // Initial data fetch
          fetchData();
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Error getting ID token claims:", err);
        message.error("Հեղինակավորման սխալ / Authentication error.");
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users via Cloud Function
      const getAllUsersFn = httpsCallable(functions, "getAllUsers");
      const usersRes = await getAllUsersFn();
      if (usersRes.data && usersRes.data.success) {
        setUsers(usersRes.data.users);
      }

      // Fetch invitations directly from Firestore (read is public)
      const querySnapshot = await getDocs(collection(db, "invitations"));
      const invs = [];
      querySnapshot.forEach((doc) => {
        invs.push({ id: doc.id, ...doc.data() });
      });
      setInvitations(invs);
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
      message.error(err.message || "Տվյալների բեռնման սխալ / Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleUpdateCoins = async (targetUid) => {
    const amount = parseInt(coinAdjustments[targetUid], 10);
    if (!amount || isNaN(amount)) {
      message.warning("Խնդրում ենք մուտքագրել վավեր թիվ / Please enter a valid number.");
      return;
    }

    setActionLoading(targetUid);

    try {
      const updateCoinsFn = httpsCallable(functions, "updateUserCoins");
      const res = await updateCoinsFn({ targetUid, coinAmount: amount });

      if (res.data && res.data.success) {
        message.success(res.data.message);
        // Refresh data
        await fetchData();
        // Clear input
        setCoinAdjustments(prev => ({ ...prev, [targetUid]: "" }));
      }
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to update coins.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (targetUid, email) => {
    setActionLoading(targetUid);

    try {
      const deleteUserFn = httpsCallable(functions, "deleteUserAccount");
      const res = await deleteUserFn({ targetUid });

      if (res.data && res.data.success) {
        message.success(res.data.message);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to delete user.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteInvitation = async (invitationId) => {
    setActionLoading(invitationId);

    try {
      const deleteInvFn = httpsCallable(functions, "deletePlatformInvitation");
      const res = await deleteInvFn({ invitationId });

      if (res.data && res.data.success) {
        message.success(res.data.message);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to delete invitation.");
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading) {
    return (
      <div className="admin-dashboard-container">
        <Card className="admin-dashboard-card loading-card" bordered={false}>
          <Spin size="large" />
          <Text style={{ marginTop: 16 }}>Ստուգվում են իրավունքները / Verifying Admin Claims...</Text>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-dashboard-container">
        <Card className="admin-dashboard-card error-card" bordered={false}>
          <Title level={3} danger style={{ marginTop: 0 }}>Մերժված Հասանելիություն / Access Denied</Title>
          <Paragraph>Դուք չունեք այս էջը դիտելու համապատասխան իրավունքներ։</Paragraph>
          <Paragraph style={{ fontSize: "0.85rem", color: "#718096" }}>
            Only users with <code>{`{ admin: true }`}</code> claim can access this dashboard.
          </Paragraph>
          <Button type="primary" onClick={() => navigate("/profile")} style={{ backgroundColor: "#2c3e35" }}>
            Back to Profile
          </Button>
        </Card>
      </div>
    );
  }

  const userColumns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <Text>{text || "No Email"}</Text>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag 
          color={role === "admin" ? "purple" : "blue"}
          icon={role === "admin" ? <CrownOutlined /> : <UserOutlined />}
        >
          {(role || "user").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Coins",
      dataIndex: "coins",
      key: "coins",
      render: (coins) => <Text strong>{coins ?? 100}</Text>,
    },
    {
      title: "Manage Coins",
      key: "manageCoins",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Input 
            type="number"
            placeholder="+/- 50"
            value={coinAdjustments[record.uid] || ""}
            onChange={(e) => setCoinAdjustments(prev => ({
              ...prev,
              [record.uid]: e.target.value
            }))}
            style={{ width: "100px" }}
          />
          <Button 
            type="primary"
            onClick={() => handleUpdateCoins(record.uid)}
            loading={actionLoading === record.uid}
            style={{ backgroundColor: "#2c3e35" }}
          >
            Update
          </Button>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Համոզվա՞ծ եք, որ ցանկանում եք ջնջել այս օգտատիրոջ հաշիվը: Այս գործողությունը անդառնալի է: / Are you sure you want to delete this user?"
          onConfirm={() => handleDeleteUser(record.uid, record.email)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button 
            type="primary" 
            danger 
            loading={actionLoading === record.uid}
          >
            Delete User
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const invitationColumns = [
    {
      title: "Invitation ID (Slug)",
      dataIndex: "id",
      key: "id",
      render: (id) => <Text strong style={{ fontFamily: "monospace" }}>{id}</Text>,
    },
    {
      title: "Owner ID",
      dataIndex: "ownerId",
      key: "ownerId",
      render: (ownerId) => <Text style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{ownerId}</Text>,
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (isPublished) => (
        <Tag color={isPublished ? "success" : "warning"}>
          {isPublished ? "Published" : "Draft"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Համոզվա՞ծ եք, որ ցանկանում եք ջնջել այս հրավերը: / Are you sure you want to delete this invitation?"
          onConfirm={() => handleDeleteInvitation(record.id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button 
            type="primary" 
            danger 
            loading={actionLoading === record.id}
          >
            Delete Invitation
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const tabItems = [
    {
      key: "users",
      label: `👥 Users Management (${users.length})`,
      children: (
        <Table 
          dataSource={users} 
          columns={userColumns} 
          rowKey="uid" 
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      ),
    },
    {
      key: "invitations",
      label: `✉️ Invitations Management (${invitations.length})`,
      children: (
        <Table 
          dataSource={invitations} 
          columns={invitationColumns} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      ),
    },
  ];

  return (
    <div className="admin-dashboard-container">
      <Card className="admin-dashboard-card" bordered={false}>
        <div className="admin-dashboard-header">
          <Title level={2} style={{ margin: 0 }}>Super Admin Dashboard</Title>
          <Text type="secondary">Պլատֆորմի կառավարման վահանակ / SaaS Platform Control Center</Text>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          items={tabItems} 
          style={{ marginTop: 20 }}
        />
      </Card>
    </div>
  );
}
