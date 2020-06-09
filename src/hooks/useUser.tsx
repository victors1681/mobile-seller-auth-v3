import * as React from 'react';
import { db, firebase } from 'root/firebaseConnection';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

export interface IUseUser {
  user?: IUser;
  users?: IUser[];
  isSellerCodeExist: (sellerCode: string, businessId?: string, userId?: string) => Promise<boolean>;
  requestUsers?: (businessId?: string) => void;
  requestUserById: (userId: string) => Promise<IUser | undefined>;
  performLogin: (uid: string, email: string, photoURL: string) => void;
  updateUser: (dataUser: IUser, businessId: string) => Promise<boolean>;
  addUser: (dataUser: IUser, businessId: string) => Promise<boolean | undefined>;
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

              const auth = firebase.auth();
              if (auth) {
                auth.currentUser?.getIdToken().then((data) => console.error('datadata', data));
              }
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

  const updateUser = async (userData: IUser, businessId: string) => {
    try {
      await db
        .collection(USER_COLLECTION)
        .doc(userData.userId)
        .update({ ...userData, business: businessId });

      toast('User Updated');

      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const addUser = async (userData: IUser, businessId: string): Promise<boolean | undefined> => {
    try {
      const password = userData.password;

      const newUser = await firebase.auth().createUserWithEmailAndPassword(userData.email, password);
      const uid = newUser.user?.uid;
      if (uid) {
        const performData = { ...userData, business: businessId };
        delete performData.password;
        const newUserConfig = db
          .collection(USER_COLLECTION)
          .doc(uid)
          .set({ ...performData, business: businessId });

        if (newUserConfig) {
          toast('User Created');
          return true;
        }
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

  const isSellerCodeExist = async (sellerCode: string, businessId?: string, userId?: string): Promise<boolean> => {
    const snapshot = await db
      .collection('users')
      .where('sellerCode', '==', sellerCode)
      .where('business', '==', businessId && businessId)
      .get();

    if (!snapshot.empty) {
      const currentData = snapshot.docs[0].id;
      return currentData !== userId; //if the user is editing and is the same keep ediging
    }

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
