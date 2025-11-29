import axios from "axios";

const API = "http://localhost:4000";

export async function fetchCategories(source: string) {
  const res = await axios.get(`${API}/categories/${source}`);
  console.log("✅ Backend response:", res.data);
  return res.data;
}
