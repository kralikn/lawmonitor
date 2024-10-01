// checkIfFileExists.ts
// import { Storage } from '@google-cloud/storage';
import { storage } from './gsc.config'


export async function checkIfFileExists(bucketName: string, fileName: string): Promise<boolean> {
  const file = storage.bucket(bucketName).file(fileName);
  const [exists] = await file.exists();
  return exists;
}
