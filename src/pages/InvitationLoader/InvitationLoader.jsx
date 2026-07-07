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

  if (!isEnvelopeOpened) {
    return (
      <EnvelopeIntro
        onOpen={() => setIsEnvelopeOpened(true)}
        sealInitials={invitationData.sealInitials || "RL"}
        heroBgMobile={invitationData.hero?.bgMobileUrl}
        heroBgDesktop={invitationData.hero?.bgDesktopUrl}
        envelopeBgUrl={invitationData.envelopeBgUrl}
      />
    );
  }

  return <Home invitationData={invitationData} />;
}
