import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { JSX, SVGProps } from "react";

export default function Page() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32">
          <div className="container space-y-10 xl:space-y-16">
            <div className="grid gap-4 px-10 md:grid-cols-2 md:gap-16">
              <div>
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Streamline Your Healthcare with{" "}
                  <span className="text-primary">Jasper Medical</span>
                </h1>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our EHR application revolutionizes direct primary care by
                  simplifying documentation, improving workflow, and enhancing
                  data-driven decision making.
                </p>
                <Link
                  href="#"
                  className="btn btn-primary hover:bg-teal-400"
                  prefetch={false}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start gap-4">
                <HospitalIcon className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Patient Management</h3>
                <p className="text-muted-foreground">
                  Effortlessly manage patient records, appointments, and
                  communications in one centralized platform.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <BarChartIcon className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Electronic Charting</h3>
                <p className="text-muted-foreground">
                  Streamline your clinical documentation with our intuitive
                  charting tools and templates.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <CheckIcon className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Reporting &amp; Analytics</h3>
                <p className="text-muted-foreground">
                  Gain valuable insights into your practice with our
                  comprehensive reporting and analytics features.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <HospitalIcon className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Telehealth Integration</h3>
                <p className="text-muted-foreground">
                  Seamlessly integrate virtual care into your practice with our
                  telehealth capabilities.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <PillIcon className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">E-Prescribing</h3>
                <p className="text-muted-foreground">
                  Streamline the prescription process and improve patient safety
                  with our e-prescribing tools.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <CompassIcon className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Compliance &amp; Security</h3>
                <p className="text-muted-foreground">
                  Rest assured that your patient data is secure and compliant
                  with industry regulations.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                  What Our Customers Say
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from healthcare providers who have transformed their
                  practices with our EHR solution.
                </p>
              </div>
              <div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-lg border bg-background p-6 shadow-sm">
                  <blockquote className="flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-muted-foreground">
                        &quot;Our practice has seen a significant improvement
                        in\n efficiency and patient satisfaction since\n
                        implementing the EHR app. The intuitive interface\n and
                        comprehensive features have truly transformed\n the way
                        we deliver care.&quot;
                      </p>
                    </div>
                    <footer className="text-sm text-muted-foreground">
                      <div>Dr. Sarah Johnson, Family Medicine</div>
                      <div>ABC Medical Center</div>
                    </footer>
                  </blockquote>
                </div>
                <div className="rounded-lg border bg-background p-6 shadow-sm">
                  <blockquote className="flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-muted-foreground">
                        &quot;The EHR app has been a game-changer for our\n
                        practice. The seamless integration with our existing\n
                        systems and the robust reporting capabilities have\n
                        allowed us to make more informed decisions and\n improve
                        patient outcomes.&quot;
                      </p>
                    </div>
                    <footer className="text-sm text-muted-foreground">
                      <div>Dr. Michael Lee, Internal Medicine</div>
                      <div>XYZ Healthcare Clinic</div>
                    </footer>
                  </blockquote>
                </div>
                <div className="rounded-lg border bg-background p-6 shadow-sm">
                  <blockquote className="flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-muted-foreground">
                        &quot;We were hesitant to switch to a new EHR system,
                        but\n the EHR app has exceeded our expectations. The\n
                        intuitive user interface and comprehensive features\n
                        have streamlined our workflows and allowed us to\n focus
                        more on patient care.&quot;
                      </p>
                    </div>
                    <footer className="text-sm text-muted-foreground">
                      <div>Dr. Emily Chen, Pediatrics</div>
                      <div>Community Health Center</div>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="#"
                className="btn btn-primary hover:bg-teal-400"
                prefetch={false}
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 EHR App. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function BarChartIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CompassIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function HospitalIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 6v4" />
      <path d="M14 14h-4" />
      <path d="M14 18h-4" />
      <path d="M14 8h-4" />
      <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2" />
      <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18" />
    </svg>
  );
}

function PillIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}
//   return (
//     <>
//       <main className="flex min-h-screen flex-col p-6">
//         {/* <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
//           <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-3/5 md:px-20">
//             <p
//               className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}
//             >
//               <strong>Welcome to Jasper Med.</strong> <br />
//               We are in the process of simplifying patient health for Direct
//               Primary Care offices.
//             </p>
//             <p>
//               Currently access to the platform is limited. <br />
//               Feel free to look around or use the contact page to request more
//               information.
//             </p>
//           </div>
//           <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12"></div>
//         </div> */}
//       </main>
//     </>
//   );
// }
