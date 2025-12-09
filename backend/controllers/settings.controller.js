import Settings from "../models/settings.model.js";

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        categories: [
          {
            id: "Group",
            title: "Group",
            description: "Explore India or International with group of strangers",
            image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
          },
          {
            id: "International",
            title: "International",
            description: "Explore international trip privately with your loved ones",
            image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1200&auto=format&fit=crop",
          },
          {
            id: "Domestic",
            title: "Domestic",
            description: "Explore India privately with your loved ones",
            image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1200&auto=format&fit=crop",
          },
          {
            id: "Honeymoon",
            title: "Honeymoon",
            description: "Couples enjoy their honeymoon phase",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
          },
        ],
      });
    }
    return res.status(200).send({ success: true, settings });
  } catch (e) {
    return res.status(500).send({ success: false, message: "Failed to load settings" });
  }
};

export const upsertSettings = async (req, res) => {
  try {
    const update = req.body || {};
    const settings = await Settings.findOneAndUpdate({}, update, { new: true, upsert: true });
    return res.status(200).send({ success: true, settings });
  } catch (e) {
    return res.status(500).send({ success: false, message: "Failed to update settings" });
  }
};
