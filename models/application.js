// Create Applications table

module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define("Application", {
        company: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contactName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        contactInfo: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        response: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    });

    Application.associate = (models) => {
        Application.belongsTo(models.User, {
            onDelete: "cascade", 
            foreignKey: {
                name: "UserId", 
                allowNull: false
            }
        });
    }

    return Application
}