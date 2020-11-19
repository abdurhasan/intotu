
import { BaseEntity, Column, ConnectionOptions, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { parseJson } from '../../helpers';
import { Config } from '../../helpers/config.helper';
import { doDecrypt } from '../../helpers/encryption.helper';


@Entity('intotu_partner')
export class IntotuPartner extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number
    @Column({ name: 'partnerName' })
    partnerName: string;
    @Column({ name: 'partnerAddress' })
    partnerAddress: string;
    @Column({ name: 'shdata' })
    shdata: string;
    @Column({ name: 'pic' })
    pic: string;
    @Column({ name: 'partnerCode' })
    partnerCode: string;

    public get confSHData(): ConnectionOptions {
        try {
            const decryptSHData = parseJson(doDecrypt(this.shdata))
            decryptSHData['name'] = this.partnerCode;
            decryptSHData['type'] = Config.get('DB_TYPE');
            decryptSHData['logging'] = Config.getBoolean('DB_LOGGING');
            decryptSHData['synchronize'] = false;
            decryptSHData['charset'] = 'utf8mb4';
            decryptSHData['timezone'] = 'Z'
            return decryptSHData
        } catch (error) {
            throw error
        }
    }

}
