import { useContext } from "react";
import ChatContext from "../contexts/ChatProvider";


const useAuth = () => {
  const context = useContext(ChatContext);

  return context;
};

export default useAuth;
