export interface User {
    id: number;
    username: string;
    role: 'admin' | 'user';
  }
  
  const users: User[] = [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'user', role: 'user' },
  ];
  
  export const authenticateUser = (username: string, password: string): User | null => {
    // This is a mock authentication. In a real app, you'd verify against a backend.
    const user = users.find(u => u.username === username);
    if (user && password === 'password') { // Using a simple password for all users
      return user;
    }
    return null;
  };
  
  export const generateToken = (user: User): string => {
    // This is a mock token. In a real app, you'd use JWT on the backend.
    return btoa(JSON.stringify(user));
  };
  
  export const verifyToken = (token: string): User | null => {
    try {
      return JSON.parse(atob(token));
    } catch (error) {
      return null;
    }
  };