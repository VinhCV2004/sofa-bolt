import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

function createDemoToken(email: string) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    email: email.trim(),
    role: 'admin',
  };
  const encoded = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `demo.${encoded}.local`;
}

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    if (!email.trim() || !password) throw new Error('Nhập email và mật khẩu để tiếp tục.');
    await setSession(createDemoToken(email));
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password }: SignUpParams): Promise<void> => {
  try {
    if (!email.trim() || !password) throw new Error('Nhập email và mật khẩu để tiếp tục.');
    await setSession(createDemoToken(email));
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
