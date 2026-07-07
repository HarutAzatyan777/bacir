import React from "react";
import { Input, Button, Table, Divider, Typography, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function RsvpTelegramTab({
  rsvpDeadline,
  setRsvpDeadline,
  newHostId,
  setNewHostId,
  newHostAm,
  setNewHostAm,
  newHostRu,
  setNewHostRu,
  newHostEn,
  setNewHostEn,
  handleAddHost,
  hosts,
  handleRemoveHost,
  telegramBotToken,
  setTelegramBotToken,
  telegramChatId,
  setTelegramChatId
}) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "Անուն AM",
      dataIndex: "am",
      key: "am",
    },
    {
      title: "Անուն RU",
      dataIndex: "ru",
      key: "ru",
    },
    {
      title: "Անուն EN",
      dataIndex: "en",
      key: "en",
      render: (text, record) => text || record.am,
    },
    {
      title: "Գործողություն",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          danger
          type="primary"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveHost(record.id)}
        >
          Ջնջել
        </Button>
      ),
    },
  ];

  return (
    <div className="tab-pane">
      <Title level={4} style={{ color: "#2c3e35", marginBottom: 20 }}>RSVP & Telegram Settings</Title>
      <div className="form-grid">
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>RSVP Վերջնաժամկետ (Deadline Date)</label>
          <Input
            type="date"
            value={rsvpDeadline}
            onChange={(e) => setRsvpDeadline(e.target.value)}
            size="large"
          />
        </div>

        <div className="form-field full-width" style={{ marginTop: 10 }}>
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հրավիրողներ (Hosts)</label>
          <div className="host-creator-row" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
            <Input
              placeholder="ID (օր.՝ robert)"
              value={newHostId}
              onChange={(e) => setNewHostId(e.target.value)}
              style={{ width: "150px" }}
              size="large"
            />
            <Input
              placeholder="Անուն AM (օր.՝ Ռոբերտ)"
              value={newHostAm}
              onChange={(e) => setNewHostAm(e.target.value)}
              style={{ flex: 1, minWidth: "180px" }}
              size="large"
            />
            <Input
              placeholder="Անուն RU (օր.՝ Роберт)"
              value={newHostRu}
              onChange={(e) => setNewHostRu(e.target.value)}
              style={{ flex: 1, minWidth: "180px" }}
              size="large"
            />
            <Input
              placeholder="Անուն EN (օր.՝ Robert)"
              value={newHostEn}
              onChange={(e) => setNewHostEn(e.target.value)}
              style={{ flex: 1, minWidth: "180px" }}
              size="large"
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddHost}
              style={{ backgroundColor: "#2c3e35" }}
              size="large"
            >
              Ավելացնել
            </Button>
          </div>

          <div style={{ marginTop: 12 }}>
            <Table
              dataSource={hosts}
              columns={columns}
              rowKey="id"
              pagination={false}
              bordered
              size="small"
              locale={{ emptyText: "Հրավիրողներ դեռ չեն ավելացվել:" }}
            />
          </div>
        </div>

        <div className="form-field full-width" style={{ margin: "16px 0" }}>
          <Divider />
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Telegram Bot Token</label>
          <Input.Password
            placeholder="123456789:ABCdefGh..."
            value={telegramBotToken}
            onChange={(e) => setTelegramBotToken(e.target.value)}
            size="large"
          />
        </div>
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Telegram Chat ID</label>
          <Input
            placeholder="-10012345678"
            value={telegramChatId}
            onChange={(e) => setTelegramChatId(e.target.value)}
            size="large"
          />
        </div>
      </div>
    </div>
  );
}
