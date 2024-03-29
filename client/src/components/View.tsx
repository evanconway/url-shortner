import { useEffect, useState } from "react";

const View = () => {
    const [shorts, setShorts] = useState<string[][]>();

    useEffect(() => {
        const get = async () => {
            const arr = await(await fetch('app/view')).json();
            setShorts(arr);
        };
        get();
    }, [setShorts]);

    return shorts === undefined ? <div>getting data...</div> : <ul>
        {shorts.map((entry, i) => {
            console.log(entry);
            const url = entry[1];
            const short = entry[0];
            return <li key={i}>
                <a href={url}>{url}</a> shortened to: <a href={url}>{short}</a>
            </li>
        })}
    </ul>
};

export default View;
