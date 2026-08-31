export const isNatalProfileComplete = (profile: any): boolean => {
  if (!profile) return false;
  return !!(
    profile.full_name &&
    profile.birth_date &&
    profile.birth_time &&
    profile.birth_city
  );
};
