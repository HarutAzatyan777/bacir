import React, { useState } from "react";
import "./ContactForm.css";
import { useLanguage } from "../../context/LanguageContext"; // Ներմուծում ենք context-ը

const translations = {
  am: {
    title: "Մեծ ուրախությամբ ցանկանում ենք Ձեզ հետ կիսել մեր կյանքի ամենագեղեցիկ ու հիշարժան պահը։",
    intro: "Սիրով հրավիրում ենք Ձեզ լինել մեր կողքին և միասին տոնել այս յուրահատուկ օրը։ Ձեզ հետ բերեք սեր, ժպիտներ ու անսահման դրական էմոցիաներ, ինչպես նաև հարմարավետ կոշիկներ՝ պարելու համար։",
    thanksTitle: "Շնորհակալություն, Ձեր պատասխանը գրանցվել է։",
    thanksSub: "Մոտ ժամանակում կապ կհաստատենք Ձեզ հետ։",
    dressCodeHint: "Թույլ տանք, որ այդ օրը սպիտակ զգեստով լինի միայն հարսնացուն 🤍",
    nameLabel: "Անուն, ազգանուն",
    namePlaceholder: "Ձեր ամբողջ անունը",
    guestsLabel: "Հրավիրված անձանց թվաքանակ",
    rsvpLegend: "Կկարողանա՞ք ներկա գտնվել միջոցառմանը",
    rsvpYes: "Այո, կգամ",
    rsvpNo: "Ցավոք, չեմ կարողանա",
    invitedByLabel: "Ու՞մ կողմից եք հրավիրված",
    invitedByPlaceholder: "Ում անունով եք հրավիրված",
    guestsHeader: "Հյուրերի անունները",
    addGuest: "+ Ավելացնել",
    guestPlaceholder: "Հյուրի անունը",
    hint: "Մուտքագրեք հավելյալ հյուրերի անունները (եթե ունեք)",
    messageLabel: "Ավելացուցիչ հաղորդագրություն (օպցիոնալ)",
    messagePlaceholder: "Հաղորդագրություն՝ հատուկ ցանկություններ կամ դիտողություններ",
    submit: "Ուղարկել",
    alertName: "Խնդրում ենք լրացնել Ձեր անունը:",
    alertRsvp: "Խնդրում ենք ընտրել՝ արդյոք կմասնակցեք միջոցառմանը:"
  },
  ru: {
    title: "С большой радостью хотим разделить с вами самый красивый и памятный момент нашей жизни.",
    intro: "С любовью приглашаем вас быть рядом с нами и вместе отпраздновать этот особенный день. Приносите с собой любовь, улыбки и бесконечные положительные эмоции, а также удобную обувь для танцев.",
    thanksTitle: "Спасибо, ваш ответ зарегистрирован!",
    thanksSub: "Мы свяжемся с вами в ближайшее время.",
    dressCodeHint: "Пусть в этот день в белом платье будет только невеста 🤍",
    nameLabel: "Имя, Фамилия",
    namePlaceholder: "Ваше полное имя",
    guestsLabel: "Количество приглашенных",
    rsvpLegend: "Сможете ли вы присутствовать на мероприятии?",
    rsvpYes: "Да, приду",
    rsvpNo: "К сожалению, не смогу",
    invitedByLabel: "Кем вы приглашены?",
    invitedByPlaceholder: "Имя того, кто вас пригласил",
    guestsHeader: "Имена гостей",
    addGuest: "+ Добавить",
    guestPlaceholder: "Имя гостя",
    hint: "Введите имена дополнительных гостей (если есть)",
    messageLabel: "Дополнительное сообщение (опционально)",
    messagePlaceholder: "Ваши пожелания или замечания",
    submit: "Отправить",
    alertName: "Пожалуйста, введите ваше имя.",
    alertRsvp: "Пожалуйста, выберите, сможете ли вы присутствовать."
  },
  en: {
    title: "It is with great joy that we want to share with you the most beautiful and memorable moment of our lives.",
    intro: "We lovingly invite you to be by our side and celebrate this special day together. Bring love, smiles, and endless positive emotions, as well as comfortable shoes for dancing.",
    thanksTitle: "Thank you, your response has been registered.",
    thanksSub: "We will contact you shortly.",
    dressCodeHint: "Let the bride be the only one in a white dress on that day 🤍",
    nameLabel: "First and Last Name",
    namePlaceholder: "Your full name",
    guestsLabel: "Number of invited guests",
    rsvpLegend: "Will you be able to attend the event?",
    rsvpYes: "Yes, I will attend",
    rsvpNo: "Unfortunately, I will not be able to",
    invitedByLabel: "Who invited you?",
    invitedByPlaceholder: "Name of the person who invited you",
    guestsHeader: "Guest names",
    addGuest: "+ Add Guest",
    guestPlaceholder: "Guest name",
    hint: "Enter names of additional guests (if any)",
    messageLabel: "Additional message (optional)",
    messagePlaceholder: "Message: special wishes or notes",
    submit: "Send",
    alertName: "Please enter your name.",
    alertRsvp: "Please select whether you will attend the event."
  }
};

