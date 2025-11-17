import { useEffect, useState } from "react";

const About = () => {
  const [stats, setStats] = useState({
    completedTrips: 0,
    totalDestinations: 0,
    averageTravelerRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(false);

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
    getStats();
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] max-w-5xl rounded-xl shadow-xl p-6 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl text-center font-semibold">About GoTour</h1>
          <p className="text-center max-w-3xl">
            We craft memorable journeys across beaches, mountains, cities, and cultural heritage sites.
            From weekend getaways to multi-country expeditions, our curated packages blend comfort, adventure, and local experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <img
            className="w-full h-44 md:h-56 object-cover rounded-lg"
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
            alt="Tropical beach"
          />
          <img
            className="w-full h-44 md:h-56 object-cover rounded-lg"
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop"
            alt="Mountain adventure"
          />
          <img
            className="w-full h-44 md:h-56 object-cover rounded-lg"
            src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1200&auto=format&fit=crop"
            alt="City exploration"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p>
              To make travel simple, safe, and inspiring. We partner with trusted accommodations and transport providers, 
              guide you through authentic local experiences, and support sustainable tourism practices.
            </p>
            <ul className="list-disc pl-6">
              <li>Curated itineraries tailored to interests and budgets</li>
              <li>Transparent pricing with no hidden fees</li>
              <li>24/7 assistance from trip planning to return</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">What We Offer</h2>
            <ul className="list-disc pl-6">
              <li>Beach escapes, treks, city breaks, and cultural tours</li>
              <li>Flexible dates, custom add‑ons, group discounts</li>
              <li>Verified stays, comfortable transfers, and local guides</li>
            </ul>
            <p>
              Check the latest packages, filter by destination, and book instantly. Your next journey is a few clicks away.
            </p>
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
          <h2 className="text-2xl font-semibold">Ready to explore?</h2>
          <p className="text-center max-w-2xl">
            Browse packages, compare offers, and book securely. Our team is here to help you plan the perfect trip.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
