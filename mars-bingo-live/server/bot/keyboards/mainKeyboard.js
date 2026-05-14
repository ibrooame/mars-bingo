function mainKeyboard(webAppUrl){ return { reply_markup:{ inline_keyboard:[[ {text:'🎰 Play Mars Bingo Live', web_app:{url:webAppUrl}} ],[ {text:'💰 Wallet', callback_data:'wallet'} ]] } }; }
function adminKeyboard(txId, type){ return { reply_markup:{ inline_keyboard:[[ {text:'✅ Approve', callback_data:`approve:${type}:${txId}`}, {text:'❌ Reject', callback_data:`reject:${type}:${txId}`} ]] } }; }
module.exports = { mainKeyboard, adminKeyboard };
