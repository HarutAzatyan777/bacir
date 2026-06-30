import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { 
  FaEnvelopeOpenText, 
  FaTelegramPlane, 
  FaMapMarkedAlt, 
  FaPalette, 
  FaImages, 
  FaCogs, 
  FaChevronRight, 
  FaCheckCircle
} from "react-icons/fa";
import "./LandingPage.css";

const translations = {
  am: {
    heroTitle: "Թվային Հրավերների Պրեմիում Հարթակ",
    heroSubtitle: "Ստեղծեք էլեգանտ և ինտերակտիվ հրավերներ ձեր հարսանիքի, ծննդյան կամ ցանկացած կարևոր միջոցառման համար: Զարմացրեք ձեր հյուրերին առաջին իսկ վայրկյանից:",
    viewDemo: "Դիտել Դեմոն",
    adminPanel: "Կառավարման Վահանակ",
    featuresTitle: "Հարթակի Հնարավորությունները",
    featuresSubtitle: "Ժամանակակից լուծումներ, որոնք էլեկտրոնային հրավերները դարձնում են արվեստի գործ",
    
    feat1Title: "3D Ծրարի Բացում",
    feat1Desc: "Ինտերակտիվ մոմե կնիքով ծրարի բացման անիմացիա, որը հաղորդում է իրական նամակի էմոցիաները:",
    feat2Title: "RSVP & Telegram Ինտեգրում",
    feat2Desc: "Հյուրերը հաստատում են իրենց մասնակցությունը, իսկ դուք ակնթարթորեն ստանում եք ծանուցում Telegram-ում:",
    feat3Title: "Երաժշտություն և Տեղանք",
    feat3Desc: "Հաճելի ֆոնային երաժշտություն և ինտերակտիվ քարտեզներ դեպի արարողությունների վայրերը:",
    feat4Title: "Դրեսս Կոդ (Dress Code)",
    feat4Desc: "Հյուրերին ներկայացրեք միջոցառման գունային գամման՝ գեղեցիկ գունային ներդաշնակության համար:",
    feat5Title: "Ֆոտոսրահ (Gallery)",
    feat5Desc: "Կիսվեք ձեր լավագույն նկարներով անմիջապես հրավերի էջում՝ ստեղծելով տրամադրություն:",
    feat6Title: "Հարմարավետ Ադմինիստրացիա",
    feat6Desc: "Ստեղծեք, խմբագրեք հրավերները և արտահանեք հյուրերի ամբողջական ցուցակը Excel (CSV) ձևաչափով:",

    howItWorksTitle: "Ինչպե՞ս է այն աշխատում",
    step1Title: "1. Գրանցեք Հասցեն (Slug)",
    step1Desc: "Ընտրեք անհատական հղում ձեր հրավերի համար (օրինակ՝ /i/robert-lusine):",
    step2Title: "2. Լրացրեք Տվյալները",
    step2Desc: "Մուտքագրեք ժամերը, վայրերը, ընտրեք երաժշտությունը և վերբեռնեք նկարները:",
    step3Title: "3. Կապեք Telegram Բոտը",
    step3Desc: "Միացրեք ձեր Telegram չատը՝ հյուրերի պատասխանները վայրկյանական ստանալու համար:",
    step4Title: "4. Ուղարկեք Հյուրերին",
    step4Desc: "Կիսվեք պատրաստի հղումով սոցիալական ցանցերում և հետևեք պատասխաններին:",

    adminPreviewTitle: "Կառավարման Հզոր Վահանակ",
    adminPreviewDesc: "Մեր հարթակի միջոցով դուք լիովին վերահսկում եք ձեր միջոցառումը: Պարզ, բայց ֆունկցիոնալ ադմինիստրատիվ էջը թույլ է տալիս կառավարել բոլոր տվյալները ցանկացած սարքից:",
    adminFeature1: "Ինտուիտիվ խմբագրիչ յուրաքանչյուր բաժնի համար",
    adminFeature2: "Ֆայլերի և նկարների ակնթարթային վերբեռնում",
    adminFeature3: "RSVP պատասխանների վիճակագրություն և Excel արտահանում",
    
    footerText: "© 2026 bacir.online. Բոլոր իրավունքները պաշտպանված են:"
  },
  ru: {
    heroTitle: "Премиум Платформа Цифровых Приглашений",
    heroSubtitle: "Создавайте элегантные и интерактивные приглашения для вашей свадьбы, дня рождения или любого важного события. Удивите ваших гостей с первых секунд!",
    viewDemo: "Посмотреть Демо",
    adminPanel: "Панель Управления",
    featuresTitle: "Возможности Платформы",
    featuresSubtitle: "Современные решения, которые превращают электронные приглашения в произведение искусства",
    
    feat1Title: "3D Открытие Конверта",
    feat1Desc: "Интерактивная анимация открытия конверта с сургучной печатью, передающая эмоции настоящего письма.",
    feat2Title: "Интеграция RSVP и Telegram",
    feat2Desc: "Гости подтверждают свое присутствие, а вы мгновенно получаете уведомление в Telegram.",
    feat3Title: "Музыка и Локация",
    feat3Desc: "Приятная фоновая музыка и интерактивные карты с маршрутами к местам проведения.",
    feat4Title: "Дресс-код (Dress Code)",
    feat4Desc: "Покажите гостям цветовую гамму мероприятия для создания красивой гармонии на фото.",
    feat5Title: "Фотогалерея (Gallery)",
    feat5Desc: "Делитесь вашими лучшими фотографиями прямо на странице приглашения, создавая настроение.",
    feat6Title: "Удобное Администрирование",
    feat6Desc: "Создавайте, редактируйте приглашения и экспортируйте полный список гостей в формат Excel (CSV).",

    howItWorksTitle: "Как это работает",
    step1Title: "1. Выберите Адрес (Slug)",
    step1Desc: "Выберите уникальную ссылку для вашего приглашения (например, /i/robert-lusine).",
    step2Title: "2. Заполните Данные",
    step2Desc: "Введите время, места, выберите музыку и загрузите фотографии.",
    step3Title: "3. Подключите Telegram Бот",
    step3Desc: "Подключите ваш Telegram чат для мгновенного получения ответов гостей.",
    step4Title: "4. Отправьте Гостям",
    step4Desc: "Поделитесь готовой ссылкой в соцсетях и отслеживайте статистику ответов.",

    adminPreviewTitle: "Мощная Панель Управления",
    adminPreviewDesc: "С нашей платформой вы полностью контролируете свое мероприятие. Простая, но функциональная админ-панель позволяет управлять всеми данными с любого устройства.",
    adminFeature1: "Интуитивный редактор для каждого раздела",
    adminFeature2: "Мгновенная загрузка файлов и изображений",
    adminFeature3: "Статистика ответов RSVP и экспорт в Excel",
    
    footerText: "© 2026 bacir.online. Все права защищены."
  }
};

