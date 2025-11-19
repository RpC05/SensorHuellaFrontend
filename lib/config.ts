export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://sensorhuellabackend.onrender.com/api/v1';
};
