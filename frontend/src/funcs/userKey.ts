export const saveData = (key: string, value: any) => {
  localStorage.setItem(key, value);
};

export const getData = (key: string) => {
  return localStorage.getItem(key);
};

export const deleteData = (key: string) => {
  localStorage.removeItem(key);
};
