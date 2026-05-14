const express = require('express');
const db = require('../database/db');
const { validateTelegram } = require('../middleware/validateTelegram');
const { fromCents } = require('../utils/helpers');
const router=express.Router();
router.get('/', validateTelegram, async(req,res,next)=>{ try{ const rows=await db.all('SELECT * FROM transactions WHERE user_id=? ORDER BY created_at DESC LIMIT 100',[req.user.id]); res.json({transactions:rows.map(t=>({...t, amount:fromCents(t.amount_cents), balanceBefore:fromCents(t.balance_before_cents), balanceAfter:fromCents(t.balance_after_cents)}))}); }catch(e){ next(e); } });
module.exports=router;
