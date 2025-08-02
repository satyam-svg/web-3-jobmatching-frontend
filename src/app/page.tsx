"use client";
import { useState } from "react";
import Hero from "./components/sections/Hero";
import Stats from "./components/sections/Stats";
import TabsSection from "./components/sections/TabsSection";
import CTA from "./components/sections/CTA";

export default function JobNetworkingPortal() {
  const [activeTab, setActiveTab] = useState("job-seekers");
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Thank you! We'll notify you at ${email} when we launch.`);
    setEmail("");
  };

  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  return (
    <>
      <Hero />
      <Stats />
      <TabsSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <CTA email={email} setEmail={setEmail} handleSubmit={handleSubmit} />
    </>
  );
}
