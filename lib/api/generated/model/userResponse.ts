import type { UserResponseProvider } from './userResponseProvider';
import type { UserResponseRole } from './userResponseRole';

export interface UserResponse {
  id?: number;
  email: string;
  name: string;
  profileImageUrl?: string;
  provider: UserResponseProvider;
  role: UserResponseRole;
  createdAt?: string;
}
