import { fetchEnv } from "./env";
// import {
//   isSavedToFirebase,
//   loadFilesFromFirebase,
//   loadFromFirebase,
//   saveFilesToFirebase,
//   saveToFirebase,
// } from "./firebase";
import {
  isSavedToHttpStorage,
  loadFilesFromHttpStorage,
  loadFromHttpStorage,
  saveFilesToHttpStorage,
  saveToHttpStorage,
} from "./httpStorage";
import { StorageBackend } from "./StorageBackend";

export enum EnvVar {
  STORAGE_BACKEND = "STORAGE_BACKEND",
  HTTP_STORAGE_BACKEND_URL = "HTTP_STORAGE_BACKEND_URL",
}

const configMap = new Map<string, string>();
const loadingConfigPromise = loadConfig();

export async function loadConfig(): Promise<void> {
  return fetchEnv().then((res) => {
    for (const [key, val] of Object.entries(res)) {
      configMap.set(key, val as string);
    }
    console.info("Loaded config: ", configMap);
  });
}

export async function getEnv(variable: EnvVar): Promise<string> {
  if (configMap.size === 0) {
    await loadingConfigPromise;
  }

  const result = configMap.get(variable);
  if (result === undefined) {
    console.warn(`Unknown config: ${variable}`);
    return "";
  }

  return result;
}


const httpStorage: StorageBackend = {
  isSaved: isSavedToHttpStorage,
  saveToStorageBackend: saveToHttpStorage,
  loadFromStorageBackend: loadFromHttpStorage,
  saveFilesToStorageBackend: saveFilesToHttpStorage,
  loadFilesFromStorageBackend: loadFilesFromHttpStorage,
};

const storageBackends = new Map<string, StorageBackend>()
  .set("http", httpStorage);

export let storageBackend: StorageBackend | null = null;

export async function getStorageBackend() {
  if (storageBackend) {
    return storageBackend;
  }

  const storageBackendName = process.env.REACT_APP_STORAGE_BACKEND;

  if (storageBackends.has(storageBackendName)) {
    storageBackend = storageBackends.get(storageBackendName) as StorageBackend;
  } else {
    console.warn("No storage backend found, default to firebase");
  }

  return storageBackend;
}
