import VisibilityOffIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityIcon from '@mui/icons-material/VisibilityRounded';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

interface PwdFieldEndIconProps {
  isVisible: boolean;
  handleClick: () => void;
}

export default function PwdFieldEndIcon({ isVisible, handleClick }: PwdFieldEndIconProps) {
  return (
    <InputAdornment position="end">
      <IconButton
        size="small"
        sx={{
          '& svg': {
            width: 20,
            height: 20,
          },
        }}
        aria-label="toggle-password-visibility"
        onClick={handleClick}
      >
        {isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    </InputAdornment>
  );
}
