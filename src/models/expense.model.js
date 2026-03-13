module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define('Expense', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paidById: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Expense.associate = function(models) {
    Expense.belongsTo(models.User, { as: 'Creator', foreignKey: 'creatorId' });
    Expense.belongsTo(models.User, { as: 'Payer', foreignKey: 'paidById' });
    Expense.belongsToMany(models.User, { through: 'ExpenseParticipant', foreignKey: 'expenseId', as: 'Participants' });
  };
  return Expense;
};