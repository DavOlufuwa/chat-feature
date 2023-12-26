import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ChatList from "../pages/ChatList";
import RequireAuth from "../components/Authentication/RequireAuth";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<RequireAuth />}>
        <Route path="/chatlist" element={<ChatList />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
