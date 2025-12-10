import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
});

  const settingsSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: "GoTour" },
    heroSubtitle: { type: String, default: "Discover, plan, and book trusted travel experiences." },
    heroBackgroundImage: { type: String, default: "" },
    categories: { type: [categorySchema], default: [] },
    offices: {
      headOffice: { type: String, default: "GoTour HQ, 107 X Road, Mahalakshmi Nagar\nMothe, Jagtial, Telangana 505327" },
      branchOffices: { type: [String], default: [
        "Hyderabad: 4th Floor, JQ Chambers, Gachibowli, Hyderabad 500032",
        "Siddipet: 1-82/2, Opposite Vishal Mart, Siddipet 502103",
      ] },
    },
    about: {
      title: { type: String, default: "About GoTour" },
      intro: { type: String, default: "We craft memorable journeys across beaches, mountains, cities, and cultural heritage sites. From weekend getaways to multi-country expeditions, our curated packages blend comfort, adventure, and local experiences." },
      images: { type: [String], default: [] },
      missionTitle: { type: String, default: "Our Mission" },
      missionText: { type: String, default: "To make travel simple, safe, and inspiring. We partner with trusted accommodations and transport providers, guide you through authentic local experiences, and support sustainable tourism practices." },
      missionBullets: { type: [String], default: [
        "Curated itineraries tailored to interests and budgets",
        "Transparent pricing with no hidden fees",
        "24/7 assistance from trip planning to return",
      ] },
      offerTitle: { type: String, default: "What We Offer" },
      offerBullets: { type: [String], default: [
        "Beach escapes, treks, city breaks, and cultural tours",
        "Flexible dates, custom add‑ons, group discounts",
        "Verified stays, comfortable transfers, and local guides",
      ] },
      offerText: { type: String, default: "Check the latest packages, filter by destination, and book instantly. Your next journey is a few clicks away." },
      ctaTitle: { type: String, default: "Ready to explore?" },
      ctaText: { type: String, default: "Browse packages, compare offers, and book securely. Our team is here to help you plan the perfect trip." },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
