import { useEffect, useState } from "react";
import LinkBar from "./LinkBar";

const UnsafeUsers = () => {
    const [users, setUsers] = useState<{name: string, password: string}[]>();

    useEffect(() => {
        const get = async () => {
            const data: { name: string, password: string }[] = await (await fetch('/app/unsafeuserdata')).json();
            setUsers(data);
        };
        get();
    }, [setUsers]);

    let returnElement = <div>fetching users...</div>

    if (users !== undefined) {
        if (users.length <= 0) returnElement = <div>{'no users:('}</div>
        else returnElement = <ul>{users.map(user => <div>{user.name}: {user.password}</div>)}</ul>;
    }

    return <div>
        <LinkBar />
        {returnElement}
    </div>;
};

export default UnsafeUsers;
