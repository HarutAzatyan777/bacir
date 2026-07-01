const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Function to load env variables from .env manually (avoiding external dependency)
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value.trim();
      }
    });
  }
}

// 1. Try to find and parse service account key
let serviceAccount = null;

const serviceAccountPath = path.join(__dirname, '..', 'service-account.json');
if (fs.existsSync(serviceAccountPath)) {
  console.log("Found service-account.json in project root.");
  try {
    serviceAccount = require(serviceAccountPath);
  } catch (err) {
    console.error("Error reading service-account.json:", err.message);
  }
} else {
  loadEnv();
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      serviceAccount = JSON.parse(serviceAccountKey);
      console.log("Found FIREBASE_SERVICE_ACCOUNT_KEY in .env");
    } catch (e) {
      console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY from .env:", e.message);
    }
  }
}

// Check if we are running in an environment that has ADC or emulator
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

if (!serviceAccount && !emulatorHost) {
  console.error("\n========================================================");
  console.error("Error: Could not find Firebase service account credentials.");
  console.error("Please do one of the following to authorize the script:");
  console.error("1. Download your service account JSON file from Firebase Console:");
  console.error("   (Project settings -> Service accounts -> Generate new private key)");
  console.error("   Rename it to 'service-account.json' and place it in the root folder of this project.");
  console.error("2. Add the stringified JSON of the service account to the FIREBASE_SERVICE_ACCOUNT_KEY variable in your .env file.");
  console.error("========================================================\n");
  process.exit(1);
}

// 2. Initialize Firebase Admin SDK
try {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    // Emulator mode or fallback
    admin.initializeApp();
  }
  console.log("Firebase Admin successfully initialized.");
} catch (err) {
  console.error("Failed to initialize Firebase Admin:", err.message);
  process.exit(1);
}

const db = admin.firestore();

