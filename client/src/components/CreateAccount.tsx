import { useState } from "react";

interface AccountInfo {
    username: string,
    password: string,
    repass: string,
}

const CreateAccount = () => {
    const [account, setAccount] = useState<AccountInfo>({ username: '', password: '', repass: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccount({
            ...account,
            [e.target.name]: e.target.value
        });
    };

    const [msg, setMsg] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (account.password !== account.repass) {
            setMsg('re-entered password does not match');
            return;
        }
        setMsg('creating account please wait...');
        const response = await fetch('/app/createaccount', {
            method: 'POST',
            body: JSON.stringify({ username: account.username, password: account.password, repassword: account.repass }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        if (response.ok) {
            window.location.href = '/';
            setAccount({ username: '', password: '', repass: ''});
            return;
        }
        if (response.status === 400) {
            const data = await response.json();
            setMsg(data['msg']);
            return;
        }
        setAccount({ username: '', password: '', repass: ''});
        return;
    };

    return <form onSubmit={onSubmit}>
        <div>
            <label htmlFor='username'>Username: </label>
            <input type='text' name='username' value={account.username} onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor='password'>Enter Password: </label>
            <input type='password' name='password' value={account.password} onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor='repass'>Re-Enter Password: </label>
            <input type='password' name='repass' value={account.repass} onChange={handleChange}/>
        </div>
        <button>Create Account</button>
        <div>
            <a href="/login">login to existing account</a>
        </div>
        {msg === null ? null : <div>
            {msg}
        </div>}
    </form>;
};

export default CreateAccount;
