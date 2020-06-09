import * as React from 'react';
import { db, firebase } from 'root/firebaseConnection';
import { toast } from 'react-toastify';

export interface IUseBusiness {
  business?: IBusiness[];
  requestBusiness?: (businessId?: string) => void;
  requestBusinessById: (businessId: string) => Promise<IBusiness | undefined>;
  updateBusiness: (businessData: IBusiness, businessId: string) => Promise<boolean>;
  addBusiness: (businessData: IBusiness) => Promise<boolean | undefined>;
  isLoading: boolean;
}

export const BUSINESS_COLLECTION = 'business';

export const useBusiness = (): IUseBusiness => {
  const [business, setBusiness] = React.useState<IBusiness[]>([]);
  const [isLoading, setLoading] = React.useState(Boolean);

  const requestBusiness = React.useCallback(() => {
    setLoading(true);
    db.collection('business')
      .get()
      .then((snapshot: firebase.firestore.QuerySnapshot) => {
        const result = [] as IBusiness[];
        snapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
          result.push({ businessId: doc.id, ...doc.data() } as IBusiness);
        });

        setBusiness(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const requestBusinessById = async (businessId: string) => {
    setLoading(true);
    const snapshot = await db
      .collection(BUSINESS_COLLECTION)
      .doc(businessId)
      .get();

    if (snapshot) {
      console.error('doc.data()doc.data()', snapshot.data());
      setLoading(false);
      return { businessId: snapshot.id, ...snapshot.data() } as IBusiness;
    }
  };

  const updateBusiness = async (businessData: IBusiness, businessId: string) => {
    try {
      delete businessData.businessId;
      await db
        .collection(BUSINESS_COLLECTION)
        .doc(businessId)
        .update({ ...businessData });

      toast('User Updated');

      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const addBusiness = async (businessData: IBusiness): Promise<boolean | undefined> => {
    try {
      delete businessData.businessId;
      const response = await db.collection(BUSINESS_COLLECTION).add({ ...businessData });

      if (response) {
        toast('Business Created');
        return true;
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

  return {
    business,
    updateBusiness,
    requestBusinessById,
    requestBusiness,
    addBusiness,
    isLoading
  };
};

export default useBusiness;
