export const createSellerOptions = (users: IUser[] | undefined) => {
  const options =
    users?.map(
      (user) =>
        ({
          name: `${user.firstName} ${user.lastName}`,
          label: `${user.sellerCode}-${user.firstName} ${user.lastName}`,
          value: user.userId
        } as SelectOptions)
    ) || ([] as SelectOptions[]);

  options.sort((a: any, b: any) => (a.name.toUpperCase() < b.name.toUpperCase() ? 0 : 0));

  return options;
};
