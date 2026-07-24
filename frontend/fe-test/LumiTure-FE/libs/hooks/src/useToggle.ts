import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';

interface ToggleActions {
  handleOpen: () => void;
  handleClose: () => void;
  handleToggle: () => void;
}

type UseToggleReturn = [
  value: boolean,
  actions: ToggleActions,
  setValue: Dispatch<SetStateAction<boolean>>,
];

interface UseToggleParams {
  toggleCallback?: (value: boolean) => void;
  defaultOpen?: boolean;
}

export const useToggle = ({
  toggleCallback,
  defaultOpen = false,
}: UseToggleParams = {}): UseToggleReturn => {
  const [value, setValue] = useState<boolean>(defaultOpen);

  const toggle = useCallback(() => {
    setValue((prevValue) => !prevValue);
  }, []);

  const open = useCallback(() => {
    setValue(true);
  }, []);

  const close = useCallback(() => {
    setValue(false);
  }, []);

  useEffect(() => {
    setValue(defaultOpen);
  }, [defaultOpen]);

  useEffect(() => {
    if (!toggleCallback) return;
    toggleCallback(value);
  }, [toggleCallback, value]);

  return [value, { handleOpen: open, handleClose: close, handleToggle: toggle }, setValue];
};
