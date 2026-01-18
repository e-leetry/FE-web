
export type UserResponseProvider = typeof UserResponseProvider[keyof typeof UserResponseProvider];


export const UserResponseProvider = {
  GOOGLE: 'GOOGLE',
  KAKAO: 'KAKAO',
} as const;
