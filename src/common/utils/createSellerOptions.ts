export const createSellerOptions = (users: IUser[] | undefined) => {
  const options =
    users?.map(
      (user) =>
        ({
          name: `${user.firstName} ${user.lastName}`,
          label: `${user.sellerCode}-${user.firstName} ${user.lastName}`,
          value: user.userId,
          code: parseInt(user.sellerCode)
        } as SelectOptions)
    ) || ([] as SelectOptions[]);

  options.sort((a: any, b: any) => a?.code - b?.code);

  return options;
};
