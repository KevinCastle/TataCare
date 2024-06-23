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

export const shortDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: 'numeric', day: 'numeric' };
  return date.toLocaleDateString('es-CL', options);
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

export const calculateRemainingTime = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const oneDay = 24 * 60 * 60 * 1000;
  const oneMonth = 30;
  const oneYear = 12;

  if (startDate > endDate) {
    return 'terminado';
  }

  const diffInDays = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay));
  const diffInMonths = diffInDays / oneMonth;
  const diffInYears = diffInMonths / oneYear;

  if (diffInDays < oneMonth) {
    return `${diffInDays} días`;
  } if (diffInMonths < oneYear) {
    return `${Math.floor(diffInMonths)} meses`;
  }
  return `${Math.floor(diffInYears)} años`;
};
