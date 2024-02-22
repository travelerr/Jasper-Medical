// components/PharmacyLookup.tsx
import React, { useState } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

type PharmacyLookupProps = {
  onSelect: (place: google.maps.places.PlaceResult) => void;
  labelText?: string;
  required?: boolean;
};

const libraries: "places"[] = ["places"];

const PharmacyLookup: React.FC<PharmacyLookupProps> = ({
  onSelect,
  labelText,
  required,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "",
    libraries,
  });

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const handleLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const handleChange = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      onSelect(place);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      {labelText && (
        <label>
          {labelText}{" "}
          {required ? <span className="text-red-500">*</span> : null}
        </label>
      )}
      <Autocomplete onLoad={handleLoad} onPlaceChanged={handleChange}>
        <input
          type="text"
          className="orm-control block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
          placeholder="Search for pharmacies"
          style={{ width: 300, height: 40, paddingLeft: 10 }}
        />
      </Autocomplete>
    </div>
  );
};

export default PharmacyLookup;
