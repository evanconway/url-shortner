import { configDotenv } from "dotenv";

const checkEnvNames = (envNames: string[]) => {
    envNames.forEach(name => {
        const value = process.env[name];
        if (value === undefined) throw new Error(`Environment variable "${name}" is not defined or .env file is missing`);
    });
};

const checkEnv = () => {
    configDotenv();
    checkEnvNames([
        'DOMAIN',
    ]);
};

export default checkEnv;
