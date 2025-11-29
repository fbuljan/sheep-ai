import axios from "axios";
import { API_URL } from "../config/api";

export async function fetchCategories(source: string) {
  const res = await axios.get(`${API_URL}/categories/${source}`);
  console.log("✅ Backend response:", res.data);
  return res.data;
}
