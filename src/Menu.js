import React  from 'react';
import logo from './logo.png';
import {
    Form,
    Link,
    Outlet,
    createBrowserRouter,
    redirect,
    useActionData,
    useFetcher,
    useLocation,
    useNavigation,
    useRouteLoaderData,
  } from "react-router-dom";
import { noviAuthProvider } from "./auth";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Home from './Home.js';
import { Container } from 'react-bootstrap';

export const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader() {
      return { user: noviAuthProvider.username };
    },
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "login",
        action: loginAction,
        loader: loginLoader,
        Component: LoginPage,
      },
      {
        path: "preferences",
        loader: protectedLoader,
        Component: PreferencesPage,
      },
    ],
  },
  {
    path: "/logout",
    async action() {
      // We signout in a "resource route" that we can hit from a fetcher.Form
      await noviAuthProvider.signout();
      return redirect("/");
    },
  },
]);

function Layout() {
  let { user } = useRouteLoaderData("root");
  let fetcher = useFetcher();
  let isLoggingOut = fetcher.formData != null;

  return (
    <div>
      <header>
        <Navbar expand="lg" className="nav-bar">
          <Link to="/" className='home-link'>
            <img src={logo} className="App-logo" alt="logo" />
            <h1>My Recipe Book</h1>
          </Link>
          <Nav className="site-menu">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li hidden={!noviAuthProvider.isAuthenticated}>
                <Link to="/preferences">Preferences</Link>
              </li>
              <li hidden={!noviAuthProvider.isAuthenticated}>
                <fetcher.Form method="post" action="/logout">
                  <button type="submit" disabled={isLoggingOut}>
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                  </button>
                </fetcher.Form>
              </li>
              <li hidden={noviAuthProvider.isAuthenticated}>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </Nav>
        </Navbar> 
        </header>
        <div className='site-body'>
          <Outlet />
        </div>
        <footer>
        <a href="https://www.flaticon.com/free-icons/cook" title="cook icons">Cook icons created by Freepik - Flaticon</a>
      </footer>
    </div>
  );
}

async function loginAction({ request }) {
  let formData = await request.formData();
  let username = formData.get("username");
  let password = formData.get("password");

  if (!username) {
    return {
      error: "You must provide a username to log in",
    };
  }
  if (!password) {
    return {
      error: "You must provide a password to log in",
    };
  }

  try {
    await noviAuthProvider.signin(username, password);
  } catch (error) {
    return {
      error: "Invalid login attempt",
    };
  }

  let redirectTo = formData.get("redirectTo");
  return redirect(redirectTo || "/");
}

async function loginLoader() {
  if (noviAuthProvider.isAuthenticated) {
    return redirect("/");
  }
  return null;
}

function LoginPage() {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let from = params.get("from") || "/";

  let navigation = useNavigation();
  let isLoggingIn = navigation.formData?.get("username") != null;

  let actionData = useActionData();

  return (
    <Form method="post" replace>
      <Container className='form'>
        <Container className='form-header'>
          <h3>Login</h3>
        </Container>
        <Container className='form-body'>
          <input type="hidden" name="redirectTo" value={from} />
          <input name="username" placeholder='username' className='form-field' />
          <input name="password" type='password' placeholder='password' className='form-field' />
          <button type="submit" disabled={isLoggingIn} className='form-button'>
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
          {actionData && actionData.error ? (
            <p className="form-error-message">{actionData.error}</p>
          ) : null}
        </Container>
      </Container>
    </Form>
  );
}

function protectedLoader({ request }) {
  if (!noviAuthProvider.isAuthenticated) {
    let params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}

function PreferencesPage() {
  return <h3>Preferences</h3>;
}