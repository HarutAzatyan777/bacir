import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import EnvelopeIntro from "../HomeStart/EnvelopeIntro";
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

  if (!isEnvelopeRemoved) {
    return (
      <div className="invitation-main-container" style={{ position: "relative", minHeight: "100vh" }}>
        <Home invitationData={invitationData} isEnvelopeOpened={isEnvelopeOpened} />
        <EnvelopeIntro
          onStartOpen={() => setIsEnvelopeOpened(true)}
          onOpen={() => setIsEnvelopeRemoved(true)}
          sealInitials={invitationData.sealInitials || "RL"}
          heroBgMobile={invitationData.hero?.bgMobileUrl}
          heroBgDesktop={invitationData.hero?.bgDesktopUrl}
          envelopeBgUrl={invitationData.envelopeBgUrl}
          envelopeBgColor={invitationData.envelopeBgColor}
          loadingBgColor={invitationData.loadingBgColor}
          sealColor={invitationData.sealColor}
          sealShape={invitationData.sealShape}
          envelopeTextColor={invitationData.envelopeTextColor}
          envelopeTextFont={invitationData.envelopeTextFont}
        />
      </div>
    );
  }

  return <Home invitationData={invitationData} isEnvelopeOpened={true} />;
}
