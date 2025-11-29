"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  makeStyles,
  tokens,
  Spinner,
  Text,
} from "@fluentui/react-components";
import { flushSync } from "react-dom";
import {
  Send24Regular,
  Mic24Regular,
  Chat24Regular,
  SignOut24Regular,
  Navigation24Regular,
  Sparkle24Filled,
  PanelLeft24Regular,
  Globe24Regular,
} from "@fluentui/react-icons";
import ChatMessage from "./ChatMessage";

const translations = {
  en: {
    title: "Citizen Impact",
    newChat: "New Chat",
    history: "History",
    noChats: "No chats yet. Start a new one!",
    signIn: "Sign In",
    signOut: "Sign Out",
    welcome: "How can I help you today?",
    welcomeBack: "Welcome back, ",
    subtitle: "Ask me anything about politics and citizenship",
    placeholder: "Ask anything...",
    followUpPlaceholder: "Ask a follow up...",
    aiThinking: "AI is thinking...",
    error: "Sorry, a connection error occurred. Please try again.",
    suggestions: [
      "How does the legislative process work?",
      "What are my voting rights?",
      "Explain the role of the Supreme Court",
      "Summarize recent policy changes",
    ],
  },
  pt: {
    title: "Citizen Impact",
    newChat: "Nova Conversa",
    history: "Histórico",
    noChats: "Nenhuma conversa ainda. Comece uma nova!",
    signIn: "Entrar",
    signOut: "Sair",
    welcome: "Como posso ajudar hoje?",
    welcomeBack: "Bem-vindo de volta, ",
    subtitle: "Pergunte qualquer coisa sobre política e cidadania",
    placeholder: "Pergunte qualquer coisa...",
    followUpPlaceholder: "Faça uma pergunta...",
    aiThinking: "IA está pensando...",
    error: "Desculpe, ocorreu um erro de conexão. Tente novamente.",
    suggestions: [
      "Como funciona o processo legislativo?",
      "Quais são meus direitos de voto?",
      "Explique o papel do Supremo Tribunal",
      "Resuma as mudanças recentes na política",
    ],
  },
};

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    height: "100vh",
    backgroundColor: tokens.colorNeutralBackground1,
    position: "relative",
    overflow: "hidden",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    width: "260px",
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    transition: "transform 0.3s ease, width 0.3s ease",
    position: "relative",
    zIndex: 100,
    height: "100%",
    "@media (max-width: 768px)": {
      position: "absolute",
      left: 0,
      top: 0,
      width: "85%",
      maxWidth: "300px",
      transform: "translateX(0)",
      boxShadow: tokens.shadow64,
      borderRight: "none",
    },
  },
  sidebarCollapsed: {
    width: "0px",
    overflow: "hidden",
    borderRight: "none",
    "@media (max-width: 768px)": {
      transform: "translateX(-100%)",
      width: "85%",
    },
  },
  overlay: {
    display: "none",
    "@media (max-width: 768px)": {
      display: "block",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      zIndex: 90,
    },
  },
  mobileHeader: {
    display: "none",
    padding: "12px 16px",
    alignItems: "center",
    gap: "12px",
    backgroundColor: tokens.colorNeutralBackground1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 80,
    "@media (max-width: 768px)": {
      display: "flex",
    },
  },
  mobileTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: tokens.colorNeutralForeground1,
  },
  sidebarHeader: {
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sidebarTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sidebarTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: tokens.colorNeutralForeground1,
    lineHeight: "24px",
  },
  toggleButton: {
    minWidth: "32px",
    padding: "0",
    marginLeft: "auto",
  },
  toggleButtonMain: {
    position: "absolute",
    top: "12px",
    left: "12px",
    zIndex: 85,
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  langButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 85,
  },
  sidebarContent: {
    flex: 1,
    padding: "16px 8px 16px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  newChatButton: {
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#2563EB",
    color: "white",
    ":hover": {
      backgroundColor: "#1D4ED8",
      color: "white",
    },
    ":active": {
      backgroundColor: "#1E40AF",
      color: "white",
    },
  },
  recentSection: {
    flex: 1,
    padding: "0 16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  recentLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: tokens.colorNeutralForeground3,
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  recentItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    cursor: "pointer",
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorNeutralForeground1,
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  recentItemText: {
    fontSize: "14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  sidebarFooter: {
    padding: "16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  signInButton: {
    justifyContent: "flex-start",
    width: "100%",
    paddingLeft: "0",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    position: "relative",
    height: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: tokens.colorNeutralBackground1,
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    "@media (max-width: 768px)": {
      padding: "12px",
    },
  },
  inputContainer: {
    padding: "16px 24px",
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    display: "flex",
    gap: "8px",
    "@media (max-width: 768px)": {
      padding: "12px",
    },
  },
  input: {
    flex: 1,
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
  },
  welcomeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  welcomeIcon: {
    width: "64px",
    height: "64px",
    backgroundColor: "#3B82F6",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    color: "white",
  },
  welcomeTitle: {
    fontSize: "32px",
    fontWeight: "600",
    color: tokens.colorNeutralForeground1,
    marginBottom: "8px",
    textAlign: "center",
    lineHeight: "1.3",
  },
  welcomeSubtitle: {
    fontSize: "16px",
    color: tokens.colorNeutralForeground3,
    marginBottom: "40px",
    textAlign: "center",
  },
  welcomeInputContainer: {
    width: "100%",
    maxWidth: "700px",
    position: "relative",
    marginBottom: "32px",
    "@media (max-width: 768px)": {
      position: "absolute",
      bottom: "80px",
      left: "0",
      right: "0",
      padding: "0 16px",
      marginBottom: "0",
      maxWidth: "100%",
    },
  },
  welcomeInput: {
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: "26px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    display: "flex",
    alignItems: "center",
    padding: "10px 24px",
    position: "relative",
  },
  welcomeInputField: {
    flex: 1,
    border: "none",
    ":focus-within": {
      border: "none",
      outline: "none",
    },
    "& input": {
      height: "48px",
      border: "none",
      fontSize: "16px",
      ":focus": {
        border: "none",
        outline: "none",
      },
    },
  },
  welcomeMic: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: tokens.colorNeutralForeground3,
    cursor: "pointer",
    "@media (max-width: 768px)": {
      right: "24px",
    },
  },
  suggestionChips: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
    "@media (max-width: 768px)": {
      position: "fixed",
      bottom: "160px",
      left: "0",
      right: "0",
      paddingLeft: "20px",
      paddingRight: "20px",
      justifyContent: "flex-start",
      flexWrap: "nowrap",
      overflowX: "auto",
      paddingBottom: "8px",
      marginTop: "0",
      zIndex: 99,
      "::-webkit-scrollbar": {
        display: "none",
      },
    },
  },
  suggestionChip: {
    borderRadius: "16px",
    padding: "8px 16px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontSize: "14px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    paddingTop: "60px",
    "@media (min-width: 769px)": {
      paddingTop: "0",
    },
  },
  messagesList: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxWidth: "900px",
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  chatInputContainer: {
    padding: "24px",
    maxWidth: "900px",
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
    position: "sticky",
    bottom: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 10,
  },
  chatInputWrapper: {
    position: "relative",
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: "26px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    display: "flex",
    alignItems: "center",
    padding: "10px 24px",
  },
  chatInput: {
    flex: 1,
    border: "none",
    ":focus-within": {
      border: "none",
      outline: "none",
    },
    "& input": {
      height: "48px",
      border: "none",
      ":focus": {
        border: "none",
        outline: "none",
      },
    },
  },
});

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface BackendMessage {
  id: string;
  content: string;
  role: string;
  timestamp: string;
}

