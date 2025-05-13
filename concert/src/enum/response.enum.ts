import { toEnum } from 'src/utils/string-enum.util';

export const StatusResponse = toEnum(
  'SUCCESS',
  'FAIL',
  'FORBIDDEN',
  'NOTFOUND',
  'EXISTS_USERNAME',
  'EXISTS_EMAIL',
  'USERNAME_OR_PASSWORD_IS_NOT_CORRECT',
  'NOT_EXISTS_ROLE',
  'TYPE_ERROR',
  'EXISTS_TEAM',
  'USER_BY_ID_NOT_FOUND',
  'VIDEO_BY_ID_NOT_FOUND',
  'FOLDER_VIDEO_BY_ID_NOT_FOUND',
  'EXISTS_CATEGORY',
  'CATEGORY_BY_ID_NOT_FOUND',
);
