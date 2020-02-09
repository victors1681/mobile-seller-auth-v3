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
  user?: User;
  users?: User[];
  business?: Business[];
  requestBusiness?: () => void;
  requestUsers?: () => void;
}

export interface Business {
  businessId: string;
  address: {
    city: string;
    country: string;
    street: string;
  };
  config: {
    sandboxPort: string;
    sandboxUrl: string;
    serverPort: string;
    serverUrl: string;
    testMode: boolean;
  };
  contact: string;
  contactPhone: string;
  email: string;
  fax: string;
  footerMessage: string;
  footerReceipt: string;
  name: string;
  phone: string;
  rnc: string;
  sellerLicenses: number;
  startingDate: Date;
  status: boolean;
  website: string;
}

export interface User {
  userId: string;
  email: string;
  photoURL: string;
  business: Business;
  editPrice: boolean;
  filterClients: boolean;
  firstName: string;
  firstTimeLogin: boolean;
  forceUpdatePassword: boolean;
  initialConfig: boolean;
  lastName: string;
  onlyMyClients: true;
  onlyProductsSelected: boolean;
  phone: string;
  priceCondition: boolean;
  resetIpad: boolean;
  restoreIpad: boolean;
  sellerCode: string;
  testMode: boolean;
  type: string;
  userLevel: string;
}

export const useMainAppContext = (): UseMainInterface => {
  const [isLogged, setLogged] = React.useState(false);
  const [user, setUser] = React.useState<User>();
  const [users, setUsers] = React.useState<User[]>([]);
  const [business, setBusiness] = React.useState<Business[]>([]);

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
              console.error('fromfromfromfromfromfromfrom', location);
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
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        performLogin(user.uid, user.email, user.photoURL);
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
      .then(({ user: { photoURL, email, uid } }) => {
        firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.SESSION)
          .then(function() {
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            // New sign-in will be persisted with session persistence.
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
        const result = [];
        snapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
          result.push({ businessId: doc.id, ...doc.data() });
        });

        setBusiness(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const requestUsers = React.useCallback(() => {
    db.collection('users')
      .get()
      .then((snapshot: firebase.firestore.QuerySnapshot) => {
        const result = [];
        snapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
          result.push({ userId: doc.id, ...doc.data() });
        });

        setUsers(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return {
    isLogged,
    handleLogin,
    firebase,
    user,
    users,
    business,
    requestBusiness,
    requestUsers
  };
};

const MainAppContext = React.createContext<UseMainInterface>({});

export default MainAppContext;

export const MainAppProvider = (props) => {
  const initialValues = useMainAppContext();

  return <MainAppContext.Provider value={initialValues}>{props.children}</MainAppContext.Provider>;
};
