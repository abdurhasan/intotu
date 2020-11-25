
import { createConnection, getConnection, getRepository } from 'typeorm';
import { IntotuPartner } from '../models/saas/intotu-partner.model';

export async function getSaasConn(partnerCode: string) {
    try {
        return getConnection(partnerCode)
    } catch {
        const getPartner = await getRepository(IntotuPartner)
            .createQueryBuilder('partner')
            .where('partner.partnerCode = :partnerCode', { partnerCode: partnerCode })
            .getOne()
        const companyDB: any = getPartner?.confSHData;
        const dbConfig = {
            ...companyDB,
            charset: 'utf8mb4',
            timezone: 'Z',
            entities: [`${__dirname}/../models/*{.ts,.js}`],
            logging: false,
            synchronize: false,
        }
        await createConnection(dbConfig);
        return getConnection(partnerCode);
    }
}