// Interface da Sessão para a Sidebar
interface ChatSession {
  id: string;
  user_email: string;
  title: string;
  created_at: string;
}

export default function ChatInterface() {
  const styles = useStyles();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<"en" | "pt">("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Estados para gerenciar as sessões
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const BACKEND_URL = "https://civic-chatbot-backend-fastapi.azurewebsites.net";

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }

    if (storedEmail) {
      setUserName(storedName);
      setUserEmail(storedEmail);
      // Carrega a lista de conversas ao entrar
      fetchSessions(storedEmail);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchSessions = async (email: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/sessions/${email}`);
      if (res.ok) {
        const sessions = await res.json();
        setChatSessions(sessions);
      }
    } catch (e) {
      console.error("Erro ao carregar sessões:", e);
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    // Em mobile, fecha a sidebar ao selecionar
    if (window.innerWidth <= 768) setSidebarOpen(false);

    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/history/${sessionId}`);
      if (!res.ok) throw new Error("Failed to load history");

      const historyData = await res.json();

      const uiMessages: Message[] = (historyData as BackendMessage[]).map(
        (item) => ({
          id: item.id,
          text: item.content,
          isUser: item.role === "user",
          timestamp: new Date(item.timestamp),
        })
      );

      setMessages(uiMessages);
    } catch (err) {
      console.error("Falha ao carregar histórico:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() || isLoading) return;

    // --- LÓGICA DE SESSÃO ---
    let activeSessionId = currentSessionId;

    // Se é a primeira mensagem de um novo chat e o usuário está logado, cria a sessão no backend
    if (!activeSessionId && userEmail) {
      try {
        const createRes = await fetch(`${BACKEND_URL}/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_email: userEmail,
            title: text.substring(0, 30) + (text.length > 30 ? "..." : ""), // Usa o início da msg como título
          }),
        });

        if (createRes.ok) {
          const newSession = await createRes.json();
          activeSessionId = newSession.id;
          setCurrentSessionId(newSession.id);
          // Atualiza a sidebar com a nova sessão no topo
          setChatSessions([newSession, ...chatSessions]);
        }
      } catch (e) {
        console.error("Erro ao criar sessão automática:", e);
      }
    }

    // Se falhar ou não tiver login, usa fallback
    const finalSessionId = activeSessionId || userEmail || "anonymous_session";
    // ------------------------

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      isUser: true,
      timestamp: new Date(),
    };

    const updateState = () => {
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);
    };

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          updateState();
        });
      });
    } else {
      updateState();
    }

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          session_id: finalSessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const data = await response.json();

      const aiResponseText =
        data.final_response?.answer ||
        data.answer ||
        data.final_response ||
        JSON.stringify(data);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          typeof aiResponseText === "string"
            ? aiResponseText
            : JSON.stringify(aiResponseText),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erro ao chamar backend:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: translations[language].error,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    // Limpa a tela e o ID da sessão atual.
    // A nova sessão só será criada no banco quando o usuário enviar a primeira mensagem.
    setMessages([]);
    setInputValue("");
    setCurrentSessionId(null);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    setMessages([]);
    setUserName(null);
    setUserEmail(null);
    setChatSessions([]); // Limpa a sidebar
    setCurrentSessionId(null);
    router.push("/signin");
  };

  const suggestions = [
    "How does the legislative process work?",
    "What are my voting rights?",
    "Explain the role of the Supreme Court",
    "Summarize recent policy changes",
  ];

  // Componente Sidebar Atualizado
  const RecentChats = () => (
    <div className={styles.recentSection}>
      <div className={styles.recentLabel}>{translations[language].history}</div>
      {chatSessions.length === 0 && (
        <div style={{ padding: "0 12px", fontSize: "13px", color: "#888" }}>
          {translations[language].noChats}
        </div>
      )}
      {chatSessions.map((session) => (
        <div
          key={session.id}
          className={styles.recentItem}
          onClick={() => handleSelectSession(session.id)}
          style={{
            backgroundColor:
              currentSessionId === session.id
                ? tokens.colorNeutralBackground1Hover
                : undefined,
          }}
        >
          <Chat24Regular fontSize={16} />
          <span className={styles.recentItemText}>{session.title}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.wrapper}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          !sidebarOpen ? styles.sidebarCollapsed : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarTitleRow}>
            <div>
              <div className={styles.sidebarTitle}>
                {translations[language].title.split(" ")[0]}
              </div>
              <div className={styles.sidebarTitle}>
                {translations[language].title.split(" ")[1]}
              </div>
            </div>
            <Button
              icon={<PanelLeft24Regular />}
              appearance="subtle"
              onClick={() => setSidebarOpen(false)}
              className={styles.toggleButton}
            />
          </div>
          <Button
            className={styles.newChatButton}
            icon={<Sparkle24Filled />}
            onClick={handleNewChat}
            size="large"
          >
            {translations[language].newChat}
          </Button>
        </div>

        <RecentChats />

        <div className={styles.sidebarFooter}>
          {userName ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Text size={200} style={{ paddingLeft: 12 }}>
                {translations[language].welcomeBack}
                <b>{userName}</b>
              </Text>
              <Button
                appearance="subtle"
                icon={<SignOut24Regular />}
                onClick={handleSignOut}
                className={styles.signInButton}
              >
                {translations[language].signOut}
              </Button>
            </div>
          ) : (
            <Button
              appearance="subtle"
              icon={<SignOut24Regular />}
              onClick={() => router.push("/signin")}
              className={styles.signInButton}
            >
              {translations[language].signIn}
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContainer}>
        <div className={styles.mobileHeader}>
          <Button
            appearance="subtle"
            icon={<Navigation24Regular />}
            onClick={() => setSidebarOpen(true)}
          />
          <span style={{ fontWeight: 600 }}>Citizen Impact</span>
        </div>

        {!sidebarOpen && (
          <Button
            icon={<PanelLeft24Regular />}
            appearance="subtle"
            onClick={() => setSidebarOpen(true)}
            className={styles.toggleButtonMain}
          />
        )}

        <Button
          className={styles.langButton}
          appearance="subtle"
          icon={<Globe24Regular />}
          onClick={() => setLanguage((prev) => (prev === "en" ? "pt" : "en"))}
        >
          {language.toUpperCase()}
        </Button>

        {messages.length === 0 ? (
          <div className={styles.welcomeContainer}>
            <div className={styles.welcomeIcon}>
              <Sparkle24Filled style={{ width: 32, height: 32 }} />
            </div>
            <h1 className={styles.welcomeTitle}>
              {userName
                ? `${translations[language].welcomeBack}${userName}!`
                : translations[language].welcome}
            </h1>
            <p className={styles.welcomeSubtitle}>
              {translations[language].subtitle}
            </p>

            <div className={styles.welcomeInputContainer}>
              <div
                className={styles.welcomeInput}
                style={
                  {
                    viewTransitionName: "input-box",
                  } as React.CSSProperties
                }
              >
                <Input
                  placeholder={translations[language].placeholder}
                  className={styles.welcomeInputField}
                  value={inputValue}
                  onChange={(e, data) => setInputValue(data.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                />
                <Mic24Regular className={styles.welcomeMic} />
              </div>
            </div>

            <div className={styles.suggestionChips}>
              {translations[language].suggestions.map((s) => (
                <button
                  key={s}
                  className={styles.suggestionChip}
                  onClick={() => handleSend(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.chatContainer}>
            <div className={styles.messagesList}>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className={styles.loadingContainer}>
                  <Spinner size="tiny" />
                  <span>{translations[language].aiThinking}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.chatInputContainer}>
              <div
                className={styles.chatInputWrapper}
                style={
                  {
                    viewTransitionName: "input-box",
                  } as React.CSSProperties
                }
              >
                <Input
                  className={styles.chatInput}
                  placeholder={translations[language].followUpPlaceholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                {inputValue.trim() ? (
                  <Button
                    appearance="transparent"
                    icon={<Send24Regular />}
                    onClick={() => handleSend()}
                    disabled={isLoading}
                  />
                ) : (
                  <Button
                    appearance="transparent"
                    icon={<Mic24Regular />}
                    disabled={isLoading}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
