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
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
