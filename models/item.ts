import Sequelize, {
	CreationOptional, InferAttributes, InferCreationAttributes, Model, ForeignKey,
} from 'sequelize';
import User from './user';

class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare img: string;
	declare deadline: CreationOptional<Date>;
	declare describe: string;
	declare percent: number;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
	declare price: number;

	declare UserId: ForeignKey<User['id']>;


	static initiate(sequelize: Sequelize.Sequelize) {
		Item.init({
			id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			},
			name: {
				type: Sequelize.STRING(100),
				allowNull: false,
			},
			img: {
				type: Sequelize.STRING(200),
				allowNull: true,
			},
			deadline: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			describe: {
				type: Sequelize.STRING(200),
				allowNull: true,
			},
			percent: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			price: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			createdAt: Sequelize.DATE,
			updatedAt: Sequelize.DATE,
		}, {
			sequelize,
			timestamps: true,
			underscored: false,
			modelName: 'Item',
			tableName: 'items',
			paranoid: false,
			charset: 'utf8mb4',
			collate: 'utf8mb4_general_ci',
		});
	}

	static associate() {
	Item.belongsTo(User);
	}
}

export default Item;