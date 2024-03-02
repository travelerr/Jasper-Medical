import Link from "next/link";
import { BsFileMedical } from "react-icons/bs";

export default function JasperLogo() {
  return (
    <Link
      className="mb-2 flex h-20 items-end justify-start rounded-md"
      href="/"
    >
      <div className="w-32 text-white md:w-40">
        <div className={`flex flex-row items-center leading-none text-white`}>
          <BsFileMedical className="h-12 w-12 text-white" />
          <p className="text-[32px] text-white">Jasper</p>
        </div>
      </div>
    </Link>
  );
}
