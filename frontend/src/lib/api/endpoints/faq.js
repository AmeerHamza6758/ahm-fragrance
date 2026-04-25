const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(
  /\/+$/,
  "",
);

export async function getFaqs() {
  const response = await fetch(`${API_BASE_URL}/api/faq/getAllFaq`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch FAQs (${response.status})`);
  }

  const payload = await response.json();
  if (payload?.status !== 1 || !Array.isArray(payload?.data)) {
    throw new Error("Invalid FAQ response");
  }

  return payload.data;
}
