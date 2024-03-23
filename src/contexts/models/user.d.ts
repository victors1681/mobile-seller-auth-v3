interface IUser {
  userId: string;
  password: string;
  email: string;
  photoURL: string;
  business: IBusiness;
  editPrice: boolean;
  filterClients: boolean;
  firstName: string;
  firstTimeLogin: boolean;
  forceUpdatePassword: boolean;
  initialConfig: boolean;
  lastName: string;
  onlyMyClients: boolean;
  onlyProductsSelected: boolean;
  phone: string;
  priceCondition: boolean;
  resetIpad: boolean;
  restoreIpad: boolean;
  sellerCode: string;
  testMode: boolean;
  type: 'seller' | 'administrator' | 'superuser' | 'driver' | 'office';
  userLevel: string;
  defaultClientByRoute: boolean;
  updateBankList: boolean;
  warehouse: string;
  disabled: boolean;
  fcmToken: string;
  cloudAccess: ICloudModules;
}

interface ICloudModules {
  orders: {
    enabled: boolean;
    allowApprove: boolean;
    allowEdit: boolean;
  };
  transports: {
    enabled: boolean;
    allowForceClose: boolean;
    allowChangeStatus: boolean;
  };
  collections: {
    enabled: boolean;
  };
  visits: {
    enabled: boolean;
  };
  masterdata: {
    enabled: boolean;
  };
  statistics: {
    enabled: boolean;
  };
  settings: {
    enabled: boolean;
  };
}
