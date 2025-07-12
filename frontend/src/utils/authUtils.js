// src/utils/authUtils.js

export const getStoredUser = () =>
  JSON.parse(localStorage.getItem("user"));

export const storeUser = (user) =>
  localStorage.setItem("user", JSON.stringify(user));

export const clearUser = () =>
  localStorage.removeItem("user");