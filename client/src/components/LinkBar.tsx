import { Link as RRLink } from 'react-router-dom';

const Link = (to: string, text: string) => <RRLink style={{ padding: '0 5px' }} to={to}>{text}</RRLink>;

const LinkBar = () => {
    return <div>
        {Link('/', 'Home')}
        {Link('/create', 'Create')}
        {Link('/view', 'View')}
        {Link('/secret', 'Secret')}
        {Link('/users', 'Users')}
    </div>
};

export default LinkBar;
