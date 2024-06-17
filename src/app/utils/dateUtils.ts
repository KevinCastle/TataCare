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

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);

  date.setHours(18, 17);

  const formattedDate = date.toLocaleDateString('es-CL', {
    month: 'short',
    day: '2-digit',
    year: '2-digit',
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();

  return `${formattedTime} ${formattedDate}`;
};
