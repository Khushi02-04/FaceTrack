"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DeleteStudentPage() {
  const { id } = useParams();
  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/api/v1/students/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("Student deleted successfully!");

      router.push("/admin/students");

    } catch (error) {
      alert("Error deleting student");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "500px" }}>
      <h2>Delete Student</h2>

      <p>Are you sure you want to delete this student?</p>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>

        <button
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete Student"}
        </button>

        <button
          onClick={() => router.push("/admin/students")}
        >
          Cancel
        </button>

      </div>
    </div>
  );
}