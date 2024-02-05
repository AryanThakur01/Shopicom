export const fetchUser = async (): Promise<{}> => {
  const res = await fetch("", {});
  const user = res.json();
  return user;
};