export default function ContactForm() {
  const { currentLang } = useLanguage();
  const t = translations[currentLang];

  const [fullName, setFullName] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [rsvp, setRsvp] = useState("");
  const [invitedBy, setInvitedBy] = useState("");
  const [guestNames, setGuestNames] = useState([]); // Դատարկ սկզբնական արժեք
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleAddGuest() {
    setGuestNames(prev => [...prev, ""]);
  }

  function handleGuestChange(index, value) {
    setGuestNames(prev => prev.map((g, i) => (i === index ? value : g)));
  }

  function handleRemoveGuest(index) {
    setGuestNames(prev => prev.filter((_, i) => i !== index));
  }

  function validate() {
    if (!fullName.trim()) {
      alert(t.alertName);
      return false;
    }
    if (!rsvp) {
      alert(t.alertRsvp);
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    // Մաքրում և միավորում ենք բոլոր անունները մեկ տողում
    const validGuestNames = guestNames.map(n => n.trim()).filter(Boolean);
    const allNames = [fullName, ...validGuestNames].join(", ");
    const attendanceText = rsvp === "yes" ? t.rsvpYes : t.rsvpNo;

    // Կազմում ենք այն վերջնական տեքստը, որը կգնա Տելեգրամ
    const botMessage = 
      `✨ Նոր պատասխան (Contact Form) ✨\n\n` +
      `👤 Անուն(ներ): ${allNames}\n` +
      `✅ Ներկայություն: ${attendanceText}\n` +
      `👨‍👩‍👧‍👦 Քանակ: ${guestsCount}\n` +
      `💌 Հրավիրված է: ${invitedBy || 'Նշված չէ'}\n` +
      `📝 Հաղորդագրություն: ${message || 'Նշված չէ'}`;

    try {
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: botMessage }),
      });

      if (!response.ok) throw new Error('Network response error');

      setSubmitted(true);

      setTimeout(() => {
        setFullName("");
        setGuestsCount(1);
        setRsvp("");
        setInvitedBy("");
        setGuestNames([]);
        setMessage("");
      }, 800);
    } catch (error) {
      console.error('Error:', error);
      alert("Տեղի ունեցավ սխալ: Խնդրում ենք փորձել կրկին:");
    }
  }

  return (
    <div className="contact-form-wrap">
      <h2 className="cf-title">{t.title}</h2>
      <p className="cf-intro">{t.intro}</p>

      {submitted ? (
        <div className="cf-thanks">
          <h3>{t.thanksTitle}</h3>
          <p>{t.thanksSub}</p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            <span className="label" style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
              {t.dressCodeHint}
            </span>
          </label>

          <label>
            {t.nameLabel}
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.namePlaceholder}
              required
            />
          </label>

          <label>
            {t.guestsLabel}
            <input
              type="number"
              min="1"
              value={guestsCount}
              onChange={(e) => setGuestsCount(parseInt(e.target.value || "1"))}
            />
          </label>

          <fieldset className="rsvp-group">
            <legend>{t.rsvpLegend}</legend>
            <label className="radio">
              <input
                type="radio"
                name="rsvp"
                value="yes"
                checked={rsvp === "yes"}
                onChange={() => setRsvp("yes")}
              />
              {t.rsvpYes}
            </label>

            <label className="radio">
              <input
                type="radio"
                name="rsvp"
                value="no"
                checked={rsvp === "no"}
                onChange={() => setRsvp("no")}
              />
              {t.rsvpNo}
            </label>
          </fieldset>

          <label>
            {t.invitedByLabel}
            <input
              type="text"
              value={invitedBy}
              onChange={(e) => setInvitedBy(e.target.value)}
              placeholder={t.invitedByPlaceholder}
            />
          </label>

          <div className="guest-names">
            <div className="guest-names-header">
              <span>{t.guestsHeader}</span>
              <button type="button" className="add-guest" onClick={handleAddGuest}>
                {t.addGuest}
              </button>
            </div>

            {guestNames.map((name, idx) => (
              <div className="guest-row" key={idx}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleGuestChange(idx, e.target.value)}
                  placeholder={`${t.guestPlaceholder} #${idx + 1}`}
                />
                <button type="button" className="remove" onClick={() => handleRemoveGuest(idx)}>
                  ✕
                </button>
              </div>
            ))}
            <small className="hint">{t.hint}</small>
          </div>

          <label>
            {t.messageLabel}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.messagePlaceholder}
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="submit-btn">{t.submit}</button>
          </div>
        </form>
      )}
    </div>
  );
}