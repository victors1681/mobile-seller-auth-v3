import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useHistory, useLocation } from 'react-router-dom';
import firebaseConfig from '../firebasekey';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export interface UseMainInterface {
  firebase?: object;
  handleLogin?: (email: string, password: string) => void;
  isLogged?: boolean;
  user?: IUser;
  users?: IUser[];
  business?: IBusiness[];
  requestBusiness?: () => void;
  requestUsers?: (businessId?: string) => void;
  requestUserById: (userId: string) => Promise<IUser | undefined>;
  isSellerCodeExist?: (sellerCode: string) => Promise<boolean>;
  updateUser?: (dataUser: IUser) => Promise<boolean>;
  addUser?: (dataUser: IUser) => Promise<boolean>;
}

export const useMainAppContext = (): UseMainInterface => {
  const [isLogged, setLogged] = React.useState(false);
  const [user, setUser] = React.useState<IUser>();
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [business, setBusiness] = React.useState<IBusiness[]>([]);

  const history = useHistory();
  const location = useLocation();

  const { from }: any = location.state || { from: { pathname: '/business' } };

  const performLogin = React.useCallback(
    (uid: string, email: string, photoURL: string) => {
      db.collection('users')
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
              if (location.pathname && !['/', '/login'].includes(location.pathname)) {
                history.replace(location.pathname);
              } else {
                history.replace(from);
              }
            });
        });

      setLogged(true);
    },
    [from, history, location]
  );

  const performActiveSession = React.useCallback(() => {
    firebase.auth().onAuthStateChanged((user: any) => {
      if (user) {
        // User is signed in.
        if (user) {
          performLogin(user.uid, user.email, user.photoURL);
        }
      } else {
        // No user is signed in.
        history.replace({ pathname: '/login' });
      }
    });
  }, []);

  React.useEffect(() => {
    performActiveSession();
  }, [performActiveSession]);

  const handleLogin = React.useCallback((email: string, password: string) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user: { photoURL, email, uid } }: any) => {
        firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.SESSION)
          .then(function() {
            return firebase.auth().signInWithEmailAndPassword(email, password);
          })
          .catch(function(error) {
            console.error('Error', error);
          });

        performLogin(uid, email, photoURL);
      })
      .catch(function(error) {
        setLogged(false);
        console.error('HELLOOOOOO', error);
      });
  }, []);

  const requestBusiness = React.useCallback(() => {
    db.collection('business')
      .get()
      .then((snapshot: firebase.firestore.QuerySnapshot) => {
        const result = [] as IBusiness[];
        snapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
          result.push({ businessId: doc.id, ...doc.data() } as IBusiness);
        });

        setBusiness(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const requestUsers = React.useCallback(
    (businessId?: string) => {
      const bID = businessId ? businessId : user?.business.businessId || '';
      db.collection('users')
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

  const requestUserById = React.useCallback(async (userId: string) => {
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .get();

    if (snapshot) {
      console.error('doc.data()doc.data()', snapshot.data());
      return { userId: snapshot.id, ...snapshot.data() } as IUser;
    }
  }, []);

  const isSellerCodeExist = async (sellerCode: string): Promise<boolean> => {
    const snapshot = await db
      .collection('users')
      .where('sellerCode', '==', sellerCode)
      .get();

    console.error('isSellerCodeExist', snapshot);
    return !!snapshot.docs.length;
  };

  const addUser = async (userData: IUser) => {
    delete userData.userId;

    const snapshot = await db.collection('users').add({ ...userData, business: userData.business.businessId });

    console.error('Update User ', snapshot);
    return true;
  };

  const updateUser = async (userData: IUser) => {
    try {
      delete userData.userId;

      const snapshot = await db
        .collection('users')
        .doc(userData.userId)
        .update({ ...userData, business: userData.business.businessId });

      console.error('Update User ', snapshot);
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    isLogged,
    handleLogin,
    firebase,
    user,
    users,
    business,
    requestBusiness,
    requestUsers,
    requestUserById,
    isSellerCodeExist,
    updateUser,
    addUser
  };
};

const MainAppContext = React.createContext<UseMainInterface>({} as UseMainInterface);

export default MainAppContext;

export const MainAppProvider = (props) => {
  const initialValues = useMainAppContext();

  return <MainAppContext.Provider value={initialValues}>{props.children}</MainAppContext.Provider>;
};