// 3. Define the Mock Invitation templates
const mocks = [
  {
    slug: "demo-wedding-portrait",
    data: {
      eventName: "Wedding / Portrait Demo",
      sealInitials: "RL",
      musicUrl: "/wedding-audio.mp3",
      envelopeBgUrl: "",
      ownerId: null,
      sections: [
        { id: "hero", type: "hero", enabled: true },
        { id: "calendar", type: "calendar", enabled: true },
        { id: "location", type: "location", enabled: true },
        { id: "gallery", type: "gallery", enabled: true },
        { id: "dressCode", type: "dressCode", enabled: true },
        { id: "rsvp", type: "rsvp", enabled: true }
      ],
      theme: {
        primaryColor: "#2c3e35",
        accentColor: "#d4af37",
        bgColor: "#fdfbf7",
        textColor: "#333333",
        sectionPadding: "80px 20px",
        containerWidth: "1200px",
        fontMain: "'Montserrat', sans-serif"
      },
      hero: {
        names: { am: "Ռոբերտ և Լուսինե", ru: "Роберт и Лусине", en: "Robert & Lusine" },
        title: { am: "Հարսանյաց Օր", ru: "День Свадьбы", en: "Wedding Day" },
        bgMobileUrl: "images/1762250986-9.avif",
        bgDesktopUrl: "images/1762250986-9.avif"
      },
      calendar: {
        title: { am: "Հիշարժան Մեր Օրը", ru: "Наш Памятный День", en: "Our Special Day" },
        intro: { am: "Մենք շատ ուրախ ենք Ձեզ հետ կիսելու մեր կյանքի ամենասպասված ու անմոռանալի պահը։", ru: "Мы очень рады разделить с вами самый долгожданный и незабываемый момент нашей жизни.", en: "We are very happy to share with you the most anticipated and unforgettable moment of our lives." },
        invite: { am: "Սիրով հրավիրում ենք Ձեզ լինել մեր կողքին և միասին տոնել այս գեղեցիկ օրը։", ru: "Мы с любовью приглашаем вас быть рядом и вместе отпраздновать этот прекрасный день.", en: "We cordially invite you to be with us and celebrate this beautiful day together." },
        eventDate: "2026-09-12T15:00:00.000Z",
        bgUrl: ""
      },
      location: {
        title: { am: "Տեղը և ժամանակացույցը", ru: "Место и расписание", en: "Location & Schedule" },
        church: {
          title: { am: "ԵԿԵՂԵՑԻ", ru: "ЦЕРКОВЬ", en: "CHURCH" },
          name: { am: "Սուրբ Գրիգոր Լուսավորիչ մայր տաճար", ru: "Собор Святого Григория Просветителя", en: "St. Gregory the Illuminator Cathedral" },
          address1: { am: "Հայաստան, ք. Երևան", ru: "Армения, г. Ереван", en: "Yerevan, Armenia" },
          address2: { am: "Երվանդ Քոչարի փողոց", ru: "улица Ерванда Кочара", en: "Yervand Kochar street" },
          time: "15:00",
          mapLink: "https://maps.google.com/?q=St.+Gregory+the+Illuminator+Cathedral"
        },
        party: {
          title: { am: "ՌԵՍՏՈՐԱՆ", ru: "РЕСТОРАН", en: "RESTAURANT" },
          name: { am: "«Ռոդես» ռեստորան", "ru": "Ресторан «Родес»", "en": "Rodes Restaurant" },
          addressExtra: { am: "Նոր Դվին", ru: "Нор Двин", en: "Nor Dvin" },
          address1: { am: "Հայաստան, Արմավիրի մարզ, ք. Էջմիածին", ru: "Армения, Армавирская область, г. Эчмиадзин", en: "Ejmiatsin, Armavir Province, Armenia" },
          address2: { am: "Աշտարակի խճուղի, շենք 1", ru: "Аштаракское шоссе, здание 1", en: "Ashtarak Highway, building 1" },
          time: "17:30",
          mapLink: "https://maps.google.com/?q=Ejmiatsin"
        },
        bgUrl: ""
      },
      gallery: {
        images: [
          "images/1762250986-9.avif",
          "images/1762250986-7.avif",
          "images/1762342687-05.avif"
        ]
      },
      dressCode: {
        show: true,
        description: {
          am: "Խնդրում ենք ընտրել նուրբ գույներ՝ հարմոնիկ լուսանկարների համար:",
          ru: "Пожалуйста, выбирайте пастельные тона для гармоничных фотографий.",
          en: "Please choose pastel colors for harmonious photos."
        },
        colors: ["#eaeaea", "#d9c8b4", "#c5a880", "#8b6f47"]
      },
      rsvp: {
        deadline: "2026-08-25",
        hosts: [
          { id: "robert", am: "Ռոբերտ", ru: "Роберт", en: "Robert" },
          { id: "lusine", am: "Լուսինե", ru: "Лусине", en: "Lusine" }
        ]
      }
    }
  },
  {
    slug: "demo-minimal-modern",
    data: {
      eventName: "Minimal / Modern Demo",
      sealInitials: "AM",
      musicUrl: "/wedding-audio.mp3",
      envelopeBgUrl: "",
      ownerId: null,
      sections: [
        { id: "hero", type: "hero", enabled: true },
        { id: "calendar", type: "calendar", enabled: true },
        { id: "location", type: "location", enabled: true },
        { id: "gallery", type: "gallery", enabled: true },
        { id: "dressCode", type: "dressCode", enabled: true },
        { id: "rsvp", type: "rsvp", enabled: true }
      ],
      theme: {
        primaryColor: "#111111",
        accentColor: "#555555",
        bgColor: "#ffffff",
        textColor: "#222222",
        sectionPadding: "80px 20px",
        containerWidth: "1200px",
        fontMain: "'Inter', sans-serif"
      },
      hero: {
        names: { am: "Ալեքս և Մարի", ru: "Алекс и Мари", en: "Alex & Mary" },
        title: { am: "Միասին Ընդմիշտ", ru: "Вместе Навсегда", en: "Together Forever" },
        bgMobileUrl: "images/1749120138-12.avif",
        bgDesktopUrl: "images/1749120138-12.avif"
      },
      calendar: {
        title: { am: "Մեր Օրացույցը", ru: "Наш Календарь", en: "Our Calendar" },
        intro: { am: "Սիրով սպասում ենք Ձեզ մեր կյանքի կարևորագույն օրը։", ru: "Ждем вас с нетерпением в самый важный день нашей жизни.", en: "We look forward to seeing you on the most important day of our lives." },
        invite: { am: "Միացեք մեզ մեր ամուսնության տոնին։", ru: "Присоединяйтесь к нам на нашем свадебном торжестве.", en: "Join us in celebrating our wedding day." },
        eventDate: "2026-10-05T14:00:00.000Z",
        bgUrl: ""
      },
      location: {
        title: { am: "Տեղը և ժամանակացույցը", ru: "Место и расписание", en: "Location & Schedule" },
        church: {
          title: { am: "ԱՐԱՐՈՂՈՒԹՅՈՒՆ", ru: "ЦЕРЕМОНИЯ", en: "CEREMONY" },
          name: { am: "Սուրբ Աննա Եկեղեցի", ru: "Церковь Святой Анны", en: "St. Anna Church" },
          address1: { am: "Հայաստան, ք. Երևան", ru: "Армения, г. Ереван", en: "Yerevan, Armenia" },
          address2: { am: "Աբովյան և Սայաթ-Նովա փողոցների խաչմերուկ", ru: "перекресток улиц Абовяна и Саят-Нова", en: "Intersection of Abovyan and Sayat-Nova streets" },
          time: "14:00",
          mapLink: "https://maps.google.com/?q=St.+Anna+Church+Yerevan"
        },
        party: {
          title: { am: "ԽՆՋՈՒՅՔ", ru: "БАНКЕТ", en: "RECEPTION" },
          name: { am: "«Հոլիդեյ» սրահ", ru: "Зал «Холидей»", en: "Holiday Hall" },
          addressExtra: { am: "Պրեմիում սրահ", ru: "Премиум зал", en: "Premium Hall" },
          address1: { am: "Հայաստան, ք. Երևան", ru: "Армения, г. Ереван", en: "Yerevan, Armenia" },
          address2: { am: "Մյասնիկյան պողոտա, շենք 20", ru: "проспект Мясникяна, здание 20", en: "Myasnikyan Avenue, building 20" },
          time: "16:30",
          mapLink: "https://maps.google.com/?q=Yerevan"
        },
        bgUrl: ""
      },
      gallery: {
        images: [
          "images/1749120138-12.avif",
          "images/1749120139-3.avif",
          "images/1749120139-9.avif"
        ]
      },
      dressCode: {
        show: true,
        description: {
          am: "Միայն սև և սպիտակ գույներ։",
          ru: "Только черный и белый цвета.",
          en: "Black and white colors only."
        },
        colors: ["#000000", "#333333", "#7f8c8d", "#ffffff"]
      },
      rsvp: {
        deadline: "2026-09-15",
        hosts: [
          { id: "alex", am: "Ալեքս", ru: "Алекс", en: "Alex" },
          { id: "mari", am: "Մարի", ru: "Мари", en: "Mary" }
        ]
      }
    }
  },
  {
    slug: "demo-floral-classic",
    data: {
      eventName: "Floral / Classic Demo",
      sealInitials: "DA",
      musicUrl: "/wedding-audio.mp3",
      envelopeBgUrl: "",
      ownerId: null,
      sections: [
        { id: "hero", type: "hero", enabled: true },
        { id: "calendar", type: "calendar", enabled: true },
        { id: "location", type: "location", enabled: true },
        { id: "gallery", type: "gallery", enabled: true },
        { id: "dressCode", type: "dressCode", enabled: true },
        { id: "rsvp", type: "rsvp", enabled: true }
      ],
      theme: {
        primaryColor: "#5c3d2e",
        accentColor: "#d9a05b",
        bgColor: "#fefbf6",
        textColor: "#473024",
        sectionPadding: "80px 20px",
        containerWidth: "1200px",
        fontMain: "'Playfair Display', serif"
      },
      hero: {
        names: { am: "Դավիթ և Անի", ru: "Давид и Ани", en: "David & Ani" },
        title: { am: "Ծաղկային Հեքիաթ", ru: "Цветочная Сказка", en: "Floral Fairytale" },
        bgMobileUrl: "images/1749120139-3.avif",
        bgDesktopUrl: "images/1749120139-3.avif"
      },
      calendar: {
        title: { am: "Մեր Օրը", ru: "Наш День", en: "Our Day" },
        intro: { am: "Սիրով սպասում ենք Ձեր ներկայությանը մեր պսակադրության արարողությանը:", ru: "Ждем вашего присутствия на нашей церемонии венчания.", en: "We look forward to your presence at our wedding ceremony." },
        invite: { am: "Եկեք միասին նշենք սիրո և ներդաշնակության այս տոնը։", ru: "Давайте вместе отпразднуем этот праздник любви и согласия.", en: "Let us celebrate this holiday of love and harmony together." },
        eventDate: "2026-08-18T16:00:00.000Z",
        bgUrl: ""
      },
      location: {
        title: { am: "Տեղը և ժամանակացույցը", ru: "Место и расписание", en: "Location & Schedule" },
        church: {
          title: { am: "ԵԿԵՂԵՑԻ", ru: "ЦЕРКОВЬ", en: "CHURCH" },
          name: { am: "Մայր Աթոռ Սուրբ Էջմիածին", ru: "Первопрестольный Святой Эчмиадзин", en: "Mother See of Holy Etchmiadzin" },
          address1: { am: "Հայաստան, ք. Էջմիածին", ru: "Армения, г. Эчмиадзин", en: "Ejmiatsin, Armenia" },
          address2: { am: "Վաղարշապատ", ru: "Вагаршапат", en: "Vagharshapat" },
          time: "16:00",
          mapLink: "https://maps.google.com/?q=Holy+Etchmiadzin"
        },
        party: {
          title: { am: "ՌԵՍՏՈՐԱՆ", ru: "РЕСТОРАН", en: "RESTAURANT" },
          name: { am: "«Ֆլորա» այգի-ռեստորան", ru: "Ресторан-сад «Флора»", en: "Flora Garden Restaurant" },
          addressExtra: { am: "Բացօթյա սրահ", ru: "Зал под открытым небом", en: "Outdoor area" },
          address1: { am: "Հայաստան, Արարատի մարզ", ru: "Армения, Араратская область", en: "Ararat Province, Armenia" },
          address2: { am: "Երևան-Արտաշատ խճուղի, 15-րդ կմ", ru: "трасса Ереван-Арташат, 15-й км", en: "Yerevan-Artashat Highway, 15th km" },
          time: "18:30",
          mapLink: "https://maps.google.com"
        },
        bgUrl: ""
      },
      gallery: {
        images: [
          "images/1749120139-3.avif",
          "images/1749120139-9.avif",
          "images/1749120139-11.avif"
        ]
      },
      dressCode: {
        show: true,
        description: {
          am: "Նախընտրելի են վարդագույնի, դեղձի և բնական նուրբ երանգները։",
          ru: "Предпочтительны розовые, персиковые и нежные природные оттенки.",
          en: "Rose, peach and gentle natural shades are preferred."
        },
        colors: ["#fadbd8", "#f5b041", "#f5cfa6", "#ebdef0"]
      },
      rsvp: {
        deadline: "2026-07-25",
        hosts: [
          { id: "david", am: "Դավիթ", ru: "Давид", en: "David" },
          { id: "ani", am: "Անի", ru: "Ани", en: "Ani" }
        ]
      }
    }
  },
  {
    slug: "demo-chic-elegant",
    data: {
      eventName: "Chic / Elegant Demo",
      sealInitials: "EE",
      musicUrl: "/wedding-audio.mp3",
      envelopeBgUrl: "",
      ownerId: null,
      sections: [
        { id: "hero", type: "hero", enabled: true },
        { id: "calendar", type: "calendar", enabled: true },
        { id: "location", type: "location", enabled: true },
        { id: "gallery", type: "gallery", enabled: true },
        { id: "dressCode", type: "dressCode", enabled: true },
        { id: "rsvp", type: "rsvp", enabled: true }
      ],
      theme: {
        primaryColor: "#2b1055",
        accentColor: "#7597de",
        bgColor: "#f9f5ff",
        textColor: "#2c3e50",
        sectionPadding: "80px 20px",
        containerWidth: "1200px",
        fontMain: "'Lora', serif"
      },
      hero: {
        names: { am: "Երվանդ և Էլեն", ru: "Ерванд и Элен", en: "Ervand & Elen" },
        title: { am: "Շիկ և Էլեգանտ", ru: "Шик и Элегантность", en: "Chic & Elegant" },
        bgMobileUrl: "images/1749120139-9.avif",
        bgDesktopUrl: "images/1749120139-9.avif"
      },
      calendar: {
        title: { am: "Մեր Օրը", ru: "Наш День", en: "Our Day" },
        intro: { am: "Մենք ուրախ կլինենք տեսնել Ձեզ մեր կյանքի ամենաուրախ տոնին։", ru: "Мы будем рады видеть вас на самом радостном празднике нашей жизни.", en: "We would be delighted to see you at the happiest celebration of our lives." },
        invite: { am: "Խնդրում ենք հաստատել Ձեր ներկայությունը։", ru: "Пожалуйста, подтвердите ваше присутствие.", en: "Please confirm your attendance." },
        eventDate: "2026-11-20T17:00:00.000Z",
        bgUrl: ""
      },
      location: {
        title: { am: "Տեղը և ժամանակացույցը", ru: "Место и расписание", en: "Location & Schedule" },
        church: {
          title: { am: "ՊՍԱԿԱԴՐՈՒԹՅՈՒՆ", ru: "ВЕНЧАНИЕ", en: "SACRAMENT" },
          name: { am: "Սուրբ Սարգիս Եկեղեցի", ru: "Церковь Святого Саркиса", en: "St. Sarkis Church" },
          address1: { am: "Հայաստան, ք. Երևան", ru: "Армения, г. Ереван", en: "Yerevan, Armenia" },
          address2: { am: "Իսրայելյան փողոց", ru: "улица Исраеляна", en: "Israyelyan street" },
          time: "17:00",
          mapLink: "https://maps.google.com/?q=St.+Sarkis+Church+Yerevan"
        },
        party: {
          title: { am: "ՀԱՆԴԻՍՈՒԹՅՈՒՆ", ru: "ТОРЖЕСТВО", en: "BANQUET" },
          name: { am: "«Քուինս» հանդիսությունների սրահ", ru: "Зал торжеств «Квинс»", en: "Queens Celebration Hall" },
          addressExtra: { am: "Գրանդ սրահ", ru: "Гранд зал", en: "Grand Hall" },
          address1: { am: "Հայաստան, ք. Երևան", ru: "Армения, г. Ереван", en: "Yerevan, Armenia" },
          address2: { am: "Արշակունյաց պողոտա, 50/3", ru: "проспект Аршакуняц, 50/3", en: "Arshakunyats Avenue, 50/3" },
          time: "19:00",
          mapLink: "https://maps.google.com"
        },
        bgUrl: ""
      },
      gallery: {
        images: [
          "images/1749120139-9.avif",
          "images/1762250986-7.avif",
          "images/1762342687-05.avif"
        ]
      },
      dressCode: {
        show: true,
        description: {
          am: "Դասական կամ երեկոյան հագուստ (navy, copper, pastel):",
          ru: "Классический или вечерний стиль (синий, медный, пастельные тона).",
          en: "Classical or evening attire (navy, copper, pastel)."
        },
        colors: ["#0d1b2a", "#415a77", "#778da9", "#e0e1dd"]
      },
      rsvp: {
        deadline: "2026-11-01",
        hosts: [
          { id: "ervand", am: "Երվանդ", ru: "Ерванд", en: "Ervand" },
          { id: "elen", am: "Էլեն", ru: "Элен", en: "Elen" }
        ]
      }
    }
  },
  {
    slug: "demo-luxury-gold",
    data: {
      eventName: "Luxury / Gold Demo",
      sealInitials: "TN",
      musicUrl: "/wedding-audio.mp3",
      envelopeBgUrl: "",
      ownerId: null,
      sections: [
        { id: "hero", type: "hero", enabled: true },
        { id: "calendar", type: "calendar", enabled: true },
        { id: "location", type: "location", enabled: true },
        { id: "gallery", type: "gallery", enabled: true },
        { id: "dressCode", type: "dressCode", enabled: true },
        { id: "rsvp", type: "rsvp", enabled: true }
      ],
      theme: {
        primaryColor: "#0c0c0c",
        accentColor: "#c5a059",
        bgColor: "#151515",
        textColor: "#eaeaea",
        sectionPadding: "80px 20px",
        containerWidth: "1200px",
        fontMain: "'Cinzel', serif"
      },
      hero: {
        names: { am: "Տիգրան և Նանե", ru: "Тигран и Нане", en: "Tigran & Nane" },
        title: { am: "Ոսկե Հարսանիք", ru: "Золотая Свадьба", en: "Golden Wedding" },
        bgMobileUrl: "images/1762250986-7.avif",
        bgDesktopUrl: "images/1762250986-7.avif"
      },
      calendar: {
        title: { am: "Մեր Ոսկե Օրը", ru: "Наш Золотой День", en: "Our Golden Day" },
        intro: { am: "Սիրով հրավիրում ենք Ձեզ լինել մեր կողքին այս շքեղ օրը։", ru: "С любовью приглашаем вас разделить с нами этот роскошный день.", en: "We warmly invite you to be with us on this luxurious day." },
        invite: { am: "Ձեր ներկայությունը կդարձնի մեր տոնն ավելի շքեղ։", ru: "Ваше присутствие сделает наш праздник еще более величественным.", en: "Your presence will make our celebration even more magnificent." },
        eventDate: "2026-09-25T16:30:00.000Z",
        bgUrl: ""
      },
      location: {
        title: { am: "Տեղը և ժամանակացույցը", ru: "Место и расписание", en: "Location & Schedule" },
        church: {
          title: { am: "ԵԿԵՂԵՑԻ", ru: "ЦЕРКОВЬ", en: "CHURCH" },
          name: { am: "Սուրբ Գայանե Եկեղեցի", ru: "Церковь Святой Гаяне", en: "St. Gayane Church" },
          address1: { am: "Հայաստան, ք. Էջմիածին", ru: "Армения, г. Эчмиадзин", en: "Ejmiatsin, Armenia" },
          address2: { am: "Սուրբ Գայանե փողոց", ru: "улица Святой Гаяне", en: "St. Gayane street" },
          time: "16:30",
          mapLink: "https://maps.google.com/?q=St.+Gayane+Church"
        },
        party: {
          title: { am: "ՌԵՍՏՈՐԱՆ", ru: "РЕСТОРАН", en: "RESTAURANT" },
          name: { am: "«Փարավոն» հանդիսությունների սրահ", ru: "Зал торжеств «Паравон»", en: "Pharaon Celebration Hall" },
          addressExtra: { am: "Լյուքս սրահ", ru: "Люкс зал", en: "Lux Hall" },
          address1: { am: "Հայաստան, Կոտայքի մարզ", ru: "Армения, Котайкская область", en: "Kotayk Province, Armenia" },
          address2: { am: "Երևան-Աբովյան խճուղի, 7-րդ կմ", ru: "трасса Ереван-Абовян, 7-й км", en: "Yerevan-Abovyan Highway, 7th km" },
          time: "18:30",
          mapLink: "https://maps.google.com"
        },
        bgUrl: ""
      },
      gallery: {
        images: [
          "images/1762250986-7.avif",
          "images/1762250986-9.avif",
          "images/1749120139-11.avif"
        ]
      },
      dressCode: {
        show: true,
        description: {
          am: "Սև, ոսկեգույն կամ սպիտակ երեկոյան զգեստներ։",
          ru: "Вечерние наряды в черных, золотых или белых тонах.",
          en: "Evening wear in black, gold, or white colors."
        },
        colors: ["#111111", "#d4af37", "#f3e5ab", "#ffffff"]
      },
      rsvp: {
        deadline: "2026-09-01",
        hosts: [
          { id: "tigran", am: "Տիգրան", ru: "Тигран", en: "Tigran" },
          { id: "nane", am: "Նանե", ru: "Нане", en: "Nane" }
        ]
      }
    }
  },
  {
    slug: "demo-romantic-photo",
    data: {
      eventName: "Romantic / Photo Demo",
      sealInitials: "AL",
      musicUrl: "/wedding-audio.mp3",
      envelopeBgUrl: "",
      ownerId: null,
      sections: [
        { id: "hero", type: "hero", enabled: true },
        { id: "calendar", type: "calendar", enabled: true },
        { id: "location", type: "location", enabled: true },
        { id: "gallery", type: "gallery", enabled: true },
        { id: "dressCode", type: "dressCode", enabled: true },
        { id: "rsvp", type: "rsvp", enabled: true }
      ],
      theme: {
        primaryColor: "#641e16",
        accentColor: "#cd6155",
        bgColor: "#fdf2e9",
        textColor: "#2c3e50",
        sectionPadding: "80px 20px",
        containerWidth: "1200px",
        fontMain: "'Montserrat', sans-serif"
      },
      hero: {
        names: { am: "Արթուր և Լիլիթ", ru: "Артур и Лилит", en: "Arthur & Lilit" },
        title: { am: "Սիրո Պատմություն", ru: "История Любви", en: "Our Love Story" },
        bgMobileUrl: "images/1762342687-05.avif",
        bgDesktopUrl: "images/1762342687-05.avif"
      },
      calendar: {
        title: { am: "Սիրո Օրացույց", ru: "Календарь Любви", en: "Love Calendar" },
        intro: { am: "Յուրաքանչյուր վայրկյանը կարևոր է, երբ սպասում ենք մեր մեծ օրվան։", ru: "Каждая секунда важна в ожидании нашего великого дня.", en: "Every second counts while waiting for our big day." },
        invite: { am: "Սիրով հրավիրում ենք Ձեզ կիսել մեր ուրախությունը։", ru: "С любовью приглашаем вас разделить нашу радость.", en: "We warmly invite you to share our happiness." },
        eventDate: "2026-07-29T15:30:00.000Z",
        bgUrl: ""
      },
      location: {
        title: { am: "Տեղը և ժամանակացույցը", ru: "Место и расписание", en: "Location & Schedule" },
        church: {
          title: { am: "ԵԿԵՂԵՑԻ", ru: "ЦЕРКОВЬ", en: "CHURCH" },
          name: { am: "Սուրբ Հովհաննես Եկեղեցի", ru: "Церковь Святого Иоанна", en: "St. John Church" },
          address1: { am: "Հայաստան, ք. Երևան", ru: "Армения, г. Ереван", en: "Yerevan, Armenia" },
          address2: { am: "Կոնդ թաղամաս", ru: "квартал Конд", en: "Kond district" },
          time: "15:30",
          mapLink: "https://maps.google.com/?q=St.+John+Church+Kond"
        },
        party: {
          title: { am: "ՌԵՍՏՈՐԱՆ", ru: "РЕСТОРАН", en: "RESTAURANT" },
          name: { am: "«Բելաջիո» ռեստորան", ru: "Ресторан «Белладжио»", en: "Bellagio Restaurant" },
          addressExtra: { am: "Ռոմանտիկ սրահ", ru: "Романтический зал", en: "Romantic Hall" },
          address1: { am: "Հայաստան, ք. Երևան", ru: "Армения, г. Ереван", en: "Yerevan, Armenia" },
          address2: { am: "Մյասնիկյան պողոտա, շենք 2", ru: "проспект Мясникяна, здание 2", en: "Myasnikyan Avenue, building 2" },
          time: "18:00",
          mapLink: "https://maps.google.com"
        },
        bgUrl: ""
      },
      gallery: {
        images: [
          "images/1762342687-05.avif",
          "images/1749625949-8.avif",
          "images/1749120139-11.avif"
        ]
      },
      dressCode: {
        show: true,
        description: {
          am: "Ընտրեք բորդո, կարմիր կամ նուրբ վարդագույն երանգներ։",
          ru: "Пожалуйста, выбирайте бордовые, красные или нежно-розовые оттенки.",
          en: "Please choose burgundy, red or soft pink shades."
        },
        colors: ["#581845", "#900c3f", "#c70039", "#ff5733"]
      },
      rsvp: {
        deadline: "2026-07-15",
        hosts: [
          { id: "arthur", am: "Արթուր", ru: "Артур", en: "Arthur" },
          { id: "lilit", am: "Լիլիթ", ru: "Лилит", en: "Lilit" }
        ]
      }
    }
  },
  {
    slug: "demo-aesthetic-editorial",
    data: {
      eventName: "Aesthetic / Editorial Demo",
      sealInitials: "GS",
      musicUrl: "/wedding-audio.mp3",
      envelopeBgUrl: "",
      ownerId: null,
      sections: [
        { id: "hero", type: "hero", enabled: true },
        { id: "calendar", type: "calendar", enabled: true },
        { id: "location", type: "location", enabled: true },
        { id: "gallery", type: "gallery", enabled: true },
        { id: "dressCode", type: "dressCode", enabled: true },
        { id: "rsvp", type: "rsvp", enabled: true }
      ],
      theme: {
        primaryColor: "#873600",
        accentColor: "#d35400",
        bgColor: "#fbf5f2",
        textColor: "#2e4053",
        sectionPadding: "80px 20px",
        containerWidth: "1200px",
        fontMain: "'Inter', sans-serif"
      },
      hero: {
        names: { am: "Գոռ և Սոնա", ru: "Гор и Сона", en: "Gor & Sona" },
        title: { am: "Էսթետիկ Երեկո", ru: "Эстетический Вечер", en: "Aesthetic Evening" },
        bgMobileUrl: "images/1749120139-11.avif",
        bgDesktopUrl: "images/1749120139-11.avif"
      },
      calendar: {
        title: { am: "Հիշարժան Օր", ru: "Памятный День", en: "A Day to Remember" },
        intro: { am: "Սիրով սպասում ենք Ձեզ մեր կյանքի ամենաէսթետիկ և սպասված իրադարձությանը։", ru: "Ждем вас на самом эстетичном и долгожданном событии нашей жизни.", en: "We look forward to seeing you at the most aesthetic and anticipated event of our lives." },
        invite: { am: "Միացեք մեզ այս գեղեցիկ օրը։", ru: "Присоединяйтесь к нам в этот прекрасный день.", en: "Join us on this beautiful day." },
        eventDate: "2026-09-05T15:00:00.000Z",
        bgUrl: ""
      },
      location: {
        title: { am: "Տեղը և ժամանակացույցը", ru: "Место и расписание", en: "Location & Schedule" },
        church: {
          title: { am: "ԵԿԵՂԵՑԻ", ru: "ЦЕРКОВЬ", en: "CHURCH" },
          name: { am: "Սուրբ Մեսրոպ Մաշտոց Եկեղեցի", ru: "Церковь Святого Месропа Маштоца", en: "St. Mesrop Mashtots Church" },
          address1: { am: "Հայաստան, Կոտայքի մարզ", ru: "Армения, Котайкская область", en: "Kotayk Province, Armenia" },
          address2: { am: "ք. Օշական", ru: "г. Ошакан", en: "Oshakan town" },
          time: "15:00",
          mapLink: "https://maps.google.com/?q=Oshakan+Church"
        },
        party: {
          title: { am: "ՌԵՍՏՈՐԱՆ", ru: "РЕСТОРАН", en: "RESTAURANT" },
          name: { am: "«Էրմիտաժ» այգի-սրահ", ru: "Сад-зал «Эрмитаж»", en: "Hermitage Garden Hall" },
          addressExtra: { am: "Էկո սրահ", ru: "Эко зал", en: "Eco Hall" },
          address1: { am: "Հայաստան, ք. Երևան", ru: "Армения, г. Ереван", en: "Yerevan, Armenia" },
          address2: { am: "Հրազդանի կիրճ, շենք 4", ru: "Разданское ущелье, здание 4", en: "Hrazdan Gorge, building 4" },
          time: "17:30",
          mapLink: "https://maps.google.com"
        },
        bgUrl: ""
      },
      gallery: {
        images: [
          "images/1749120139-11.avif",
          "images/1749625949-8.avif",
          "images/1762250986-9.avif"
        ]
      },
      dressCode: {
        show: true,
        description: {
          am: "Նախընտրելի են տերակոտա, շագանակագույն և բեժ երանգները։",
          ru: "Предпочтительны терракотовые, коричневые и бежевые оттенки.",
          en: "Terracotta, brown and beige shades are preferred."
        },
        colors: ["#cd853f", "#d2691e", "#8b4513", "#faf0e6"]
      },
      rsvp: {
        deadline: "2026-08-20",
        hosts: [
          { id: "gor", am: "Գոռ", ru: "Гор", en: "Gor" },
          { id: "sona", am: "Սոնա", ru: "Сона", en: "Sona" }
        ]
      }
    }
  },
  {
    slug: "demo-vintage-retro",
    data: {
      eventName: "Vintage / Retro Demo",
      sealInitials: "KM",
      musicUrl: "/wedding-audio.mp3",
      envelopeBgUrl: "",
      ownerId: null,
      sections: [
        { id: "hero", type: "hero", enabled: true },
        { id: "calendar", type: "calendar", enabled: true },
        { id: "location", type: "location", enabled: true },
        { id: "gallery", type: "gallery", enabled: true },
        { id: "dressCode", type: "dressCode", enabled: true },
        { id: "rsvp", type: "rsvp", enabled: true }
      ],
      theme: {
        primaryColor: "#1b4f72",
        accentColor: "#e59866",
        bgColor: "#ebf5fb",
        textColor: "#2c3e50",
        sectionPadding: "80px 20px",
        containerWidth: "1200px",
        fontMain: "'Playfair Display', serif"
      },
      hero: {
        names: { am: "Կարեն և Մանե", ru: "Карен и Мане", en: "Karen & Mane" },
        title: { am: "Վինտաժային Հարսանիք", ru: "Винтажная Свадьба", en: "Vintage Wedding" },
        bgMobileUrl: "images/1749625949-8.avif",
        bgDesktopUrl: "images/1749625949-8.avif"
      },
      calendar: {
        title: { am: "Վինտաժ Օր", ru: "Винтажный День", en: "Vintage Day" },
        intro: { am: "Սիրով սպասում ենք Ձեզ մեր կյանքի հետադարձ հիշողություններով լի օրը։", ru: "Ждем вас в день, наполненный воспоминаниями о нашей жизни.", en: "We look forward to seeing you on a day filled with retro memories." },
        invite: { am: "Եկեք միասին ստեղծենք նոր հիշողություններ։", ru: "Давайте вместе создавать новые воспоминания.", en: "Let's create new memories together." },
        eventDate: "2026-10-12T16:00:00.000Z",
        bgUrl: ""
      },
      location: {
        title: { am: "Տեղը և ժամանակացույցը", ru: "Место и расписание", en: "Location & Schedule" },
        church: {
          title: { am: "ԵԿԵՂԵՑԻ", ru: "ЦЕРКОВЬ", en: "CHURCH" },
          name: { am: "Սուրբ Սարգիս Եկեղեցի", ru: "Церковь Святого Саркиса", en: "St. Sarkis Church" },
          address1: { am: "Հայաստան, ք. Երևան", ru: "Армения, г. Ереван", en: "Yerevan, Armenia" },
          address2: { am: "Նոր Նորքի 5-րդ զանգված", ru: "5-й микрорайон Нор Норка", en: "5th Block of Nor Nork" },
          time: "16:00",
          mapLink: "https://maps.google.com"
        },
        party: {
          title: { am: "ՌԵՍՏՈՐԱՆ", ru: "РЕСТОРАН", en: "RESTAURANT" },
          name: { am: "«Վինտաժ» ռեստորան", ru: "Ресторан «Винтаж»", en: "Vintage Restaurant" },
          addressExtra: { am: "Ռետրո սրահ", ru: "Ретро зал", en: "Retro Hall" },
          address1: { am: "Հայաստան, ք. Երևան", ru: "Армения, г. Ереван", en: "Yerevan, Armenia" },
          address2: { am: "Թումանյան փողոց, շենք 40", ru: "улица Туманяна, здание 40", en: "Tumanyan street, building 40" },
          time: "18:00",
          mapLink: "https://maps.google.com"
        },
        bgUrl: ""
      },
      gallery: {
        images: [
          "images/1749625949-8.avif",
          "images/1762342687-05.avif",
          "images/1749120138-12.avif"
        ]
      },
      dressCode: {
        show: true,
        description: {
          am: "Ռետրո կամ վինտաժային ոճի զգեստներ (sage green, cream, vintage blue):",
          ru: "Наряды в стиле ретро или винтаж (шалфейный, кремовый, винтажный синий).",
          en: "Retro or vintage style outfits (sage green, cream, vintage blue)."
        },
        colors: ["#3d5a80", "#98c1d9", "#e0f2f1", "#ee6c4d"]
      },
      rsvp: {
        deadline: "2026-09-25",
        hosts: [
          { id: "karen", am: "Կարեն", ru: "Карен", en: "Karen" },
          { id: "mane", am: "Մանե", ru: "Мане", en: "Mane" }
        ]
      }
    }
  }
];

// 4. Run the upload logic
async function seedMocks() {
  console.log(`Starting to seed ${mocks.length} mock invitations into Firestore...`);
  
  for (const mock of mocks) {
    try {
      const invitationRef = db.collection("invitations").doc(mock.slug);
      await invitationRef.set(mock.data);
      console.log(`✔ Successfully uploaded invitation: ${mock.slug}`);

      // Create an empty secrets document as well
      const secretsRef = db.collection("invitationSecrets").doc(mock.slug);
      await secretsRef.set({
        telegramBotToken: "",
        telegramChatId: ""
      });
      console.log(`✔ Successfully uploaded invitation secrets: ${mock.slug}`);
    } catch (err) {
      console.error(`✘ Failed to upload ${mock.slug}:`, err.message);
    }
  }

  console.log("\nFinished seeding mock data!");
  process.exit(0);
}

seedMocks();
