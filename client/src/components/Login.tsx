import { useState } from "react";

interface LoginInfo {
    username: string,
    password: string,
}

const Login = () => {
    const [login, setLogin] = useState<LoginInfo>({ username: '', password: '' });

    const [msg, setMsg] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('trigger login');
        const response = await fetch('/app/login', {
            method: 'POST',
            body: JSON.stringify(login),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        if (response.ok) {
            window.location.href = '/';
            setMsg('logging in...');
        } else if (response.status === 401) {
            const { msg } = await response.json();
            if (msg === 'no-account') setMsg('username not recognized');
            if (msg === 'wrong-pass') setMsg('incorrect password');
        } else if (response.status === 500) setMsg('could not login');
        return;
    };

    return <form onSubmit={onSubmit}>
        <div>
            <label htmlFor='username'>Username: </label>
            <input type='text' name='username' value={login.username} onChange={handleChange} />
        </div>
        <div>
            <label htmlFor='password'>Password: </label>
            <input type='password' name='password' value={login.password} onChange={handleChange} />
        </div>
        <button>Login</button>
        <div>
            <a href="/createaccount">create new account</a>
        </div>
        {msg === null ? null : <div>{msg}</div>}
    </form>;
};

export default Login;
