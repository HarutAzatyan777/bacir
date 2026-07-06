import React from "react";
import ImageUpload from "../ImageUpload";

export default function CalendarLocationTab({
  eventDate,
  setEventDate,
  calBgFile,
  setCalBgFile,
  calBgUrl,
  setCalBgUrl,
  calTitleAm,
  setCalTitleAm,
  calTitleRu,
  setCalTitleRu,
  calTitleEn,
  setCalTitleEn,
  calIntroAm,
  setCalIntroAm,
  calIntroRu,
  setCalIntroRu,
  calIntroEn,
  setCalIntroEn,
  calInviteAm,
  setCalInviteAm,
  calInviteRu,
  setCalInviteRu,
  calInviteEn,
  setCalInviteEn,
  showChurch,
  setShowChurch,
  showParty,
  setShowParty,
  churchTitleAm,
  setChurchTitleAm,
  churchTitleRu,
  setChurchTitleRu,
  churchTitleEn,
  setChurchTitleEn,
  churchNameAm,
  setChurchNameAm,
  churchNameRu,
  setChurchNameRu,
  churchNameEn,
  setChurchNameEn,
  churchAddr1Am,
  setChurchAddr1Am,
  churchAddr1Ru,
  setChurchAddr1Ru,
  churchAddr1En,
  setChurchAddr1En,
  churchAddr2Am,
  setChurchAddr2Am,
  churchAddr2Ru,
  setChurchAddr2Ru,
  churchAddr2En,
  setChurchAddr2En,
  churchTime,
  setChurchTime,
  churchMapLink,
  setChurchMapLink,
  partyTitleAm,
  setPartyTitleAm,
  partyTitleRu,
  setPartyTitleRu,
  partyTitleEn,
  setPartyTitleEn,
  partyNameAm,
  setPartyNameAm,
  partyNameRu,
  setPartyNameRu,
  partyNameEn,
  setPartyNameEn,
  partyAddrExtraAm,
  setPartyAddrExtraAm,
  partyAddrExtraRu,
  setPartyAddrExtraRu,
  partyAddrExtraEn,
  setPartyAddrExtraEn,
  partyAddr1Am,
  setPartyAddr1Am,
  partyAddr1Ru,
  setPartyAddr1Ru,
  partyAddr1En,
  setPartyAddr1En,
  partyAddr2Am,
  setPartyAddr2Am,
  partyAddr2Ru,
  setPartyAddr2Ru,
  partyAddr2En,
  setPartyAddr2En,
  partyTime,
  setPartyTime,
  partyMapLink,
  setPartyMapLink,
  locBgFile,
  setLocBgFile,
  locBgUrl,
  setLocBgUrl
}) {
  return (
    <div className="tab-pane">
      <h3>Օրացույց / Calendar</h3>
      <div className="form-grid">
        <div className="form-field">
          <label>Ամսաթիվ և Ժամ (Event Date & Time)</label>
          <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
        </div>
        <div className="form-field">
          <ImageUpload
            label="Օրացույցի ֆոնային նկար"
            file={calBgFile}
            setFile={setCalBgFile}
            url={calBgUrl}
            setUrl={setCalBgUrl}
            dimensionsInfo="Խորհուրդ է տրվում՝ 1200 x 800px"
          />
        </div>

        <div className="form-field">
          <label>Վերնագիր AM</label>
          <input type="text" value={calTitleAm} onChange={(e) => setCalTitleAm(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Վերնագիր RU</label>
          <input type="text" value={calTitleRu} onChange={(e) => setCalTitleRu(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Վերնագիր EN</label>
          <input type="text" value={calTitleEn} onChange={(e) => setCalTitleEn(e.target.value)} />
        </div>

        <div className="form-field">
          <label>Ներածություն AM</label>
          <textarea value={calIntroAm} onChange={(e) => setCalIntroAm(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Ներածություն RU</label>
          <textarea value={calIntroRu} onChange={(e) => setCalIntroRu(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Ներածություն EN</label>
          <textarea value={calIntroEn} onChange={(e) => setCalIntroEn(e.target.value)} />
        </div>

        <div className="form-field">
          <label>Հրավեր տեքստ AM</label>
          <textarea value={calInviteAm} onChange={(e) => setCalInviteAm(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Հրավեր տեքստ RU</label>
          <textarea value={calInviteRu} onChange={(e) => setCalInviteRu(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Հրավեր տեքստ EN</label>
          <textarea value={calInviteEn} onChange={(e) => setCalInviteEn(e.target.value)} />
        </div>
      </div>

      <hr className="form-divider" />

      <div className="form-grid" style={{ marginBottom: "25px", gridTemplateColumns: "1fr 1fr" }}>
        <div className="form-field" style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            id="showChurchCheckbox"
            checked={showChurch}
            onChange={(e) => setShowChurch(e.target.checked)}
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
          <label htmlFor="showChurchCheckbox" style={{ margin: 0, cursor: "pointer", fontWeight: "bold", color: "#2c3e35" }}>
            Ցուցադրել Եկեղեցու բաժինը / Показать раздел Церкви / Show Church
          </label>
        </div>
        <div className="form-field" style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            id="showPartyCheckbox"
            checked={showParty}
            onChange={(e) => setShowParty(e.target.checked)}
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
          <label htmlFor="showPartyCheckbox" style={{ margin: 0, cursor: "pointer", fontWeight: "bold", color: "#2c3e35" }}>
            Ցուցադրել Ռեստորանի բաժինը / Показать раздел Ресторана / Show Reception
          </label>
        </div>
      </div>

      <hr className="form-divider" />

      {showChurch && (
        <>
          <h3>Եկեղեցու Արարողություն / Church</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Վերնագիր (օր.՝ ԵԿԵՂԵՑԻ)</label>
              <input type="text" value={churchTitleAm} onChange={(e) => setChurchTitleAm(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Վերնագիր RU</label>
              <input type="text" value={churchTitleRu} onChange={(e) => setChurchTitleRu(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Վերնագիր EN</label>
              <input type="text" value={churchTitleEn} onChange={(e) => setChurchTitleEn(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Եկեղեցու անուն AM</label>
              <input type="text" value={churchNameAm} onChange={(e) => setChurchNameAm(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Եկեղեցու անուն RU</label>
              <input type="text" value={churchNameRu} onChange={(e) => setChurchNameRu(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Եկեղեցու անուն EN</label>
              <input type="text" value={churchNameEn} onChange={(e) => setChurchNameEn(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Հասցե տող 1 AM</label>
              <input type="text" value={churchAddr1Am} onChange={(e) => setChurchAddr1Am(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Հասցե տող 1 RU</label>
              <input type="text" value={churchAddr1Ru} onChange={(e) => setChurchAddr1Ru(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Հասցե տող 1 EN</label>
              <input type="text" value={churchAddr1En} onChange={(e) => setChurchAddr1En(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Հասցե տող 2 AM</label>
              <input type="text" value={churchAddr2Am} onChange={(e) => setChurchAddr2Am(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Հասցե տող 2 RU</label>
              <input type="text" value={churchAddr2Ru} onChange={(e) => setChurchAddr2Ru(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Հասցե տող 2 EN</label>
              <input type="text" value={churchAddr2En} onChange={(e) => setChurchAddr2En(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Ժամ (օր.՝ 15:00)</label>
              <input type="text" value={churchTime} onChange={(e) => setChurchTime(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Քարտեզի հղում (Google Maps Link)</label>
              <input type="text" value={churchMapLink} onChange={(e) => setChurchMapLink(e.target.value)} />
            </div>
          </div>
          <hr className="form-divider" />
        </>
      )}

      {showParty && (
        <>
          <h3>Ռեստորան / Party</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Վերնագիր (օր.՝ ՌԵՍՏՈՐԱՆ)</label>
              <input type="text" value={partyTitleAm} onChange={(e) => setPartyTitleAm(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Վերնագիր RU</label>
              <input type="text" value={partyTitleRu} onChange={(e) => setPartyTitleRu(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Վերնագիր EN</label>
              <input type="text" value={partyTitleEn} onChange={(e) => setPartyTitleEn(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Ռեստորանի անուն AM</label>
              <input type="text" value={partyNameAm} onChange={(e) => setPartyNameAm(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Ռեստորանի անուն RU</label>
              <input type="text" value={partyNameRu} onChange={(e) => setPartyNameRu(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Ռեստորանի անուն EN</label>
              <input type="text" value={partyNameEn} onChange={(e) => setPartyNameEn(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Լրացուցիչ տեղեկություն (օր.՝ Նոր Դվին) AM</label>
              <input type="text" value={partyAddrExtraAm} onChange={(e) => setPartyAddrExtraAm(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Լրացուցիչ տեղեկություն RU</label>
              <input type="text" value={partyAddrExtraRu} onChange={(e) => setPartyAddrExtraRu(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Լրացուցիչ տեղեկություն EN</label>
              <input type="text" value={partyAddrExtraEn} onChange={(e) => setPartyAddrExtraEn(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Հասցե տող 1 AM</label>
              <input type="text" value={partyAddr1Am} onChange={(e) => setPartyAddr1Am(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Հասցե տող 1 RU</label>
              <input type="text" value={partyAddr1Ru} onChange={(e) => setPartyAddr1Ru(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Հասցե տող 1 EN</label>
              <input type="text" value={partyAddr1En} onChange={(e) => setPartyAddr1En(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Հասցե տող 2 AM</label>
              <input type="text" value={partyAddr2Am} onChange={(e) => setPartyAddr2Am(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Հասցե տող 2 RU</label>
              <input type="text" value={partyAddr2Ru} onChange={(e) => setPartyAddr2Ru(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Հասցե տող 2 EN</label>
              <input type="text" value={partyAddr2En} onChange={(e) => setPartyAddr2En(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Ժամ (օր.՝ 17:30)</label>
              <input type="text" value={partyTime} onChange={(e) => setPartyTime(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Քարտեզի հղում (Google Maps Link)</label>
              <input type="text" value={partyMapLink} onChange={(e) => setPartyMapLink(e.target.value)} />
            </div>
          </div>
          <hr className="form-divider" />
        </>
      )}

      <div className="form-grid" style={{ marginTop: "20px" }}>
        <div className="form-field">
          <ImageUpload
            label="Տեղանքի բաժնի ֆոնային նկար"
            file={locBgFile}
            setFile={setLocBgFile}
            url={locBgUrl}
            setUrl={setLocBgUrl}
            dimensionsInfo="Խորհուրդ է տրվում՝ 1200 x 800px"
          />
        </div>
      </div>
    </div>
  );
}
