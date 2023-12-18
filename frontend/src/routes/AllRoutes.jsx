import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ChatList from "../pages/ChatList";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chatlist" element={<ChatList />} />
    </Routes>
  );
};

export default AllRoutes;
