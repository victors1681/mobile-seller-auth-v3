import  * as React from "react";
import 'firebase/firestore';
import 'firebase/auth';


const useUser = (db) => {

    const [user, setUser] = React.useState<IUser>();
    const [users, setUsers] = React.useState<IUser[]>([]);

    const createUser = () => {

    }

    const updateUser = async (userData: IUser) => {
        delete userData.userId;
    
        const snapshot = await db
          .collection('users')
          .doc(userData.userId)
          .update({ ...userData, business: userData.business.businessId });
    
        console.error('Update User ', snapshot);
        return true;
      };
}

export default useUser;