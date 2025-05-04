import { FrontendUserType } from '../types/FrontendTypes';

interface UserDetails extends FrontendUserType {
  date: Date;
}

export const setUserDetails = (data: FrontendUserType) => {
  const details = { ...data, date: new Date() } as UserDetails;
  localStorage.setItem('auth', JSON.stringify(details));
};

export const getUserDetails = () => {
  const data = localStorage.getItem('auth');
  if (data) {
    const res = JSON.parse(data) as UserDetails;
    const currentDate = new Date();
    const oldDate = new Date(res.date);
    if (currentDate.getDate() - oldDate.getDate() >= 1) {
      // token expires
      localStorage.removeItem('auth');
      return null;
    }
    return {
      email: res.email,
      isAdmin: res.isAdmin,
      token: res.token,
      userID: res.userID,
      userName: res.userName,
      userAddress: res.userAddress,
    } as FrontendUserType;
  }
  return null;
};
