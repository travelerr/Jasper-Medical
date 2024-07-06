import JasperLogo from "@/app/_ui/shared/jasper-logo";
import LoginForm from "@/app/_ui/authentication/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <JasperLogo position="center" />
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
