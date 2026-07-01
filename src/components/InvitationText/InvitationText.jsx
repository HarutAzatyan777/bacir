import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./InvitationText.css";
import { useLanguage } from "../../context/LanguageContext";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const translations = {
  am: {
    confirmTitle: "Խնդրում ենք հաստատել Ձեր ներկայությունը մինչև Մայիսի 25-ը։",
    nameLabel: "Անուն Ազգանուն",
    guestsLabel: "Հյուրերի քանակ",
    maxGuestsHint: "Մինչև 20 հյուր թույլատրվում է",
    attendanceLabel: "Կկարողանա՞ք ներկա գտնվել",
    yes: "Այո, կգամ",
    no: "Ցավոք, ոչ",
    invitedByLabel: "Ու՞մ կողմից եք հրավիրված",
    submitBtn: "Ուղարկել",
    submittingBtn: "Ուղարկվում է...",
    successMsg: "Շնորհակալություն, Ձեր պատասխանը հաջողությամբ ուղարկվեց։",
    errorMsg: "Սխալ տեղի ունեցավ։ Խնդրում ենք փորձել մի փոքր ուշ։",
    waName: "Անուն",
    waAttendance: "Ներկայություն",
    waGuests: "Քանակ",
    waInvitedBy: "Հրավիրված՝",
    waYes: "Այո",
    waNo: "Ոչ",
    alertName: "Խնդրում ենք լրացնել գոնե մեկ անուն։",
    optional: "(ոչ պարտադիր)",
    robert: "Ռոբերտ",
    lusine: "Լուսինե"
  },
  ru: {
    confirmTitle: "Пожалуйста, подтвердите присутствие до 25 мая.",
    nameLabel: "Имя Фамилия",
    guestsLabel: "Количество гостей",
    maxGuestsHint: "До 20 гостей",
    attendanceLabel: "Сможете ли вы присутствовать?",
    yes: "Да, приду",
    no: "К сожалению, нет",
    invitedByLabel: "Кем вы приглашены?",
    submitBtn: "Отправить",
    submittingBtn: "Отправка...",
    successMsg: "Спасибо, ваш ответ успешно отправлен!",
    errorMsg: "Произошла ошибка. Пожалуйста, попробуйте позже.",
    waName: "Имя",
    waAttendance: "Присутствие",
    waGuests: "Кол-во",
    waInvitedBy: "От имени",
    waYes: "Да",
    waNo: "Нет",
    alertName: "Пожалуйста, введите хотя бы одно имя.",
    optional: "(необязательно)",
    robert: "Роберт",
    lusine: "Лусине"
  },
  en: {
    confirmTitle: "Please confirm your attendance by May 25.",
    nameLabel: "First and Last Name",
    guestsLabel: "Number of guests",
    maxGuestsHint: "Up to 20 guests allowed",
    attendanceLabel: "Will you be able to attend?",
    yes: "Yes, I will attend",
    no: "Unfortunately, no",
    invitedByLabel: "Who invited you?",
    submitBtn: "Send",
    submittingBtn: "Sending...",
    successMsg: "Thank you, your response has been successfully sent.",
    errorMsg: "An error occurred. Please try again later.",
    waName: "Name",
    waAttendance: "Attendance",
    waGuests: "Quantity",
    waInvitedBy: "Invited by:",
    waYes: "Yes",
    waNo: "No",
    alertName: "Please enter at least one name.",
    optional: "(optional)",
    robert: "Robert",
    lusine: "Lusine"
  }
};

