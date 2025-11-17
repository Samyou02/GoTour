import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const GroupDestinationPackages = () => {
  const { destination } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/package/get-packages?category=Group&searchTerm=${encodeURIComponent(destination)}&limit=100`);
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

  const adminDates = useMemo(() => {
    const list = [];
    packages.forEach((p) => {
      (p.groupAvailableDates || []).forEach((d) => list.push(d));
    });
    return list;
  }, [packages]);

  return (
    <div className="w-full">
      <div className="relative w-full h-40 md:h-56 overflow-hidden">
        <img src={heroImage} alt={destination} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-3xl font-extrabold">{destination} Group Packages</h1>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button className="text-sm text-orange-600 hover:underline" onClick={() => navigate("/group-tours")}>Back to Group Trip Destinations</button>
        <div className="grid gap-4 mt-4 lg:grid-cols-[2fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {loading && <div className="text-center">Loading...</div>}
            {!loading && packages.map((p) => {
              const activities = (p.packageActivities || "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 6);
              return (
                <div key={p._id} className="bg-white rounded-xl shadow-md overflow-hidden">
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
          <div className="bg-white rounded-xl shadow-md h-fit">
            <div className="p-3 border-b">
              <h4 className="font-semibold">Available Group Dates</h4>
              <p className="text-sm text-gray-600">{destination}</p>
            </div>
            <div className="p-3">
              {adminDates.length === 0 ? (
                <div className="text-sm text-gray-600">No dates provided by admin</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {adminDates.map((d, i) => (
                    <div key={i} className="border rounded p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{d.location || ""}</p>
                        <p className="text-sm">{d.month}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(d.dates || []).map((n, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded-full bg-blue-50 border">{n}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDestinationPackages;