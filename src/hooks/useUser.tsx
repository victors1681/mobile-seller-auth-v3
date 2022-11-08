import * as React from 'react';
import { db, firebase, functions } from 'root/firebaseConnection';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

export interface IUseUser {
  user?: IUser;
  users?: IUser[];
  isSellerCodeExist: (sellerCode: string, businessId?: string, userId?: string) => Promise<boolean>;
  requestUsers: (businessId?: string) => Promise<void>;
  requestUserById: (userId: string) => Promise<IUser | undefined>;
  performLogin: (uid: string, email: string, photoURL: string) => void;
  updateUser: (dataUser: IUser, businessId: string) => Promise<boolean>;
  transferUser: (sellerSource: string, sellerTarget: string) => Promise<boolean>;
  addUser: (dataUser: IUser, businessId: string) => Promise<boolean | undefined>;
  isLogged: boolean;
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
  removeUser: (userId: string) => Promise<boolean | undefined>;
  changePassword: (userId: string, password: string) => Promise<boolean | undefined>;
  sendEmailToResetPassword: (email: string) => Promise<boolean | undefined>;
}

export enum UserTypeEnum {
  seller = 'seller',
  administrator = 'administrator',
  superuser = 'superuser'
}

export const USER_COLLECTION = 'users';

export const useUser = (): IUseUser => {
  const [user, setUser] = React.useState<IUser>();
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [isLogged, setLogged] = React.useState(false);

  const history = useHistory();
  const location = useLocation();

  const { from }: any = location.state || { from: { pathname: '/business' } };

  const performLogin = React.useCallback(
    async (uid: string, email: string, photoURL: string) => {
      db.collection(USER_COLLECTION)
        .doc(uid)
        .get()
        .then((snapshot) => {
          const userData: any = { ...snapshot.data(), uid, email, photoURL };
          db.collection('business')
            .doc(userData.business)
            .get()
            .then((snapshot) => {
              const businessData: any = { ...snapshot.data(), businessId: userData.business };
              setUser({ ...userData, business: businessData });

              // const auth = firebase.auth();
              // if (auth) {
              //   auth.currentUser?.getIdToken().then((data) => console.error('datadata', data));
              // }
              setLogged(true);

              if (location.pathname && !['/', '/login'].includes(location.pathname)) {
                history.replace(location.pathname);
              } else {
                history.replace(from);
              }
            });
        });
    },
    [from, history, location]
  );

  const requestUsers = React.useCallback(
    (businessId?: string): Promise<void> => {
      const bID = businessId ? businessId : user?.business.businessId || '';
      const promise = db
        .collection(USER_COLLECTION)
        .where('business', '==', bID)
        .get()
        .then((snapshot: firebase.firestore.QuerySnapshot) => {
          const result = [] as IUser[];
          snapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
            result.push({ userId: doc.id, ...doc.data() } as IUser);
          });
          setUsers(result);
        })
        .catch((error) => {
          console.error(error);
        });

      return promise;
    },
    [user]
  );

  const requestUserById = async (userId: string) => {
    const userById = functions.httpsCallable('userById');
    const { data } = await userById(userId);

    if (data) {
      return data as IUser;
    }
  };

  const updateUser = async (userData: IUser, businessId: string) => {
    try {
      const updateUser = functions.httpsCallable('updateUser');
      const payload = { ...userData, businessId };

      const response = await updateUser(payload);
      if (response) {
        toast('User Updated');
      }

      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const transferUser = async (sellerSource: string, sellerTarget: string) => {
    try {
      const updateUser = functions.httpsCallable('transferUser');
      const payload = { sellerSource, sellerTarget };

      const response = await updateUser(payload);
      if (response) {
        toast('Código de vendedor transferidos');
      }

      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const addUser = async (userData: IUser, businessId: string): Promise<boolean | undefined> => {
    try {
      const addNewUser = functions.httpsCallable('addUser');
      //if photoURL is empty create placeholder link
      const photoURL = userData.photoURL ? userData.photoURL : 'https://storage.cloud.google.com/it_soluclick/user-temporal-placeholder.jpeg';

      const response = await addNewUser({ ...userData, photoURL, business: businessId });
      if (response) {
        toast('User Created');
      }
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, ' ', errorMessage);
      toast.error(errorMessage);
      return;
    }
  };

  const removeUser = async (userId: string): Promise<boolean | undefined> => {
    try {
      const deleteUser = functions.httpsCallable('deleteUser');
      const response = await deleteUser(userId);
      if (response) {
        toast('User Removed');
      }
      return true;
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, ' ', errorMessage);
      toast.error(errorMessage);
      return;
    }
  };
  const changePassword = async (userId: string, password: string): Promise<boolean | undefined> => {
    try {
      const updatePassword = functions.httpsCallable('updatePassword');
      const response = await updatePassword({ userId, password });
      if (response) {
        toast('password Changed');
      }
      return true;
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, ' ', errorMessage);
      toast.error(errorMessage);
      return;
    }
  };

  const sendEmailToResetPassword = async (email: string): Promise<boolean | undefined> => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);

      toast('Email sent');

      return true;
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, ' ', errorMessage);
      toast.error(errorMessage);
      return;
    }
  };

  const isSellerCodeExist = async (sellerCode: string, businessId?: string, userId?: string): Promise<boolean> => {
    const snapshot = await db
      .collection('users')
      .where('sellerCode', '==', sellerCode)
      .where('business', '==', businessId)
      .get();

    if (!snapshot.empty) {
      const currentData = snapshot.docs[0].id;
      return currentData === userId; //if the user is editing and is the same keep editing
    }

    return !!snapshot.docs.length;
  };

  return {
    user,
    users,
    updateUser,
    transferUser,
    requestUserById,
    requestUsers,
    addUser,
    performLogin,
    isSellerCodeExist,
    isLogged,
    setLogged,
    removeUser,
    changePassword,
    sendEmailToResetPassword
  };
};

export default useUser;
