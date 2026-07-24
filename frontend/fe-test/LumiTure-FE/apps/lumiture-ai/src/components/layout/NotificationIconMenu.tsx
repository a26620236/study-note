import IconButton from '@mui/material/IconButton';

import { Icon } from '@lumiture-ui';

export default function NotificationIconMenu() {
  // const [notificationIconMenuTrigger, setNotificationIconMenuTrigger] =
  //   useState<null | HTMLElement>(null);
  // const handleOpenNotificationIconMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setNotificationIconMenuTrigger(event.currentTarget);
  // };
  // const handleCloseNotificationIconMenu = () => {
  //   setNotificationIconMenuTrigger(null);
  // };

  return (
    <>
      <IconButton
        size="medium"
        // onClick={handleOpenNotificationIconMenu}
      >
        <Icon name="notifications" sx={{ color: 'common.white' }} />
      </IconButton>
      {/* TODO: 等小鈴鐺需求 & 邏輯再說 */}
      {/* <Menu
        id="account-icon-menu"
        anchorEl={notificationIconMenuTrigger}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        open={Boolean(notificationIconMenuTrigger)}
        onClose={handleCloseNotificationIconMenu}
        sx={(theme) => ({ mt: theme.spacing(5) })}
        slotProps={{
          paper: {
            sx: {
              width: 220,
              backgroundColor: 'primary.dark',
              color: 'common.white',
            },
          },
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
      </Menu> */}
    </>
  );
}
