import { useEffect, useState } from 'react';
import { Link as RRLink } from 'react-router-dom';
import { getCookie } from '../utils';

const Link = (to: string, text: string) => <RRLink style={{ padding: '0 5px' }} to={to}>{text}</RRLink>;

const LinkBar = () => {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const get = async () => {
            const data = await(await fetch('/app/username')).json();
            setUsername(data['name']);
        };
        get();
    }, [getCookie('sessionId')]);

    return <div>
        <h1>Ultra Scuffed URL Shortener</h1>
        {Link('/', 'Home')}
        {Link('/shorten', 'Shorten')}
        {Link('/logout', 'Logout')}
        {username === null ? null : <span>Greetings {username}!</span>}
    </div>;
};

export default LinkBar;
