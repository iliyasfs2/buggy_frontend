import { redirect } from "next/navigation";

export default async function SetupRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  if (params?.edit === "1") {
    redirect("/dev-hub?edit=1");
  }
  redirect("/dev-hub");
}
