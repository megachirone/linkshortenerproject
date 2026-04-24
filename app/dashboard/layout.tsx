import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }
  return <>{children}</>;
}