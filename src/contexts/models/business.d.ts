interface IBusiness {
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
      displayPriceWithTax: boolean;
      allowPriceBelowMinimum: boolean;
      orderEmailTemplateID: number;
      paymentEmailTemplateID: number;
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
    logoUrl: string;
    sellingPackaging:false;
  }
  
  