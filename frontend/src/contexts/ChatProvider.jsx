import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create the Context
const ChatContext = createContext();

// Provide The Context
export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();
  const [refetch, setRefetch] = useState(false);
  const navigate = useNavigate();

  // Getting the User Data at the beginning
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user?.accessToken) {
      setUser(user);
      navigate("/chatlist", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("userInfo", JSON.stringify(user));
  }, [user, setUser]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        refetch,
        setRefetch,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// special hook
export default ChatContext;
