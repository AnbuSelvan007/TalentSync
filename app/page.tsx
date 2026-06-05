import ThemeToggle from "@/components/shared/ThemeToggle";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/chat");
}
// export default function Home() {
//   return (
//     <main className="flex min-h-screen items-center justify-center">
//       <ThemeToggle />
//     </main>
//   );
// }