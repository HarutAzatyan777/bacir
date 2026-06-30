import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Invitations from "./pages/Invitations/Invitations";
import Contact from "./pages/Contact/Contact";
import HomeStart from "./pages/HomeStart/HomeStart";
import InvitationLoader from "./pages/InvitationLoader/InvitationLoader";
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import LandingPage from "./pages/Landing/LandingPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo" element={<HomeStart />} />
      <Route path="/home" element={<Home />} />
      <Route path="/invitations" element={<Invitations />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/i/:id" element={<InvitationLoader />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Dashboard />} />
    </Routes>
  );
}

