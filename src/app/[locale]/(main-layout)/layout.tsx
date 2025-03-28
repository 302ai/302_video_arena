import HomeHeader from "@/components/home/header";
import AppFooter from "@/components/global/app-footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeHeader className="mb-4 mt-6 h-12" />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <AppFooter className="mt-4 h-14" />
    </div>
  );
}
