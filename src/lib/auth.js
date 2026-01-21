export const getUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};
export const checkAccess = (router, allowedRoles = []) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user || !user.roles) {
    router.replace("/login");
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
