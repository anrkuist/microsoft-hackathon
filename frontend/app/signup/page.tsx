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
  Person24Regular,
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
  termsCheckbox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "24px",
    fontSize: "13px",
    color: tokens.colorNeutralForeground2,
    lineHeight: "1.4",
  },
  signUpButton: {
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
  signIn: {
    textAlign: "center",
    fontSize: "14px",
    color: tokens.colorNeutralForeground2,
    marginTop: "24px",
  },
  signInLink: {
    color: tokens.colorBrandForeground1,
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

export default function SignUpPage() {
  const styles = useStyles();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (!agreeTerms) {
        setError("You must agree to the terms and conditions");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        "https://civic-chatbot-backend-fastapi.azurewebsites.net/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Signup failed";

        // Lógica para tratar erros do FastAPI/Pydantic
        if (typeof data.detail === "string") {
          // Erro simples (ex: "Email already registered")
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          // Erro de Validação (Lista de erros)
          // Pega a primeira mensagem e remove o prefixo "Value error, " se existir
          const firstError = data.detail[0];
          errorMessage = firstError.msg.replace("Value error, ", "");
        } else {
          errorMessage = JSON.stringify(data.detail);
        }

        throw new Error(errorMessage);
      }

      // Sucesso
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userName", data.user_name);

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
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
            Join our community and start having intelligent conversations today.
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
            <h2 className={styles.formTitle}>Create Account</h2>
            <p className={styles.formSubtitle}>
              Sign up to get started with AI Chatbot
            </p>

            <form onSubmit={handleSignUp}>
              <div className={styles.formField}>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  className={styles.inputField}
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  contentBefore={<Person24Regular />}
                  size="large"
                />
              </div>

              <div className={styles.formField}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  className={styles.inputField}
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  placeholder="Create a password (min 8 characters)"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

              <div className={styles.formField}>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  className={styles.inputField}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  contentAfter={
                    <Button
                      appearance="subtle"
                      icon={
                        showConfirmPassword ? (
                          <EyeOff24Regular />
                        ) : (
                          <Eye24Regular />
                        )
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={{ minWidth: "32px", padding: "0" }}
                    />
                  }
                  size="large"
                />
              </div>

              <div className={styles.termsCheckbox}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ cursor: "pointer", marginTop: "2px" }}
                />
                <label htmlFor="agreeTerms" style={{ cursor: "pointer" }}>
                  I agree to the Terms of Service and Privacy Policy
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
                className={styles.signUpButton}
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
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
              Sign up with Microsoft
            </Button>
            <Button
              appearance="secondary"
              className={styles.socialButton}
              disabled={isLoading}
            >
              Sign up with Google
            </Button>

            <div className={styles.signIn}>
              Already have an account?{" "}
              <Link href="/signin" className={styles.signInLink}>
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
