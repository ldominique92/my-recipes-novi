  export const noviAuthProvider = {
    isAuthenticated: false,
    username: null,
    async signin(username) {
      await new Promise((r) => setTimeout(r, 500)); // fake delay
      noviAuthProvider.isAuthenticated = true;
      noviAuthProvider.username = username;
    },
    async signout() {
      await new Promise((r) => setTimeout(r, 500)); // fake delay
      noviAuthProvider.isAuthenticated = false;
      noviAuthProvider.username = "";
    },
  };