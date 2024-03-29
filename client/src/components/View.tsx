import { useEffect, useState } from "react";

const View = () => {
    const [shorts, setShorts] = useState<string[][]>();

    useEffect(() => {
        const get = async () => {
            const data = await(await fetch('app/view')).json();
            const arr = Object.keys(data).map(key => ([key, data[key]]));
            console.log(arr);
            setShorts(arr);
        };
        get();
    }, [setShorts]);

    return shorts === undefined ? <div>getting data...</div> : <ul>
        {shorts.map((entry, i) => <li key={i}><a href={entry[1]}>{entry[1]}</a> shortened to: <a href={entry[1]}>{entry[0]}</a></li>)}
    </ul>
};

export default View;
