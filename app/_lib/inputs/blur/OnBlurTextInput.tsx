import { useEffect, useState } from "react";

interface IOnBlurTextInput {
  placeholder?: string;
  initialValue?: string;
  editId?: number;
  editString?: string;
  relativeToEdit?: any;
  onBlurCallback: (value: string, id?: number, string?: string) => void;
  className?: string;
}

export default function OnBlurTextInput(props: IOnBlurTextInput) {
  const {
    placeholder,
    onBlurCallback,
    initialValue,
    editId,
    editString,
    className,
  } = props;
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
      onBlurCallback(inputValue, editId, editString);
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
      className={`h-0.5 rounded text-sm w-full ${className ?? ""}`}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
}
