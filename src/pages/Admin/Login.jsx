import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isRegistering = false;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to admin dashboard
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/admin");
    } catch (err) {
      console.error("Auth error:", err);
      if (isRegistering) {
        setError("Գրանցման սխալ / Ошибка регистрации: " + err.message);
      } else {
        setError("Մուտքի տվյալները սխալ են / Неверные учетные данные");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <h2>{isRegistering ? "ԳՐԱՆՑՈՒՄ" : "BACIR ONLINE"}</h2>
          <p>
            {isRegistering 
              ? "Ստեղծեք նոր հաշիվ հրավերներ կառավարելու համար" 
              : "Մուտք գործել կառավարման վահանակ"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Էլ. հասցե / Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Գաղտնաբառ / Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading 
              ? (isRegistering ? "Գրանցվում է..." : "Մուտք է գործում...") 
              : (isRegistering ? "Գրանցվել / Зарегистрироваться" : "Մուտք գործել / Войти")}
          </button>
          
        </form>
      </div>
    </div>
  );
}
