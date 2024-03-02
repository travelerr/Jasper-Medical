import { userSignOut } from "@/app/_lib/actions";
import { PowerIcon } from "@heroicons/react/24/outline";

export const SignOutButton = () => {
  const signOutHandler = async () => {
    await userSignOut();
  };

  return (
    <button
      className="text-red-500 flex items-center p-2"
      onClick={() => signOutHandler()}
    >
      <PowerIcon className="w-6 mr-3" />
      Sign Out
    </button>
  );
};
