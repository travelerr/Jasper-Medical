import Link from "next/link";

export default function LoginButton() {
  return (
    <Link
      className="btn btn-primary hover:bg-teal-400"
      href="/authentication/login"
    >
      Login
    </Link>
  );
}
