import { Link, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";

const GroupTours = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [groupPackages, setGroupPackages] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/package/get-packages?category=Group&limit=999`);
        const data = await res.json();
        setGroupPackages(data?.packages || []);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const destinations = useMemo(() => {
    const map = new Map();
    groupPackages.forEach((p) => {
      const key = p.packageDestination || "Unknown";
      if (!map.has(key)) {
        map.set(key, p);
      }
    });
    return Array.from(map.entries()).map(([dest, pkg]) => ({
      title: `${dest} Group`,
      image: (pkg.packageImages && pkg.packageImages[0]) || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
      search: dest,
    }));
  }, [groupPackages]);

  return (
    <div className="w-full bg-orange-50 min-h-[60vh]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button
          className="text-sm text-orange-600 hover:underline"
          onClick={() => navigate("/")}
        >
          ← Back to home
        </button>

        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="w-10 h-10 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center">
            <FaUsers />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-center">Group Trip Destinations</h1>
          <p className="text-center text-sm text-gray-700 max-w-2xl">
            Choose these packages to enjoy budget-friendly trips while meeting and traveling with new people.
          </p>
        </div>

        <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <div className="text-center text-gray-700">Loading...</div>}
          {!loading && destinations.map((g, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img src={g.image} alt={g.title} className="w-full h-44 object-cover" />
              <div className="p-3">
                <h3 className="font-semibold text-lg">{g.title}</h3>
                <Link
                  to={`/group-packages/${encodeURIComponent(g.search)}`}
                  className="mt-3 inline-block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-md hover:brightness-105"
                >
                  View All Packages
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupTours;