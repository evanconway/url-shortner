const Login = () => {
    return <div>
        <div>
            <label htmlFor='username'>Username: </label>
            <input type='text' name='username'/>
        </div>
        <div>
            <label htmlFor='password'>Password: </label>
            <input type='text' name='password'/>
        </div>
        <button>Login</button>
        <div>
            <a href="/createaccount">Create New Account</a>
        </div>
    </div>;
};

export default Login;
