//export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
// src/config/api.js

export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  "https://flow-guard-back-end.onrender.com";
