import JasperLogo from "@/app/_ui/shared/jasper-logo";
import ForgotPassword from "@/app/_ui/authentication/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <JasperLogo position="center" />
          <ForgotPassword />
        </div>
      </div>
    </main>
  );
}
