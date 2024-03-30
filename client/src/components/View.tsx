import { useEffect, useState } from "react";

const View = () => {
    const [shorts, setShorts] = useState<{ original: string, short: string }[]>();

    useEffect(() => {
        const get = async () => {
            const data = await(await fetch('app/view')).json();
            setShorts(data);
        };
        get();
    }, [setShorts]);

    if (shorts === undefined) return <div>getting data...</div>;

    if (shorts.length <= 0) return <div>no urls shortened yet</div>;

    return <ul>
        {shorts.map((entry, i) => {
            const { original: url, short} = entry;
            return <li key={i}>
                <a href={url}>{url}</a> shortened to: <a href={url}>{short}</a>
            </li>
        })}
    </ul>
};

export default View;
