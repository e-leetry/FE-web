
export type UserResponseRole = typeof UserResponseRole[keyof typeof UserResponseRole];


export const UserResponseRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;
