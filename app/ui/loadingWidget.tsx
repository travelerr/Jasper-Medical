import React from "react";
import { Spinner } from "flowbite-react";
import { RotatingLines } from "react-loader-spinner";

const LoadingOverlay = ({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children?: any;
}) => {
  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 100,
          }}
        >
          <div className="flex flex-wrap gap-2">
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="96"
              visible={true}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingOverlay;
