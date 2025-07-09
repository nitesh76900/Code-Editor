import React, { useEffect, useContext, useState, useRef } from "react";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { Send } from "lucide-react";

const ChatBox = ({ projectId, messages: initialMessages }) => {
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState(initialMessages || []);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      const sortedMessages = [...initialMessages].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(sortedMessages);
    } else {
      setMessages([]);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (!socket) {
      setError("Socket not initialized");
      return;
    }

    socket.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("error", (err) => {
      setError(err.message || "An error occurred while receiving messages");
    });

    return () => {
      socket.off("new-message");
      socket.off("error");
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !user || !projectId) {
      setError("Please provide a message and ensure you're connected");
      return;
    }

    setIsSending(true);
    setError("");
    try {
      socket.emit("chat-message", {
        projectId,
        userId: user._id,
        message: newMessage.trim(),
      });
      setNewMessage("");
    } catch (err) {
      setError( err||"Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full font-sans">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mx-3">
          {error}
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scroll-smooth relative">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg._id || index}
              className={`flex ${msg.sender?._id === user?._id ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`max-w-[80%] sm:max-w-[70%] p-3 rounded-xl shadow-sm transition-all duration-200 ${
                  msg.sender?._id === user?._id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-xs sm:text-sm font-semibold">{msg.sender?.username || "Unknown User"}</p>
                <p className="text-sm sm:text-base break-words">{msg.message || "No content"}</p>
                <p className="text-xs text-gray-300 mt-1 sm:mt-2 opacity-80">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : "Unknown time"}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
      <form onSubmit={handleSendMessage} className="border-t p-2 sm:p-3 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
            disabled={isSending}
          />
          <button
            type="submit"
            className="p-2 sm:p-3 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-200 disabled:opacity-50"
            disabled={isSending || !newMessage.trim()}
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600" />
            ) : (
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;