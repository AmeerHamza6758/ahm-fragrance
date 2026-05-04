const AUTH_TOKEN_KEY = "token";
const CHECKOUT_PROFILE_KEY = "ahm_checkout_profile";

const isBrowser = () => typeof window !== "undefined";

const safeParse = (value, fallback = null) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const emptyProfile = () => ({
  id: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  postal: "",
  province: "",
});

const mapCheckoutProfile = (raw = {}) => ({
  id: raw.id || "",
  name: raw.name || "",
  phone: raw.phone || "",
  email: raw.email || "",
  address: raw.address || "",
  city: raw.city || "",
  postal: raw.postal || "",
  province: raw.province || "",
});

const mapUserToCheckoutProfile = (user = {}) => ({
  id: user._id || user.id || "",
  name: user.userName || "",
  phone: user.phone || "",
  email: user.email || "",
  address: user.address?.street || "",
  city: user.address?.city || "",
  postal: user.address?.postalCode || "",
  province: user.address?.province || "",
});

export const getStoredCheckoutProfile = () => {
  if (!isBrowser()) {
    return emptyProfile();
  }
  const profile = safeParse(localStorage.getItem(CHECKOUT_PROFILE_KEY), {});
  return {
    ...emptyProfile(),
    ...mapCheckoutProfile(profile),
  };
};

export const saveCheckoutProfile = (partialProfile = {}) => {
  if (!isBrowser()) return;
  const existing = getStoredCheckoutProfile();
  const next = {
    ...existing,
    ...mapCheckoutProfile(partialProfile),
  };
  localStorage.setItem(CHECKOUT_PROFILE_KEY, JSON.stringify(next));
};

export const persistAuthSession = ({ token, user, checkoutProfile } = {}) => {
  if (!isBrowser()) return;

  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  if (user) {
    saveCheckoutProfile(mapUserToCheckoutProfile(user));
  }

  if (checkoutProfile) {
    saveCheckoutProfile(checkoutProfile);
  }
};
