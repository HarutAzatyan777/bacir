import React, { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { Card, Table, Tag, Button, Spin, Statistic, Row, Col, Typography, Space } from "antd";
import { LeftOutlined, DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import "./RsvpList.css";

const { Title, Text } = Typography;

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
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" />
        <Text style={{ display: "block", marginTop: 16 }}>Բեռնվում է... / Loading RSVPs...</Text>
      </div>
    );
  }

  const columns = [
    {
      title: "Անուններ / Имена",
      dataIndex: "names",
      key: "names",
      render: (names) => (
        <Space wrap>
          {names ? names.map((name, i) => (
            <Tag key={i} color="geekblue" style={{ fontSize: "0.85rem" }}>{name}</Tag>
          )) : "-"}
        </Space>
      ),
    },
    {
      title: "Ներկայություն / Присутствие",
      dataIndex: "attendance",
      key: "attendance",
      render: (attendance) => (
        <Tag 
          color={attendance === "yes" ? "success" : "error"}
          icon={attendance === "yes" ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          style={{ fontSize: "0.85rem", padding: "4px 8px" }}
        >
          {attendance === "yes" ? "Այո / Да" : "Ոչ / Нет"}
        </Tag>
      ),
    },
    {
      title: "Քանակ / Кол-во",
      dataIndex: "guests",
      key: "guests",
      render: (guests) => <Text strong>{guests || 1}</Text>,
    },
    {
      title: "Հրավիրող / Кем приглашен",
      dataIndex: "invitedBy",
      key: "invitedBy",
      render: (invitedBy) => invitedBy || "-",
    },
    {
      title: "Ամսաթիվ / Дата",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (submittedAt) => submittedAt ? new Date(submittedAt).toLocaleString() : "-",
    },
  ];

  return (
    <div className="rsvp-container">
      <div className="rsvp-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <Title level={3} style={{ margin: 0 }}>RSVP Պատասխաններ / Ответы ({rsvps.length})</Title>
        <Space>
          <Button 
            type="primary"
            icon={<DownloadOutlined />} 
            onClick={exportToCSV} 
            disabled={rsvps.length === 0}
            style={{ backgroundColor: "#2c3e35" }}
          >
            Արտահանել Excel (CSV)
          </Button>
          <Button icon={<LeftOutlined />} onClick={onBack}>
            Հետ / Back
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "30px" }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stats-card">
            <Statistic 
              title="Մասնակցում են / Придут"
              value={stats.attending}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CheckCircleOutlined />}
              suffix="խումբ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stats-card">
            <Statistic 
              title="Ընդհանուր հյուրեր / Всего гостей"
              value={stats.totalGuests}
              valueStyle={{ color: "#d4af37" }}
              prefix={<UsergroupAddOutlined />}
              suffix="հոգի"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stats-card">
            <Statistic 
              title="Չեն մասնակցում / Не придут"
              value={stats.declined}
              valueStyle={{ color: "#cf1322" }}
              prefix={<CloseCircleOutlined />}
              suffix="խումբ"
            />
          </Card>
        </Col>
      </Row>

      {/* RSVP List Table */}
      <Card bordered={false}>
        <Table 
          dataSource={rsvps}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
          locale={{ emptyText: "Առայժմ ոչ մի պատասխան չկա: / No responses yet." }}
        />
      </Card>
    </div>
  );
}
