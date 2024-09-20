export const formatDate = (date: string) => {
  return new Date(new Date(date).getTime() - 6 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
};
