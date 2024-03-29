import { useEffect, useState } from "react";

const UnsafeUsers = () => {
    const [users, setUsers] = useState<{name: string, password: string}[]>();

    useEffect(() => {
        const get = async () => {
            const data: { name: string, password: string }[] = await (await fetch('/app/unsafeuserdata')).json();
            setUsers(data);
        };
        get();
    }, [setUsers]);

    if (users === undefined) return <div>fetching users...</div>;

    return <ul>
        {users.map(user => <div>{user.name}: {user.password}</div>)}
    </ul>
};

export default UnsafeUsers;
