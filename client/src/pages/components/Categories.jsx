import { useNavigate } from "react-router";
import { FaUsers, FaGlobeAsia, FaLandmark, FaHeart } from "react-icons/fa";

const Categories = ({ items: externalItems }) => {
  const navigate = useNavigate();

  const items = externalItems && externalItems.length ? externalItems.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    icon: c.id === "Group" ? <FaUsers className="text-2xl" /> : c.id === "International" ? <FaGlobeAsia className="text-2xl" /> : c.id === "Domestic" ? <FaLandmark className="text-2xl" /> : <FaHeart className="text-2xl" />,
    image: c.image,
  })) : [
    {
      id: "Group",
      title: "Group",
      description:
        "Explore India or International with group of strangers",
      icon: <FaUsers className="text-2xl" />,
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "International",
      title: "International",
      description:
        "Explore international trip privately with your loved ones",
      icon: <FaGlobeAsia className="text-2xl" />,
      image:
        "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "Domestic",
      title: "Domestic",
      description:
        "Explore India privately with your loved ones",
      icon: <FaLandmark className="text-2xl" />,
      image:
        "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "Honeymoon",
      title: "Honeymoon",
      description: "Couples enjoy their honeymoon phase",
      icon: <FaHeart className="text-2xl" />,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center gap-4 py-8">
      <h2 className="text-3xl font-extrabold text-center">Our Travel Categories</h2>
      <p className="text-center text-sm text-gray-600">Click below categories to explore and select related packages</p>
      <div className="grid w-full gap-3 p-2 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              const key = (item.id || item.title || "").toLowerCase();
              if (key.includes("group")) navigate("/group-tours");
              else if (key.includes("international")) navigate("/international");
              else if (key.includes("domestic")) navigate("/domestic");
              else if (key.includes("honeymoon")) navigate("/honeymoon");
              else navigate(`/search?searchTerm=${encodeURIComponent(item.title || item.id || "")}`);
            }}
            className="relative w-full h-40 rounded-xl overflow-hidden shadow-md hover:shadow-lg active:translate-y-[1px]"
          >
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-lg font-semibold">{item.title}</span>
              </div>
              <span className="text-xs opacity-90">{item.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
