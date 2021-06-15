import { queryEmailFromFS, setUserDataToFS } from '../../store/firestore';
import {
  getDataFromLS,
} from '../../store/localStorageEffect';

const userInfoEffect = () => {
  const getUserInfoByValidatingUser = async (user) => {
    console.log(user);
    try {
      const userInfoFromFS = await queryEmailFromFS(user.email);

      if (userInfoFromFS === null) {
        console.log('此email沒有在FS上註冊過');
        const userInfo = {
          name: user.displayName,
          email: user.email,
          headshot: user.photoURL,
        };
        return userInfo;
      }
      console.log('FS中發現此email');
      return userInfoFromFS;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const checkUserInfoIsEqualToFSData = async (userInfo) => {
    try {
      const userInfoFromFS = await queryEmailFromFS(userInfo.email);
      if (JSON.stringify(userInfo) === JSON.stringify(userInfoFromFS)) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const updateUserInfoToFSFromLS = async () => {
    const shouldUpdate = !await checkUserInfoIsEqualToFSData();
    console.log(shouldUpdate);
    if (!shouldUpdate) return;
    await setUserDataToFS(getDataFromLS('userInfo'));
  };

  return {
    getUserInfoByValidatingUser,
    updateUserInfoToFSFromLS,
  };
};

export default userInfoEffect;
