
// Admin email list - these users have admin privileges
const ADMIN_EMAILS = [
  'zak.seid@gmail.com',
  'zakseid0@gmail.com',
];

export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export const checkAdminAccess = (userEmail?: string): boolean => {
  if (!userEmail) return false;
  return isAdminEmail(userEmail);
};
