import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import EnvelopeIntro from "../HomeStart/EnvelopeIntro";
import GiftBoxIntro from "../HomeStart/GiftBoxIntro";
import ScrollIntro from "../HomeStart/ScrollIntro";
import CurtainIntro from "../HomeStart/CurtainIntro";
import SplashIntro from "../HomeStart/SplashIntro";
import GatefoldIntro from "../HomeStart/GatefoldIntro";
import Home from "../Home/Home";
import "./InvitationLoader.css";

export default function InvitationLoader() {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const id = paramId || searchParams.get("id");
  const [invitationData, setInvitationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [isEnvelopeRemoved, setIsEnvelopeRemoved] = useState(false);
  const isPreview = searchParams.get("preview") === "true";

  console.log("InvitationLoader rendering. id:", id, "isPreview:", isPreview, "searchParams:", searchParams.toString());

  useEffect(() => {
    if (!isPreview) return;

    document.body.classList.add("preview-mode");

    let isDown = false;
    let startY;
    let scrollTop;

    const handleMouseDown = (e) => {
      // Don't drag-scroll if clicking interactive inputs/buttons
      if (
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "A" ||
        e.target.tagName === "INPUT" ||
        e.target.tagName === "SELECT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.closest("button") ||
        e.target.closest("a") ||
        e.target.closest(".seal") ||
        e.target.closest(".lang-dropdown-btn") ||
        e.target.closest(".language-switcher-btn") ||
        e.target.closest(".nav-admin-btn")
      ) {
        return;
      }
      isDown = true;
      document.body.classList.add("grabbing");
      startY = e.clientY;
      scrollTop = window.scrollY || document.documentElement.scrollTop;
    };

    const handleMouseLeave = () => {
      isDown = false;
      document.body.classList.remove("grabbing");
    };

    const handleMouseUp = () => {
      isDown = false;
      document.body.classList.remove("grabbing");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const y = e.clientY;
      const walk = (y - startY) * 1.5; // Scroll speed multiplier
      window.scrollTo(0, scrollTop - walk);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.body.classList.remove("preview-mode");
      document.body.classList.remove("grabbing");
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isPreview]);
  
  // Prevent scrolling while envelope is active and scroll to top when it starts opening / unmounts
  useEffect(() => {
    if (isPreview) return; // Don't lock scroll in preview mode
    if (!isEnvelopeRemoved) {
      window.scrollTo(0, 0);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "";
      };
    } else {
      window.scrollTo(0, 0);
    }
  }, [isEnvelopeRemoved, isEnvelopeOpened, isPreview]);

  const mergePreviewData = (prev, data) => {
    const merged = { ...prev, ...data };
    if (prev && prev.theme && data.theme) {
      merged.theme = { ...prev.theme, ...data.theme };
    }
    if (prev && prev.calendar && data.calendar) {
      merged.calendar = { ...prev.calendar, ...data.calendar };
    }
    if (prev && prev.location && data.location) {
      merged.location = { ...prev.location, ...data.location };
    }
    if (prev && prev.dressCode && data.dressCode) {
      merged.dressCode = { ...prev.dressCode, ...data.dressCode };
    }
    if (prev && prev.rsvpTelegram && data.rsvpTelegram) {
      merged.rsvpTelegram = { ...prev.rsvpTelegram, ...data.rsvpTelegram };
    }
    if (prev && prev.hero && data.hero) {
      merged.hero = { ...prev.hero, ...data.hero };
    }
    return merged;
  };

  useEffect(() => {
    if (!isPreview) return;

    const handleMessage = (e) => {
      console.log("Iframe received message event. Origin:", e.origin, "Data:", e.data);
      if (e.origin !== window.location.origin) {
        console.warn("Origin check failed. Expected:", window.location.origin, "Got:", e.origin);
        return;
      }

      if (e.data && e.data.type === "INVITATION_PREVIEW_UPDATE") {
        console.log("Iframe INVITATION_PREVIEW_UPDATE received successfully. Data:", e.data.data);
        setInvitationData((prev) => mergePreviewData(prev, e.data.data));
        setLoading(false);
        setError(false);
      }
    };

    // Expose direct update function for same-origin parent window
    window.updatePreviewData = (data) => {
      console.log("Direct updatePreviewData called. Data:", data);
      setInvitationData((prev) => mergePreviewData(prev, data));
      setLoading(false);
      setError(false);
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      delete window.updatePreviewData;
    };
  }, [isPreview]);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        setLoading(true);
        setError(false);
        const docRef = doc(db, "invitations", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setInvitationData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching invitation:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvitation();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="premium-spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
        <p className="loader-text">Բեռնվում է / Загрузка... / Loading...</p>
      </div>
    );
  }

  if (error || !invitationData) {
    return (
      <div className="not-found-container">
        <div className="not-found-card">
          <h1>404</h1>
          <h2>Հրավերը չի գտնվել</h2>
          <p>Մուտքագրված հասցեով հրավեր գոյություն չունի:</p>
          <hr className="gold-divider" />
          <h2>Приглашение не найдено</h2>
          <p>Приглашение по указанному адресу не существует.</p>
          <hr className="gold-divider" />
          <h2>Invitation not found</h2>
          <p>The invitation at the specified address does not exist.</p>
        </div>
      </div>
    );
  }

  const renderIntro = () => {
    const props = {
      onStartOpen: () => setIsEnvelopeOpened(true),
      onOpen: () => setIsEnvelopeRemoved(true),
      sealInitials: invitationData.sealInitials || "RL",
      heroBgMobile: invitationData.hero?.bgMobileUrl,
      heroBgDesktop: invitationData.hero?.bgDesktopUrl,
      envelopeBgUrl: invitationData.envelopeBgUrl,
      envelopeBgColor: invitationData.envelopeBgColor,
      loadingBgColor: invitationData.loadingBgColor,
      envelopeTextColor: invitationData.envelopeTextColor,
      envelopeTextFont: invitationData.envelopeTextFont
    };

    switch (invitationData.introType) {
      case "gift_box":
        return <GiftBoxIntro {...props} />;
      case "scroll":
        return <ScrollIntro {...props} sealColor={invitationData.sealColor} />;
      case "curtain":
        return <CurtainIntro {...props} />;
      case "splash":
        return <SplashIntro {...props} />;
      case "gatefold":
        return <GatefoldIntro {...props} />;
      default:
        return (
          <EnvelopeIntro
            {...props}
            envelopeBgUrl={invitationData.envelopeBgUrl}
            sealColor={invitationData.sealColor}
            sealShape={invitationData.sealShape}
          />
        );
    }
  };

  if (!isEnvelopeRemoved) {
    return (
      <div className="invitation-main-container" style={{ position: "relative", minHeight: "100vh" }}>
        <Home invitationData={invitationData} isEnvelopeOpened={isEnvelopeOpened} />
        {renderIntro()}
      </div>
    );
  }

  return <Home invitationData={invitationData} isEnvelopeOpened={true} />;
}
