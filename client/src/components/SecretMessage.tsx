import { useEffect, useState } from "react";
import LinkBar from "./LinkBar";

const SecretMessage = () => {
    const [msg, setMsg] = useState('getting secret message...');

    useEffect(() => {
        const get = async () => {
            const data = await (await fetch('/app/greet')).text();
            setMsg(data);
        };
        get();
    }, [setMsg]);

    return <div>
        <LinkBar />
        {msg}
    </div>;
};

export default SecretMessage;
