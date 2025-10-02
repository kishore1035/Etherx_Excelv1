import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", color: "", bio: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile/me")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          color: data.color || "",
          bio: data.profile?.bio || "",
        });
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setProfile(data);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-card rounded-lg shadow">
      <h2 className="text-2xl mb-6">Profile</h2>
      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div>
          <Label>Email</Label>
          <Input name="email" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <Label>Phone</Label>
          <Input name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div>
          <Label>Color</Label>
          <Input name="color" value={form.color} onChange={handleChange} />
        </div>
        <div>
          <Label>Bio</Label>
          <Input name="bio" value={form.bio} onChange={handleChange} />
        </div>
        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
