import { Client, Account } from 'appwrite';

const client = new Client();
client.setProject('6797fccc000a073cda4a');


export const account = new Account(client);
export default client;