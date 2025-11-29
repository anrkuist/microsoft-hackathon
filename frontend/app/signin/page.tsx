"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Input,
  Label,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  Mail24Regular,
  Eye24Regular,
  EyeOff24Regular,
  Dismiss24Regular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  container: {
    display: "flex",
    minHeight: "100vh", // Allow growing
    width: "100%",
  },
  leftSection: {
    flex: 1,
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackgroundHover} 100%)`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: tokens.colorNeutralForegroundOnBrand,
    padding: "40px",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  leftContent: {
    maxWidth: "400px",
    textAlign: "center",
  },
  brandTitle: {
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "16px",
    color: tokens.colorNeutralForegroundOnBrand,
  },
  brandSubtitle: {
    fontSize: "18px",
    fontWeight: "400",
    opacity: 0.9,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  rightSection: {
    flex: 1,
    display: "flex",
    alignItems: "center", // Center vertically
    justifyContent: "center",
    backgroundColor: tokens.colorNeutralBackground1,
    padding: "40px",
    position: "relative", // Needed for absolute positioning of exit button
    "@media (max-width: 768px)": {
      paddingTop: "40px", // Reset padding
      paddingBottom: "40px",
    },
  },
  exitButton: {
    position: "absolute",
    top: "24px",
    right: "24px",
    zIndex: 10,
    color: tokens.colorNeutralForeground1,
    ":hover": {
      color: tokens.colorNeutralForeground1Hover,
    },
    "@media (max-width: 768px)": {
      top: "16px",
      right: "16px",
    },
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
  },
  card: {
    padding: "32px",
    borderRadius: "12px",
    boxShadow: `0 2px 8px ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  formTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "8px",
    color: tokens.colorNeutralForeground1,
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: "14px",
    color: tokens.colorNeutralForeground3,
    marginBottom: "32px",
    textAlign: "center",
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
  },
  inputField: {
    width: "100%",
  },
  passwordContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  passwordInput: {
    flex: 1,
  },
  rememberMe: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "24px",
    fontSize: "14px",
    color: tokens.colorNeutralForeground2,
  },
  signInButton: {
    width: "100%",
    height: "40px",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    color: tokens.colorNeutralForeground3,
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
  },
  socialButton: {
    width: "100%",
    marginBottom: "8px",
  },
  signUp: {
    textAlign: "center",
    fontSize: "14px",
    color: tokens.colorNeutralForeground2,
    marginTop: "24px",
  },
  signUpLink: {
    color: tokens.colorBrandForeground1,
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

export default function SignInPage() {
  const styles = useStyles();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        "https://civic-chatbot-backend-fastapi.azurewebsites.net/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      // Sucesso
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userName", data.user_name);
      router.push("/");
    } catch (err: unknown) {
      // Verifica se o erro é do tipo padrão do JavaScript
      if (err instanceof Error) {
        setError(err.message);
      } else {
        // Fallback para erros desconhecidos
        setError("An unexpected error occurred during sign in.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.leftContent}>
          <h1 className={styles.brandTitle}>AI Chatbot</h1>
          <p className={styles.brandSubtitle}>
            Intelligent conversations at your fingertips. Sign in to get
            started.
          </p>
        </div>
      </div>

      <div className={styles.rightSection}>
        <Button
          icon={<Dismiss24Regular />}
          appearance="subtle"
          className={styles.exitButton}
          onClick={() => router.push("/")}
          aria-label="Exit to home"
        />
        <div className={styles.formContainer}>
          <div className={styles.card}>
            <h2 className={styles.formTitle}>Sign In</h2>
            <p className={styles.formSubtitle}>
              Use your email to sign in to your account
            </p>

            <form onSubmit={handleSignIn}>
              <div className={styles.formField}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  className={styles.inputField}
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  contentBefore={<Mail24Regular />}
                  size="large"
                />
              </div>

              <div className={styles.formField}>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  className={styles.inputField}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  contentAfter={
                    <Button
                      appearance="subtle"
                      icon={
                        showPassword ? <EyeOff24Regular /> : <Eye24Regular />
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ minWidth: "32px", padding: "0" }}
                    />
                  }
                  size="large"
                />
              </div>

              <div className={styles.rememberMe}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="rememberMe" style={{ cursor: "pointer" }}>
                  Remember me
                </label>
              </div>

              {error && (
                <div
                  style={{
                    color: tokens.colorPaletteRedForeground1,
                    marginBottom: "16px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                appearance="primary"
                className={styles.signInButton}
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span>or</span>
              <div className={styles.dividerLine} />
            </div>

            <Button
              appearance="secondary"
              className={styles.socialButton}
              disabled={isLoading}
            >
              Continue with Microsoft
            </Button>
            <Button
              appearance="secondary"
              className={styles.socialButton}
              disabled={isLoading}
            >
              Continue with Google
            </Button>

            <div className={styles.signUp}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className={styles.signUpLink}>
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
