// Dependencies
const bcrypt = require(`bcrypt`)

// Create Users table
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(`User`, {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: [8]
            }
        }
    });

    // Application association
    User.associate = (models) => {
        User.hasMany(models.Application, {
            onDelete: `cascade`
        });
    }

    User.beforeCreate(user => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
    });

    return User
}

