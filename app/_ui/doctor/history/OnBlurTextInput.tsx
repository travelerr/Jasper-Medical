import { useEffect, useState } from "react";

interface IOnBlurTextInput {
  placeholder?: string;
  initialValue?: string;
  editId?: number;
  onBlurCallback: (value: string, id?: number) => void;
}

export default function OnBlurTextInput(props: IOnBlurTextInput) {
  const { placeholder, onBlurCallback, initialValue, editId } = props;
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (initialValue?.length) {
      setInputValue(initialValue);
    }
  }, [initialValue]);

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const makeCallback = () => {
    if (inputValue.trim() !== "") {
      console.log("Making API call with:", inputValue);
      onBlurCallback(inputValue, editId);
      console.log("Made API call with:", inputValue);
    }
  };

  const handleBlur = () => {
    makeCallback();
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      makeCallback();
      event.target.blur(); // Optional: to remove focus from the input after pressing Enter
      setInputValue("");
    }
  };

  return (
    <input
      type="text"
      className="h-0.5 rounded text-sm w-full"
      placeholder={placeholder}
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
}
