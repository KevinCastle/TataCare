export const getBirthdate = (birthdate: string): string => {
  const date = new Date(birthdate);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-CL', options);
};

export const getAge = (birthdate: string): string => {
  const date = new Date(birthdate);
  const age = new Date(Date.now() - date.getTime());
  return Math.abs(age.getUTCFullYear() - 1970).toString();
};
