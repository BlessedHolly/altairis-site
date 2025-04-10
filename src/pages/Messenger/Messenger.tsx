import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { useGetChatsQuery, useSendMessageMutation } from "../../store/apiSlice";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Messenger.module.scss";
import { throttle } from "lodash";
import noAvatar from "/images/noavatar.jpg";
import { formatDate } from "../../utils/utils";

interface IMessage {
  sender: string;
  text: string;
  date: string;
}

interface IUser {
  avatar: string;
  name: string;
  _id: string;
}

interface IChat {
  participants: [IUser, IUser];
  messages: IMessage[];
}

function Messenger() {
  const { data, isLoading, refetch } = useGetChatsQuery(undefined, {
    pollingInterval: 5000,
  });
  const [sendMessage] = useSendMessageMutation();
  const chats: IChat[] = data?.chats || [];
  const [companion, setCompanionId] = useState<IUser | null>(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const prevChatIdRef = useRef<string | null>(null);

  const sortedChats = [...chats].sort((a, b) => {
    const aLastMsg = a.messages[a.messages.length - 1];
    const bLastMsg = b.messages[b.messages.length - 1];

    const aTime = aLastMsg ? new Date(aLastMsg.date).getTime() : 0;
    const bTime = bLastMsg ? new Date(bLastMsg.date).getTime() : 0;
    return bTime - aTime;
  });

  const currentChat = chats.find((chat) =>
    chat.participants.some((user) => user._id === companion?._id)
  );

  const handleSend = async () => {
    if (!message.trim() || !companion) return;
    try {
      await sendMessage({ userId: companion._id, message }).unwrap();
      refetch();
      setMessage("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  useEffect(() => {
    if (state) {
      setCompanionId({ _id: state, name: "", avatar: "" });
    }
  }, [state]);

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowWidth(window.innerWidth);
    }, 200);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel();
    };
  }, []);

  useEffect(() => {
    if (state) {
      setCompanionId({ _id: state, name: "", avatar: "" });
      if (windowWidth <= 768) {
        setIsMobileChatOpen(true);
      }
      navigate(".", { replace: true, state: null });
    }
  }, [state, windowWidth, navigate]);

  useEffect(() => {
    if (state) {
      setCompanionId({ _id: state, name: "", avatar: "" });
      if (windowWidth <= 768) {
        setIsMobileChatOpen(true);
      }
    }
  }, [state, windowWidth]);

  useEffect(() => {
    if (windowWidth < 769 && isMobileChatOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [windowWidth, isMobileChatOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages]);

  useEffect(() => {
    const currentChatId = companion?._id;
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });

    prevChatIdRef.current = currentChatId ?? null;
  }, [companion]);

  if (isLoading) return <Loading />;

  return (
    <div
      className={`${styles["messenger-container"]} ${
        windowWidth <= 768
          ? isMobileChatOpen
            ? styles["messenger-container-main"]
            : ""
          : ""
      }`}
    >
      {windowWidth <= 768 ? (
        isMobileChatOpen ? (
          <section className={styles.chat}>
            <button
              className={styles.backButton}
              onClick={() => setIsMobileChatOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.0"
                width="20.000000pt"
                height="20.000000pt"
                viewBox="0 0 512.000000 512.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                  fill="#000000"
                  stroke="none"
                >
                  <path d="M1925 4550 c-123 -14 -227 -58 -330 -141 -105 -84 -1450 -1439 -1488 -1499 -135 -216 -141 -463 -15 -678 24 -41 227 -252 738 -765 388 -390 732 -730 765 -756 122 -98 249 -143 400 -143 335 0 600 246 631 584 9 101 -15 218 -68 328 -38 78 -56 100 -221 267 l-180 183 1205 0 c1158 0 1208 1 1280 19 411 105 604 574 386 938 -71 119 -208 228 -348 276 l-65 22 -1229 3 -1229 2 179 183 c164 166 184 190 221 267 79 160 90 312 38 479 -89 282 -372 464 -670 431z" />
                </g>
              </svg>
            </button>

            {companion ? (
              <>
                <div className={styles.messages}>
                  {currentChat ? (
                    currentChat.messages.map((msg, idx) => {
                      const currentDate = new Date(msg.date)
                        .toISOString()
                        .slice(0, 10);
                      const prevDate =
                        idx > 0
                          ? new Date(currentChat.messages[idx - 1].date)
                              .toISOString()
                              .slice(0, 10)
                          : null;

                      const showDate = idx === 0 || currentDate !== prevDate;

                      return (
                        <React.Fragment key={idx}>
                          {showDate && (
                            <div className={styles.dateSeparator}>
                              <p>{formatDate(msg.date).split(" at ")[0]}</p>
                            </div>
                          )}
                          <div
                            className={
                              msg.sender === data.userId
                                ? styles.myMessage
                                : styles.theirMessage
                            }
                          >
                            <p>{msg.text}</p>
                            <p className={styles["date-message"]}>
                              {formatDate(msg.date).slice(-8)}
                            </p>
                          </div>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <p className={styles.placeholder}>Start a conversation</p>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className={styles.inputArea}>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message..."
                  />
                  <button onClick={handleSend}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.0"
                      width="20.000000pt"
                      height="20.000000pt"
                      viewBox="0 0 512.000000 512.000000"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g
                        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#000000"
                        stroke="none"
                      >
                        <path d="M4755 5113 c-41 -11 -4522 -1454 -4562 -1469 -57 -21 -129 -87 -161 -148 -36 -70 -38 -188 -4 -257 25 -52 82 -113 127 -137 17 -8 433 -149 925 -314 l894 -298 56 39 c349 243 1598 1109 1609 1116 20 12 54 62 -559 -815 -306 -437 -564 -807 -574 -822 -18 -27 -18 -28 279 -920 164 -491 306 -909 315 -928 25 -49 84 -105 139 -132 69 -34 187 -32 257 4 61 32 127 104 148 161 9 23 343 1057 743 2297 692 2148 727 2259 727 2330 1 122 -55 214 -160 266 -53 26 -153 40 -199 27z" />
                      </g>
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <p className={styles.placeholder}>Select chat</p>
            )}
          </section>
        ) : (
          <aside className={styles.sidebar}>
            {sortedChats.length ? (
              sortedChats.map((chat, i) => {
                const companionUser = chat.participants.find(
                  (p) => p._id !== data.userId
                )!;

                const isActive = companion?._id === companionUser._id;

                return (
                  <div
                    onClick={() => {
                      setCompanionId(companionUser);
                      setIsMobileChatOpen(true);
                    }}
                    key={i}
                    className={`${styles["chat-preview-wrapper"]} ${
                      isActive ? styles["active-chat"] : ""
                    }`}
                  >
                    <div
                      className={`${styles.chatPreview} ${
                        isActive ? styles["active-chat"] : ""
                      }`}
                    >
                      <img src={companionUser.avatar || noAvatar} alt="" />
                      <div className={styles["name-last-message-container"]}>
                        <p className={styles["name-preview"]}>
                          {companionUser?.name}
                        </p>
                        {chat.messages.length > 0 ? (
                          <p className={styles["last-message"]}>
                            {chat.messages[chat.messages.length - 1].text}
                          </p>
                        ) : (
                          <p>"No messages yet"</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.placeholder}>You don't have any chats yet</p>
            )}
          </aside>
        )
      ) : (
        <>
          <aside className={styles.sidebar}>
            {sortedChats.length ? (
              sortedChats.map((chat, i) => {
                const companionUser = chat.participants.find(
                  (p) => p._id !== data.userId
                )!;

                const isActive = companion?._id === companionUser._id;

                return (
                  <div
                    onClick={() => setCompanionId(companionUser)}
                    key={i}
                    className={`${styles["chat-preview-wrapper"]} ${
                      isActive ? styles["active-chat"] : ""
                    }`}
                  >
                    <div
                      className={`${styles.chatPreview} ${
                        isActive ? styles["active-chat"] : ""
                      }`}
                    >
                      <img src={companionUser.avatar || noAvatar} alt="" />
                      <div className={styles["name-last-message-container"]}>
                        <p className={styles["name-preview"]}>
                          {companionUser?.name}
                        </p>
                        {chat.messages.length > 0 ? (
                          <p className={styles["last-message"]}>
                            {chat.messages[chat.messages.length - 1].text}
                          </p>
                        ) : (
                          <p>"No messages yet"</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.placeholder}>You don't have any chats yet</p>
            )}
          </aside>
          <section className={styles.chat}>
            {companion ? (
              <>
                <div className={styles.messages}>
                  {currentChat ? (
                    currentChat.messages.map((msg, idx) => {
                      const currentDate = new Date(msg.date)
                        .toISOString()
                        .slice(0, 10);
                      const prevDate =
                        idx > 0
                          ? new Date(currentChat.messages[idx - 1].date)
                              .toISOString()
                              .slice(0, 10)
                          : null;

                      const showDate = idx === 0 || currentDate !== prevDate;

                      return (
                        <React.Fragment key={idx}>
                          {showDate && (
                            <div className={styles.dateSeparator}>
                              <p>{formatDate(msg.date).split(" at ")[0]}</p>
                            </div>
                          )}
                          <div
                            className={
                              msg.sender === data.userId
                                ? styles.myMessage
                                : styles.theirMessage
                            }
                          >
                            <p>{msg.text}</p>
                            <p className={styles["date-message"]}>
                              {formatDate(msg.date).slice(-8)}
                            </p>
                          </div>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <p className={styles.placeholder}>Start a conversation</p>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className={styles.inputArea}>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message..."
                  />
                  <button onClick={handleSend}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.0"
                      width="20.000000pt"
                      height="20.000000pt"
                      viewBox="0 0 512.000000 512.000000"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g
                        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#000000"
                        stroke="none"
                      >
                        <path d="M4755 5113 c-41 -11 -4522 -1454 -4562 -1469 -57 -21 -129 -87 -161 -148 -36 -70 -38 -188 -4 -257 25 -52 82 -113 127 -137 17 -8 433 -149 925 -314 l894 -298 56 39 c349 243 1598 1109 1609 1116 20 12 54 62 -559 -815 -306 -437 -564 -807 -574 -822 -18 -27 -18 -28 279 -920 164 -491 306 -909 315 -928 25 -49 84 -105 139 -132 69 -34 187 -32 257 4 61 32 127 104 148 161 9 23 343 1057 743 2297 692 2148 727 2259 727 2330 1 122 -55 214 -160 266 -53 26 -153 40 -199 27z" />
                      </g>
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <p className={styles.placeholder}>Select chat</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Messenger;
