import React  from 'react';
import {
    Form,
    redirect,
    useActionData,
    useLocation,
    useNavigation,
} from "react-router-dom";
import { noviAuthProvider } from "./auth";
import { Container } from 'react-bootstrap';
  
export async function loginAction({ request }) {
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

export async function loginLoader() {
    if (noviAuthProvider.isAuthenticated) {
        return redirect("/");
    }
    return null;
}

export function LoginPage() {
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