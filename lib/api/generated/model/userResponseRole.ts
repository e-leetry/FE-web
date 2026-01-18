
export type UserResponseRole = typeof UserResponseRole[keyof typeof UserResponseRole];


export const UserResponseRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;
