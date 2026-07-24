'use client';

import { useRouter } from 'next/navigation';

import { Typography, type ButtonProps } from '@mui/material';

import { Button, Icon } from '@lumiture-ui';

type GoBackProps = ButtonProps & {
  content: React.ReactNode;
  url?: string;
  onClick?: () => void;
};

const GoBack = ({ content, url, onClick, ...props }: GoBackProps) => {
  const router = useRouter();

  const handleGoBack = () => {
    if (onClick) {
      onClick();
    } else if (url) {
      router.push(url);
    }
  };

  return (
    <Button
      variant="text"
      color="primary"
      startIcon={<Icon name="arrow_circle_left" />}
      onClick={handleGoBack}
      data-testid="go-back-button"
      {...props}
    >
      <Typography variant="buttonBold2">{content}</Typography>
    </Button>
  );
};

export default GoBack;
