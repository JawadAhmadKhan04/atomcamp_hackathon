import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ComplaintListing from "./pages/ComplaintListing";
import RegistrarOneInterface from "./pages/RegistrarOneInterface";
import AuthorisedOfficerInterface from "./pages/AuthorisedOfficerInterface";

/**
 * Main application entrypoint containing React Router routing mappings.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page 3: Complaint Listing (Main/Root Route) */}
        <Route path="/" element={<ComplaintListing />} />

        {/* Page 1: Registrar-I Interface */}
        <Route path="/registrar-1" element={<RegistrarOneInterface />} />

        {/* Page 2: Authorised Officer Interface */}
        <Route path="/authorised-officer" element={<AuthorisedOfficerInterface />} />
      </Routes>
    </BrowserRouter>
  );
}
