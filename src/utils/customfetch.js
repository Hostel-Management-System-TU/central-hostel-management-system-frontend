const fetchWithAuth = async (url, options = {}, token) => {
  const isFormData = options.body instanceof FormData;

  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });
};

export default fetchWithAuth;