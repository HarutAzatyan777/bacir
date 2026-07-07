import React, { useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Card, Form, Input, Button, Alert, Divider, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";
import Logo from "../../components/Logo/Logo";

const { Title, Text, Link } = Typography;

// Helper function to initialize user profile document in Firestore
async function ensureUserDocument(user, referrerId) {
  if (!user) return;
  const userDocRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userDocRef);
  
  if (!docSnap.exists()) {
    const initialData = {
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      coins: 100, // starting balance default
      plan: "Free",
      createdAt: new Date().toISOString()
    };
    if (referrerId) {
      initialData.referredBy = referrerId;
    }
    await setDoc(userDocRef, initialData);
  }
}

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();

  // Capture referral ID if present in the URL
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("referrerId", ref);
    }
  }, [searchParams]);

  useEffect(() => {
    // If already logged in, redirect to admin dashboard
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Reset form errors and fields when toggling mode
  useEffect(() => {
    form.resetFields();
    setError("");
  }, [isRegistering, form]);

  const onFinish = async (values) => {
    const { email, password } = values;
    setError("");
    setLoading(true);

    try {
      let credential;
      if (isRegistering) {
        credential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        credential = await signInWithEmailAndPassword(auth, email, password);
      }

      // Ensure user document exists in Firestore and save referrer link if new
      const referrerId = localStorage.getItem("referrerId");
      await ensureUserDocument(credential.user, referrerId);
      localStorage.removeItem("referrerId");

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

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const credential = await signInWithPopup(auth, provider);

      // Ensure user document exists in Firestore and save referrer link if new
      const referrerId = localStorage.getItem("referrerId");
      await ensureUserDocument(credential.user, referrerId);
      localStorage.removeItem("referrerId");

      navigate("/admin");
    } catch (err) {
      console.error("Google Auth error:", err);
      setError("Google-ով մուտքի սխալ / Ошибка входа через Google: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <div className="login-logo" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Logo variant="vertical" height={60} theme="gold" />
          {isRegistering && (
            <Title level={4} style={{ marginTop: 12, marginBottom: 4, fontWeight: 600, letterSpacing: "1px", color: "#2c3e35" }}>
              ԳՐԱՆՑՈՒՄ / РЕГИСТРАЦИЯ
            </Title>
          )}
          <Text type="secondary" className="login-subtitle">
            {isRegistering 
              ? "Ստեղծեք նոր հաշիվ հրավերներ կառավարելու համար" 
              : "Մուտք գործել կառավարման վահանակ"}
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="login-alert"
          />
        )}

        <Form
          form={form}
          name="login-form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          autoComplete="off"
        >
          <Form.Item
            label="Էլ. հասցե / Email"
            name="email"
            rules={[
              { required: true, message: "Խնդրում ենք մուտքագրել էլ. հասցեն / Please enter email" },
              { type: "email", message: "Խնդրում ենք մուտքագրել վավեր էլ. հասցե / Please enter a valid email" }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="site-form-item-icon" />} 
              placeholder="admin@example.com" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Գաղտնաբառ / Password"
            name="password"
            rules={[
              { required: true, message: "Խնդրում ենք մուտքագրել գաղտնաբառը / Please enter password" },
              { min: 6, message: "Գաղտնաբառը պետք է լինի առնվազն 6 նիշ / Password must be at least 6 characters" }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="login-form-button" 
              loading={loading}
              block
              size="large"
            >
              {isRegistering ? "Գրանցվել / Sign Up" : "Մուտք գործել / Sign In"}
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>or</Divider>

        <Button 
          type="default" 
          onClick={handleGoogleSignIn}
          disabled={loading}
          icon={<FcGoogle size={18} style={{ marginRight: 4 }} />}
          className="login-google-button"
          block
          size="large"
        >
          Continue with Google
        </Button>

        <div className="auth-toggle">
          {isRegistering ? (
            <Text>
              Արդեն ունե՞ք հաշիվ:{" "}
              <Link onClick={() => setIsRegistering(false)}>
                Մուտք գործել / Sign In
              </Link>
            </Text>
          ) : (
            <Text>
              Չունե՞ք հաշիվ:{" "}
              <Link onClick={() => setIsRegistering(true)}>
                Գրանցվել / Sign Up
              </Link>
            </Text>
          )}
        </div>
      </Card>
    </div>
  );
}
