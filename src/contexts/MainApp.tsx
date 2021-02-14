import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { IUseUser, useUser, useBusiness, IUseBusiness } from 'hooks';
import { firebase, functions } from 'root/firebaseConnection';
import { toast } from 'react-toastify';

export interface UseMainInterface {
  firebase?: object;
  handleLogin?: (email: string, password: string) => Promise<boolean | undefined>;
  isLogged: boolean;
  logOut: () => void;
  currentUser?: IUser;
  userHook: IUseUser;
  businessHook: IUseBusiness;
  sendMessageAll: (title: string, body: string) => Promise<boolean>;
  sendMessageToUser: (targetUserId: string, title: string, body: string) => Promise<boolean>;
}

export const useMainAppContext = (): UseMainInterface => {
  const [currentUser, setCurrentUser] = React.useState<IUser>();
  const userHook = useUser();
  const businessHook = useBusiness();

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

  const logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
      })
      .catch(function(error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };
  const handleLogin = React.useCallback(
    async (email: string, password: string) => {
      try {
        const userLogged = await firebase.auth().signInWithEmailAndPassword(email, password);

        if (userLogged) {
          const uid = userLogged.user?.uid || '';
          const photoURL = userLogged.user?.photoURL || '';

          if (uid === '') {
            throw new Error('uid invalid');
          }

          await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

          userHook.performLogin(uid, email, photoURL);
          return true;
        }
      } catch (error) {
        userHook.setLogged(false);
        return false;
      }
      return false;
    },
    [userHook]
  );

  const sendMessageAll = async (title: string, body: string): Promise<boolean> => {
    try {
      const send = functions.httpsCallable('notifyAllUsers');
      await send({ title, body });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const sendMessageToUser = async (targetUserId: string, title: string, body: string): Promise<boolean> => {
    try {
      const send = functions.httpsCallable('sendSimpleNotificationToUserById');
      await send({ targetUserId, title, body });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return {
    isLogged: userHook.isLogged,
    handleLogin,
    firebase,
    currentUser,
    userHook,
    businessHook,
    logOut,
    sendMessageAll,
    sendMessageToUser
  };
};

const MainAppContext = React.createContext<UseMainInterface>({} as UseMainInterface);

export default MainAppContext;

export const MainAppProvider = (props) => {
  const initialValues = useMainAppContext();

  return <MainAppContext.Provider value={initialValues}>{props.children}</MainAppContext.Provider>;
};
