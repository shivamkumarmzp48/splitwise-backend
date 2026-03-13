const { Expense, User, ExpenseParticipant, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.createExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, value, currency, date, paidById, memberIds } = req.body;
    const creatorId = req.user.id;
    const members = await User.findAll({ where: { id: memberIds }, transaction: t });
    if (members.length !== memberIds.length) {
      throw new Error('Some members not found');
    }
    const expense = await Expense.create({
      name, value, currency, date, creatorId, paidById
    }, { transaction: t });
    const participants = memberIds.map(userId => ({ expenseId: expense.id, userId }));
    await ExpenseParticipant.bulkCreate(participants, { transaction: t });
    await t.commit();
    res.status(201).json(expense);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Creator', attributes: ['id', 'email'] },
        { model: User, as: 'Payer', attributes: ['id', 'email'] },
        { model: User, as: 'Participants', attributes: ['id', 'email'], through: { attributes: [] } }
      ]
    });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const expense = await Expense.findByPk(req.params.id, { transaction: t });
    if (!expense) {
      await t.rollback();
      return res.status(404).json({ error: 'Expense not found' });
    }
    const { name, value, currency, date, paidById, memberIds } = req.body;
    if (name) expense.name = name;
    if (value) expense.value = value;
    if (currency) expense.currency = currency;
    if (date) expense.date = date;
    if (paidById) expense.paidById = paidById;
    await expense.save({ transaction: t });

    if (memberIds) {
      await ExpenseParticipant.destroy({ where: { expenseId: expense.id }, transaction: t });
      const participants = memberIds.map(userId => ({ expenseId: expense.id, userId }));
      await ExpenseParticipant.bulkCreate(participants, { transaction: t });
    }
    await t.commit();
    res.json(expense);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const expense = await Expense.findByPk(req.params.id, { transaction: t });
    if (!expense) {
      await t.rollback();
      return res.status(404).json({ error: 'Expense not found' });
    }
    await ExpenseParticipant.destroy({ where: { expenseId: expense.id }, transaction: t });
    await expense.destroy({ transaction: t });
    await t.commit();
    res.status(204).send();
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.getActivityLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { from, to } = req.query;
    const whereCondition = {
      [Op.or]: [
        { creatorId: userId },
        { paidById: userId },
        { '$Participants.id$': userId }
      ]
    };
    if (from && to) {
      whereCondition.date = { [Op.between]: [from, to] };
    }
    const expenses = await Expense.findAll({
      where: whereCondition,
      include: [
        { model: User, as: 'Creator', attributes: ['id', 'email'] },
        { model: User, as: 'Payer', attributes: ['id', 'email'] },
        { model: User, as: 'Participants', attributes: ['id', 'email'], through: { attributes: [] } }
      ],
      order: [['date', 'DESC']]
    });
    res.json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};