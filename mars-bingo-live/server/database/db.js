const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { schemaSql } = require('./schema');
const logger = require('../utils/logger');
require('dotenv').config();
const dbPath = path.resolve(process.cwd(), process.env.DB_FILE || './server/database/mars_bingo.sqlite');
let db;
function getDb(){ if(!db){ db = new sqlite3.Database(dbPath); db.configure('busyTimeout',5000); } return db; }
function run(sql, params=[]){ return new Promise((resolve,reject)=>getDb().run(sql, params, function(err){ err?reject(err):resolve({lastID:this.lastID, changes:this.changes}); })); }
function get(sql, params=[]){ return new Promise((resolve,reject)=>getDb().get(sql, params, (err,row)=>err?reject(err):resolve(row))); }
function all(sql, params=[]){ return new Promise((resolve,reject)=>getDb().all(sql, params, (err,rows)=>err?reject(err):resolve(rows))); }
function exec(sql){ return new Promise((resolve,reject)=>getDb().exec(sql, err=>err?reject(err):resolve())); }
async function transaction(fn){ await run('BEGIN IMMEDIATE'); try{ const out = await fn({run,get,all}); await run('COMMIT'); return out; }catch(e){ try{ await run('ROLLBACK'); }catch(rollbackErr){ logger.error('Rollback failed', rollbackErr); } throw e; } }
async function initDatabase(){ await exec(schemaSql); logger.info('SQLite initialized', dbPath); }
function close(){ return new Promise((resolve)=>{ if(!db) return resolve(); db.close(()=>resolve()); db=null; }); }
module.exports = { getDb, run, get, all, exec, transaction, initDatabase, close, dbPath };