export default function InvitationText({ rsvpData, invitationId }) {
  const { currentLang } = useLanguage();
  const t = translations[currentLang];

  const hosts = rsvpData?.hosts || [
    { id: "robert", am: "Ռոբերտ", ru: "Роберт" },
    { id: "lusine", am: "Լուսինե", ru: "Лусине" }
  ];

  const [formData, setFormData] = useState({
    names: [""],
    attendance: "yes", // Նախնական արժեք կարող ենք դնել "yes"
    invitedBy: hosts[0]?.id || "robert",
    guests: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleNameChange = (index, value) => {
    const newNames = [...formData.names];
    newNames[index] = value;
    setFormData((prev) => ({ ...prev, names: newNames }));
  };

  const handleGuestChange = (newCount) => {
    setFormData((prev) => {
      const newNames = [...prev.names];
      if (newCount > newNames.length) {
        for (let i = newNames.length; i < newCount; i++) newNames.push("");
      } else if (newCount < newNames.length) {
        newNames.length = newCount;
      }
      return { ...prev, guests: newCount, names: newNames };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.names.some(n => n.trim() !== "")) {
      alert(t.alertName);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    // Save to Firestore if invitationId is available
    if (invitationId) {
      try {
        const responsesCol = collection(db, "invitations", invitationId, "responses");
        await addDoc(responsesCol, {
          names: formData.names.filter(n => n.trim() !== ""),
          attendance: formData.attendance,
          invitedBy: formData.invitedBy,
          guests: formData.guests,
          submittedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Error saving RSVP to Firestore:", err);
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }
    }

    const selectedHost = hosts.find(h => h.id === formData.invitedBy);
    const invitedByValue = selectedHost 
      ? (selectedHost[currentLang] || selectedHost.am) 
      : formData.invitedBy;

    const attendanceValue = formData.attendance === "yes" ? t.waYes : t.waNo;
    const namesString = formData.names.filter(n => n.trim() !== "").join(", ");

    const message =
      `✨ Նոր պատասխան հրավերի ✨\n\n` +
      `👤 ${t.waName}: ${namesString}\n` +
      `✅ ${t.waAttendance}: ${attendanceValue}\n` +
      `👨‍👩‍👧‍👦 ${t.waGuests}: ${formData.guests}\n` +
      `💌 ${t.waInvitedBy}: ${invitedByValue}`;

    const apiEndpoint = "/api/sendMessage"; 

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, invitationId }), // Send invitationId for dynamic Telegram routing
      });

      if (!response.ok) throw new Error('Network response error');

      setSubmitStatus('success');
      setFormData({ names: [""], attendance: "yes", invitedBy: hosts[0]?.id || "robert", guests: 1 });
      setTimeout(() => setSubmitStatus(null), 5000);

    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic deadline text
  let displayDeadline = "Մայիսի 25-ը";
  let displayDeadlineRu = "25 мая";
  let displayDeadlineEn = "May 25";
  if (rsvpData?.deadline) {
    try {
      const deadlineDate = new Date(rsvpData.deadline);
      const monthsAm = ["Հունվարի", "Փետրվարի", "Մարտի", "Ապրիլի", "Մայիսի", "Հունիսի", "Հուլիսի", "Օգոստոսի", "Սեպտեմբերի", "Հոկտեմբերի", "Նոյեմբերի", "Դեկտեմբերի"];
      const monthsRu = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
      const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const day = deadlineDate.getDate();
      const monthIndex = deadlineDate.getMonth();
      displayDeadline = `${monthsAm[monthIndex]} ${day}-ը`;
      displayDeadlineRu = `${day} ${monthsRu[monthIndex]}`;
      displayDeadlineEn = `${monthsEn[monthIndex]} ${day}`;
    } catch (e) {
      console.error(e);
    }
  }

  const confirmTitleText = currentLang === "ru" 
    ? `Пожалуйста, подтвердите присутствие до ${displayDeadlineRu}.` 
    : currentLang === "en"
    ? `Please confirm your attendance by ${displayDeadlineEn}.`
    : `Խնդրում ենք հաստատել Ձեր ներկայությունը մինչև ${displayDeadline}։`;

  return (
    <motion.div
      className="invitation-text"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ color: '#333' }}
      >
        {confirmTitleText}
      </motion.h2>

      <AnimatePresence mode="wait">
        {submitStatus === 'success' ? (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              marginTop: '20px'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✨</div>
            <h3 style={{ color: '#2c3e35', fontSize: '1.3rem', margin: 0, lineHeight: '1.5' }}>
              {t.successMsg}
            </h3>
          </motion.div>
        ) : (
          <motion.form
            key="invitation-form"
            className="invitation-form"
            onSubmit={handleSubmit}
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            {formData.names.map((name, index) => (
              <label key={index} className="form-label" style={{ color: '#333', fontWeight: 'bold', marginTop: index > 0 ? '15px' : '0' }}>
                <span className="label-text">
                  {t.nameLabel} {formData.guests > 1 ? index + 1 : ""}
                  {index > 0 && <span style={{ fontSize: '0.85em', color: '#666', fontWeight: 'normal', marginLeft: '5px' }}>{t.optional}</span>}
                </span>
                <input
                  className="input-ios"
                  type="text"
                  placeholder={t.nameLabel}
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  style={{ color: '#333', border: '1px solid #999', backgroundColor: '#fff' }}
                />
              </label>
            ))}

            <div className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>
              <span className="label-text">{t.guestsLabel}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleGuestChange(Math.max(1, formData.guests - 1))}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
                >
                  -
                </button>
                <span style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center', color: '#333' }}>
                  {formData.guests}
                </span>
                <button
                  type="button"
                  onClick={() => handleGuestChange(Math.min(20, formData.guests + 1))}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Գեղեցիկ Segmented Control Ներկայության համար */}
            <div className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>
              <span className="label-text">{t.attendanceLabel}</span>
              <div className="radio-group">
                {["yes", "no"].map((option) => (
                  <div
                    key={option}
                    className={`segment ${formData.attendance === option ? "checked" : ""}`}
                    onClick={() => setFormData((p) => ({ ...p, attendance: option }))}
                  >
                    {formData.attendance === option && (
                      <motion.div layoutId="attendance-active" className="active-bg" />
                    )}
                    <span className="segment-text">{option === "yes" ? t.yes : t.no}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Գեղեցիկ Segmented Control Հրավիրողի համար (select-ի փոխարեն) */}
            <div className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>
              <span className="label-text">{t.invitedByLabel}</span>
              <div className="radio-group">
                {hosts.map((host) => (
                  <div
                    key={host.id}
                    className={`segment ${formData.invitedBy === host.id ? "checked" : ""}`}
                    onClick={() => setFormData((p) => ({ ...p, invitedBy: host.id }))}
                  >
                    {formData.invitedBy === host.id && (
                      <motion.div layoutId="invitedBy-active" className="active-bg" />
                    )}
                    <span className="segment-text">
                      {host[currentLang] || host.am}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {submitStatus === 'error' && <div className="form-error">{t.errorMsg}</div>}

            <motion.button
              className="motion-button"
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              disabled={isSubmitting}
              style={{ backgroundColor: '#2c3e35', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', width: '100%', marginTop: '20px' }}
            >
              {isSubmitting ? t.submittingBtn : t.submitBtn}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}