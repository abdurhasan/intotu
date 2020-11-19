
import { Connection, ConnectionOptions, createConnection } from 'typeorm';


let saasConn: any = null;
export async function getSaasConn(companyDB: ConnectionOptions): Promise<Connection> {
    if (!saasConn) {
        const dbConfig = {
            ...companyDB,
            entities: [`${__dirname}/../models/*{.ts,.js}`]
        }
        saasConn = await createConnection(dbConfig);
    }
    return saasConn
}