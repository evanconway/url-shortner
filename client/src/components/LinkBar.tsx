import { Link as RRLink } from 'react-router-dom';

const Link = (to: string, text: string) => <RRLink style={{ padding: '0 5px' }} to={to}>{text}</RRLink>;

// @ts-ignore
const getCookie = (name: string) => document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))?.at(2);

const LinkBar = () => {
    return <div>
        {Link('/', 'Home')}
        {Link('/shorten', 'Shorten')}
        {Link('/logout', 'Logout')}
        <span>Greetings {getCookie('username')}!</span>
    </div>
};

export default LinkBar;
