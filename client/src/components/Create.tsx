import { useState } from "react";

const Create = () => {
    const [urlInput, setUrlInput] = useState('');

    return <div>
        <div>
            <label htmlFor="url">URL To Shorten</label>
            <input type="text" name="url" onChange={e => {
                setUrlInput(e.target.value);
            }} value={urlInput}/>
        </div>
        <button onClick={async () => {
            await fetch('/app/create', {
                method: "POST",
                body: JSON.stringify({ urlInput }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            window.location.href = '/view';
            setUrlInput('');
        }}>Create</button>
    </div>;
};

export default Create;
