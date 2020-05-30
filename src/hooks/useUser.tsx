import * as React from 'react';
import { db, firebase } from 'root/firebaseConnection';
import { useHistory, useLocation } from 'react-router-dom';

export interface IUseUser {
  user?: IUser;
  users?: IUser[];
  isSellerCodeExist?: (sellerCode: string) => Promise<boolean>;
  requestUsers?: (businessId?: string) => void;
  requestUserById: (userId: string) => Promise<IUser | undefined>;
  performLogin: (uid: string, email: string, photoURL: string) => void;
  updateUser?: (dataUser: IUser) => Promise<boolean>;
  addUser?: (dataUser: IUser) => Promise<boolean>;
  isLogged: boolean;
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
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
    (uid: string, email: string, photoURL: string) => {
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
    (businessId?: string) => {
      const bID = businessId ? businessId : user?.business.businessId || '';
      db.collection(USER_COLLECTION)
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
    },
    [user]
  );

  const requestUserById = async (userId: string) => {
    const snapshot = await db
      .collection(USER_COLLECTION)
      .doc(userId)
      .get();

    if (snapshot) {
      console.error('doc.data()doc.data()', snapshot.data());
      return { userId: snapshot.id, ...snapshot.data() } as IUser;
    }
  };

  const updateUser = async (userData: IUser) => {
    try {
      delete userData.userId;

      const snapshot = await db
        .collection(USER_COLLECTION)
        .doc(userData.userId)
        .update({ ...userData, business: userData.business.businessId });

      console.error('Update User ', snapshot);
      return true;
    } catch (err) {
      return false;
    }
  };

  const addUser = async (userData: IUser) => {
    delete userData.userId;

    const snapshot = await db.collection(USER_COLLECTION).add({ ...userData, business: userData.business.businessId });

    console.error('Update User ', snapshot);
    return true;
  };

  const isSellerCodeExist = async (sellerCode: string): Promise<boolean> => {
    const snapshot = await db
      .collection('users')
      .where('sellerCode', '==', sellerCode)
      .get();

    console.error('isSellerCodeExist', snapshot);
    return !!snapshot.docs.length;
  };

  return {
    user,
    users,
    updateUser,
    requestUserById,
    requestUsers,
    addUser,
    performLogin,
    isSellerCodeExist,
    isLogged,
    setLogged
  };
};

export default useUser;
