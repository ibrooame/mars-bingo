const { Telegraf } = require('telegraf');
const { ensureUser, getUserByTelegramId } = require('../database/queries/wallet');
const { mainKeyboard } = require('./keyboards/mainKeyboard');
const { fromCents } = require('../utils/helpers');
const logger = require('../utils/logger');
function createBot(){ const token=process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN; if(!token){ logger.warn('BOT_TOKEN missing; Telegram bot disabled'); return null; } const bot=new Telegraf(token); const publicUrl=process.env.PUBLIC_URL || `http://localhost:${process.env.PORT||3000}`; bot.start(async ctx=>{ const user=await ensureUser(ctx.from); await ctx.reply(`🚀 Welcome ${user.first_name || 'player'} to Mars Bingo Live!`, mainKeyboard(publicUrl)); }); bot.command('wallet', async ctx=>{ const user=await getUserByTelegramId(ctx.from.id); await ctx.reply(`Balance: ${fromCents(user?.balance_cents||0)} ETB`); }); bot.command('admin', async ctx=>{ const ids=(process.env.ADMIN_IDS||'').split(',').map(s=>s.trim()).filter(Boolean); if(!ids.includes(String(ctx.from.id))) return ctx.reply('Unauthorized'); await ctx.reply('Admin dashboard', mainKeyboard(`${publicUrl}/admin/`)); }); bot.catch(err=>logger.error('bot error',err)); return bot; }
module.exports = { createBot };
