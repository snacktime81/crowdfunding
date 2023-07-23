import {Sequelize} from 'sequelize';
const env = process.env.NODE_ENV as 'production' | 'test' || 'development';
import configObj from '../config/config'
const config = configObj[env];
import User from './user';
import Item from './item';

export const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: 'mysql',
	}
)

User.initiate(sequelize);
Item.initiate(sequelize);


User.associate();
Item.associate();
