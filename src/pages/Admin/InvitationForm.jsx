import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../firebase";
import { Card, Button, Tabs, Modal, Spin, Typography, message, Space } from "antd";
import { MobileOutlined, SaveOutlined } from "@ant-design/icons";
import "./InvitationForm.css";

// Sub-tab Components
import GeneralTab from "./tabs/GeneralTab";
import SectionsTab from "./tabs/SectionsTab";
import ThemeTab from "./tabs/ThemeTab";
import HeroTab from "./tabs/HeroTab";
import CalendarLocationTab from "./tabs/CalendarLocationTab";
import GalleryTab from "./tabs/GalleryTab";
import DressCodeTab from "./tabs/DressCodeTab";
import RsvpTelegramTab from "./tabs/RsvpTelegramTab";

const { Title, Text } = Typography;

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
      message.error("Տվյալները բեռնելիս սխալ տեղի ունեցավ / Error loading details.");
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
      if (!partyTitleRu || partyTitleRu === "БАНԿЕТНЫЙ ЗАЛ" || partyTitleRu === "ЗАСТОЛЬԵ") setPartyTitleRu("РЕСТОРАН");
      if (!partyTitleEn || partyTitleEn === "BANQUET HALL" || partyTitleEn === "RECEPTION") setPartyTitleEn("RESTAURANT");
    } else if (type === "birthday") {
      setShowChurch(false);
      setShowParty(true);
      
      // Defaults for Birthday
      if (!heroTitleAm || heroTitleAm === "Հարսանյաց Օր" || heroTitleAm === "Սուրբ Կնունք") setHeroTitleAm("Ծննդյան Օր");
      if (!heroTitleRu || heroTitleRu === "День Свадьбы" || heroTitleRu === "Святое Крещение") setHeroTitleRu("День Рождения");
      if (!heroTitleEn || heroTitleEn === "Wedding Day" || heroTitleEn === "Holy Baptism") setHeroTitleEn("Birthday Party");
      
      if (!partyTitleAm || partyTitleAm === "ՌԵՍՏՈՐԱՆ" || partyTitleAm === "ՀԱՑԿԵՐՈՒՅԹ") setPartyTitleAm("ՄԻՋՈՑԱՌՄԱՆ ՍՐԱՀ");
      if (!partyTitleRu || partyTitleRu === "РЕСТОРАН" || partyTitleRu === "ЗАСТОЛЬԵ") setPartyTitleRu("БАНԿЕТНЫЙ ЗАЛ");
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
      if (!partyTitleRu || partyTitleRu === "РЕСТОРАН" || partyTitleRu === "БАНԿЕТНЫЙ ЗАЛ") setPartyTitleRu("ЗАСТОЛЬԵ");
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
    Modal.confirm({
      title: "Ջնջել բաժինը / Удалить раздел",
      content: "Վստա՞հ եք, որ ցանկանում եք ջնջել այս բաժինը / Вы уверены, что хотите удалить этот раздел?",
      okText: "Yes",
      cancelText: "No",
      okButtonProps: { danger: true },
      onOk: () => {
        setSections(sections.filter((s) => s.id !== id));
      }
    });
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
      message.warning("Խնդրում ենք նշել վավեր հասցե (Slug): / Please specify a valid slug.");
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
      message.error("Պահպանելիս սխալ տեղի ունեցավ / Error saving details.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanSlug = await saveData();
    if (cleanSlug) {
      message.success("Հաջողությամբ պահպանվեց / Saved successfully.");
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
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" />
        <Text style={{ display: "block", marginTop: 16 }}>Բեռնվում է... / Loading form details...</Text>
      </div>
    );
  }

  const tabItems = [
    {
      key: "general",
      label: "GENERAL",
      children: (
        <GeneralTab
          mode={mode}
          slug={slug}
          setSlug={setSlug}
          eventName={eventName}
          setEventName={setEventName}
          eventType={eventType}
          handleEventTypeChange={handleEventTypeChange}
          sealInitials={sealInitials}
          setSealInitials={setSealInitials}
          musicUrl={musicUrl}
          setMusicUrl={setMusicUrl}
          envelopeBgFile={envelopeBgFile}
          setEnvelopeBgFile={setEnvelopeBgFile}
          envelopeBgUrl={envelopeBgUrl}
          setEnvelopeBgUrl={setEnvelopeBgUrl}
        />
      )
    },
    {
      key: "sections",
      label: "SECTIONS",
      children: (
        <SectionsTab
          sections={sections}
          moveSectionUp={moveSectionUp}
          moveSectionDown={moveSectionDown}
          toggleSectionEnabled={toggleSectionEnabled}
          addCustomSection={addCustomSection}
          removeCustomSection={removeCustomSection}
          updateCustomSection={updateCustomSection}
        />
      )
    },
    {
      key: "theme",
      label: "THEME",
      children: (
        <ThemeTab
          primaryColor={primaryColor}
          setPrimaryColor={setPrimaryColor}
          accentColor={accentColor}
          setAccentColor={setAccentColor}
          bgColor={bgColor}
          setBgColor={setBgColor}
          textColor={textColor}
          setTextColor={setTextColor}
          sectionPadding={sectionPadding}
          setSectionPadding={setSectionPadding}
          containerWidth={containerWidth}
          setContainerWidth={setContainerWidth}
          fontMain={fontMain}
          setFontMain={setFontMain}
        />
      )
    },
    {
      key: "hero",
      label: "HERO IMAGE",
      children: (
        <HeroTab
          heroNamesAm={heroNamesAm}
          setHeroNamesAm={setHeroNamesAm}
          heroNamesRu={heroNamesRu}
          setHeroNamesRu={setHeroNamesRu}
          heroNamesEn={heroNamesEn}
          setHeroNamesEn={setHeroNamesEn}
          heroTitleAm={heroTitleAm}
          setHeroTitleAm={setHeroTitleAm}
          heroTitleRu={heroTitleRu}
          setHeroTitleRu={setHeroTitleRu}
          heroTitleEn={heroTitleEn}
          setHeroTitleEn={setHeroTitleEn}
          heroBgMobileFile={heroBgMobileFile}
          setHeroBgMobileFile={setHeroBgMobileFile}
          heroBgMobileUrl={heroBgMobileUrl}
          setHeroBgMobileUrl={setHeroBgMobileUrl}
          heroBgDesktopFile={heroBgDesktopFile}
          setHeroBgDesktopFile={setHeroBgDesktopFile}
          heroBgDesktopUrl={heroBgDesktopUrl}
          setHeroBgDesktopUrl={setHeroBgDesktopUrl}
        />
      )
    },
    {
      key: "calendar_location",
      label: "CALENDAR & LOCATION",
      children: (
        <CalendarLocationTab
          eventDate={eventDate}
          setEventDate={setEventDate}
          calBgFile={calBgFile}
          setCalBgFile={setCalBgFile}
          calBgUrl={calBgUrl}
          setCalBgUrl={setCalBgUrl}
          calTitleAm={calTitleAm}
          setCalTitleAm={setCalTitleAm}
          calTitleRu={calTitleRu}
          setCalTitleRu={setCalTitleRu}
          calTitleEn={calTitleEn}
          setCalTitleEn={setCalTitleEn}
          calIntroAm={calIntroAm}
          setCalIntroAm={setCalIntroAm}
          calIntroRu={calIntroRu}
          setCalIntroRu={setCalIntroRu}
          calIntroEn={calIntroEn}
          setCalIntroEn={setCalIntroEn}
          calInviteAm={calInviteAm}
          setCalInviteAm={setCalInviteAm}
          calInviteRu={calInviteRu}
          setCalInviteRu={setCalInviteRu}
          calInviteEn={calInviteEn}
          setCalInviteEn={setCalInviteEn}
          showChurch={showChurch}
          setShowChurch={setShowChurch}
          showParty={showParty}
          setShowParty={setShowParty}
          churchTitleAm={churchTitleAm}
          setChurchTitleAm={setChurchTitleAm}
          churchTitleRu={churchTitleRu}
          setChurchTitleRu={setChurchTitleRu}
          churchTitleEn={churchTitleEn}
          setChurchTitleEn={setChurchTitleEn}
          churchNameAm={churchNameAm}
          setChurchNameAm={setChurchNameAm}
          churchNameRu={churchNameRu}
          setChurchNameRu={setChurchNameRu}
          churchNameEn={churchNameEn}
          setChurchNameEn={setChurchNameEn}
          churchAddr1Am={churchAddr1Am}
          setChurchAddr1Am={setChurchAddr1Am}
          churchAddr1Ru={churchAddr1Ru}
          setChurchAddr1Ru={setChurchAddr1Ru}
          churchAddr1En={churchAddr1En}
          setChurchAddr1En={setChurchAddr1En}
          churchAddr2Am={churchAddr2Am}
          setChurchAddr2Am={setChurchAddr2Am}
          churchAddr2Ru={churchAddr2Ru}
          setChurchAddr2Ru={setChurchAddr2Ru}
          churchAddr2En={churchAddr2En}
          setChurchAddr2En={setChurchAddr2En}
          churchTime={churchTime}
          setChurchTime={setChurchTime}
          churchMapLink={churchMapLink}
          setChurchMapLink={setChurchMapLink}
          partyTitleAm={partyTitleAm}
          setPartyTitleAm={setPartyTitleAm}
          partyTitleRu={partyTitleRu}
          setPartyTitleRu={setPartyTitleRu}
          partyTitleEn={partyTitleEn}
          setPartyTitleEn={setPartyTitleEn}
          partyNameAm={partyNameAm}
          setPartyNameAm={setPartyNameAm}
          partyNameRu={partyNameRu}
          setPartyNameRu={setPartyNameRu}
          partyNameEn={partyNameEn}
          setPartyNameEn={setPartyNameEn}
          partyAddrExtraAm={partyAddrExtraAm}
          setPartyAddrExtraAm={setPartyAddrExtraAm}
          partyAddrExtraRu={partyAddrExtraRu}
          setPartyAddrExtraRu={setPartyAddrExtraRu}
          partyAddrExtraEn={partyAddrExtraEn}
          setPartyAddrExtraEn={setPartyAddrExtraEn}
          partyAddr1Am={partyAddr1Am}
          setPartyAddr1Am={setPartyAddr1Am}
          partyAddr1Ru={partyAddr1Ru}
          setPartyAddr1Ru={setPartyAddr1Ru}
          partyAddr1En={partyAddr1En}
          setPartyAddr1En={setPartyAddr1En}
          partyAddr2Am={partyAddr2Am}
          setPartyAddr2Am={setPartyAddr2Am}
          partyAddr2Ru={partyAddr2Ru}
          setPartyAddr2Ru={setPartyAddr2Ru}
          partyAddr2En={partyAddr2En}
          setPartyAddr2En={setPartyAddr2En}
          partyTime={partyTime}
          setPartyTime={setPartyTime}
          partyMapLink={partyMapLink}
          setPartyMapLink={setPartyMapLink}
          locBgFile={locBgFile}
          setLocBgFile={setLocBgFile}
          locBgUrl={locBgUrl}
          setLocBgUrl={setLocBgUrl}
        />
      )
    },
    {
      key: "gallery",
      label: "GALLERY",
      children: (
        <GalleryTab
          setGalleryFiles={setGalleryFiles}
          galleryFiles={galleryFiles}
          galleryUrls={galleryUrls}
          setGalleryUrls={setGalleryUrls}
        />
      )
    },
    {
      key: "dress_code",
      label: "DRESS CODE",
      children: (
        <DressCodeTab
          showDressCode={showDressCode}
          setShowDressCode={setShowDressCode}
          sections={sections}
          setSections={setSections}
          dressDescAm={dressDescAm}
          setDressDescAm={setDressDescAm}
          dressDescRu={dressDescRu}
          setDressDescRu={setDressDescRu}
          dressDescEn={dressDescEn}
          setDressDescEn={setDressDescEn}
          newColor={newColor}
          setNewColor={setNewColor}
          handleAddColor={handleAddColor}
          dressColors={dressColors}
          handleRemoveColor={handleRemoveColor}
        />
      )
    },
    {
      key: "rsvp_telegram",
      label: "RSVP & TELEGRAM",
      children: (
        <RsvpTelegramTab
          rsvpDeadline={rsvpDeadline}
          setRsvpDeadline={setRsvpDeadline}
          newHostId={newHostId}
          setNewHostId={setNewHostId}
          newHostAm={newHostAm}
          setNewHostAm={setNewHostAm}
          newHostRu={newHostRu}
          setNewHostRu={setNewHostRu}
          newHostEn={newHostEn}
          setNewHostEn={setNewHostEn}
          handleAddHost={handleAddHost}
          hosts={hosts}
          handleRemoveHost={handleRemoveHost}
          telegramBotToken={telegramBotToken}
          setTelegramBotToken={setTelegramBotToken}
          telegramChatId={telegramChatId}
          setTelegramChatId={setTelegramChatId}
        />
      )
    }
  ];

  return (
    <div className="form-container">
      <div className="form-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <Title level={2} style={{ margin: 0 }}>
          {mode === "create" ? "Ստեղծել նոր հրավեր" : "Խմբագրել հրավերը"}
        </Title>
        <Space>
          <Button onClick={onCancel}>
            Չեղարկել / Cancel
          </Button>
          <Button 
            icon={<MobileOutlined />} 
            onClick={handlePreview} 
            disabled={saving}
          >
            Նախադիտում / Preview
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSubmit} 
            loading={saving}
            style={{ backgroundColor: "#2c3e35" }}
          >
            Պահպանել / Save
          </Button>
        </Space>
      </div>

      <Card bordered={false} styles={{ body: { padding: "10px 24px" } }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          items={tabItems}
          type="card"
        />
      </Card>

      {/* iPhone 17 Preview Modal */}
      <Modal
        title="iPhone 17 Նախադիտում / Предпросмотр iPhone 17"
        open={showPreviewModal}
        onCancel={() => setShowPreviewModal(false)}
        footer={null}
        width={380}
        centered
        className="preview-device-modal"
        styles={{ body: { padding: 0 } }}
      >
        <div className="preview-device-container" style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
          <div className="iphone-17-frame">
            {/* Dynamic Island */}
            <div className="dynamic-island"></div>
            {/* Screen frame */}
            <div className="iphone-screen">
              {previewSlug && (
                <iframe 
                  src={`/i/${previewSlug}?preview=true`} 
                  title="iPhone 17 Preview"
                  className="preview-iframe"
                />
              )}
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
      </Modal>
    </div>
  );
}
