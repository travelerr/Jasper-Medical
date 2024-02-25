import JasperLogo from "@/app/_ui/shared/jasper-logo";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center h-screen">
      <div>
        <a href={`mailto:${process.env.ADMIN_EMAIL}`} className="link">
          {process.env.ADMIN_EMAIL}
        </a>
      </div>
    </main>
  );
}
