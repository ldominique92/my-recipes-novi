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
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Home from './Home.js';

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
          path: "protected",
          loader: protectedLoader,
          Component: ProtectedPage,
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
    return (
      <Container>
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
                <li>
                  <Link to="/protected">Protected Page</Link>
                </li>
                <li>
                <AuthStatus />
                </li>
              </ul>
            </Nav>
          </Navbar> 
          </header>
          <Container className='site-body'>
            <Outlet />
          </Container>
          <footer>
          <a href="https://www.flaticon.com/free-icons/cook" title="cook icons">Cook icons created by Freepik - Flaticon</a>
        </footer>
      </Container>
    );
  }


function AuthStatus() {
  // Get our logged in user, if they exist, from the root route loader data
  let { user } = useRouteLoaderData("root");
  let fetcher = useFetcher();

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  let isLoggingOut = fetcher.formData != null;

  return (
    <div>
      <p>Welcome {user}!</p>
      <fetcher.Form method="post" action="/logout">
        <button type="submit" disabled={isLoggingOut}>
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </fetcher.Form>
    </div>
  );
}

async function loginAction({ request }: LoaderFunctionArgs) {
  let formData = await request.formData();
  let username = formData.get("username");

  // Validate our form inputs and return validation errors via useActionData()
  if (!username) {
    return {
      error: "You must provide a username to log in",
    };
  }

  // Sign in and redirect to the proper destination if successful.
  try {
    await noviAuthProvider.signin(username);
  } catch (error) {
    // Unused as of now but this is how you would handle invalid
    // username/password combinations - just like validating the inputs
    // above
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
    <div>
      <p>You must log in to view the page at {from}</p>

      <Form method="post" replace>
        <input type="hidden" name="redirectTo" value={from} />
        <label>
          Username: <input name="username" />
        </label>{" "}
        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
        {actionData && actionData.error ? (
          <p style={{ color: "red" }}>{actionData.error}</p>
        ) : null}
      </Form>
    </div>
  );
}

function protectedLoader({ request }: LoaderFunctionArgs) {
  // If the user is not logged in and tries to access `/protected`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  if (!noviAuthProvider.isAuthenticated) {
    let params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}