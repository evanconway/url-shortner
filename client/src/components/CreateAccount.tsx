const CreateAccount = () => {
    return <div>
        <div>
            <label htmlFor='username'>Username: </label>
            <input type='text' name='username'/>
        </div>
        <div>
            <label htmlFor='password'>Enter Password: </label>
            <input type='text' name='password'/>
        </div>
        <div>
            <label htmlFor='password2'>Re-Enter Password: </label>
            <input type='text' name='password2'/>
        </div>
        <button>Create Account</button>
        <div>
            <a href="/login">login to existing account</a>
        </div>
    </div>;
};

export default CreateAccount;
