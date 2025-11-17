import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const InternationalDestinationPackages = () => {
  const { destination } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/package/get-packages?category=International&searchTerm=${encodeURIComponent(destination)}&limit=100`);
        const data = await res.json();
        setPackages(data?.packages || []);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    fetchData();
  }, [destination]);

  const heroImage = useMemo(() => {
    return packages.length && packages[0]?.packageImages?.length ? packages[0].packageImages[0] : "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop";
  }, [packages]);

  return (
    <div className="w-full">
      <div className="relative w-full h-40 md:h-56 overflow-hidden">
        <img src={heroImage} alt={destination} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-3xl font-extrabold">{destination} Packages</h1>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button className="text-sm text-orange-600 hover:underline" onClick={() => navigate("/international")}>Back to International Destinations</button>
        <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <div className="text-center">Loading...</div>}
          {!loading && packages.map((p) => {
            const activities = (p.packageActivities || "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 6);
            return (
              <div key={p._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img src={(p.packageImages && p.packageImages[0]) || heroImage} alt={p.packageName} className="w-full h-40 object-cover" />
                <div className="p-3 border-b">
                  <p className="text-xs font-semibold text-orange-600">{p.packageDays}D/{p.packageNights}N</p>
                  <h3 className="font-semibold text-lg">{p.packageName}</h3>
                  <p className="text-xl font-bold text-orange-600">₹{p.packageDiscountPrice || p.packagePrice}</p>
                </div>
                <div className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {activities.map((a, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-slate-100 border">{a}</span>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <Link to={`/package/${p._id}/itinerary`} className="text-center bg-orange-600 text-white py-2 rounded">View Outlined Itinerary</Link>
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && packages.length === 0 && <div className="text-center text-gray-700">No packages found</div>}
        </div>
      </div>
    </div>
  );
};

export default InternationalDestinationPackages;