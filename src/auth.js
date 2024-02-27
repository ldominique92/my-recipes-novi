import axios from 'axios';

const appUrl = 'https://api.datavortex.nl/testapp';

export const noviAuthProvider = {
  isAuthenticated: false,
  username: null,
  token: null,
  async signin(username, password) {
    await axios({
      method: 'post',
      url: appUrl + '/users/authenticate',
      data: {
        username: username,
        password: password
      }
    })
    .then((response) =>
    {
      if (response.status == 200 && response.data && response.data.jwt) {
        noviAuthProvider.token = response.data.jwt;
        noviAuthProvider.isAuthenticated = true;
        noviAuthProvider.username = username;
      }
    });
  },
  async signout() {
    noviAuthProvider.isAuthenticated = false;
    noviAuthProvider.username = "";
  },
};