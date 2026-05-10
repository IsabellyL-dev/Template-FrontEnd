import { MOCK_USERNAME, MOCK_PASSWORD } from '../constants/mockCredentials';

export function validateMockLogin(username: string, password: string): boolean {
  return username.trim() === MOCK_USERNAME && password === MOCK_PASSWORD;
}