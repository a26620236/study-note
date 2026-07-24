const ERROR_CODES = {
  USER_NOT_FOUND: {
    key: 'USER_NOT_FOUND',
    message: 'Cannot find this user',
  },
  DUPLICATE_EMAIL: {
    key: 'DUPLICATE_EMAIL',
    message: 'This email address has already been used. Please enter a different email address.',
  },
  USER_ALREADY_IN_GROUP: {
    key: 'USER_ALREADY_IN_GROUP',
    message: 'This user is already in this group.',
  },
  DELETE_USER_GROUP_CONTAIN_USERS: {
    key: 'DELETE_USER_GROUP_CONTAIN_USERS',
    message:
      'To delete this group, you must first remove all members from this group and any of its subgroups.',
  },
  INACTIVE_USER: {
    key: 'INACTIVE_USER',
    message: 'Please activate your LumiTure.ai account.',
  },
  USER_IN_ANOTHER_ORG: {
    key: 'USER_IN_ANOTHER_ORG',
    message: 'This user is already in another organization.',
  },
};

export { ERROR_CODES };
