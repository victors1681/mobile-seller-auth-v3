import * as React from "react";
import * as firebase from "firebase"; 
import firebaseConfig from "../firebasekey";
import {
    BrowserRouter as Router,
    useHistory,
    useLocation
  } from "react-router-dom";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

export interface useMainInterface {
    firebase?: object;
    handleLogin?: (email: string, password: string)=>void;
    isLogged?: boolean;
    user?: User
    users? :Array<User>
    business?: Array<Business>
    requestBusiness?: () => void
    requestUsers?: () => void
}

export interface Business {
    businessId: string
    address: {
        city: string
        country: string
        street: string
    }
    config: {
        sandboxPort: string 
        sandboxUrl: string 
        serverPort: string 
        serverUrl: string
        testMode: boolean
    }
    contact: string
    contactPhone: string
    email: string
    fax: string
    footerMessage: string
    footerReceipt: string
    name: string
    phone: string
    rnc: string
    sellerLicenses: number
    startingDate: Date
    status: boolean
    website: string
}

export interface User {
    uid: string
    email: string,
    photoURL: string,
    business: Business
    editPrice: boolean
    filterClients: boolean
    firstName: string
    firstTimeLogin: boolean
    forceUpdatePassword: boolean
    initialConfig: boolean
    lastName: string
    onlyMyClients: true
    onlyProductsSelected: boolean
    phone: string
    priceCondition: boolean
    resetIpad: boolean
    restoreIpad: boolean
    sellerCode: string
    testMode: boolean
    type: string
    userLevel: string
}

export const useMainAppContext = (): useMainInterface => {
    const [isLogged, setLogged] = React.useState(false);
    const [user, setUser] = React.useState<User>();
    const [users, setUsers] = React.useState<Array<User>>([]);
    const [business, setBusiness] = React.useState<Array<Business>>([]);

    let history = useHistory();
    let location = useLocation();

    const { from }: any = location.state || { from: { pathname: "/business" } };

    React.useEffect(() => {

        firebase.auth().onAuthStateChanged(user => { 
            if (user) {
                // User is signed in.
                performLogin(user.uid, user.email, user.photoURL);
                console.error("CURRENT USERRRRRR", user);
            } else {
                 // No user is signed in.
                 history.replace({ pathname: "/login" });
            }
        });
    }, []);

    const performLogin = (uid: string, email: string, photoURL: string ) => {
         //get user information
 
         db.collection("users").doc(uid).get().then((snapshot) => {

            const userData: any = { ...snapshot.data(), uid, email, photoURL };
            db.collection("business").doc(userData.business).get().then((snapshot) => {

                const businessData: any = {...snapshot.data(), businessId: userData.business };
                setUser({...userData, business: businessData});
                history.replace(from);
            }) ;
            
        });

        setLogged(true);
    }

   const handleLogin = (email: string, password: string) => {

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(( { user: { photoURL, email, uid }})=>{
           
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(function() {
              // Existing and future Auth states are now persisted in the current
              // session only. Closing the window would clear any existing state even
              // if a user forgets to sign out.
              // ...
              // New sign-in will be persisted with session persistence.
              return firebase.auth().signInWithEmailAndPassword(email, password);
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
            });

            performLogin(uid, email, photoURL);

        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            setLogged(false);
            console.error("HELLOOOOOO", error);
          });

    }

    const requestBusiness = () => {
        db.collection("business").get().then((snapshot:firebase.firestore.QuerySnapshot) => {

            let result = [];
            snapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) =>{
                result.push({ businessId: doc.id, ...doc.data()});
            });

            setBusiness(result);
            
        }).catch((error)=>{
            console.error(error)
        })
    }
    const requestUsers = () => {
        db.collection("users").get().then((snapshot:firebase.firestore.QuerySnapshot) => {

            let result = [];
            snapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) =>{
                result.push({ userId: doc.id, ...doc.data()});
            });

            setUsers(result);
            
        }).catch((error)=>{
            console.error(error)
        })
    }

    return {
        isLogged,
        handleLogin,
        firebase,
        user,
        users,
        business,
        requestBusiness,
        requestUsers

    } 

}
 

const MainAppContext = React.createContext<useMainInterface>({});

export default MainAppContext;

export const MainAppProvider = (props) => {

    const initialValues = useMainAppContext();

    return (
        <MainAppContext.Provider value={initialValues} >
            {props.children}
        </MainAppContext.Provider>
    )
}