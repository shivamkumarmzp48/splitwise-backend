const { Expense, User, ExpenseParticipant } = require('../models');
const { Op } = require('sequelize');

exports.getBalances = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.findAll({
      where: {
        [Op.or]: [
          { paidById: userId },
          { '$Participants.id$': userId }
        ]
      },
      include: [
        { model: User, as: 'Payer', attributes: ['id'] },
        { model: User, as: 'Participants', attributes: ['id'], through: { attributes: [] } }
      ]
    });

    const balances = {};
    expenses.forEach(expense => {
      const participants = expense.Participants.map(p => p.id);
      const numParticipants = participants.length;
      const share = parseFloat(expense.value) / numParticipants;
      if (expense.paidById === userId) {
        participants.forEach(pId => {
          if (pId !== userId) {
            balances[pId] = (balances[pId] || 0) + share;
          }
        });
      } else {
        if (participants.includes(userId)) {
          const payerId = expense.paidById;
          balances[payerId] = (balances[payerId] || 0) - share;
        }
      }
    });

    const result = await Promise.all(
      Object.entries(balances).map(async ([otherUserId, balance]) => {
        const user = await User.findByPk(otherUserId, { attributes: ['id', 'email'] });
        return { user, balance: parseFloat(balance.toFixed(2)) };
      })
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};