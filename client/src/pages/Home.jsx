import React, { useEffect, useState } from "react";
import "./styles/Home.css";
import { FaCalendar, FaSearch, FaStar } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import PackageCard from "./PackageCard";
import Categories from "./components/Categories";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data?.success) setSettings(data.settings);
      } catch (e) {}
    };
    loadSettings();
  }, []);

  return (
    <div className="main w-full">
      <div className="w-full flex flex-col">
        <div
          className="backaground_image w-full"
          style={settings?.heroBackgroundImage ? { backgroundImage: `url(${settings.heroBackgroundImage})` } : undefined}
        ></div>
        <div className="hero_overlay w-full"></div>
        <div className="top-part w-full gap-3 flex flex-col parallax">
          <h1 className="text-white text-4xl md:text-5xl text-center font-extrabold tracking-tight gradient_title">
            {settings?.heroTitle || "GoTour"}
          </h1>
          <h2 className="text-white text-sm text-center xsm:text-lg font-medium layer">
            {settings?.heroSubtitle || "Discover, plan, and book trusted travel experiences."}
          </h2>
          <div className="w-full flex justify-center items-center gap-3 mt-6 layer animate_float">
            <div className="glass_group flex items-center px-3 py-2 w-[90%] max-w-xl">
              <FaSearch className="text-white mx-2" />
              <input
                type="text"
                className="flex-1 rounded-full outline-none bg-transparent text-white placeholder:text-white/80"
                placeholder="Search destinations, packages, themes"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  navigate(`/search?searchTerm=${search}`);
                }}
                className="bg-indigo-600 text-white px-5 h-10 flex justify-center items-center text-base font-semibold rounded-full hover:brightness-105 shadow-lg active:translate-y-[1px]"
              >
                Go
              </button>
            </div>
          </div>
          <div className="w-[90%] max-w-xl flex justify-center mt-8 gap-2 layer animate_float">
            <button
              onClick={() => {
                navigate("/search?offer=true");
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white p-2 py-1 text-xs sm:text-sm rounded-full flex-1 hover:brightness-105 shadow-lg active:translate-y-[1px] glow"
            >
              Best Offers
              <LuBadgePercent className="text-xl" />
            </button>
            <button
              onClick={() => {
                navigate("/search?sort=packageRating");
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white p-2 py-1 text-xs sm:text-sm rounded-full flex-1 hover:brightness-105 shadow-lg active:translate-y-[1px] glow"
            >
              Top Rated
              <FaStar className="text-xl" />
            </button>
            <button
              onClick={() => {
                navigate("/search?sort=createdAt");
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white p-2 py-1 text-xs sm:text-sm rounded-full flex-1 hover:brightness-105 shadow-lg active:translate-y-[1px] glow"
            >
              Latest
              <FaCalendar className="text-base" />
            </button>
            <button
              onClick={() => {
                navigate("/search?sort=packageTotalRatings");
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white p-2 py-1 text-xs sm:text-sm rounded-full flex-1 hover:brightness-105 shadow-lg active:translate-y-[1px] glow"
            >
              Most Rated
              <FaRankingStar className="text-xl" />
            </button>
          </div>
        </div>
        {/* main page */}
        <div className="main p-6 flex flex-col gap-6">
          <Categories items={settings?.categories || []} />
        </div>
      </div>
    </div>
  );
};

export default Home;
