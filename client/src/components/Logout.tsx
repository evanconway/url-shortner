import { useState } from "react";
import LinkBar from "./LinkBar";

const Logout = () => {
    const [msg, setMsg] = useState<string | null>(null);

    return <div>
        <LinkBar />
        <div>Are you sure?</div>
        <button onClick={async e => {
            e.preventDefault();
            const response = await fetch('/app/logout');
            if (response.ok) {
                window.location.href = '/';
                setMsg('logging out...');
                return;
            }
            setMsg('logout failed');
        }}>yes</button>
        {msg === null ? null : <div>{msg}</div>}
    </div>;
};

export default Logout;
