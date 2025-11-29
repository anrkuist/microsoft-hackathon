import { useState, useEffect } from "react";
import { Avatar, makeStyles, tokens } from "@fluentui/react-components";
import { Person24Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  messageContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px", // Increased spacing
    width: "100%",
  },
  userMessage: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
  },
  botMessage: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  messageContent: {
    maxWidth: "80%",
    lineHeight: "1.6",
    fontSize: "16px",
    "@media (max-width: 768px)": {
      maxWidth: "90%",
    },
  },
  userContent: {
    // No background for user content text itself if we use the avatar as the bubble?
    // Wait, the image shows the user message as a blue circle with text "hi" inside?
    // OR is that the avatar?
    // "Blue circle with white text (initials or "hi")" -> That looks like an Avatar or a very small bubble.
    // If the user types a long message, it should probably be a bubble.
    // Let's assume standard chat: User bubble (Blue), Bot text (Plain).
    // The image shows "hi" inside a blue circle. That might be the message itself if it's short, or an avatar.
    // But there is NO text outside the blue circle. So the blue circle IS the message container?
    // Let's look closely at the image.
    // The user message is JUST a blue circle with "hi".
    // The user message is "ok" in another blue circle.
    // It seems the user message IS the bubble.
    backgroundColor: "#2563EB", // Blue
    color: "white",
    padding: "12px 20px",
    borderRadius: "24px",
    borderTopRightRadius: "4px", // Optional styling for chat bubble
  },
  botContent: {
    backgroundColor: "transparent",
    color: tokens.colorNeutralForeground1,
    padding: "0", // No padding for document-like look
  },
  avatar: {
    // If we want an avatar for the bot? The image shows NO avatar for the bot.
    // Just text.
  },
});

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  const styles = useStyles();
  const [displayedText, setDisplayedText] = useState(isUser ? message : "");

  useEffect(() => {
    if (isUser) return;

    setDisplayedText(""); // Reset text when message changes
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedText(message.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 20); // Adjust speed here (20ms per char)

    return () => clearInterval(intervalId);
  }, [message, isUser]);

  if (isUser) {
    return (
      <div className={`${styles.messageContainer} ${styles.userMessage}`}>
        {/* User Message Bubble */}
        <div className={`${styles.messageContent} ${styles.userContent}`}>
            {message}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.messageContainer} ${styles.botMessage}`}>
      {/* Bot Message - No Avatar, Just Text */}
      <div className={`${styles.messageContent} ${styles.botContent}`}>
        {displayedText}
      </div>
    </div>
  );
}
