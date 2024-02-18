import React, { useState } from "react";
import Image from "next/image";

interface IImageWithFallbackProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  width: number;
  height: number;
  className: string;
}

const ImageWithFallback = (props: IImageWithFallbackProps) => {
  const { src, fallbackSrc, alt, width, height, className } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      style={{ height: "fit-content" }}
      src={imgSrc}
      className={className}
      alt={alt}
      width={width}
      height={height}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageWithFallback;
