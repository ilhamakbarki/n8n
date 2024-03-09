import * as crypto from 'crypto';

// Fungsi untuk encrypt data
export function encrypt(text: string, key: string): string {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
	let encrypted = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	const combinedData = `${iv.toString('hex')}.${encrypted}`;
  return Buffer.from(combinedData, 'utf-8').toString('base64');
}

// Fungsi untuk mendekripsi data
export function decrypt(encryptedText: string, key: string): string {
	const decodedData = Buffer.from(encryptedText, 'base64').toString('utf-8');
	const parts = decodedData.split('.');
	if(parts.length !== 2) return ""
	const iv = Buffer.from(parts[0], 'hex');
	const encryptedData = parts[1];
	const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
	let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
	decryptedData += decipher.final('utf8');
	return decryptedData;
}
