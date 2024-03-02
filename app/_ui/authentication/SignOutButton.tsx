import { SignOut } from "@/app/_lib/actions";
import { FaSignOutAlt } from "react-icons/fa";

export const SignOutButton = () => {
  const signOutHandler = async () => {
    await SignOut();
  };

  return (
    <button
      className="text-red-500 flex items-center p-2"
      onClick={() => signOutHandler()}
    >
      Sign Out
      <FaSignOutAlt className="ml-2" />
    </button>
  );
};
