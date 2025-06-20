import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./landing_page/Navbar";
import Footer from "./landing_page/Footer";

import HomePage from "./landing_page/home/HomePage";
import Signup from "./landing_page/signup/Signup";
import AboutPage from "./landing_page/about/AboutPage";
import ProductPage from "./landing_page/products/ProductPage";
import PricingPage from "./landing_page/pricing/PricingPage";
import SupportPage from "./landing_page/support/SupportPage";
import NotFound from "./landing_page/NotFound";

// Placeholder component for Dashboard route
const DashboardHomePlaceholder = () => {
  return (
    <div>
      <h2>Dashboard is served separately. Please visit /dashboard in your browser.</h2>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/dashboard/*" element={<DashboardHomePlaceholder />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
