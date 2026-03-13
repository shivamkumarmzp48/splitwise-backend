module.exports = (sequelize, DataTypes) => {
  const ExpenseParticipant = sequelize.define('ExpenseParticipant', {
    expenseId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  ExpenseParticipant.associate = function(models) {};
  return ExpenseParticipant;
};