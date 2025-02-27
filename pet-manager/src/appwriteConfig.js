import { Client, Account, Databases, Storage } from 'appwrite';

export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const STORAGE_ID = import.meta.env.VITE_STORAGE_ID;
export const COLLECTION_ID_PETS = import.meta.env.VITE_COLLECTION_ID_PETS;
export const COLLECTION_ID_EVENTS = import.meta.env.VITE_COLLECTION_ID_EVENTS;
export const COLLECTION_ID_REGISTER = import.meta.env.VITE_COLLECTION_ID_REGISTER;

const client = new Client();
client.setProject(PROJECT_ID);


export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export default client;