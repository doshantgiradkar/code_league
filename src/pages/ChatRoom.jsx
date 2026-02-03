import React, { useEffect, useState } from "react";
import {
  addSubCollectionDocument,
  onSubcollectionUpdate,
} from "../firebase/helperFunction";

import { doc, setDoc, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

import { createMessageModel } from "../models/message.model";

const CHAT_ID = "global-chat-test";

const USERS = [
  { id: "user_1", name: "Dev" },
  { id: "user_2", name: "Alex" },
];

const ChatRoom = () => {
  const [currentUser, setCurrentUser] = useState(USERS[0]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  /* ----------------------------------
     Ensure chat document exists
  -----------------------------------*/
  const initChat = async () => {
    const chatRef = doc(db, "chats", CHAT_ID);
    await setDoc(
      chatRef,
      {
        id: CHAT_ID,
        participants: USERS.map((u) => u.id),
        updatedAt: new Date(),
      },
      { merge: true }
    );
  };

  /* ----------------------------------
     Realtime messages (via helper)
  -----------------------------------*/
  useEffect(() => {
    initChat();

    const unsubscribe = onSubcollectionUpdate(
      ["chats", CHAT_ID],
      "messages",
      [orderBy("createdAt", "asc")],
      setMessages
    );

    return () => unsubscribe();
  }, []);

  /* ----------------------------------
     Send message
  -----------------------------------*/
  const sendMessage = async () => {
    if (!text.trim()) return;

    setLoading(true);

    const payload = createMessageModel({
      senderId: currentUser.id,
      text,
    });

    await addSubCollectionDocument(
      ["chats", CHAT_ID],
      "messages",
      payload
    );

    setText("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-4 flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">🔥 Global Chat</h2>

          <select
            value={currentUser.id}
            onChange={(e) =>
              setCurrentUser(
                USERS.find((u) => u.id === e.target.value)
              )
            }
            className="border rounded px-2 py-1 text-sm"
          >
            {USERS.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto border rounded p-2 mb-3">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 text-sm">
              No messages yet
            </p>
          )}

          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const senderName =
              USERS.find((u) => u.id === msg.senderId)?.name || "Unknown";

            return (
              <div
                key={msg.id}
                className={`mb-2 flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-1 rounded-lg max-w-xs ${
                    isMe
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {!isMe && (
                    <div className="text-xs font-semibold mb-1">
                      {senderName}
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message as ${currentUser.name}`}
            className="flex-1 border rounded px-2 py-1"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-4 rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChatRoom;
