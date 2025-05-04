import { BackendUserType } from '../types/BackendTypes';
import { FrontendUserType } from '../types/FrontendTypes';

export const UsertMapper = (UserRes: BackendUserType) => {
  return {
    userID: UserRes.Id,
    email: UserRes.UserEmail,
    token: UserRes.Token,
    isAdmin: UserRes.UserType === 'admin',
    userName: UserRes.UserName,
  } as FrontendUserType;
};