export default function LandingPage() {
  const { currentLang, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const t = translations[currentLang];

  return (
    <div className="landing-layout">
      {/* Background Glows */}
      <div className="glow-1"></div>
      <div className="glow-2"></div>

      {/* Header / Navbar */}
      <header className="landing-header">
        <div className="logo-section">
          <span className="logo-gold">BACIR</span>
          <span className="logo-sub">ONLINE</span>
        </div>
        <div className="nav-actions">
          <div className="lang-selector-glass">
            <button 
              className={currentLang === "am" ? "active" : ""} 
              onClick={() => changeLanguage("am")}
            >
              AM
            </button>
            <button 
              className={currentLang === "ru" ? "active" : ""} 
              onClick={() => changeLanguage("ru")}
            >
              RU
            </button>
          </div>
          <button className="nav-admin-btn" onClick={() => navigate("/admin")}>
            {t.adminPanel}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-viewport">
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-main-title"
          >
            {t.heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle-text"
          >
            {t.heroSubtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-cta-buttons"
          >
            <button className="cta-btn primary-gold" onClick={() => navigate("/i/robert-lusine")}>
              <FaEnvelopeOpenText className="btn-icon" /> {t.viewDemo}
            </button>
            <button className="cta-btn secondary-glass" onClick={() => navigate("/admin")}>
              {t.adminPanel} <FaChevronRight className="btn-icon-right" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>{t.featuresTitle}</h2>
          <p>{t.featuresSubtitle}</p>
        </div>

        <div className="features-grid">
          <div className="feature-glass-card">
            <div className="feat-icon-box">
              <FaEnvelopeOpenText />
            </div>
            <h3>{t.feat1Title}</h3>
            <p>{t.feat1Desc}</p>
          </div>

          <div className="feature-glass-card">
            <div className="feat-icon-box">
              <FaTelegramPlane />
            </div>
            <h3>{t.feat2Title}</h3>
            <p>{t.feat2Desc}</p>
          </div>

          <div className="feature-glass-card">
            <div className="feat-icon-box">
              <FaMapMarkedAlt />
            </div>
            <h3>{t.feat3Title}</h3>
            <p>{t.feat3Desc}</p>
          </div>

          <div className="feature-glass-card">
            <div className="feat-icon-box">
              <FaPalette />
            </div>
            <h3>{t.feat4Title}</h3>
            <p>{t.feat4Desc}</p>
          </div>

          <div className="feature-glass-card">
            <div className="feat-icon-box">
              <FaImages />
            </div>
            <h3>{t.feat5Title}</h3>
            <p>{t.feat5Desc}</p>
          </div>

          <div className="feature-glass-card">
            <div className="feat-icon-box">
              <FaCogs />
            </div>
            <h3>{t.feat6Title}</h3>
            <p>{t.feat6Desc}</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>{t.howItWorksTitle}</h2>
        </div>

        <div className="timeline-container">
          <div className="timeline-step">
            <div className="step-number">1</div>
            <h4>{t.step1Title}</h4>
            <p>{t.step1Desc}</p>
          </div>
          <div className="timeline-step">
            <div className="step-number">2</div>
            <h4>{t.step2Title}</h4>
            <p>{t.step2Desc}</p>
          </div>
          <div className="timeline-step">
            <div className="step-number">3</div>
            <h4>{t.step3Title}</h4>
            <p>{t.step3Desc}</p>
          </div>
          <div className="timeline-step">
            <div className="step-number">4</div>
            <h4>{t.step4Title}</h4>
            <p>{t.step4Desc}</p>
          </div>
        </div>
      </section>

      {/* Admin Preview Section */}
      <section className="admin-preview-section">
        <div className="admin-preview-content">
          <div className="admin-text-info">
            <h2>{t.adminPreviewTitle}</h2>
            <p>{t.adminPreviewDesc}</p>
            <ul className="admin-benefits-list">
              <li><FaCheckCircle className="check-icon" /> {t.adminFeature1}</li>
              <li><FaCheckCircle className="check-icon" /> {t.adminFeature2}</li>
              <li><FaCheckCircle className="check-icon" /> {t.adminFeature3}</li>
            </ul>
          </div>
          <div className="admin-mockup-wrapper">
            <div className="admin-mockup-window">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="mockup-title">Admin Dashboard</div>
              </div>
              <div className="mockup-body">
                <div className="mockup-sidebar">
                  <div className="sidebar-item active">Dashboard</div>
                  <div className="sidebar-item">Invitations</div>
                  <div className="sidebar-item">Settings</div>
                </div>
                <div className="mockup-main">
                  <div className="mockup-card-row">
                    <div className="mockup-stat-card">
                      <h5>Attending</h5>
                      <span className="stat-num">42</span>
                    </div>
                    <div className="mockup-stat-card">
                      <h5>Declined</h5>
                      <span className="stat-num">12</span>
                    </div>
                  </div>
                  <div className="mockup-table">
                    <div className="table-row header">
                      <span>Guest Name</span>
                      <span>RSVP</span>
                    </div>
                    <div className="table-row">
                      <span>Robert & Lusine</span>
                      <span className="rsvp-yes">Attending</span>
                    </div>
                    <div className="table-row">
                      <span>Gayane & Harut</span>
                      <span className="rsvp-yes">Attending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>{t.footerText}</p>
      </footer>
    </div>
  );
}
