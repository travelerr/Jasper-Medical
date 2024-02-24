import { lusitana } from "@/app/_ui/fonts";
import { auth } from "../../../auth";

export default async function Page() {
  const session = await auth();
  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>Admin Dashboard</h1>
    </main>
  );
}
