import axios from 'axios';

const appUrl = 'https://api.datavortex.nl/myrecipebook/users';

export const noviAuthProvider = {
  isAuthenticated: false,
  username: null,
  token: null,
  async signin(username, password, email) {
    await axios({
      method: 'post',
      url: appUrl + '/users',
      data: {
        username: username,
        password: password,
        email: email,
        info: null,
        authorities: [
          {
            authority: "USER"
          }
        ]
      }
    })
    .then((response) =>
    {
      if (response.status === 200 && response.data && response.data.jwt) {
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