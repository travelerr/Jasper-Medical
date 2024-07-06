import Link from "next/link";
import Image from "next/image";
import HeaderLogoTransparent from "@/public/logos/fulllogo_transparent_nobuffer.png";

interface IJasperLogoProps {
  position?: string;
}

export default function JasperLogo(props: IJasperLogoProps) {
  const { position } = props;
  return (
    <Link
      className={`mb-2 flex h-20 items-end justify-${
        position ?? "start"
      } rounded-md`}
      href="/"
    >
      <div className="w-32 text-white md:w-40">
        <div className={`flex flex-row items-center leading-none text-white`}>
          <Image
            src={HeaderLogoTransparent}
            width={500}
            height={500}
            alt="Picture of the author"
          />
        </div>
      </div>
    </Link>
  );
}
