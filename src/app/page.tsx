import { redirect } from "next/navigation";

export default function Home() {
  // Gracefully bounce users entering base index straight into primary view
  redirect("/camera-management");
}