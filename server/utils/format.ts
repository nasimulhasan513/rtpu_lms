export const formatDate = (date: string) => {
  const dhakaTZ = 'Asia/Dhaka';
  const dhakaMoment = new Date(date).toLocaleString('en-US', { timeZone: dhakaTZ });
  const dhakaMomentDate = new Date(dhakaMoment);
  return dhakaMomentDate.toISOString();
}