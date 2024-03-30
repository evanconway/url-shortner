import { useEffect, useState } from "react";
import LinkBar from "./LinkBar";

const Home = () => {
    const [shorts, setShorts] = useState<{ original: string, short: string }[]>();

    useEffect(() => {
        const get = async () => {
            const data = await(await fetch('app/view')).json();
            setShorts(data);
        };
        get();
    }, [setShorts]);

    let shortsList = <div>getting data...</div>;

    if (shorts !== undefined) {
        shortsList = shorts.length <= 0 ? <div>no urls shortened yet</div> : <ul>
            {shorts.map((entry, i) => {
                const { original: url, short} = entry;
                return <li key={i}>
                    <a href={url}>{url}</a> shortened to: <a href={url}>{short}</a>
                </li>
            })}
        </ul>;
    }

    return <div>
        <LinkBar />
        {shortsList}
    </div>;
};

export default Home;
