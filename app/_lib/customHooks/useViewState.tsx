import { useState } from "react";

function useViewState() {
  const [viewState, setViewState] = useState({
    loading: false,
    error: false,
    success: false,
  });

  // Update functions
  const setLoading = (isLoading: boolean) => {
    setViewState({ loading: isLoading, error: false, success: !isLoading });
  };
  const setSuccess = () =>
    setViewState({ loading: false, error: false, success: true });
  const setError = () =>
    setViewState({ loading: false, error: true, success: false });

  return { viewState, setLoading, setSuccess, setError };
}

export default useViewState;
