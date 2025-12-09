import { useEffect, useState } from "react";

const SiteContent = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroBackgroundImage: "",
    categories: [],
    offices: { headOffice: "", branchOffices: [] },
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/settings");
        const data = await res.json();
        setLoading(false);
        if (data?.success) setSettings(data.settings);
      } catch (e) {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateField = (key, value) => setSettings((s) => ({ ...s, [key]: value }));
  const uploadFile = async (file, folder) => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder || "site-content");
    const res = await fetch("/api/upload/image", { method: "POST", body: form, credentials: "include" });
    const data = await res.json();
    if (!res.ok || data?.success !== true) throw new Error(data?.message || "Upload failed");
    return data.url;
  };

  const updateCategory = (i, patch) => {
    const next = [...(settings.categories || [])];
    next[i] = { ...next[i], ...patch };
    updateField("categories", next);
  };
  const addCategory = () => {
    updateField("categories", [
      ...(settings.categories || []),
      { id: "New", title: "New", description: "", image: "" },
    ]);
  };
  const removeCategory = (i) => {
    const next = [...(settings.categories || [])];
    next.splice(i, 1);
    updateField("categories", next);
  };

  const updateOffice = (i, value) => {
    const next = [...(settings.offices?.branchOffices || [])];
    next[i] = value;
    updateField("offices", { ...(settings.offices || {}), branchOffices: next });
  };
  const addOffice = () => {
    const next = [...(settings.offices?.branchOffices || []), ""];
    updateField("offices", { ...(settings.offices || {}), branchOffices: next });
  };
  const removeOffice = (i) => {
    const next = [...(settings.offices?.branchOffices || [])];
    next.splice(i, 1);
    updateField("offices", { ...(settings.offices || {}), branchOffices: next });
  };

  const save = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      setLoading(false);
      if (data?.success) {
        setSettings(data.settings);
        alert("Updated successfully");
      } else {
        alert(data?.message || "Failed to update");
      }
    } catch (e) {
      setLoading(false);
      alert("Failed to update");
    }
  };

  return (
    <div className="w-full p-3 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Site Content</h2>
      {loading && <div>Loading...</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-3 border rounded-lg">
          <h3 className="text-lg font-semibold">Hero Section</h3>
          <label className="block mt-2 text-sm">Title</label>
          <input className="p-2 border rounded w-full" value={settings.heroTitle || ""} onChange={(e) => updateField("heroTitle", e.target.value)} />
          <label className="block mt-2 text-sm">Subtitle</label>
          <input className="p-2 border rounded w-full" value={settings.heroSubtitle || ""} onChange={(e) => updateField("heroSubtitle", e.target.value)} />
          <label className="block mt-2 text-sm">Background Image</label>
          <div className="flex items-center gap-2">
            <input type="file" accept="image/*" onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setLoading(true);
              try {
                const url = await uploadFile(f, "hero");
                updateField("heroBackgroundImage", url);
              } catch (err) {
                alert("Upload failed");
              }
              setLoading(false);
            }} />
            {settings.heroBackgroundImage && (<a href={settings.heroBackgroundImage} target="_blank" rel="noreferrer" className="text-blue-600 underline">Preview</a>)}
          </div>
        </div>

        <div className="p-3 border rounded-lg">
          <h3 className="text-lg font-semibold">Offices</h3>
          <label className="block mt-2 text-sm">Head Office</label>
          <textarea className="p-2 border rounded w-full" rows={3} value={settings?.offices?.headOffice || ""} onChange={(e) => updateField("offices", { ...(settings.offices || {}), headOffice: e.target.value })} />
          <label className="block mt-2 text-sm">Branch Offices</label>
          <div className="flex flex-col gap-2">
            {(settings?.offices?.branchOffices || []).map((b, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input className="p-2 border rounded w-full" value={b} onChange={(e) => updateOffice(i, e.target.value)} />
                <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => removeOffice(i)}>Delete</button>
              </div>
            ))}
            <button className="px-2 py-1 bg-slate-700 text-white rounded w-min" onClick={addOffice}>Add</button>
          </div>
        </div>
      </div>

      <div className="p-3 border rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Homepage Categories</h3>
          <button className="px-3 py-1 bg-slate-700 text-white rounded" onClick={addCategory}>Add Category</button>
        </div>
        <div className="grid lg:grid-cols-2 gap-3 mt-3">
          {(settings.categories || []).map((c, i) => (
            <div key={i} className="border rounded p-3 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm">ID</label>
                  <input className="p-2 border rounded w-full" value={c.id || ""} onChange={(e) => updateCategory(i, { id: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm">Title</label>
                  <input className="p-2 border rounded w-full" value={c.title || ""} onChange={(e) => updateCategory(i, { title: e.target.value })} />
                </div>
              </div>
              <label className="text-sm">Description</label>
              <input className="p-2 border rounded w-full" value={c.description || ""} onChange={(e) => updateCategory(i, { description: e.target.value })} />
              <label className="text-sm">Image</label>
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setLoading(true);
                  try {
                    const url = await uploadFile(f, `category-${c.id || 'general'}`);
                    updateCategory(i, { image: url });
                  } catch (err) {
                    alert("Upload failed");
                  }
                  setLoading(false);
                }} />
                {c.image && (<a href={c.image} target="_blank" rel="noreferrer" className="text-blue-600 underline">Preview</a>)}
              </div>
              <div className="flex justify-end">
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => removeCategory(i)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={save}>{loading ? "Saving..." : "Save Changes"}</button>
      </div>
    </div>
  );
};

export default SiteContent;
