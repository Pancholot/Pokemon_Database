export const saveData = (key: string, value: any) => {
  sessionStorage.setItem(key, value);
};

export const getData = (key: string) => {
  return sessionStorage.getItem(key);
};

export const deleteData = (key: string) => {
  sessionStorage.removeItem(key);
};
