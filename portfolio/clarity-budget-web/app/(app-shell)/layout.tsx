import { redirect } from "next/navigation";
import { createRouteClient } from "@/lib/supabase-server";
import { NavBar } from "@/components/shell/NavBar";
import { T } from "@/lib/constants";

export default async function AppShellLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createRouteClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text }}>
      <NavBar email={data.user.email ?? ""} />
      <main>{children}</main>
    </div>
  );
}
