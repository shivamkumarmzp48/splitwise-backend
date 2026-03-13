module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Expense, { as: 'CreatedExpenses', foreignKey: 'creatorId' });
    User.hasMany(models.Expense, { as: 'PaidExpenses', foreignKey: 'paidById' });
    User.belongsToMany(models.Expense, { through: 'ExpenseParticipant', foreignKey: 'userId', as: 'ParticipatedExpenses' });
  };
  return User;
};