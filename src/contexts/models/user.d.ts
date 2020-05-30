interface IUser {
    userId: string;
    password?: string;
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
    defaultClientByRoute: boolean;
    updateBankList: boolean;
    warehouse: string;
  }
