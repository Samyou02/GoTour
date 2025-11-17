import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Itinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/package/get-package-data/${id}`);
        const data = await res.json();
        if (data?.success) {
          setPackageData(data.packageData);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!packageData) return <div className="p-6">Not found</div>;

  const heroImage = packageData?.packageImages?.[0];

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button className="text-sm text-orange-600 hover:underline" onClick={() => navigate(-1)}>Back</button>
        <div className="mt-2 bg-white rounded-2xl overflow-hidden shadow">
          <div className="relative w-full h-44 md:h-60">
            {heroImage && <img src={heroImage} alt={packageData.packageName} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="p-4">
                <h1 className="text-white text-xl md:text-2xl font-extrabold">{packageData.packageName}</h1>
                <p className="text-white text-sm">{packageData.packageDays} Days / {packageData.packageNights} Nights • {packageData.packageDestination}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 p-4 lg:grid-cols-[2fr_1fr]">
            <div>
              <h2 className="text-lg font-semibold mb-2">Outlined Itinerary</h2>
              <div className="bg-white border rounded-xl p-3">
                <div className="flex flex-col gap-2">
                  {(packageData.itineraryDays || []).map((d, i) => (
                    <div key={i} className="border-l-4 border-blue-600 pl-3">
                      <p className="text-blue-700 font-semibold">Day {i + 1}</p>
                      <p className="text-gray-800">{d.title}</p>
                    </div>
                  ))}
                  {(packageData.itineraryDays || []).length === 0 && (
                    <div className="text-sm text-gray-600">No itinerary provided</div>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white border rounded-xl p-3">
                  <h3 className="font-semibold text-green-700">Inclusions</h3>
                  <ul className="mt-2 list-disc list-inside text-sm">
                    {(packageData.inclusions || []).map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                    {(packageData.inclusions || []).length === 0 && <li className="list-none text-gray-600">No inclusions listed</li>}
                  </ul>
                </div>
                <div className="bg-white border rounded-xl p-3">
                  <h3 className="font-semibold text-red-700">Exclusions</h3>
                  <ul className="mt-2 list-disc list-inside text-sm">
                    {(packageData.exclusions || []).map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                    {(packageData.exclusions || []).length === 0 && <li className="list-none text-gray-600">No exclusions listed</li>}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white border rounded-xl p-3">
                <p className="text-2xl font-bold text-orange-600">₹{packageData.packageDiscountPrice || packageData.packagePrice}</p>
                <p className="text-sm text-gray-600">per person</p>
                <Link to={`/package/${packageData._id}`} className="mt-3 block text-center bg-orange-600 text-white py-2 rounded">View Package</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;