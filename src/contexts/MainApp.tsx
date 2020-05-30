import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { IUseUser, useUser } from 'hooks';
import { db, firebase } from 'root/firebaseConnection';

export interface UseMainInterface {
  firebase?: object;
  handleLogin?: (email: string, password: string) => void;
  isLogged: boolean;
  currentUser?: IUser;
  userHook: IUseUser;
  business?: IBusiness[];
  requestBusiness?: () => void;
}

export const useMainAppContext = (): UseMainInterface => {
  const [currentUser, setCurrentUser] = React.useState<IUser>();
  const userHook = useUser();

  const [business, setBusiness] = React.useState<IBusiness[]>([]);

  const history = useHistory();

  const performActiveSession = React.useCallback(() => {
    firebase.auth().onAuthStateChanged((user: any) => {
      if (user) {
        // User is signed in.
        if (user) {
          userHook.performLogin(user.uid, user.email, user.photoURL);
        }
      } else {
        // No user is signed in.
        history.replace({ pathname: '/login' });
      }
    });
  }, [userHook]);

  //update currentUser
  React.useEffect(() => {
    if (userHook && userHook.user) {
      setCurrentUser(userHook.user);
    }
  }, [userHook && userHook.user]);

  React.useEffect(() => {
    performActiveSession();
  }, []);

  const handleLogin = React.useCallback(
    (email: string, password: string) => {
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

          userHook.performLogin(uid, email, photoURL);
        })
        .catch(function(error) {
          userHook.setLogged(false);
          console.error('Error', error);
        });
    },
    [userHook]
  );

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

  return {
    isLogged: userHook.isLogged,
    handleLogin,
    firebase,
    currentUser,
    userHook,
    business,
    requestBusiness
  };
};

const MainAppContext = React.createContext<UseMainInterface>({} as UseMainInterface);

export default MainAppContext;

export const MainAppProvider = (props) => {
  const initialValues = useMainAppContext();

  return <MainAppContext.Provider value={initialValues}>{props.children}</MainAppContext.Provider>;
};
