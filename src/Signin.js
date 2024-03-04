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
  
export async function signinAction({ request }) {
    let formData = await request.formData();
    let username = formData.get("username");
    let password = formData.get("password");
    let repeatPassword = formData.get("repeat-password");
    let email = formData.get("email");

    if (!username) {
        return {
        error: "You must provide a username to sign in",
        };
    }
    if (!password) {
        return {
        error: "You must provide a password to sign in",
        };
    }
    if (!repeatPassword) {
        return {
        error: "Repeat your password to sign in",
        };
    }
    if (!email) {
        return {
        error: "You must provide a email to sign in",
        };
    }
    if (password !== repeatPassword) {
        return {
            error: "Passwords must match",
            };
    }

    try {
        await noviAuthProvider.signin(username, password, email);
    } catch (error) {
        return {
        error: "Invalid signin attempt",
        };
    }

    let redirectTo = formData.get("redirectTo");
    return redirect(redirectTo || "/");
    }

export async function signinLoader() {
    if (noviAuthProvider.isAuthenticated) {
        noviAuthProvider.signout();
    }
    return null;
}

export function SigninPage() {
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    let from = params.get("from") || "/";

    let navigation = useNavigation();
    let isSigninIn = navigation.formData?.get("username") != null;

    let actionData = useActionData();

    return (
        <Form method="post" replace>
        <Container className='form'>
            <Container className='form-header'>
            <h3>Create an account</h3>
            </Container>
            <Container className='form-body'>
            <input type="hidden" name="redirectTo" value={from} />
            <input name="username" placeholder='username' className='form-field' />
            <input name="email" placeholder='email' className='form-field' />
            <input name="password" type='password' placeholder='password' className='form-field' />
            <input name="repeat-password" type='password' placeholder='repeat password' className='form-field' />
            <button type="submit" disabled={isSigninIn} className='form-button'>
                {isSigninIn ? "Saving..." : "Create account"}
            </button>
            {actionData && actionData.error ? (
                <p className="form-error-message">{actionData.error}</p>
            ) : null}
            </Container>
        </Container>
        </Form>
    );
}