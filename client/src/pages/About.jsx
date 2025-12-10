import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const About = () => {
  const [stats, setStats] = useState({
    completedTrips: 0,
    totalDestinations: 0,
    averageTravelerRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(false);
  const [about, setAbout] = useState(null);

  const location = useLocation();
  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/stats/overview");
        const data = await res.json();
        if (data?.success) {
          setStats(data);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    const getAbout = async () => {
      try {
        const res = await fetch(`/api/settings?v=${Date.now()}`);
        const json = await res.json();
        if (json?.success) setAbout(json.settings?.about || null);
      } catch (e) {}
    };
    getStats();
    getAbout();
  }, [location.key]);

  useEffect(() => {
    const handler = () => {
      fetch(`/api/settings?v=${Date.now()}`)
        .then((r) => r.json())
        .then((json) => {
          if (json?.success) setAbout(json.settings?.about || null);
        })
        .catch(() => {});
    };
    window.addEventListener("settings-updated", handler);
    return () => window.removeEventListener("settings-updated", handler);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] max-w-5xl rounded-xl shadow-xl p-6 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl text-center font-semibold">{about?.title || "About GoTour"}</h1>
          <p className="text-center max-w-3xl">
            {about?.intro || "We craft memorable journeys across beaches, mountains, cities, and cultural heritage sites. From weekend getaways to multi-country expeditions, our curated packages blend comfort, adventure, and local experiences."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {(about?.images?.length ? about.images.slice(0,3) : [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1200&auto=format&fit=crop",
          ]).map((src, i) => (
            <img key={i} className="w-full h-44 md:h-56 object-cover rounded-lg" src={src} alt={`About ${i+1}`} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">{about?.missionTitle || "Our Mission"}</h2>
            <p>{about?.missionText || "To make travel simple, safe, and inspiring. We partner with trusted accommodations and transport providers, guide you through authentic local experiences, and support sustainable tourism practices."}</p>
            <ul className="list-disc pl-6">
              {(about?.missionBullets?.length ? about.missionBullets : [
                "Curated itineraries tailored to interests and budgets",
                "Transparent pricing with no hidden fees",
                "24/7 assistance from trip planning to return",
              ]).map((b, i) => (<li key={i}>{b}</li>))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">{about?.offerTitle || "What We Offer"}</h2>
            <ul className="list-disc pl-6">
              {(about?.offerBullets?.length ? about.offerBullets : [
                "Beach escapes, treks, city breaks, and cultural tours",
                "Flexible dates, custom add‑ons, group discounts",
                "Verified stays, comfortable transfers, and local guides",
              ]).map((b, i) => (<li key={i}>{b}</li>))}
            </ul>
            <p>{about?.offerText || "Check the latest packages, filter by destination, and book instantly. Your next journey is a few clicks away."}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg border">
            <p className="text-3xl font-bold">{loading ? "—" : stats.completedTrips}</p>
            <p>Trips Completed</p>
          </div>
          <div className="p-4 rounded-lg border">
            <p className="text-3xl font-bold">{loading ? "—" : stats.totalDestinations}</p>
            <p>Destinations Worldwide</p>
          </div>
          <div className="p-4 rounded-lg border">
            <p className="text-3xl font-bold">{loading ? "—" : `${stats.averageTravelerRating}/5`}</p>
            <p>Average Traveler Rating</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-semibold">{about?.ctaTitle || "Ready to explore?"}</h2>
          <p className="text-center max-w-2xl">{about?.ctaText || "Browse packages, compare offers, and book securely. Our team is here to help you plan the perfect trip."}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
