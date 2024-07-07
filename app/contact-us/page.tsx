export default function ContactUsPage() {
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="text-4xl flex flex-col text-center">
        <p className="mb-2">Why go through the hassel of a contact form?</p>
        <p className="text-4xl mb-2"> Email us directly! </p>
        <a
          href={`mailto:${process.env.ADMIN_EMAIL}`}
          className="link text-primary text-3xl"
        >
          {process.env.ADMIN_EMAIL}
        </a>
      </div>
    </main>
  );
}
