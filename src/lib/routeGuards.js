export const requireAuth = (router) => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.replace("/login");
    return false;
  }

  return true;
};

export const requireRoles = (router, allowedRoles = []) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.roles) {
    router.replace("/");
    return false;
  }

  const hasAccess = allowedRoles.some((role) =>
    user.roles.includes(role)
  );

  if (!hasAccess) {
    router.replace("/");
    return false;
  }

  return true;
};
