import { Dialect, Sequelize } from "sequelize";

class SequelizeConnection {
    private static conn: Sequelize | null = null;
    private static readonly db_name: string = "api_ecommerce_typescript";
    private static readonly db_user: string = "root";
    private static readonly db_password: string | undefined = "";
    private static readonly db_host: string | undefined = "localhost";
    private static readonly db_driver: Dialect | undefined = "mysql"; // Remplacez par le dialecte de votre base de données

    private constructor() {
        // Instance privée, empêchant l'instantiation directe
    }

    public static getSequelize(): Sequelize {
        if (!this.conn) {
            this.init();
        }

        return this.conn!;
    }

    private static init(): void {
        try {
            this.conn = new Sequelize(
                this.db_name,
                this.db_user,
                this.db_password,
                {
                    host: this.db_host,
                    dialect: this.db_driver,
                    // Ajoutez d'autres options selon vos besoins
                }
            );
        } catch (error) {
            console.error("Erreur lors de l'initialisation de la connexion Sequelize:", error);
            throw error;
        }
    }
}

export default SequelizeConnection;
