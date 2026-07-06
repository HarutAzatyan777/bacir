import React from "react";

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
  return (
    <div className="tab-pane">
      <h3>Հաստատում (RSVP) & Ինտեգրումներ</h3>
      <div className="form-grid">
        <div className="form-field">
          <label>RSVP Վերջնաժամկետ (Deadline Date)</label>
          <input
            type="date"
            value={rsvpDeadline}
            onChange={(e) => setRsvpDeadline(e.target.value)}
          />
        </div>

        <div className="form-field full-width">
          <label>Հրավիրողներ (Hosts)</label>
          <div className="host-creator-row">
            <input
              type="text"
              placeholder="ID (օր.՝ robert)"
              value={newHostId}
              onChange={(e) => setNewHostId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Անուն AM (օր.՝ Ռոբերտ)"
              value={newHostAm}
              onChange={(e) => setNewHostAm(e.target.value)}
            />
            <input
              type="text"
              placeholder="Անուն RU (օր.՝ Роберт)"
              value={newHostRu}
              onChange={(e) => setNewHostRu(e.target.value)}
            />
            <input
              type="text"
              placeholder="Անուն EN (օր.՝ Robert)"
              value={newHostEn}
              onChange={(e) => setNewHostEn(e.target.value)}
            />
            <button type="button" className="add-host-btn" onClick={handleAddHost}>
              + Ավելացնել
            </button>
          </div>

          <div className="hosts-table-container">
            <table className="hosts-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Անուն AM</th>
                  <th>Անուն RU</th>
                  <th>Անուն EN</th>
                  <th>Գործողություն</th>
                </tr>
              </thead>
              <tbody>
                {hosts.map((h) => (
                  <tr key={h.id}>
                    <td>{h.id}</td>
                    <td>{h.am}</td>
                    <td>{h.ru}</td>
                    <td>{h.en || h.am}</td>
                    <td>
                      <button
                        type="button"
                        className="delete-row-btn"
                        onClick={() => handleRemoveHost(h.id)}
                      >
                        Ջնջել
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="form-divider full-width" />

        <div className="form-field">
          <label>Telegram Bot Token</label>
          <input
            type="password"
            placeholder="123456789:ABCdefGh..."
            value={telegramBotToken}
            onChange={(e) => setTelegramBotToken(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Telegram Chat ID</label>
          <input
            type="text"
            placeholder="-10012345678"
            value={telegramChatId}
            onChange={(e) => setTelegramChatId(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
