
import { Connection, ConnectionOptions, createConnection } from 'typeorm';


let saasConn: any = null;
export async function getSaasConn(companyDB: ConnectionOptions): Promise<Connection> {
    if (!saasConn) {
        const dbConfig = {
            ...companyDB,
            charset: 'utf8mb4',
            timezone: 'Z',
            entities: [`${__dirname}/../models/*{.ts,.js}`],
            logging: false,
            synchronize: false,
        }        
        saasConn = await createConnection(dbConfig);
    }
    return saasConn
}