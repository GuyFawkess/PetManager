import { Client, Account, Databases } from 'appwrite';

export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const COLLECTION_ID_PETS = import.meta.env.VITE_COLLECTION_ID_PETS;
export const COLLECTION_ID_EVENTS = import.meta.env.VITE_COLLECTION_ID_EVENTS;

const client = new Client();
client.setProject('6797fccc000a073cda4a');


export const account = new Account(client);
export const database = new Databases(client);
export default client;