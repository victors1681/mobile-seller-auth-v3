import * as React from 'react';
import { db, firebase } from 'root/firebaseConnection';
import { toast } from 'react-toastify';
import { testServerConnectionApi } from './api';

export interface IUseBusiness {
  business?: IBusiness[];
  requestBusiness?: (businessId?: string) => void;
  requestBusinessById: (businessId: string) => Promise<IBusiness | undefined>;
  updateBusiness: (businessData: IBusiness, businessId: string) => Promise<boolean>;
  addBusiness: (businessData: IBusiness) => Promise<boolean | undefined>;
  isLoading: boolean;
  testServerConnection: (host: string, port: string) => Promise<boolean | undefined>;
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
      setLoading(false);

      const data = snapshot.data() as any;

      const dataTransformed = {
        businessId: snapshot.id,
        ...data,
        config: { metadata: [], ...data.config }
      } as IBusiness;

      return dataTransformed;
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

  const testServerConnection = async (host: string, port: string): Promise<boolean | undefined> => {
    try {
      const response = await testServerConnectionApi(host, port);
      if (response) {
        toast.success('Connection Success');
        return true;
      }
    } catch (error) {
      toast.error('Connection Error');
      return false;
    }
  };

  return {
    business,
    updateBusiness,
    requestBusinessById,
    requestBusiness,
    addBusiness,
    isLoading,
    testServerConnection
  };
};

export default useBusiness;
