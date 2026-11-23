const USERNAME = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/;

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function portfolioUsername(value: string | undefined) {
  const username = normalizeUsername(value ?? "");
  if (!USERNAME.test(username)) {
    return null;
  }
  return username;
}
