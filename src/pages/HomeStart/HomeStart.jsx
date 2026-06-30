import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Envelope from "./EnvelopeIntro";

export default function HomeStart() {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <Envelope onFinish={() => navigate("/home")} />
    </AnimatePresence>
  );
}
