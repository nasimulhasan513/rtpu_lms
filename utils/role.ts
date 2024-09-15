export const hasRole = (role: string) => {
  const user = useUser();
  return user.value?.role === role;
};
