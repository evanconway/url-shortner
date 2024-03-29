import { useEffect, useState } from "react";

const SecretMessage = () => {
    const [msg, setMsg] = useState('getting secret message...');

    useEffect(() => {
        const get = async () => {
            const data = await (await fetch('/app/greet')).text();
            setMsg(data);
        };
        get();
    }, [setMsg]);

    return <div>{msg}</div>;
};

export default SecretMessage;
