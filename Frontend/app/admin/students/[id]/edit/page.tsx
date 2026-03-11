"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditStudentPage() {
  const { id } = useParams();
  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    roll_no: "",
    class_id: "",
  });

  // Fetch student data
  useEffect(() => {
    if (!id) return;

    fetch(`${API}/api/v1/students/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          email: data.email || "",
          mobile: data.mobile || "",
          roll_no: data.roll_no || "",
          class_id: data.class_id || "",
        });
      })
      .catch((err) => console.error("Error fetching student:", err));
  }, [id, API]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}/api/v1/students/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            mobile: formData.mobile,
            roll_no: formData.roll_no,
            class_id: formData.class_id
              ? parseInt(formData.class_id)
              : null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error("Update failed");
      }

      alert("Student updated successfully!");
      router.push("/admin/students");

    } catch (error) {
      alert("Error updating student");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px" }}>
      <h2>Edit Student</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
        />

        <input
          name="roll_no"
          placeholder="Roll Number"
          value={formData.roll_no}
          onChange={handleChange}
        />

        <input
          name="class_id"
          placeholder="Class ID"
          value={formData.class_id}
          onChange={handleChange}
        />

        <button onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update Student"}
        </button>

      </div>
    </div>
  );
}