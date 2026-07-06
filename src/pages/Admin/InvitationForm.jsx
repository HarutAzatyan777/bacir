import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../firebase";
import { FaMobileAlt } from "react-icons/fa";
import "./InvitationForm.css";

export default function InvitationForm({ mode, invitationId, onSuccess, onCancel }) {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSlug, setPreviewSlug] = useState("");

  // Form states
  const [slug, setSlug] = useState("");
  const [eventName, setEventName] = useState("");
  const [sealInitials, setSealInitials] = useState("RL");
  const [musicUrl, setMusicUrl] = useState("/wedding-audio.mp3");
  const [envelopeBgFile, setEnvelopeBgFile] = useState(null);
  const [envelopeBgUrl, setEnvelopeBgUrl] = useState("");
  const [sections, setSections] = useState([
    { id: "hero", type: "hero", enabled: true },
    { id: "calendar", type: "calendar", enabled: true },
    { id: "location", type: "location", enabled: true },
    { id: "gallery", type: "gallery", enabled: true },
    { id: "dressCode", type: "dressCode", enabled: true },
    { id: "rsvp", type: "rsvp", enabled: true }
  ]);

  const [eventType, setEventType] = useState("wedding"); // wedding, birthday, baptism, other
  const [showChurch, setShowChurch] = useState(true);
  const [showParty, setShowParty] = useState(true);

  // Theme states
  const [primaryColor, setPrimaryColor] = useState("#2c3e35");
  const [accentColor, setAccentColor] = useState("#d4af37");
  const [bgColor, setBgColor] = useState("#fdfbf7");
  const [textColor, setTextColor] = useState("#333333");
  const [sectionPadding, setSectionPadding] = useState("80px 20px");
  const [containerWidth, setContainerWidth] = useState("1200px");
  const [fontMain, setFontMain] = useState("'Montserrat', sans-serif");

  // Hero Section
  const [heroNamesAm, setHeroNamesAm] = useState("");
  const [heroNamesRu, setHeroNamesRu] = useState("");
  const [heroNamesEn, setHeroNamesEn] = useState("");
  const [heroTitleAm, setHeroTitleAm] = useState("");
  const [heroTitleRu, setHeroTitleRu] = useState("");
  const [heroTitleEn, setHeroTitleEn] = useState("");
  const [heroBgMobileFile, setHeroBgMobileFile] = useState(null);
  const [heroBgDesktopFile, setHeroBgDesktopFile] = useState(null);
  const [heroBgMobileUrl, setHeroBgMobileUrl] = useState("");
  const [heroBgDesktopUrl, setHeroBgDesktopUrl] = useState("");

  // Calendar
  const [calTitleAm, setCalTitleAm] = useState("");
  const [calTitleRu, setCalTitleRu] = useState("");
  const [calTitleEn, setCalTitleEn] = useState("");
  const [calIntroAm, setCalIntroAm] = useState("");
  const [calIntroRu, setCalIntroRu] = useState("");
  const [calIntroEn, setCalIntroEn] = useState("");
  const [calInviteAm, setCalInviteAm] = useState("");
  const [calInviteRu, setCalInviteRu] = useState("");
  const [calInviteEn, setCalInviteEn] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [calBgFile, setCalBgFile] = useState(null);
  const [calBgUrl, setCalBgUrl] = useState("");

  // Location - Church
  const [churchTitleAm, setChurchTitleAm] = useState("ԵԿԵՂԵՑԻ");
  const [churchTitleRu, setChurchTitleRu] = useState("ЦЕРКОВЬ");
  const [churchTitleEn, setChurchTitleEn] = useState("CHURCH");
  const [churchNameAm, setChurchNameAm] = useState("");
  const [churchNameRu, setChurchNameRu] = useState("");
  const [churchNameEn, setChurchNameEn] = useState("");
  const [churchAddr1Am, setChurchAddr1Am] = useState("");
  const [churchAddr1Ru, setChurchAddr1Ru] = useState("");
  const [churchAddr1En, setChurchAddr1En] = useState("");
  const [churchAddr2Am, setChurchAddr2Am] = useState("");
  const [churchAddr2Ru, setChurchAddr2Ru] = useState("");
  const [churchAddr2En, setChurchAddr2En] = useState("");
  const [churchTime, setChurchTime] = useState("15:00");
  const [churchMapLink, setChurchMapLink] = useState("");

  // Location - Party
  const [partyTitleAm, setPartyTitleAm] = useState("ՌԵՍՏՈՐԱՆ");
  const [partyTitleRu, setPartyTitleRu] = useState("РЕСТОРАН");
  const [partyTitleEn, setPartyTitleEn] = useState("RESTAURANT");
  const [partyNameAm, setPartyNameAm] = useState("");
  const [partyNameRu, setPartyNameRu] = useState("");
  const [partyNameEn, setPartyNameEn] = useState("");
  const [partyAddrExtraAm, setPartyAddrExtraAm] = useState("");
  const [partyAddrExtraRu, setPartyAddrExtraRu] = useState("");
  const [partyAddrExtraEn, setPartyAddrExtraEn] = useState("");
  const [partyAddr1Am, setPartyAddr1Am] = useState("");
  const [partyAddr1Ru, setPartyAddr1Ru] = useState("");
  const [partyAddr1En, setPartyAddr1En] = useState("");
  const [partyAddr2Am, setPartyAddr2Am] = useState("");
  const [partyAddr2Ru, setPartyAddr2Ru] = useState("");
  const [partyAddr2En, setPartyAddr2En] = useState("");
  const [partyTime, setPartyTime] = useState("17:30");
  const [partyMapLink, setPartyMapLink] = useState("");
  const [locBgFile, setLocBgFile] = useState(null);
  const [locBgUrl, setLocBgUrl] = useState("");

  // Gallery
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryUrls, setGalleryUrls] = useState([]);

  // Dress Code
  const [showDressCode, setShowDressCode] = useState(true);
  const [dressDescAm, setDressDescAm] = useState("Ընտրեք նուրբ գույներ։");
  const [dressDescRu, setDressDescRu] = useState("Пожалуйста, выбирайте пастельные тона.");
  const [dressDescEn, setDressDescEn] = useState("Please choose pastel colors.");
  const [dressColors, setDressColors] = useState(["#eaeaea", "#d9c8b4", "#c5a880", "#8b6f47"]);
  const [newColor, setNewColor] = useState("#ffffff");

  // RSVP & Telegram
  const [rsvpDeadline, setRsvpDeadline] = useState("");
  const [hosts, setHosts] = useState([
    { id: "robert", am: "Ռոբերտ", ru: "Роберт" },
    { id: "lusine", am: "Լուսինե", ru: "Лусине" }
  ]);
  const [newHostId, setNewHostId] = useState("");
  const [newHostAm, setNewHostAm] = useState("");
  const [newHostRu, setNewHostRu] = useState("");
  const [newHostEn, setNewHostEn] = useState("");
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");

  // Load existing data for Edit mode
  useEffect(() => {
    if (mode === "edit" && invitationId) {
      loadInvitationData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, invitationId]);

  const loadInvitationData = async () => {
    setLoading(true);
    try {
      // Fetch public details
      const docRef = doc(db, "invitations", invitationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSlug(docSnap.id);
        setEventName(data.eventName || "");
        setEventType(data.eventType || "wedding");
        setSealInitials(data.sealInitials || "RL");
        setMusicUrl(data.musicUrl || "/wedding-audio.mp3");
        setEnvelopeBgUrl(data.envelopeBgUrl || "");

        if (data.sections && Array.isArray(data.sections)) {
          setSections(data.sections);
        } else {
          setSections([
            { id: "hero", type: "hero", enabled: true },
            { id: "calendar", type: "calendar", enabled: true },
            { id: "location", type: "location", enabled: true },
            { id: "gallery", type: "gallery", enabled: true },
            { id: "dressCode", type: "dressCode", enabled: data.dressCode?.show !== false },
            { id: "rsvp", type: "rsvp", enabled: true }
          ]);
        }

        // Load theme or use default
        if (data.theme) {
          setPrimaryColor(data.theme.primaryColor || "#2c3e35");
          setAccentColor(data.theme.accentColor || "#d4af37");
          setBgColor(data.theme.bgColor || "#fdfbf7");
          setTextColor(data.theme.textColor || "#333333");
          setSectionPadding(data.theme.sectionPadding || "80px 20px");
          setContainerWidth(data.theme.containerWidth || "1200px");
          setFontMain(data.theme.fontMain || "'Montserrat', sans-serif");
        }

        // Hero
        setHeroNamesAm(data.hero?.names?.am || "");
        setHeroNamesRu(data.hero?.names?.ru || "");
        setHeroNamesEn(data.hero?.names?.en || "");
        setHeroTitleAm(data.hero?.title?.am || "");
        setHeroTitleRu(data.hero?.title?.ru || "");
        setHeroTitleEn(data.hero?.title?.en || "");
        setHeroBgMobileUrl(data.hero?.bgMobileUrl || "");
        setHeroBgDesktopUrl(data.hero?.bgDesktopUrl || "");

        // Calendar
        setCalTitleAm(data.calendar?.title?.am || "");
        setCalTitleRu(data.calendar?.title?.ru || "");
        setCalTitleEn(data.calendar?.title?.en || "");
        setCalIntroAm(data.calendar?.intro?.am || "");
        setCalIntroRu(data.calendar?.intro?.ru || "");
        setCalIntroEn(data.calendar?.intro?.en || "");
        setCalInviteAm(data.calendar?.invite?.am || "");
        setCalInviteRu(data.calendar?.invite?.ru || "");
        setCalInviteEn(data.calendar?.invite?.en || "");
        setEventDate(data.calendar?.eventDate ? data.calendar.eventDate.substring(0, 16) : "");
        setCalBgUrl(data.calendar?.bgUrl || "");

        // Church
        setShowChurch(data.location?.church?.show !== false);
        setChurchTitleAm(data.location?.church?.title?.am || "ԵԿԵՂԵՑԻ");
        setChurchTitleRu(data.location?.church?.title?.ru || "ЦЕРКОВЬ");
        setChurchTitleEn(data.location?.church?.title?.en || "CHURCH");
        setChurchNameAm(data.location?.church?.name?.am || "");
        setChurchNameRu(data.location?.church?.name?.ru || "");
        setChurchNameEn(data.location?.church?.name?.en || "");
        setChurchAddr1Am(data.location?.church?.address1?.am || "");
        setChurchAddr1Ru(data.location?.church?.address1?.ru || "");
        setChurchAddr1En(data.location?.church?.address1?.en || "");
        setChurchAddr2Am(data.location?.church?.address2?.am || "");
        setChurchAddr2Ru(data.location?.church?.address2?.ru || "");
        setChurchAddr2En(data.location?.church?.address2?.en || "");
        setChurchTime(data.location?.church?.time || "15:00");
        setChurchMapLink(data.location?.church?.mapLink || "");

        // Party
        setShowParty(data.location?.party?.show !== false);
        setPartyTitleAm(data.location?.party?.title?.am || "ՌԵՍՏՈՐԱՆ");
        setPartyTitleRu(data.location?.party?.title?.ru || "РЕСТОРАН");
        setPartyTitleEn(data.location?.party?.title?.en || "RESTAURANT");
        setPartyNameAm(data.location?.party?.name?.am || "");
        setPartyNameRu(data.location?.party?.name?.ru || "");
        setPartyNameEn(data.location?.party?.name?.en || "");
        setPartyAddrExtraAm(data.location?.party?.addressExtra?.am || "");
        setPartyAddrExtraRu(data.location?.party?.addressExtra?.ru || "");
        setPartyAddrExtraEn(data.location?.party?.addressExtra?.en || "");
        setPartyAddr1Am(data.location?.party?.address1?.am || "");
        setPartyAddr1Ru(data.location?.party?.address1?.ru || "");
        setPartyAddr1En(data.location?.party?.address1?.en || "");
        setPartyAddr2Am(data.location?.party?.address2?.am || "");
        setPartyAddr2Ru(data.location?.party?.address2?.ru || "");
        setPartyAddr2En(data.location?.party?.address2?.en || "");
        setPartyTime(data.location?.party?.time || "17:30");
        setPartyMapLink(data.location?.party?.mapLink || "");
        setLocBgUrl(data.location?.bgUrl || "");

        // Gallery
        setGalleryUrls(data.gallery?.images || []);

        // Dress Code
        setShowDressCode(data.dressCode?.show !== false);
        setDressDescAm(data.dressCode?.description?.am || "");
        setDressDescRu(data.dressCode?.description?.ru || "");
        setDressDescEn(data.dressCode?.description?.en || "");
        setDressColors(data.dressCode?.colors || []);

        // RSVP
        setRsvpDeadline(data.rsvp?.deadline || "");
        setHosts(data.rsvp?.hosts || []);
      }

      // Fetch secrets
      const secretsRef = doc(db, "invitationSecrets", invitationId);
      const secretsSnap = await getDoc(secretsRef);
      if (secretsSnap.exists()) {
        const secretsData = secretsSnap.data();
        setTelegramBotToken(secretsData.telegramBotToken || "");
        setTelegramChatId(secretsData.telegramChatId || "");
      }
    } catch (err) {
      console.error("Error loading invitation:", err);
      alert("Տվյալները բեռնելիս սխալ տեղի ունեցավ:");
    } finally {
      setLoading(false);
    }
  };

  const handleEventTypeChange = (type) => {
    setEventType(type);
    
    // Auto-configure sections and defaults based on selected event type
    if (type === "wedding") {
      setShowChurch(true);
      setShowParty(true);
      
      // Defaults for Wedding
      if (!heroTitleAm || heroTitleAm === "Ծննդյան Օր" || heroTitleAm === "Սուրբ Կնունք") setHeroTitleAm("Հարսանյաց Օր");
      if (!heroTitleRu || heroTitleRu === "День Рождения" || heroTitleRu === "Святое Крещение") setHeroTitleRu("День Свадьбы");
      if (!heroTitleEn || heroTitleEn === "Birthday Party" || heroTitleEn === "Holy Baptism") setHeroTitleEn("Wedding Day");
      
      if (!churchTitleAm || churchTitleAm === "ԵԿԵՂԵՑԻ") setChurchTitleAm("ԵԿԵՂԵՑԻ");
      if (!churchTitleRu || churchTitleRu === "ЦЕРКОВЬ") setChurchTitleRu("ЦЕРКОВЬ");
      if (!churchTitleEn || churchTitleEn === "CHURCH") setChurchTitleEn("CHURCH");
      
      if (!partyTitleAm || partyTitleAm === "ՄԻՋՈՑԱՌՄԱՆ ՍՐԱՀ" || partyTitleAm === "ՀԱՑԿԵՐՈՒՅԹ") setPartyTitleAm("ՌԵՍՏՈՐԱՆ");
      if (!partyTitleRu || partyTitleRu === "БАНКЕТНЫЙ ЗАЛ" || partyTitleRu === "ЗАСТОЛЬЕ") setPartyTitleRu("РЕСТОРАН");
      if (!partyTitleEn || partyTitleEn === "BANQUET HALL" || partyTitleEn === "RECEPTION") setPartyTitleEn("RESTAURANT");
    } else if (type === "birthday") {
      setShowChurch(false);
      setShowParty(true);
      
      // Defaults for Birthday
      if (!heroTitleAm || heroTitleAm === "Հարսանյաց Օր" || heroTitleAm === "Սուրբ Կնունք") setHeroTitleAm("Ծննդյան Օր");
      if (!heroTitleRu || heroTitleRu === "День Свадьбы" || heroTitleRu === "Святое Крещение") setHeroTitleRu("День Рождения");
      if (!heroTitleEn || heroTitleEn === "Wedding Day" || heroTitleEn === "Holy Baptism") setHeroTitleEn("Birthday Party");
      
      if (!partyTitleAm || partyTitleAm === "ՌԵՍՏՈՐԱՆ" || partyTitleAm === "ՀԱՑԿԵՐՈՒՅԹ") setPartyTitleAm("ՄԻՋՈՑԱՌՄԱՆ ՍՐԱՀ");
      if (!partyTitleRu || partyTitleRu === "РЕСТОРАН" || partyTitleRu === "ЗАСТОЛЬЕ") setPartyTitleRu("БАНКЕТНЫЙ ЗАЛ");
      if (!partyTitleEn || partyTitleEn === "RESTAURANT" || partyTitleEn === "RECEPTION") setPartyTitleEn("BANQUET HALL");
    } else if (type === "baptism") {
      setShowChurch(true);
      setShowParty(true);
      
      // Defaults for Baptism
      if (!heroTitleAm || heroTitleAm === "Հարսանյաց Օր" || heroTitleAm === "Ծննդյան Օր") setHeroTitleAm("Սուրբ Կնունք");
      if (!heroTitleRu || heroTitleRu === "День Свадьбы" || heroTitleRu === "День Рождения") setHeroTitleRu("Святое Крещение");
      if (!heroTitleEn || heroTitleEn === "Wedding Day" || heroTitleEn === "Birthday Party") setHeroTitleEn("Holy Baptism");
      
      if (!churchTitleAm || churchTitleAm === "ԵԿԵՂԵՑԻ") setChurchTitleAm("ԵԿԵՂԵՑԻ");
      if (!churchTitleRu || churchTitleRu === "ЦЕРКОВЬ") setChurchTitleRu("ЦЕРКОВЬ");
      if (!churchTitleEn || churchTitleEn === "CHURCH") setChurchTitleEn("CHURCH");
      
      if (!partyTitleAm || partyTitleAm === "ՌԵՍՏՈՐԱՆ" || partyTitleAm === "ՄԻՋՈՑԱՌՄԱՆ ՍՐԱՀ") setPartyTitleAm("ՀԱՑԿԵՐՈՒՅԹ");
      if (!partyTitleRu || partyTitleRu === "РЕСТОРАН" || partyTitleRu === "БАНКЕТНЫЙ ЗАЛ") setPartyTitleRu("ЗАСТОЛЬԵ");
      if (!partyTitleEn || partyTitleEn === "RESTAURANT" || partyTitleEn === "BANQUET HALL") setPartyTitleEn("RECEPTION");
    }
  };

  // Upload file helper
  const handleUpload = async (file, folder) => {
    if (!file) return null;
    const cleanSlug = slug.trim().toLowerCase();
    const storageRef = ref(storage, `invitations/${cleanSlug}/${folder}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleAddColor = () => {
    if (!dressColors.includes(newColor)) {
      setDressColors([...dressColors, newColor]);
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setDressColors(dressColors.filter((c) => c !== colorToRemove));
  };

  const handleAddHost = () => {
    if (newHostId && newHostAm) {
      setHosts([...hosts, { id: newHostId, am: newHostAm, ru: newHostRu || newHostAm, en: newHostEn || newHostAm }]);
      setNewHostId("");
      setNewHostAm("");
      setNewHostRu("");
      setNewHostEn("");
    }
  };

  const handleRemoveHost = (idToRemove) => {
    setHosts(hosts.filter((h) => h.id !== idToRemove));
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    setSections(newSections);
  };

  const moveSectionDown = (index) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    setSections(newSections);
  };

  const toggleSectionEnabled = (index) => {
    const newSections = [...sections];
    newSections[index].enabled = !newSections[index].enabled;
    if (newSections[index].type === "dressCode") {
      setShowDressCode(newSections[index].enabled);
    }
    setSections(newSections);
  };

  const addCustomSection = () => {
    const newId = "custom_" + Date.now();
    const newCustom = {
      id: newId,
      type: "customText",
      enabled: true,
      title: { am: "Նոր բաժին", ru: "Новый раздел", en: "New section" },
      content: { am: "Բովանդակություն...", ru: "Содержимое...", en: "Content..." }
    };
    setSections([...sections, newCustom]);
  };

  const removeCustomSection = (id) => {
    if (window.confirm("Վստա՞հ եք, որ ցանկանում եք ջնջել այս բաժինը / Вы уверены, что хотите удалить этот раздел?")) {
      setSections(sections.filter((s) => s.id !== id));
    }
  };

  const updateCustomSection = (id, field, lang, value) => {
    setSections(
      sections.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            [field]: {
              ...s[field],
              [lang]: value
            }
          };
        }
        return s;
      })
    );
  };

  const saveData = async () => {
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    if (!cleanSlug) {
      alert("Խնդրում ենք նշել վավեր հասցե (Slug):");
      return null;
    }

    setSaving(true);
    try {
      // 1. Upload new files if any
      let finalHeroBgMobile = heroBgMobileUrl;
      let finalHeroBgDesktop = heroBgDesktopUrl;
      let finalCalBg = calBgUrl;
      let finalLocBg = locBgUrl;
      let finalEnvelopeBg = envelopeBgUrl;
      let finalGalleryUrls = [...galleryUrls];

      if (envelopeBgFile) {
        const url = await handleUpload(envelopeBgFile, "envelope");
        if (url) finalEnvelopeBg = url;
      }
      if (heroBgMobileFile) {
        const url = await handleUpload(heroBgMobileFile, "hero");
        if (url) finalHeroBgMobile = url;
      }
      if (heroBgDesktopFile) {
        const url = await handleUpload(heroBgDesktopFile, "hero");
        if (url) finalHeroBgDesktop = url;
      }
      if (calBgFile) {
        const url = await handleUpload(calBgFile, "calendar");
        if (url) finalCalBg = url;
      }
      if (locBgFile) {
        const url = await handleUpload(locBgFile, "location");
        if (url) finalLocBg = url;
      }

      // Upload gallery photos
      if (galleryFiles.length > 0) {
        const uploadPromises = Array.from(galleryFiles).map((file) =>
          handleUpload(file, "gallery")
        );
        const uploadedUrls = await Promise.all(uploadPromises);
        finalGalleryUrls = [...finalGalleryUrls, ...uploadedUrls.filter(Boolean)];
      }

      // 2. Build Firestore Document
      const invitationDoc = {
        eventName,
        eventType,
        sealInitials,
        musicUrl,
        envelopeBgUrl: finalEnvelopeBg,
        ownerId: auth.currentUser ? auth.currentUser.uid : null,
        sections,
        theme: {
          primaryColor,
          accentColor,
          bgColor,
          textColor,
          sectionPadding,
          containerWidth,
          fontMain
        },
        hero: {
          names: { am: heroNamesAm, ru: heroNamesRu, en: heroNamesEn },
          title: { am: heroTitleAm, ru: heroTitleRu, en: heroTitleEn },
          bgMobileUrl: finalHeroBgMobile,
          bgDesktopUrl: finalHeroBgDesktop,
        },
        calendar: {
          title: { am: calTitleAm, ru: calTitleRu, en: calTitleEn },
          intro: { am: calIntroAm, ru: calIntroRu, en: calIntroEn },
          invite: { am: calInviteAm, ru: calInviteRu, en: calInviteEn },
          eventDate: eventDate ? new Date(eventDate).toISOString() : "",
          bgUrl: finalCalBg,
        },
        location: {
          title: { 
            am: churchTitleAm === "ԵԿԵՂԵՑԻ" ? "Տեղը և ժամանակացույցը" : "Место и расписание", 
            ru: "Место и расписание",
            en: "Location & Schedule"
          },
          church: {
            show: showChurch,
            title: { am: churchTitleAm, ru: churchTitleRu, en: churchTitleEn },
            name: { am: churchNameAm, ru: churchNameRu, en: churchNameEn },
            address1: { am: churchAddr1Am, ru: churchAddr1Ru, en: churchAddr1En },
            address2: { am: churchAddr2Am, ru: churchAddr2Ru, en: churchAddr2En },
            time: churchTime,
            mapLink: churchMapLink,
          },
          party: {
            show: showParty,
            title: { am: partyTitleAm, ru: partyTitleRu, en: partyTitleEn },
            name: { am: partyNameAm, ru: partyNameRu, en: partyNameEn },
            addressExtra: { am: partyAddrExtraAm, ru: partyAddrExtraRu, en: partyAddrExtraEn },
            address1: { am: partyAddr1Am, ru: partyAddr1Ru, en: partyAddr1En },
            address2: { am: partyAddr2Am, ru: partyAddr2Ru, en: partyAddr2En },
            time: partyTime,
            mapLink: partyMapLink,
          },
          bgUrl: finalLocBg,
        },
        gallery: {
          images: finalGalleryUrls,
        },
        dressCode: {
          show: showDressCode,
          description: { am: dressDescAm, ru: dressDescRu, en: dressDescEn },
          colors: dressColors,
        },
        rsvp: {
          deadline: rsvpDeadline,
          hosts: hosts,
        },
      };

      // Save public details
      await setDoc(doc(db, "invitations", cleanSlug), invitationDoc);

      // Save secrets
      const secretsDoc = {
        telegramBotToken: telegramBotToken.trim(),
        telegramChatId: telegramChatId.trim(),
      };
      await setDoc(doc(db, "invitationSecrets", cleanSlug), secretsDoc);

      // Reset file selection states
      setEnvelopeBgFile(null);
      setHeroBgMobileFile(null);
      setHeroBgDesktopFile(null);
      setCalBgFile(null);
      setLocBgFile(null);
      setGalleryFiles([]);

      // Update URL states
      setEnvelopeBgUrl(finalEnvelopeBg);
      setHeroBgMobileUrl(finalHeroBgMobile);
      setHeroBgDesktopUrl(finalHeroBgDesktop);
      setCalBgUrl(finalCalBg);
      setLocBgUrl(finalLocBg);
      setGalleryUrls(finalGalleryUrls);

      return cleanSlug;
    } catch (err) {
      console.error("Error saving invitation:", err);
      alert("Պահպանելիս սխալ տեղի ունեցավ:");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanSlug = await saveData();
    if (cleanSlug) {
      alert("Հաջողությամբ պահպանվեց:");
      onSuccess();
    }
  };

  const handlePreview = async () => {
    const cleanSlug = await saveData();
    if (cleanSlug) {
      setPreviewSlug(cleanSlug);
      setShowPreviewModal(true);
    }
  };

  if (loading) {
    return <div className="form-loading">Բեռնվում է...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-title-row">
        <h2>{mode === "create" ? "Ստեղծել նոր հրավեր" : "Խմբագրել հրավերը"}</h2>
        <div className="form-actions-top">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Չեղարկել / Отмена
          </button>
          <button type="button" className="preview-btn" onClick={handlePreview} disabled={saving}>
            <FaMobileAlt style={{ marginRight: "4px" }} /> Նախադիտում / Превью
          </button>
          <button type="button" className="save-btn" onClick={handleSubmit} disabled={saving}>
            {saving ? "Պահպանվում է..." : "Պահպանել / Сохранить"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="form-tabs">
        {["general", "sections", "theme", "hero", "calendar_location", "gallery", "dress_code", "rsvp_telegram"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="form-body">
        {/* Tab 1: General */}
        {activeTab === "general" && (
          <div className="tab-pane">
            <div className="form-grid">
              <div className="form-field full-width">
                <label>Հասցեի Slug (օր.՝ robert-lusine) *</label>
                <input
                  type="text"
                  placeholder="robert-lusine"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={mode === "edit"}
                  required
                />
                <small>Այս Slug-ը կօգտագործվի URL-ում (օրինակ՝ /i/robert-lusine): Միայն փոքրատառեր, թվեր և գծիկներ:</small>
              </div>

              <div className="form-field">
                <label>Միջոցառման անուն (ներքին օգտագործման)</label>
                <input
                  type="text"
                  placeholder="Ռոբերտի և Լուսինեի հարսանիքը"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Միջոցառման տեսակ (Occasion / Event Type)</label>
                <select
                  value={eventType}
                  onChange={(e) => handleEventTypeChange(e.target.value)}
                  style={{
                    padding: "12px",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    color: "#1e293b",
                    fontSize: "0.95rem",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="wedding">Հարսանիք / Свадьба / Wedding</option>
                  <option value="birthday">Ծննդյան օր / День рождения / Birthday</option>
                  <option value="baptism">Կնունք / Крещение / Baptism</option>
                  <option value="other">Այլ միջոցառում / Другое / Other</option>
                </select>
              </div>

              <div className="form-field">
                <label>Կնիքի տառերը (Initials, օր.՝ RL)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={sealInitials}
                  onChange={(e) => setSealInitials(e.target.value)}
                />
              </div>

              <div className="form-field full-width">
                <label>Երաժշտության URL (Music file link or path)</label>
                <input
                  type="text"
                  value={musicUrl}
                  onChange={(e) => setMusicUrl(e.target.value)}
                />
                <small>Կարող եք թողնել լռելյայն `/wedding-audio.mp3` կամ տեղադրել այլ հղում:</small>
              </div>

              <div className="form-field full-width">
                <label>Ծրարի/նամակի ֆոնային նկար (Envelope/Letter BG Image)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEnvelopeBgFile(e.target.files[0])}
                />
                {envelopeBgUrl && (
                  <div className="preview-img-container">
                    <img src={envelopeBgUrl} alt="Envelope Preview" className="preview-thumb" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 1.5: Sections */}
        {activeTab === "sections" && (
          <div className="tab-pane">
            <h3>Բաժինների դասավորություն / Настройка разделов</h3>
            <p className="tab-desc" style={{ color: "#a3b899", fontSize: "0.85rem", marginBottom: "20px" }}>
              Դասավորեք բաժինները ըստ ցանկության և միացրեք կամ անջատեք դրանք (ինչպես WordPress-ում):
            </p>

            <div className="sections-list">
              {sections.map((section, index) => {
                const isFirst = index === 0;
                const isLast = index === sections.length - 1;
                const sectionNames = {
                  hero: "Գլխավոր / Главная",
                  calendar: "Օրացույց / Календарь",
                  location: "Տեղանք / Локация",
                  gallery: "Պատկերասրահ / Галерея",
                  dressCode: "Դրեսս Կոդ / Дресс-код",
                  rsvp: "Հաստատում (RSVP) / Подтверждение",
                  customText: `Հատուկ բաժին / Свой раздел (${section.title?.am || "Նոր"})`
                };

                return (
                  <div key={section.id} className="section-item-card">
                    <div className="section-item-header">
                      <div className="section-item-info">
                        <span className="section-badge">{section.type}</span>
                        <span className="section-title-label">{sectionNames[section.type] || section.type}</span>
                      </div>
                      
                      <div className="section-item-actions">
                        <button
                          type="button"
                          className="reorder-btn"
                          onClick={() => moveSectionUp(index)}
                          disabled={isFirst}
                          title="Տեղափոխել վերև"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          className="reorder-btn"
                          onClick={() => moveSectionDown(index)}
                          disabled={isLast}
                          title="Տեղափոխել ներքև"
                        >
                          ▼
                        </button>
                        
                        <button
                          type="button"
                          className={`toggle-section-btn ${section.enabled ? "enabled" : "disabled"}`}
                          onClick={() => toggleSectionEnabled(index)}
                        >
                          {section.enabled ? "Միացված / Вкл" : "Անջատված / Выкл"}
                        </button>

                        {section.type === "customText" && (
                          <button
                            type="button"
                            className="delete-section-btn"
                            onClick={() => removeCustomSection(section.id)}
                          >
                            Ջնջել / Удалить
                          </button>
                        )}
                      </div>
                    </div>

                    {section.type === "customText" && (
                      <div className="custom-section-edit-grid">
                        <div className="form-field">
                          <label>Վերնագիր AM</label>
                          <input
                            type="text"
                            value={section.title?.am || ""}
                            onChange={(e) => updateCustomSection(section.id, "title", "am", e.target.value)}
                          />
                        </div>
                        <div className="form-field">
                          <label>Վերնագիր RU</label>
                          <input
                            type="text"
                            value={section.title?.ru || ""}
                            onChange={(e) => updateCustomSection(section.id, "title", "ru", e.target.value)}
                          />
                        </div>
                        <div className="form-field">
                          <label>Վերնագիր EN</label>
                          <input
                            type="text"
                            value={section.title?.en || ""}
                            onChange={(e) => updateCustomSection(section.id, "title", "en", e.target.value)}
                          />
                        </div>
                        <div className="form-field">
                          <label>Տեքստ AM</label>
                          <textarea
                            value={section.content?.am || ""}
                            onChange={(e) => updateCustomSection(section.id, "content", "am", e.target.value)}
                          />
                        </div>
                        <div className="form-field">
                          <label>Տեքստ RU</label>
                          <textarea
                            value={section.content?.ru || ""}
                            onChange={(e) => updateCustomSection(section.id, "content", "ru", e.target.value)}
                          />
                        </div>
                        <div className="form-field">
                          <label>Տեքստ EN</label>
                          <textarea
                            value={section.content?.en || ""}
                            onChange={(e) => updateCustomSection(section.id, "content", "en", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button type="button" className="add-section-btn" onClick={addCustomSection}>
              + Ավելացնել հատուկ բաժին / Добавить свой раздел
            </button>
          </div>
        )}

        {/* Tab 1.6: Theme / Styler */}
        {activeTab === "theme" && (
          <div className="tab-pane">
            <h3>Դիզայնի կարգավորումներ / Настройка дизайна (Styler)</h3>
            <p className="tab-desc" style={{ color: "#a3b899", fontSize: "0.85rem", marginBottom: "20px" }}>
              Անհատականացրեք ձեր հրավիրատոմսի գույները, տառատեսակները և դասավորությունը:
            </p>

            <div className="form-grid">
              <div className="form-field">
                <label>Հիմնական գույն (Primary Color)</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Ակցենտային գույն (Accent/Gold Color)</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Ֆոնի գույն (Background Color)</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Տեքստի գույն (Text Color)</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Բաժնի հեռավորություն (Section Padding)</label>
                <input
                  type="text"
                  placeholder="80px 20px"
                  value={sectionPadding}
                  onChange={(e) => setSectionPadding(e.target.value)}
                />
                <small>Օրինակ՝ `80px 20px` (վերև/ներքև և աջ/ձախ):</small>
              </div>

              <div className="form-field">
                <label>Առավելագույն լայնություն (Container Width)</label>
                <input
                  type="text"
                  placeholder="1200px"
                  value={containerWidth}
                  onChange={(e) => setContainerWidth(e.target.value)}
                />
                <small>Օրինակ՝ `1200px` կամ `100%`:</small>
              </div>

              <div className="form-field full-width">
                <label>Տառատեսակ (Main Font)</label>
                <select
                  value={fontMain}
                  onChange={(e) => setFontMain(e.target.value)}
                  style={{
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option style={{ background: "#1c2e24", color: "#fff" }} value="'Montserrat', sans-serif">Montserrat (Modern Sans-Serif)</option>
                  <option style={{ background: "#1c2e24", color: "#fff" }} value="'Playfair Display', serif">Playfair Display (Elegant Serif)</option>
                  <option style={{ background: "#1c2e24", color: "#fff" }} value="'Inter', sans-serif">Inter (Clean Neutral)</option>
                  <option style={{ background: "#1c2e24", color: "#fff" }} value="'Cormorant Garamond', serif">Cormorant Garamond (Classic Wedding Serif)</option>
                  <option style={{ background: "#1c2e24", color: "#fff" }} value="'Great Vibes', cursive">Great Vibes (Romantic Script)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hero */}
        {activeTab === "hero" && (
          <div className="tab-pane">
            <h3>Գլխավոր Էջ / Hero Section</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Անուններ (Հայերեն)</label>
                <input type="text" value={heroNamesAm} onChange={(e) => setHeroNamesAm(e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Անուններ (Ռուսերեն)</label>
                <input type="text" value={heroNamesRu} onChange={(e) => setHeroNamesRu(e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Անուններ (Անգլերեն)</label>
                <input type="text" value={heroNamesEn} onChange={(e) => setHeroNamesEn(e.target.value)} required />
              </div>

              <div className="form-field">
                <label>Վերնագիր (Հայերեն)</label>
                <input type="text" value={heroTitleAm} onChange={(e) => setHeroTitleAm(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Վերնագիր (Ռուսերեն)</label>
                <input type="text" value={heroTitleRu} onChange={(e) => setHeroTitleRu(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Վերնագիր (Անգլերեն)</label>
                <input type="text" value={heroTitleEn} onChange={(e) => setHeroTitleEn(e.target.value)} />
              </div>

              <div className="form-field">
                <label>Հեռախոսի ֆոնային նկար (Mobile BG)</label>
                <input type="file" accept="image/*" onChange={(e) => setHeroBgMobileFile(e.target.files[0])} />
                {heroBgMobileUrl && <div className="preview-img-container"><img src={heroBgMobileUrl} alt="Preview" className="preview-thumb" /></div>}
              </div>

              <div className="form-field">
                <label>Համակարգչի ֆոնային նկար (Desktop BG)</label>
                <input type="file" accept="image/*" onChange={(e) => setHeroBgDesktopFile(e.target.files[0])} />
                {heroBgDesktopUrl && <div className="preview-img-container"><img src={heroBgDesktopUrl} alt="Preview" className="preview-thumb" /></div>}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Calendar & Location */}
        {activeTab === "calendar_location" && (
          <div className="tab-pane">
            <h3>Օրացույց / Calendar</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Ամսաթիվ և Ժամ (Event Date & Time)</label>
                <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Օրացույցի ֆոնային նկար</label>
                <input type="file" accept="image/*" onChange={(e) => setCalBgFile(e.target.files[0])} />
                {calBgUrl && <div className="preview-img-container"><img src={calBgUrl} alt="Preview" className="preview-thumb" /></div>}
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
                <label>Տեղանքի բաժնի ֆոնային նկար</label>
                <input type="file" accept="image/*" onChange={(e) => setLocBgFile(e.target.files[0])} />
                {locBgUrl && <div className="preview-img-container"><img src={locBgUrl} alt="Preview" className="preview-thumb" /></div>}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Gallery */}
        {activeTab === "gallery" && (
          <div className="tab-pane">
            <h3>Լուսանկարների Սրահ / Gallery</h3>
            <div className="gallery-upload-section">
              <label className="upload-box">
                <span>+ Ավելացնել լուսանկարներ / Добавить фото</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setGalleryFiles(e.target.files)}
                />
              </label>
              {galleryFiles.length > 0 && (
                <div className="selected-files-list">
                  <p>Ընտրված նոր ֆայլեր ({galleryFiles.length})՝</p>
                  <ul>
                    {Array.from(galleryFiles).map((f, idx) => (
                      <li key={idx}>{f.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="existing-gallery">
              <h4>Առկա լուսանկարներ ({galleryUrls.length})</h4>
              {galleryUrls.length === 0 ? (
                <p className="no-images">Նկարներ դեռ չկան:</p>
              ) : (
                <div className="gallery-thumbs-grid">
                  {galleryUrls.map((url, idx) => (
                    <div key={idx} className="gallery-thumb-card">
                      <img src={url} alt={`Gallery ${idx}`} />
                      <button
                        type="button"
                        className="delete-thumb-btn"
                        onClick={() => setGalleryUrls(galleryUrls.filter((_, i) => i !== idx))}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Dress Code */}
        {activeTab === "dress_code" && (
          <div className="tab-pane">
            <div className="dresscode-toggle">
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={showDressCode}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setShowDressCode(val);
                    setSections(sections.map(s => s.type === "dressCode" ? { ...s, enabled: val } : s));
                  }}
                />
                Ցուցադրել Dress Code-ը / Показать дресс-код
              </label>
            </div>

            {showDressCode && (
              <div className="dresscode-settings form-grid">
                <div className="form-field">
                  <label>Նկարագրություն AM</label>
                  <textarea value={dressDescAm} onChange={(e) => setDressDescAm(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Նկարագրություն RU</label>
                  <textarea value={dressDescRu} onChange={(e) => setDressDescRu(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Նկարագրություն EN</label>
                  <textarea value={dressDescEn} onChange={(e) => setDressDescEn(e.target.value)} />
                </div>

                <div className="form-field full-width">
                  <label>Գունային Գամմա / Цветовая гамма</label>
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                    />
                    <button type="button" className="add-color-btn" onClick={handleAddColor}>
                      + Ավելացնել գույն
                    </button>
                  </div>

                  <div className="colors-preview-list">
                    {dressColors.map((c, idx) => (
                      <div key={idx} className="color-badge" style={{ backgroundColor: c }}>
                        <span className="color-hex">{c}</span>
                        <button
                          type="button"
                          className="remove-color-badge"
                          onClick={() => handleRemoveColor(c)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: RSVP & Telegram */}
        {activeTab === "rsvp_telegram" && (
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
        )}
      </form>

      {/* iPhone 17 Preview Modal */}
      {showPreviewModal && previewSlug && (
        <div className="preview-modal-overlay" onClick={() => setShowPreviewModal(false)}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h3>iPhone 17 Նախադիտում / Предпросмотр iPhone 17</h3>
              <button className="preview-modal-close" onClick={() => setShowPreviewModal(false)}>
                &times;
              </button>
            </div>
            <div className="preview-device-container">
              <div className="iphone-17-frame">
                {/* Dynamic Island */}
                <div className="dynamic-island"></div>
                {/* Screen frame */}
                <div className="iphone-screen">
                  <iframe 
                    src={`/i/${previewSlug}?preview=true`} 
                    title="iPhone 17 Preview"
                    className="preview-iframe"
                  />
                </div>
                {/* Side buttons */}
                <div className="iphone-btn volume-up"></div>
                <div className="iphone-btn volume-down"></div>
                <div className="iphone-btn action-button"></div>
                <div className="iphone-btn power-button"></div>
                {/* Home Indicator */}
                <div className="home-indicator"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
