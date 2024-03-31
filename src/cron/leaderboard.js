'use strict';
const cron = require('node-cron');
const moment = require('moment');
const {Op,Sequelize} = require('sequelize')

// module.exports =  cron.schedule('0 * * * *', async () => {
//     try {
//         const where = {
//             createdAt: {
//                 [Op.and]: {
//                     [Op.gte]: moment().startOf('day').format(),
//                     [Op.lte]: moment()
//                         .endOf('day')
//                         .format()
//                 }
//             }

//         };
//         const data = await game_history.findAll({
//             where,
//             attributes: [
//                 [Sequelize.fn('COUNT', Sequelize.col('tableId')), 'gamePlayed'],
//                 [Sequelize.fn('SUM', Sequelize.col('winAmount')), 'Amount']
//             ],
//             include: [
//                 {
//                     model: user,
//                     attributes: ['username']
//                 }
//             ],
//             group: ['userId'],
//             order: [
//                 [Sequelize.fn('SUM', Sequelize.col('winAmount')), "DESC"],
//             ],
//             limit: 10
//         })
//         leaderboard.destroy({
//             where: { type: 'Daily' },
//         })
//         let arr = [];
//         for (let i = 0; i < data.length; i++)
//             arr.push({ rank: i + 1, type: 'Daily', name: data[i].dataValues.user.dataValues.username, amount: data[i].dataValues.Amount, gamePlayed: data[i].dataValues.gamePlayed })
//         await leaderboard.bulkCreate(arr);
//     } catch (error) {
//         console.log(error);
//     }
// })

// module.exports = cron.schedule(' 0 */2 * * *', async () => {
//     try {
//         const where = {
//             createdAt: {
//                 [Op.and]: {
//                     [Op.gte]: moment().startOf('week').format(),
//                     [Op.lte]: moment()
//                         .endOf('week')
//                         .format()
//                 }
//             }

//         };
//         const data = await game_history.findAll({
//             where,
//             attributes: [
//                 [Sequelize.fn('COUNT', Sequelize.col('tableId')), 'gamePlayed'],
//                 [Sequelize.fn('SUM', Sequelize.col('winAmount')), 'Amount']
//             ],
//             include: [
//                 {
//                     model: user,
//                     attributes: ['username']
//                 }
//             ],
//             group: ['userId'],
//             order: [
//                 [Sequelize.fn('SUM', Sequelize.col('winAmount')), "DESC"],
//             ],
//             limit: 10
//         })
//         leaderboard.destroy({
//             where: { type: 'Weekly' },
//         })
//         let arr = [];
//         for (let i = 0; i < data.length; i++)
//             arr.push({ rank: i + 1, type: 'Weekly', name: data[i].dataValues.user.dataValues.username, amount: data[i].dataValues.Amount, gamePlayed: data[i].dataValues.gamePlayed })
//         await leaderboard.bulkCreate(arr);
//     } catch (error) {
//         console.log(error);
//     }
// })

// module.exports = cron.schedule(' 0 */2 * * *', async () => {
//     try {
//         const where = {
//             createdAt: {
//                 [Op.and]: {
//                     [Op.gte]: moment().startOf('month').format(),
//                     [Op.lte]: moment()
//                         .endOf('month')
//                         .format()
//                 }
//             }

//         };
//         const data = await game_history.findAll({
//             where,
//             attributes: [
//                 [Sequelize.fn('COUNT', Sequelize.col('tableId')), 'gamePlayed'],
//                 [Sequelize.fn('SUM', Sequelize.col('winAmount')), 'Amount']
//             ],
//             include: [
//                 {
//                     model: user,
//                     attributes: ['username']
//                 }
//             ],
//             group: ['userId'],
//             order: [
//                 [Sequelize.fn('SUM', Sequelize.col('winAmount')), "DESC"],
//             ],
//             limit: 10
//         })
//         leaderboard.destroy({
//             where: { type: 'Monthly' },
//         })
//         let arr = [];
//         for (let i = 0; i < data.length; i++)
//             arr.push({ rank: i + 1, type: 'Monthly', name: data[i].dataValues.user.dataValues.username, amount: data[i].dataValues.Amount, gamePlayed: data[i].dataValues.gamePlayed })
//         await leaderboard.bulkCreate(arr);
//     } catch (error) {
//         console.log(error);
//     }
// })
