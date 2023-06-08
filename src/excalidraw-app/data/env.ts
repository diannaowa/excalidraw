export const fetchEnv = async (): Promise<{ [key: string]: string }> => {
  return fetch("/.env.production")
    .then((res) => res.json())
    .catch((e) => console.error("Cannot fetch .env.production file"));
};
