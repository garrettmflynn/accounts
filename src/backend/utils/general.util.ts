export function getDbURI(): string {
    const { env } = process;

    switch (env.DATABASE) {
        case 'LOCAL':
            return env.LOCAL_DB_URI || 'mongodb://localhost:27017/';
        case 'TEST':
            if (!env.DB_URI)
                throw new Error('"DB_URI" for "TEST" db not set');

            return env.DB_URI;
        case 'PROD':
            if (env.ENV !== 'PROD')
                throw new Error('CAN ONLY USE IN PROD');

            if (!env.DB_URI)
                throw new Error('"DB_URI" for "PROD" not set');

            return env.DB_URI;
        default:
            throw new Error('"DATABASE" not set')
    }
}
