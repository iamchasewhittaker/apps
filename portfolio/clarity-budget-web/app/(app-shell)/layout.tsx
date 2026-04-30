import { redirect } from "next/navigation";
import { createRouteClient } from "@/lib/supabase-server";
import { Sidebar } from "@/components/shell/Sidebar";

export default async function AppShellLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createRouteClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar email={data.user.email ?? ""} />
      <main className="ml-[240px] flex-1 p-8 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
