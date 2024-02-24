import { BsFileMedical } from "react-icons/bs";

export default function JasperLogo() {
  return (
    <div className={`flex flex-row items-center leading-none text-white`}>
      <BsFileMedical className="h-12 w-12 text-white" />
      <p className="text-[44px] text-white">Jasper Med</p>
    </div>
  );
}
