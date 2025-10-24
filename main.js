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
  const ascii = figlet.textSync("UBOT KINGS", { font: "Standard" });
  const lines = ascii.split("\n");
  const footer = "VERSION : 4.5.0";
  const developers = "DEVELOPERS : © BY KINGS";
  animateColorOnly(lines, footer, developers);
  setInterval(() => {}, 1000);
})();

// ================================== //
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
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

const FETCH_TIMEOUT = 15000;
const SEND_DELAY = 500;
const MAX_FILES = 100;

let config = require('./config.js');
const updateHandler = require('./database/update.js');
const blFile = path.join(__dirname, "./database/blacklist.json");
if (!fs.existsSync(blFile)) fs.writeFileSync(blFile, JSON.stringify([]));

const settings = require("./settings.js");
const apiKey = "58e505edaaf948e6b5c5c35f6fa49262";

const apiId = parseInt(config.API_ID);
const apiHash = config.API_HASH;
let stringSession = new StringSession(config.STRING_SESSION || "");

let isSelfMode = true;
let afk = {
    isAfk: false,
    reason: "",
    since: null
};

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

    const email = `${username}@Kings.com`;
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
<blockquote>┏━⬣❏「 INFO DATA PANEL 」❏
│➥ Domain : ${domain}
│➥ ID     : ${server.id}
│➥ Name   : ${escapeHtml(name)}
│➥ CPU    : ${cpuLimit === 0 ? "Unlimited" : cpuLimit + "%"}
│➥ Memory : ${memoryLimit === 0 ? "Unlimited" : memoryLimit + " MB"}
│➥ Disk   : ${diskLimit === 0 ? "Unlimited" : diskLimit + " MB"}
│➥ Email  : ${escapeHtml(email)}
│➥ User   : ${escapeHtml(username)}
│➥ Pass   : ${escapeHtml(password)}
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
        message: `<blockquote>⚠️ Format salah. Gunakan: <code>${prefix}${cmdKey} nama, ID</code></blockquote>`,
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
        message: `<blockquote>❌ Spec tidak ditemukan untuk ${cmdKey}</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    statusMsg = await client.sendMessage(chatId, {
      message: `<blockquote>🌐 Membuat server: <b>${escapeHtml(name)}</b>\nUkuran: <b>${cmdKey}</b>\n🔐 Username: <code>${escapeHtml(username)}</code>\nMohon tunggu...🚀</blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });

    const res = await createServerAndNotify(client, targetIdentifier, name, username, password, spec.mem, spec.disk, spec.cpu);

    if (statusMsg && statusMsg.id) {
      try {
        await client.deleteMessages(chatId, [statusMsg.id]);
      } catch (e) {
        console.warn("Tidak bisa hapus statusMsg (ignored):", e.message || e);
      }
    }

    if (!res.ok) {
      return await client.sendMessage(chatId, {
        message: `<blockquote>❌ Gagal membuat server: <code>${escapeHtml(res.error || "unknown")}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    await client.sendMessage(chatId, {
      message: `<blockquote>✅ Server <b>${escapeHtml(name)}</b> berhasil dibuat dan data dikirim ke <code>${escapeHtml(String(targetIdentifier))}</code></blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
    return;
  } catch (err) {
    console.error("handleCreateSizeCommand error:", err);
    try {
      if (statusMsg && statusMsg.id) await client.deleteMessages(chatId, [statusMsg.id]);
    } catch (_) {}
    await client.sendMessage(chatId, {
      message: `<blockquote>❌ Terjadi kesalahan: <code>${escapeHtml(err.message || String(err))}</code></blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  }
}

async function handleADPCommand(client, chatId, message, textArgs, prefix) {
  const parts = (textArgs || "").split(",").map(p => p.trim());
  if (parts.length < 2) {
    return await client.sendMessage(chatId, {
      message: `<blockquote>⚠️ Format salah. Gunakan: <code>${prefix}adp nama, ID</code></blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  }

  const name = parts[0];
  const targetId = parts[1];
  const email = `${name}@Kings.com`;
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
<blockquote>┏━⬣❏「 INFO DATA ADMIN PANEL 」❏
│➥ Domain      : ${domain}
│➥ Name         : ${name}
│➥ Email        : ${email}
│➥ Password     : ${password}
┗━━━━━━━━━⬣</blockquote>`.trim();

    await client.sendMessage(targetId, { message: msgText, parseMode: "html" });
    await client.sendMessage(chatId, { message: `✅ Admin Panel berhasil dibuat dan data dikirim ke ID ${targetId}`, parseMode: "html", replyTo: message.id });

  } catch (err) {
    await client.sendMessage(chatId, {
      message: `<blockquote>❌ Gagal membuat admin panel: <code>${escapeHtml(err.message)}</code></blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  }
}

async function handleDelADPCommand(client, chatId, message, textArgs, prefix) {
  const targetUserId = (textArgs || "").trim();
  if (!targetUserId) {
    return await client.sendMessage(chatId, {
      message: `<blockquote>⚠️ Format salah. Gunakan: <code>${prefix}deladp ( ID )</code></blockquote>`,
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
      message: `<blockquote>✅ Admin Panel dengan ID <code>${targetUserId}</code> berhasil dihapus.</blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });

  } catch (err) {
    await client.sendMessage(chatId, {
      message: `<blockquote>❌ Gagal menghapus admin panel: <code>${escapeHtml(err.message)}</code></blockquote>`,
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
  if (!serverId) return await client.sendMessage(chatId, { message: `⚠️ Format: ${prefix}delsrv ID`, parseMode: "html", replyTo: message.id });

  try {
    const res = await fetch(`${domain}/api/application/servers/${serverId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${plta}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await client.sendMessage(chatId, { message: `✅ Server ID ${serverId} deleted.`, parseMode: "html", replyTo: message.id });
  } catch (err) {
    await client.sendMessage(chatId, { message: `❌ Failed: ${escapeHtml(err.message)}`, parseMode: "html", replyTo: message.id });
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
    console.log("Loading...");

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

        console.log("Koneksi Succses!");
        const newSessionString = client.session.save();
        console.log("Sesi Anda:", newSessionString);
        
        saveSessionToConfig(newSessionString);

    } catch (e) {
        console.error("Error:", e.message);
        return null;
    }

    return client;
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
        message: `<blockquote>😴 <b>Sedang AFK</b>
📝 Reason: ${afk.reason}
⏱️ Durasi: ${durasi}</blockquote>`,
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
         case 'menu':
          const menuText = `
<blockquote>
┏❐ ⌜ <b>UBOT KINGS 👑</b> ⌟ ❐
┃⭔ Creator  : @The_kings_co
┃⭔ VERSION : 4.5.0
┃⭔ Status   : <b>Online</b>
┃⭔ Mode     : <i>${isSelfMode ? "Self" : "Public"}</i>
┃⭔ Prefix   : ${prefix}
┃⭔ Modules  : ${totalFitur}
┗❐
╭─❰ <b>👤 A C C O U N T S</b> ❱
│ • ${prefix}setpp   | Change Profile Photo
│ • ${prefix}setname | Change Name
│ • ${prefix}setdesk | Change Bio/Desc
│ • ${prefix}info    | Account/User Info
│ • ${prefix}createbot  | Creating a bot in BotFather
│ • ${prefix}revoke  | reset old bot token to new
│ • ${prefix}delbot  | Deleting bots in BotFather
│ • ${prefix}update  | update script and display
╰───────────────
╭─❰ <b>📁 U T I L I T I E S</b> ❱
│ • ${prefix}block   | Block a user
│ • ${prefix}pushkontak| Send message to all group members
│ • ${prefix}cfdall | Send messages to all users
│ • ${prefix}cfdgroup | share messages to all groups
╰───────────────
╭─❰ <b>⚙️ M O D E & S T A T U S</b> ❱
│ • ${prefix}self    | Switch to Self Mode
│ • ${prefix}public  | Switch to Public Mode
│ • ${prefix}afk     | Set AFK status
│ • ${prefix}unafk   | Return from AFK
│ • ${prefix}addbl | Blacklist Group
│ • ${prefix}unaddbl | Remove group blacklist
│ • ${prefix}blacklist | display blacklist
╰───────────────
╭─❰ <b>🔍 F U N & S E A R C H</b> ❱
│ • ${prefix}xnxx    | Search Xnxx Videos
│ • ${prefix}brat    | Generate Brat Text Image
│ • ${prefix}pinterest [ Kata kunci ] | Search images
│ • ${prefix}yts  | Search video youtube
╰───────────────
╭─❰ <b>📥 D O W N L O A D</b> ❱
│ • ${prefix}tt   | Download TikTok videos
│ • ${prefix}ttmp3   | Download TikTok audio
╰───────────────
╭─❰ <b>🛠 T O O L S</b> ❱
│ • ${prefix}iqc    | Create images iphone
│ • ${prefix}getcode [ Kata kunci ] | Fetch web files
│ • ${prefix}dox ( NIK ) | Doxxing number NIK
│ • ${prefix}prefix ( SIMBOL )
│ • ${prefix}tourl   | Upload media & get URL
│ • ${prefix}tohd  | add image quality
│ • ${prefix}trackip | Track IP address
│ • ${prefix}cekhost | Website data information
│ • ${prefix}ssweb [ Kata Kunci ] | website screenshot 
╰───────────────
╭─❰ <b>🌐 P T E R O D A C T Y L</b> ❱
│ • ${prefix}1gb - 10gb nama, ID
│ • ${prefix}unli nama, ID
│ • ${prefix}delsrv ID
│ • ${prefix}listsrv
│ • ${prefix}adp nama, ID
│ • ${prefix}deladp ID
│ • ${prefix}listadp
│ • ${prefix}setuser | Change user name
│ • ${prefix}resetpw | Reset password server
│ • ${prefix}installpanel | Installing pterodactyl to vps
│ • ${prefix}uninstallpanel | Uninstalling pterodactyl from vps
│ • ${prefix}reinstallpanel | Reinstalling pterodactyl
╰───────────────
╭─❰ <b>📡 M E N U  V P S</b> ❱
│ • ${prefix}pass | Change vps password
╰───────────────
╭─❰ <b>🛡 O B F U S C A T E</b> ❱
│ • ${prefix}encinvis  | Obfuscating invisible code
│ • ${prefix}encvar  | Obfuscating Var code
╰───────────────
╭─❰ <b>👥️️ M E N U  G R O U P</b> ❱
│ • ${prefix}ban
│ • ${prefix}unban
│ • ${prefix}kick
│ • ${prefix}mute
│ • ${prefix}unmute
│ • ${prefix}del
│ • ${prefix}tagall | Tag all users
│ • ${prefix}batal | Stop tagging all users
╰──────────────\n\n© ʙʏ ᴋɪɴɢs 👑
</blockquote>`;
          await client.sendMessage(chatId, { message: menuText, parseMode: "html" });
          break;
         
                      case 'setpp':
                if (!message.replyTo) {
                    return client.sendMessage(chatId, { message: `<blockquote>⚠️ <b>Format:</b> <b>${prefix}setpp</b> <reply media></blockquote>`, parseMode: 'html' });
                }
                
                try {
                    const repliedMsg = await client.getMessages(chatId, { ids: message.replyTo.replyToMsgId });
                    const media = repliedMsg[0]?.media;
                    if (!media) {
                        return client.sendMessage(chatId, { message: "⚠️ Media tidak ditemukan dalam balasan", parseMode: 'html' });
                    }
                    
                    await client.sendMessage(chatId, { message: "Processing..." });
                    const downloadedFile = await client.downloadMedia(media);
                    await client.invoke(
                        new Api.photos.UploadProfilePhoto({
                            file: downloadedFile
                        })
                    );
                    
                    await client.sendMessage(chatId, { message: "<blockquote>✅️ <b>Foto profil berhasil diubah!</b></blockquote>", parseMode: 'html' });

                } catch (e) {
                    console.error("Error setpp:", e);
                    await client.sendMessage(chatId, { message: `<blockquote>❌️ Gagal mengubah foto profil. Error: ${e.message.slice(0, 50)}...</blockquote>`, parseMode: 'html' });
                }
                break;
                
                        case "prefix":
          if (!text) {
            await client.sendMessage(chatId, { message: `<blockquote>⚠️ Format prefix: ${prefix}</blockquote>`, parseMode: "html" });
          } else {
            prefix = text;
            savePrefixToConfig(text);
            await client.sendMessage(chatId, { message: `<blockquote>✅ Prefix berhasil diubah ke: ${text}</blockquote>`, parseMode: "html" });
          }
          break;
                
            case 'setname':
                if (!text) {
                    return client.sendMessage(chatId, { message: `<blockquote>⚠️ <b>Format:</b> ${prefix}setname <name></blockquote>`, parseMode: 'html' });
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
                    await client.sendMessage(chatId, { message: `<blockquote>✅️ Nama berhasil diubah ke: <b>${text}</b></blockquote>`, parseMode: 'html' });
                } catch (e) {
                    console.error("Error setname:", e);
                    await client.sendMessage(chatId, { message: `<blockquote>❌️ Gagal mengubah nama. Error: ${e.message.slice(0, 50)}...</blockquote>`, parseMode: 'html' });
                }
                break;
                
            case 'setdesk':
                if (!text) {
                    return client.sendMessage(chatId, { message: `<blockquote>⚠️ <b>Format:</b> ${prefix}setdesk <new description></blockquote>`, parseMode: 'html' });
                }
                try {
                    await client.invoke(
                        new Api.account.UpdateProfile({
                            about: text
                        })
                    );
                    await client.sendMessage(chatId, { message: `<blockquote>✅️ Deskripsi berhasil diubah ke: <b>${text}</b></blockquote>`, parseMode: 'html' });
                } catch (e) {
                    console.error("Error setdesk:", e);
                    await client.sendMessage(chatId, { message: `<blockquote>❌️ Gagal mengubah deskripsi. Error: ${e.message.slice(0, 50)}...`, parseMode: 'html' });
                }
                break;

            case 'block':
                if (!text) {
                    return client.sendMessage(chatId, { message: `<blockquote>⚠️ <b>Format:</b> ${prefix}block <username> atau ID</blockquote>`, parseMode: 'html' });
                }
                
                try {
                    await client.sendMessage(chatId, { message: `<blockquote>⌛️ Mencoba memblokir pengguna <b>${text}</b></blockquote>`, parseMode: 'html' });
                    const targetUser = await client.getEntity(text);
                    
                    await client.invoke(
                        new Api.contacts.Block({
                            id: targetUser
                        })
                    );
                    await client.sendMessage(chatId, { message: `<blockquote>✅️ User <b>${text}</b> berhasil di blockir`, parseMode: 'html' });
                } catch (e) {
                    console.error("Error block:", e);
                    await client.sendMessage(chatId, { message: `<blockquote>❌️ Gagal blockir user. Error: ${e.message.slice(0, 50)}...</blockquote>`, parseMode: 'html' });
                }
                break;

            case 'pushkontak':
                if (!chatId.toString().startsWith('-100')) {
                    return client.sendMessage(chatId, { message: "This command can only be used in Groups/Supergroups." });
                }
                if (!text) {
                    return client.sendMessage(chatId, { message: `Usage: ${prefix}pushkontak <text>` });
                }

                try {
                    await client.sendMessage(chatId, { message: "Starting the contact push process. This may take some time and may trigger Telegram restrictions."});
                    
                    const participants = await client.getParticipants(chatId);
                    let savedCount = 0;
                    
                    for (const user of participants) {
                        if (user.isSelf || user.bot || user.isCreator) continue; 
                        
                        try {
                            await client.sendMessage(user.id, { message: text });
                            await client.sendMessage(chatId, { message: `<i>Push Contact #${savedCount + 1}</i> to ${user.id} (@${user.username || 'No Username'}) successful.`, parseMode: 'html' });
                            savedCount++;
                            
                        } catch (sendError) {
                            await client.sendMessage(chatId, { message: `Failed to send to ${user.id}: ${sendError.message.slice(0, 50)}...`, parseMode: 'html' });
                        }
                        
                        await new Promise(resolve => setTimeout(resolve, 1500)); 
                    }

                    await client.sendMessage(chatId, { message: `<b>Done!</b> Successfully sent message to ${savedCount} members.`, parseMode: 'html' });

                } catch (e) {
                    console.error("Error pushkontak:", e);
                    await client.sendMessage(chatId, { message: `Failed to execute push contact. Error: ${e.message.slice(0, 50)}...` });
                }
                break;

            case 'self':
                isSelfMode = true;
                await client.sendMessage(chatId, { message: "<blockquote>🤖 Bot berhasil di ubah ke mode <b>self</b></blockquote>", parseMode: 'html' });
                break;

            case 'public':
                isSelfMode = false;
                await client.sendMessage(chatId, { message: "<blockquote>🤖 Bot berhasil di ubah ke mode <b>Public</b></blockquote>", parseMode: 'html' });
                break;
                
            case 'info': {
  (async () => {
    try {
      let targetUser = selfUser;

      const replyMsg = message.replyTo || message.reply_to_message;
      if (replyMsg) {
        if (replyMsg.sender) targetUser = replyMsg.sender;
        else if (replyMsg.from) targetUser = replyMsg.from;
      } else if (text) {
        targetUser = await client.getEntity(text);
      }

      const fullUser = await client.invoke(
        new Api.users.GetFullUser({ id: targetUser })
      );

      const infoText = `
<blockquote><b>INFO ACCOUNT</b>
👤 Fullname: ${targetUser.firstName || ''} ${targetUser.lastName || ''}
🔖 Username: @${targetUser.username || 'N/A'}
🆔 ID: <code>${targetUser.id}</code>
🌟 Premium: ${targetUser.premium ? 'Yes' : 'No'}
Bio: ${fullUser.fullUser.about || 'No description'}
</blockquote>`;

      await client.sendMessage(message.chat.id, {
        message: infoText,
        parseMode: 'html',
        replyTo: message.id
      });

    } catch (e) {
      console.error("Error info:", e);
      await client.sendMessage(message.chat.id, {
        message: `<blockquote>❌ Gagal ambil data user. Error: ${e.message.slice(0, 50)}...</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}
                
            case 'afk':
                if (afk.isAfk) {
                    return client.sendMessage(chatId, { message: "<blockquote>✅️ berhasil mengaktifkan ke mode AFK</blockquote>", parseMode: 'html' });
                }
                afk.isAfk = true;
                afk.reason = text || 'No reason';
                afk.since = Date.now();
                await client.sendMessage(chatId, { message: `<blockquote>😴 <b>Sedang AFK</b>.\n📝Reason: <i>${afk.reason}</i></blockquote>`, parseMode: 'html' });
                break;
                
            case 'unafk':
                if (!afk.isAfk) {
                    return client.sendMessage(chatId, { message: "<blockquote>⚠️ Anda belum mengaktifkan AFK!</blockquote>", parseMode: 'html' });
                }
                afk.isAfk = false;
                afk.reason = "";
                afk.since = null;
                await client.sendMessage(chatId, { message: "<blockquote><b>✅️ Berhasil menonaktifkan AFK</b></blockquote>", parseMode: 'html' });
                break;
                
            case 'xnxx':
                if (!text) {
                    return client.sendMessage(chatId, { message: `Usage: <b>${prefix}xnxx <query></b>`, parseMode: 'html' });
                }

                const loadingXnxxMsg = await client.sendMessage(chatId, { message: `Searching for videos for <b>${text}</b>...`, parseMode: 'html' });

                try {
                    const searchUrl = `https://restapi-v2.simplebot.my.id/search/xnxx?q=${encodeURIComponent(text)}`;
                    const searchResponse = await axios.get(searchUrl);

                    if (!searchResponse.data.status || !searchResponse.data.result || searchResponse.data.result.length === 0) {
                        await client.deleteMessages(chatId, [loadingXnxxMsg.id]);
                        return client.sendMessage(chatId, { message: 'No results found.' });
                    }

                    const top = searchResponse.data.result[0];
                    const title = top.title.trim();
                    const link = top.link;

                    await client.sendMessage(chatId, { 
                        message: `Found: <b>${title}</b>. Retrieving download links...`, 
                        parseMode: 'html'
                    });
                    
                    await client.deleteMessages(chatId, [loadingXnxxMsg.id]);
                    const dlUrl = `https://restapi-v2.simplebot.my.id/download/xnxx?url=${encodeURIComponent(link)}`;
                    const dlResponse = await axios.get(dlUrl);
                    
                    const result = dlResponse.data.result;
                    if (!result) {
                        return client.sendMessage(chatId, { message: 'Failed to retrieve video data from the search result URL.' });
                    }

                    const high = result.files?.high;
                    const low = result.files?.low;
                    const rawInfo = result.info || '';
                    const viewMatch = rawInfo.match(/(\d[\d.,]*[KMB]?)/g);
                    const views = viewMatch ? viewMatch.at(-1).replace(/,/g, '') : 'Unknown'; 
                    const durationSec = parseInt(result.duration) || 0;
                    const durasi = `${Math.floor(durationSec/60)}m ${durationSec%60}s`;
                    const makeCaption = (resolusi, linkFallback = null) => {
                        let caption = `<b>${title}</b>\nDuration: ${durasi}\nResolution: ${resolusi}\nViews: ${views}\n© ʙʏ ᴋɪɴɢs 👑`;
                        if (linkFallback) {
                            caption += `\n\n🔗 ${linkFallback}`;
                        }
                        return caption;
                    };

                    let videoLink = high || low;
                    let resolutionLabel = high ? 'High' : (low ? 'Low' : 'Link');
                    
                    if (videoLink) {
                        await client.sendMessage(chatId, {
                            message: makeCaption(resolutionLabel, videoLink),
                            parseMode: 'html', 
                            linkPreview: true
                        });
                        
                    } else {
                        return await client.sendMessage(chatId, { message: "Can't get High or low video link." }); 
                    }

                } catch (e) {
                    console.error("Error xnxx:", e);
                    await client.deleteMessages(chatId, [loadingXnxxMsg.id]).catch(() => {});
                    await client.sendMessage(chatId, { message: `An error occurred while fetching data. Error: ${e.message.slice(0, 50)}...` });
                }
                break;
                
            case 'brat':
                if (!text) {
                    return client.sendMessage(
                        chatId,
                        `<b>Usage:</b>${prefix}brat <Your Message>`,
                        { parseMode: 'html' }
                    );
                }

                const bratText = encodeURIComponent(text);
                const isAnimated = false; 
                const delay = 100; 
                const bratApiUrl = `https://api.siputzx.my.id/api/m/brat?text=${bratText}&isAnimated=${isAnimated}&delay=${delay}`;

                const loadingBratMsg = await client.sendMessage(
                    chatId,
                    `<b>⌛️ Sedang prosess...</b> Membuat text stiker: <i>${text.slice(0, 30)}...</i>`,
                    { parseMode: 'html' }
                );

                try {
                    const res = await axios.get(bratApiUrl, { responseType: 'arraybuffer' });
                    
                    if (res.status !== 200 || res.headers['content-type'] !== 'image/png') {
                         await client.deleteMessages(chatId, [loadingBratMsg.id]);
                         return client.sendMessage(
                            chatId,
                            '<b>Error:</b> API failed to return an image. Please try again later.',
                            { parseMode: 'html' }
                        );
                    }

                    const buffer = Buffer.from(res.data);

                    await client.sendMessage(chatId, {
                        message: `<blockquote><b>✅️ Brat berhasil dibuat</b>\n\nQuery: <i>${text}</i>\n\n© ʙʏ ᴋɪɴɢs 👑</blockquote>`,
                        file: buffer,
                        caption: `<blockquote><b>✅️ Brat berhasil dibuat</b>\n\nQuery: <i>${text}</i>\n\n© ʙʏ ᴋɪɴɢs 👑</blockquote>`,
                        parseMode: 'html',
                        replyTo: message.id 
                    });

                    await client.deleteMessages(chatId, [loadingBratMsg.id]).catch(() => {});

                } catch (e) {
                    console.error(" Error:", e);
                    
                    await client.deleteMessages(chatId, [loadingBratMsg.id]).catch(() => {}); 
                    
                    client.sendMessage(
                        chatId,
                        `<b>Error:</b> An error occurred while contacting the API. Error: ${e.message.slice(0, 50)}...`,
                        { parseMode: 'html', replyTo: message.id }
                    );
                }
                break;

            case 'tourl': {
  (async () => {
    const chatId = message.chatId || message.chat?.id;

    if (!message.replyTo) {
      return client.sendMessage(chatId, {
        message: `<blockquote><b>❌ Reply pesan media yang mau diubah ke link</b>\nGunakan: <code>${prefix}tourl</code></blockquote>`,
        parseMode: 'html'
      });
    }

    const repliedMessageId = message.replyTo.replyToMsgId || message.replyTo.msgId || message.replyTo.id;
    let filePath = null;
    let loadingMsg = null;

    try {
      loadingMsg = await client.sendMessage(chatId, {
        message: '<blockquote>⌛️ Sedang mengubah media ke link...</blockquote>',
        parseMode: 'html',
        replyTo: repliedMessageId
      });

      const repliedMsg = await client.getMessages(chatId, { ids: repliedMessageId });
      const media = repliedMsg[0]?.media;

      if (!media) {
        return client.sendMessage(chatId, {
          message: `<blockquote><b>❌ Media gagal diubah ke link</b></blockquote>`,
          parseMode: 'html',
          replyTo: repliedMessageId
        });
      }

      const mediaBuffer = await client.downloadMedia(media);
      let mimeType = repliedMsg[0]?.document?.mimeType || repliedMsg[0]?.video?.mimeType || 'application/octet-stream';
      let fileName = repliedMsg[0]?.document?.attributes?.find(attr => attr.className === 'DocumentAttributeFilename')?.fileName || 'file';
      const ext = getFileExtension(mimeType, fileName);
      filePath = path.join(__dirname, `temp_${Date.now()}${ext}`);
      await fs.promises.writeFile(filePath, mediaBuffer);

      const url = await CatBox(filePath);

      await client.sendMessage(chatId, {
        message: `<blockquote><b>📦 CatBox URL:</b>\n<a href="${url}">${url}</a></blockquote>`,
        parseMode: 'html',
        replyTo: repliedMessageId
      });

      if (loadingMsg) {
        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
      }

    } catch (error) {
      console.error("Error tourl:", error);

      if (loadingMsg) {
        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
      }

      await client.sendMessage(chatId, {
        message: `<blockquote><b>❌ Error:</b> ${error.message || error}</blockquote>`,
        parseMode: 'html',
        replyTo: message.id
      });
    } finally {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error hapus temp file:", err);
        });
      }
    }
  })();
  break;
}
                
case 'iqc':
  (async () => {
    try {
      const argsText = text.trim();
      if (!argsText.includes("|")) {
        return await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ Format salah!\nGunakan: <code>${prefix}iqc jam|batre|carrier|text</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id,
        });
      }

      const [time, battery, carrier, ...msgParts] = argsText.split("|");
      const messageText = msgParts.join("|").trim();

      if (!time || !battery || !carrier || !messageText) {
        return await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ Semua parameter wajib diisi!\nFormat: <code>${prefix}iqc jam|batre|carrier|text</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id,
        });
      }

      const statusMsg = await client.sendMessage(chatId, {
        message: '<blockquote>🚀 Membuat gambar dari teks Anda...</blockquote>',
        parseMode: "html",
      });

      const url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(
        time
      )}&batteryPercentage=${encodeURIComponent(battery)}&carrierName=${encodeURIComponent(
        carrier
      )}&messageText=${encodeURIComponent(messageText)}&emojiStyle=apple`;

      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const filePath = path.join(__dirname, `iqc_${Date.now()}.png`);
      fs.writeFileSync(filePath, response.data);

      await client.sendMessage(chatId, {
        file: filePath,
        replyTo: message.id,
      });

      try {
        if (statusMsg?.id) await client.deleteMessages(chatId, [statusMsg.id]);
      } catch (_) {}
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (_) {}

    } catch (err) {
      console.error('❌ Error iqc:', err);
      await client.sendMessage(chatId, {
        message: `❌ *Terjadi error:* ${err.message || err}`,
        parseMode: "html",
        replyTo: message?.id,
      }).catch(() => {});
    }
  })();
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
      message: `<blockquote>⚠️ Gunakan: <code>${prefix}pinterest [kata kunci]</code></blockquote>`,
      parseMode: "html"
    });
    break;
  }

  const loadingMsg = await client.sendMessage(chatId, {
    message: `<blockquote>🔍 Mencari gambar untuk: <b>${escapeHtml(text)}</b></blockquote>`,
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
        message: `<blockquote>❌ Tidak ditemukan hasil untuk: <b>${escapeHtml(text)}</b></blockquote>`,
        parseMode: "html"
      });
      break;
    }

    const randomFive = results.sort(() => 0.5 - Math.random()).slice(0, 5);

    await client.sendMessage(chatId, {
      message: `<blockquote>✅ Menemukan ${randomFive.length} gambar dari: <b>${escapeHtml(text)}\n© ʙʏ ᴋɪɴɢs 👑</b></blockquote>`,
      parseMode: "html"
    });

    for (const [i, url] of randomFive.entries()) {
      await client.sendFile(chatId, {
        file: url,
        caption: `<blockquote>🖼️ Gambar ke-${i + 1}\nDari pencarian: <b>${escapeHtml(text)}</b></blockquote>`,
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

    await client.sendMessage(chatId, { message: "❌ Terjadi kesalahan saat mengambil gambar." });
  }
  break;
  
function resolveResourceUrl(base, relative) {
  try {
    return new URL(relative, base).href;
  } catch {
    return null;
  }
}

function isOnlineUrl(url) {
  return /^https?:\/\//i.test(url);
}

function isWantedFile(url) {
  return /\.(js|css|png|jpe?g|gif|svg|ico|webp|woff2?|ttf|html?|mp4|webm|ogg)$/i.test(url);
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function fetchArrayBuffer(url) {
  return await axios.get(url, { responseType: "arraybuffer", timeout: FETCH_TIMEOUT });
}

case "getcode": {
  if (!text) {
    await client.sendMessage(chatId, {
      message: `<blockquote>⚠️ Gunakan: <code>${prefix}getcode [url]</code>\nContoh: <code>${prefix}getcode google.com</code></blockquote>`,
      parseMode: "html"
    });
    break;
  }

  let startUrl = text.trim();
  if (!/^https?:\/\//i.test(startUrl)) startUrl = "https://" + startUrl;

  const msgProgress = await client.sendMessage(chatId, {
    message: `<blockquote>🔍 Mengambil file dari:\n<b>${startUrl}</b></blockquote>`,
    parseMode: "html"
  });

  const baseName = `site_${Date.now()}`;
  const tmpDir = path.join(process.cwd(), baseName);
  fs.mkdirSync(tmpDir, { recursive: true });

  let htmlText;
  try {
    const r = await axios.get(startUrl, { timeout: FETCH_TIMEOUT, responseType: "text", maxRedirects: 5 });
    htmlText = r.data;
    fs.writeFileSync(path.join(tmpDir, "index.html"), htmlText, "utf8");
  } catch (e) {
    await client.editMessage(chatId, {
      message: `❌ Gagal mengambil halaman utama:\n<code>${e.message}</code>`,
      parseMode: "html",
      messageId: msgProgress.id
    });
    fs.rmSync(tmpDir, { recursive: true, force: true });
    break;
  }

  const resourceSet = new Set();
  const tagRegex = /<(script|link|img)[^>]*?(?:src|href)=["']?([^"'>\s]+)["']?/gi;
  const inlineStyleRegex = /style=["'][^"']*url\(([^)]+)\)[^"']*["']/gi;
  const metaRegex = /<meta[^>]+(property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/gi;
  const iconRegex = /<link[^>]+rel=["'][^"']*(icon|shortcut icon|apple-touch-icon)[^"']*["'][^>]+href=["']([^"']+)["']/gi;

  let m;
  while ((m = tagRegex.exec(htmlText))) if (m[2]) resourceSet.add(m[2]);
  while ((m = inlineStyleRegex.exec(htmlText))) {
    const raw = m[1].trim().replace(/^['"]|['"]$/g, "");
    if (raw) resourceSet.add(raw);
  }
  while ((m = metaRegex.exec(htmlText))) if (m[2]) resourceSet.add(m[2]);
  while ((m = iconRegex.exec(htmlText))) if (m[2]) resourceSet.add(m[2]);

  const queue = Array.from(resourceSet)
    .map((raw) => resolveResourceUrl(startUrl, raw))
    .filter((u) => isOnlineUrl(u) && isWantedFile(u));

  const totalFiles = Math.min(queue.length, MAX_FILES);
  let success = 0;
  const visited = new Set();

  for (const fileUrl of queue.slice(0, totalFiles)) {
    if (visited.has(fileUrl)) continue;
    visited.add(fileUrl);

    try {
      const { data } = await fetchArrayBuffer(fileUrl);
      const urlObj = new URL(fileUrl);
      const filename = sanitizeFilename(urlObj.pathname.split("/").pop() || `file_${success}`);
      const filePath = path.join(tmpDir, filename);
      fs.writeFileSync(filePath, Buffer.from(data));
      success++;

      if (success % 5 === 0 || success === totalFiles) {
        await client.editMessage(chatId, {
          message: `<blockquote>📥 Mengunduh file... (${success}/${totalFiles})</blockquote>`,
          parseMode: "html",
          messageId: msgProgress.id
        }).catch(() => {});
      }
    } catch (e) {
      console.error("❌ Gagal download:", fileUrl, e.message);
    }

    await new Promise((r) => setTimeout(r, SEND_DELAY));
  }

  const zip = new AdmZip();
  zip.addLocalFolder(tmpDir);
  const zipPath = path.join(process.cwd(), `${baseName}.zip`);
  zip.writeZip(zipPath);

  await client.editMessage(chatId, {
    message: "📦 Sedang mengirim file ZIP...",
    messageId: msgProgress.id
  }).catch(() => {});

  await client.sendFile(chatId, {
    file: zipPath,
    caption: `<blockquote>✅ Selesai mengambil isi web\n📦 Total file: ${success}\n🌐 URL: ${startUrl}\n\n© ʙʏ ᴋɪɴɢs 👑</blockquote>`,
    parseMode: "html"
  });

  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.unlinkSync(zipPath);
  } catch {}

  break;
}

case 'dox':
  try {
    if (!text) {
      await client.sendMessage(chatId, { 
        message: `<blockquote>⚠️ Gunakan format: <code>${prefix}dox 16070xxxxxxxxxxxx</code></blockquote>`, 
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
        message: "❌ NIK tidak valid atau gagal diproses.", 
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
🌐 <b>Hasil Doxxing NIK</b>

✅ <b>NIK Valid:</b> ${nik.isValid()}
🏙️ <b>Provinsi ID:</b> ${nik.provinceId()}
📌 <b>Nama Provinsi:</b> ${provinsi}
🏢 <b>Kabupaten ID:</b> ${nik.kabupatenKotaId()}
📌 <b>Nama Kabupaten:</b> ${kabupaten}
📍 <b>Kecamatan ID:</b> ${nik.kecamatanId()}
📌 <b>Nama Kecamatan:</b> ${kecamatan}
🏤 <b>Kode Pos:</b> ${nik.kodepos()}
🚻 <b>Jenis Kelamin:</b> ${nik.kelamin()}
🎂 <b>Tanggal Lahir:</b> ${nik.lahir()}
🔑 <b>Uniqcode:</b> ${nik.uniqcode()}

📍 <b>Lokasi Maps:</b> <a href="${mapsUrl}">Klik di sini</a>
</blockquote>`.trim();

    await client.sendMessage(chatId, { 
      message: hasil, 
      parseMode: "html", 
      linkPreview: false 
    });

  } catch (err) {
    console.error("Unhandled error in .dox:", err);
    await client.sendMessage(chatId, { 
      message: "❌ Terjadi error internal saat memproses NIK.", 
      parseMode: "html" 
    });
  }
  break;
  
case "encinvis": {
  const fileTempBase = `invisible-encrypted-${Date.now()}`;
  const STATUS_TEXT = "⌛️ Sedang mengobfuscate invisible tunggu beberapa menit...";
  let outPath = null;
  let statusMsg = null;
  try {
    if (!message.replyTo) {
      await client.sendMessage(chatId, { message: `<blockquote>❌ Balas file .js dengan ${prefix}encinvis</blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    const repliedId = message.replyTo.replyToMsgId || message.replyTo.msgId || message.replyTo.id || null;
    if (!repliedId) {
      await client.sendMessage(chatId, { message: "<blockquote>❌ Gagal menemukan pesan yang direply</blockquote>", parseMode: "html", replyTo: message.id });
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
      await client.sendMessage(chatId, { message: "<blockquote>❌ Gagal mengambil pesan yang direply</blockquote>", parseMode: "html", replyTo: message.id });
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
      await client.sendMessage(chatId, { message: "<blockquote>❌ File yang direply bukan .js</blockquote>", parseMode: "html", replyTo: message.id });
      break;
    }

    try {
      statusMsg = await client.sendMessage(chatId, { message: STATUS_TEXT, replyTo: message.id });
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
      await client.sendMessage(chatId, { message: `<blockquote>❌ Gagal mendownload file: ${e.message || e}</blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    if (!buffer || buffer.length === 0) {
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: "<blockquote>❌ File kosong setelah download</blockquote>", parseMode: "html", replyTo: message.id });
      break;
    }

    let src = buffer.toString("utf8");
    try { new Function(src); } catch (syntaxErr) {
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ Syntax error:\n<code>${syntaxErr.message}</code></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    let obfResult;
    try {
      obfResult = await JsConfuser.obfuscate(src, getStrongObfuscationConfig());
    } catch (e) {
      console.error("Obfuscate error:", e);
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ Gagal melakukan obfuscation: ${e.message || e}</blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    const obfuscatedCode = typeof obfResult === "string" ? obfResult : obfResult.code;
    try { new Function(obfuscatedCode); } catch (postErr) {
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ Hasil obfuscation tidak valid:\n<code>${postErr.message}</code></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    outPath = path.join(__dirname, `${fileTempBase}-${safeName}`);
    fs.writeFileSync(outPath, obfuscatedCode, "utf8");

    try {
      await client.sendMessage(chatId, { file: outPath, caption: `<blockquote>✅ File terenkripsi: ${safeName}</blockquote>`, parseMode: "html", replyTo: message.id });
    } catch (e) {
      const outBuf = Buffer.from(obfuscatedCode, "utf8");
      try {
        await client.sendMessage(chatId, { file: outBuf, caption: `<blockquote>✅ File terenkripsi: ${safeName}</blockquote>`, parseMode: "html", replyTo: message.id });
      } catch (e2) {
        console.error("send file fallback failed:", e2);
        if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
        await client.sendMessage(chatId, { message: `<blockquote>❌ Gagal mengirim file: ${e2.message || e2}</blockquote>`, parseMode: "html", replyTo: message.id });
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
    console.error("Unhandled error encinvis:", err);
    if (typeof statusMsg !== "undefined" && statusMsg && statusMsg.id) {
      try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
    }
    try {
      await client.sendMessage(chatId, { message: `<blockquote>❌ Terjadi kesalahan: ${err.message || err}</blockquote>`, parseMode: "html", replyTo: message.id });
    } catch (_) {}
  }
  break;
}

case "encvar": {
  const fileTempBase = `var-encrypted-${Date.now()}`;
  const STATUS_TEXT = "<blockquote>⌛️ <b>Mengobfuscate Var tunggu beberapa menit...</b></blockquote>";
  let outPath = null;
  let statusMsg = null;

  try {
    if (!message.replyTo) {
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>Balas file .js dengan ${prefix}encvar</b></blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
      break;
    }

    const repliedId = message.replyTo.replyToMsgId || message.replyTo.msgId || message.replyTo.id || null;
    if (!repliedId) {
      await client.sendMessage(chatId, { message: "<blockquote>❌ <b>Gagal menemukan file yang direply</b></blockquote>", parseMode: "html", replyTo: message.id });
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
      await client.sendMessage(chatId, { message: "<blockquote>❌ <b>Gagal mengambil file yang direply</b></blockquote>", parseMode: "html", replyTo: message.id });
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
      await client.sendMessage(chatId, { message: "<blockquote>❌ <b>File yang direply bukan .js</b></blockquote>", parseMode: "html", replyTo: message.id });
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
      await client.sendMessage(chatId, { message: `<blockquote>❌ <b>Gagal mendownload file: ${e.message || e}</b></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    if (!buffer || buffer.length === 0) {
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: "<blockquote>❌ <b>File kosong setelah download</b></blockquote>", parseMode: "html", replyTo: message.id });
      break;
    }

    const src = buffer.toString("utf8");

    try { new Function(src); } catch (syntaxErr) {
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ <b>Syntax error:\n<code>${syntaxErr.message}</code></b></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    let obfResult;
    try {
      obfResult = await JsConfuser.obfuscate(src, getNovaObfuscationConfig());
    } catch (e) {
      console.error("Obfuscate error:", e);
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ <b>Gagal melakukan obfuscation: ${e.message || e}</b></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    const obfuscatedCode = typeof obfResult === "string" ? obfResult : (obfResult && obfResult.code) || "";
    try { new Function(obfuscatedCode); } catch (postErr) {
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ <b>Hasil obfuscation tidak valid:\n<code>${postErr.message}</b></code></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    outPath = path.join(__dirname, `${fileTempBase}-${safeName}`);
    try {
      fs.writeFileSync(outPath, obfuscatedCode, "utf8");
    } catch (e) {
      console.error("write file error:", e);
      if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      await client.sendMessage(chatId, { message: `<blockquote>❌ <b>Gagal menyimpan file sementara: ${e.message || e}</b></blockquote>`, parseMode: "html", replyTo: message.id });
      break;
    }

    try {
      await client.sendMessage(chatId, { file: outPath, caption: `<blockquote>✅ <b>File berhasil terenkripsi: ${safeName}</b></blockquote>`, parseMode: "html", replyTo: message.id });
    } catch (e) {
      const outBuf = Buffer.from(obfuscatedCode, "utf8");
      try {
        await client.sendMessage(chatId, { file: outBuf, caption: `<blockquote>✅ <b>File berhasil terenkripsi: ${safeName}</b></blockquote>`, parseMode: "html", replyTo: message.id });
      } catch (e2) {
        console.error("send file fallback failed:", e2);
        if (statusMsg) try { await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
        await client.sendMessage(chatId, { message: `<blockquote>❌ <b>Gagal mengirim file: ${e2.message || e2}</b></blockquote>`, parseMode: "html", replyTo: message.id });
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
      await client.sendMessage(chatId, { message: `<blockquote>❌ <b>Terjadi kesalahan: ${err.message || err}</b></blockquote>`, parseMode: "html", replyTo: message.id });
    } catch (_) {}
  }
  break;
}

case "pass": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat.id;

      const text = message.message || message.text || "";
      const parts = text.trim().split(/\s+/);
      if (parts.length < 4) {
        return await client.sendMessage(chatId, {
          message: "<blockquote>⚠️ Format: <b>.pass &lt;ip_vps&gt; &lt;pass_old&gt; &lt;pass_new&gt;</b></blockquote>",
          parseMode: "html",
          replyTo: message.id,
        });
      }

      const ip = parts[1];
      const passOld = parts[2];
      const passNew = parts[3];
      const port = 22;
      const targetUser = "root";

      const statusMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 Mencoba terhubung ke <code>${ip}</code>...</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });

      const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(ip)) {
      }

      const conn = new SSH2.Client();
      let finished = false;
      const connectTimeout = setTimeout(() => {
        if (!finished) {
          finished = true;
          try { conn.end(); } catch(_) {}
          client.sendMessage(chatId, { message: `❌ Timeout: gagal terhubung ke ${ip}`, replyTo: message.id }).catch(()=>{});
        }
      }, 25000); 
      
      conn.on("ready", () => {
        (async () => {
          try {
            await client.sendMessage(chatId, { message: `✅ Terhubung ke ${ip}. Mencoba mengganti password...`, replyTo: message.id }).catch(()=>{});

            const safeNew = passNew.replace(/["`\\\$]/g, "\\$&");
            const cmd = `echo "${targetUser}:${safeNew}" | chpasswd`;

            conn.exec(cmd, { pty: true }, (err, stream) => {
              if (err) {
                clearTimeout(connectTimeout);
                finished = true;
                conn.end();
                client.sendMessage(chatId, { message: `❌ Gagal menjalankan perintah: ${err.message}`, replyTo: message.id }).catch(()=>{});
                return;
              }

              let stdout = "";
              let stderr = "";
              stream.on("close", (code, signal) => {
                clearTimeout(connectTimeout);
                finished = true;
                conn.end();
                if (code === 0) {
                  client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>Password berhasil diubah untuk\n👤 USERNAME : <b>${targetUser}</b>\n🌐 IP: <b><code>${ip}</code></b>\n🔑 <b>PASSWORD NEW</b> :<b>${passNew}</b></blockquote>`,
                    parseMode: "html",
                    replyTo: message.id,
                  }).catch(()=>{});
                } else {
                  const errTxt = stderr || `Exit code ${code} (signal ${signal})`;
                  client.sendMessage(chatId, {
                    message: `<blockquote>❌ Gagal mengubah password. Detail: <code>${escapeHtml(errTxt)}</code></blockquote>`,
                    parseMode: "html",
                    replyTo: message.id,
                  }).catch(()=>{});
                }
              }).on("data", (data) => {
                stdout += data.toString();
              }).stderr.on("data", (data) => {
                stderr += data.toString();
              });
            });

          } catch (e) {
            clearTimeout(connectTimeout);
            finished = true;
            conn.end();
            await client.sendMessage(chatId, { message: `❌ Error saat mencoba mengganti password: ${e.message || e}`, replyTo: message.id }).catch(()=>{});
          }
        })();
      });

      conn.on("error", async (err) => {
        if (finished) return;
        finished = true;
        clearTimeout(connectTimeout);

        let userMsg = `❌ Gagal terhubung ke ${ip}: ${err.message || err}`;
        if (err.level === "client-authentication" || /All configured authentication methods failed/.test(String(err.message))) {
          userMsg = "❌ Autentikasi gagal — kemungkinan password lama salah.";
        } else if (err.code === "ECONNREFUSED" || /connect ECONNREFUSED/.test(String(err.message))) {
          userMsg = "❌ Koneksi ditolak — IP/port mungkin tidak benar atau SSH tidak aktif di server.";
        } else if (err.code === "ENOTFOUND" || /getaddrinfo ENOTFOUND/.test(String(err.message))) {
          userMsg = "❌ IP/domain tidak ditemukan — periksa IP atau DNS.";
        } else if (/timed out|ETIMEDOUT/.test(String(err.message))) {
          userMsg = "❌ Timeout saat mencoba menyambung — server mungkin tidak dapat dijangkau.";
        }

        try { await client.sendMessage(chatId, { message: userMsg, replyTo: message.id }); } catch(_) {}
        try { conn.end(); } catch(_) {}
      });

      conn.on("end", () => {
      });

      conn.on("close", (hadError) => {
      });

      conn.connect({
        host: ip,
        port,
        username: targetUser,
        password: passOld,
        readyTimeout: 20000,
      });

      function escapeHtml(s = "") {
        return s.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");
      }

    } catch (err) {
      console.error("handler .pass error:", err);
      await client.sendMessage(message.chatId || message.chat.id, {
        message: `❌ Error: ${err.message || err}`,
        replyTo: message.id,
      }).catch(()=>{});
    }
  })();
  break;
}

case "ssweb": {
  (async () => {
    const chatId = message.chatId || message.chat.id;
    try {
      const apiKey = "0d261b";
      const text = (message.message || message.text || "").trim();
      const parts = text.split(/\s+/);
      if (parts.length < 2) {
        return await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ Gunakan: <b>${prefix}ssweb &lt;url_or_domain&gt;</b>\nContoh: <code>.ssweb google.com</code></blockquote>`,
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
          message: "<blockquote>❌ URL tidak valid. Pastikan kamu memasukkan domain atau URL yang benar..</blockquote>",
          parseMode: "html",
          replyTo: message.id,
        });
      }

      const statusMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 Mengambil screenshot dari:\n<code>${url.href}</code>\nSilakan tunggu...</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });

      const outPath = path.join(__dirname, `ssweb_${Date.now()}.png`);

      const apiUrl = `https://api.screenshotmachine.com/?key=${apiKey}&url=${encodeURIComponent(url.href)}&dimension=1366xfull&format=png&cacheLimit=0`;

      const response = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 30000 });
      fs.writeFileSync(outPath, response.data);

      await client.sendMessage(chatId, {
        file: outPath,
        caption: `<blockquote><b>Screenshot</b>\n<code>${url.href}</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });

      try { if (statusMsg?.id) await client.deleteMessages(chatId, [statusMsg.id]); } catch (_) {}
      try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}

    } catch (err) {
      console.error(`${prefix}ssweb error:`, err);
      const msg = String(err && err.message ? err.message : err);
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ Gagal mengambil screenshot: ${escapeHtml(msg)}</blockquote>`,
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
          message: `<blockquote>❌ <b>Format salah! :</b> ${prefix}installpanel ip_vps,password_vps,domain_panel,domain_node,ram_vps\n
<b>Contoh :</b> ${prefix}installpanel 1.2.3.4,PasswordVps,sub.domain.com,node.domain.com,16000000</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const [ipvps, passwd, subdomain, domainnode, ramvps] = t;

      const { Client } = require("ssh2");
      const conn = new Client();

      const connSettings = {
        host: ipvps,
        port: 22,
        username: "root",
        password: passwd,
      };

      const password = "KINGS";
      const command = "bash <(curl -s https://pterodactyl-installer.se)";
      const commandWings = "bash <(curl -s https://pterodactyl-installer.se)";

      await client.sendMessage(chatId, {
        message: `<blockquote>🚀 <b>Memulai pemasangan Pterodactyl!</b>

🖥️ <b>IP VPS:</b> <code>${ipvps}</code>
🌐 <b>Panel:</b> <code>${subdomain}</code>
🛰️ <b>Node:</b> <code>${domainnode}</code>
💾 <b>RAM:</b> <code>${ramvps}</code>

⏳ Mohon tunggu 5–15 menit...</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      conn.on("ready", () => {
        client.sendMessage(chatId, { message: "<blockquote>📦 <b>Step 1/3:</b> Instalasi Pterodactyl dimulai...</blockquote>", parseMode: "html" });

        conn.exec(command, (err, stream) => {
          if (err) {
            client.sendMessage(chatId, { message: "<blockquote>❌ Gagal menjalankan instalasi Pterodactyl! Cek IP atau password VPS</blockquote>", parseMode: "html" });
            conn.end();
            return;
          }

          stream.on("close", (code) => {
            if (code !== 0) {
              client.sendMessage(chatId, { message: `<blockquote>❌ Proses install Pterodactyl gagal (exit code ${code})</blockquote>`, parseMode: "html" });
              conn.end();
              return;
            }

            client.sendMessage(chatId, { message: "<blockquote>✅ Install Pterodactyl selesai. Lanjut ke Step 2/3: Instalasi Wings...</blockquote>", parseMode: "html" });
            installWings(conn, domainnode, subdomain, password, ramvps);
          }).on("data", (data) => handlePanelInstallationInput(data, stream, subdomain, password))
            .stderr.on("data", (data) => console.log("STDERR:", data.toString()));
        });
      })
      .on("error", (err) => {
        if (err.message.includes("All configured authentication methods failed")) {
          client.sendMessage(chatId, { message: "<blockquote>❌ Password VPS salah atau akses SSH ditolak</blockquote>", parseMode: "html" });
        } else if (err.message.includes("ECONNREFUSED")) {
          client.sendMessage(chatId, { message: "<blockquote>❌ Port 22 VPS tidak terbuka atau VPS mati</blockquote>", parseMode: "html" });
        } else if (err.message.includes("ETIMEDOUT")) {
          client.sendMessage(chatId, { message: "<blockquote>❌ VPS tidak merespon atau timeout</blockquote>", parseMode: "html" });
        } else {
          client.sendMessage(chatId, { message: `<blockquote>❌ SSH Error: ${err.message}</blockquote>`, parseMode: "html" });
        }
      })
      .connect(connSettings);

      function installWings(conn, domainnode, subdomain, password, ramvps) {
        client.sendMessage(chatId, { message: "<blockquote>🚀 Step 2/3: Instalasi Wings (Node)...</blockquote>", parseMode: "html" });

        conn.exec(commandWings, (err, stream) => {
          if (err) {
            client.sendMessage(chatId, { message: "<blockquote>❌ Gagal menjalankan perintah instalasi wings</blockquote>", parseMode: "html" });
            conn.end();
            return;
          }

          stream.on("close", (code) => {
            if (code !== 0) {
              client.sendMessage(chatId, { message: `<blockquote>❌ Proses install wings gagal (exit code ${code})</blockquote>`, parseMode: "html" });
              conn.end();
              return;
            }

            client.sendMessage(chatId, { message: "<blockquote>✅ Install wings selesai. Lanjut ke Step 3/3: Membuat Node & Location...</blockquote>", parseMode: "html" });
            createNode(conn, domainnode, ramvps, subdomain, password);
          }).on("data", (data) => handleWingsInstallationInput(data, stream, domainnode, subdomain))
            .stderr.on("data", (data) => console.log("STDERR:", data.toString()));
        });
      }

      function createNode(conn, domainnode, ramvps, subdomain, password) {
        const commandNode = "bash <(curl -s https://raw.githubusercontent.com/LeXcZxMoDz9/Installerlex/refs/heads/main/install.sh)";
        client.sendMessage(chatId, { message: "<blockquote>📡 Step 3/3: Membuat Node & Location di Pterodactyl...</blockquote>", parseMode: "html" });

        conn.exec(commandNode, (err, stream) => {
          if (err) {
            client.sendMessage(chatId, { message: "<blockquote>❌ Gagal membuat node</blockquote>", parseMode: "html" });
            conn.end();
            return;
          }

          stream.on("close", (code) => {
            if (code !== 0) {
              client.sendMessage(chatId, { message: `<blockquote>❌ Pembuatan node gagal (exit code ${code})</blockquote>`, parseMode: "html" });
              conn.end();
              return;
            }

            client.sendMessage(chatId, { message: "<blockquote>🎉 Panel, Wings, dan Node sudah terpasang!\n\n🟢 Silakan lanjut setup Pterodactyl di website</blockquote>", parseMode: "html" });
            conn.end();
            sendPanelData();
          }).on("data", (data) => handleNodeCreationInput(data, stream, domainnode, ramvps))
            .stderr.on("data", (data) => console.log("STDERR:", data.toString()));
        });
      }

      function sendPanelData() {
        client.sendMessage(chatId, {
          message: `<blockquote>━━━━━━━━━━━━━━━━━━━━
<b>✅ INSTALASI PTERODACTYL SELESAI</b>
━━━━━━━━━━━━━━━━━━━━
🌐 <b>Domain :</b> <a href="https://${subdomain}">https://${subdomain}</a>
🛰️ <b>Node :</b> <a href="https://${domainnode}">https://${domainnode}</a>
💾 <b>RAM :</b> <b>${ramvps}</b>
👤 <b>User :</b> <b>KINGS</b>
🔑 <b>Pass :</b> <b>KINGS</b>
━━━━━━━━━━━━━━━━━━━━
<b>Cara Lanjut:</b>
1️⃣ Login panel ➜ buat location & node.
2️⃣ Node: FQDN <b>https://${domainnode}</b> | RAM <b>${ramvps}</b>
3️⃣ Buat allocation: port 2000–2300.
4️⃣ Ambil token node, lalu: .wings ip_vps,password_vps,token
━━━━━━━━━━━━━━━━━━━━
Tunggu ±5 menit agar panel aktif
</blockquote>`,
          parseMode: "html"
        });
      }

      function handlePanelInstallationInput(data, stream, subdomain, password) {
        const str = data.toString();
        if (str.includes("(Y)es/(N)o:")) stream.write("yes\n");
        if (str.includes("Please read the Terms")) stream.write("A\n");
        if (str.includes("I agree")) stream.write("y\n");
        if (str.toLowerCase().includes("email")) stream.write("kings@gmail.com\n");
        if (str.includes("Input")) {
          stream.write(`${password}\n`);
          stream.write("Asia/Jakarta\n");
          stream.write("kings@gmail.com\n");
          stream.write("KINGS\n");
          stream.write(`${subdomain}\n`);
          stream.write("y\n");
        }
        console.log("STDOUT:", str);
      }

      function handleWingsInstallationInput(data, stream, domainnode, subdomain) {
        const str = data.toString();
        if (str.includes("(Y)es/(N)o:")) stream.write("yes\n");
        if (str.includes("Input")) {
          stream.write(`${subdomain}\n`);
          stream.write("KINGS\n");
          stream.write(`${domainnode}\n`);
          stream.write("kings@gmail.com\n");
          stream.write("y\n");
        }
        console.log("STDOUT:", str);
      }

      function handleNodeCreationInput(data, stream, domainnode, ramvps) {
        stream.write("4\nKINGS\nKINGS\n");
        stream.write(`${domainnode}\n`);
        stream.write("KINGS\n");
        stream.write(`${ramvps}\n${ramvps}\n1\n`);
        console.log("STDOUT:", data.toString());
      }

    } catch (e) {
      console.error("Error installpanel:", e);
      await client.sendMessage(chatId, { message: `<blockquote>❌ Terjadi error: ${e.message}</blockquote>`, parseMode: "html", replyTo: message.id });
    }
  })();
  break;
}

case "uninstallpanel": {
  (async () => {
    try {
      const chatId = message.chatId || message.chat.id;
      const args = message.text.split(" ").slice(1).join(" ");
      const t = args.split(",").map(x => x.trim());

      if (t.length < 2) {
        return client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>Format salah! :</b> ${prefix}uninstallpanel ip_vps,password_vps\n\n<b>Contoh:</b> ${prefix}uninstallpanel 1.2.3.4,PasswordVps</blockquote>`,
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
        message: `<blockquote>🚀 <b>Proses uninstall Pterodactyl dimulai...</b>\n\n🖥️ <b>IP</b> : <code>${ipvps}</code>\n\n⏳ Mohon tunggu beberapa menit</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      conn.on("ready", () => {
        client.sendMessage(chatId, {
          message: "<blockquote>🚀 <b>Berhasil terhubung ke VPS, mulai proses uninstall Pterodactyl...</b></blockquote>",
          parseMode: "html"
        });

        conn.exec(uninstallCommand, { pty: true }, (err, stream) => {
          if (err) {
            client.sendMessage(chatId, {
              message: "<blockquote>❌ Gagal menjalankan perintah uninstall Pterodactyl</blockquote>",
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
                message: `<blockquote>✅ <b>Uninstall Pterodactyl selesai!</b>\n\nPterodactyl & Wings telah dihapus sepenuhnya dari VPS <code>${ipvps}</code></blockquote>`,
                parseMode: "html"
              });
            } else {
              client.sendMessage(chatId, {
                message: `<blockquote>⚠️ Uninstall Pterodactyl selesai dengan kode keluar <b>${code}</b>. Sebagian komponen mungkin masih tersisa</blockquote>`,
                parseMode: "html"
              });
            }
          });
        });
      })
      .on("error", (err) => {
        if (err.message.includes("All configured authentication methods failed")) {
          client.sendMessage(chatId, { message: "<blockquote>❌ Password VPS salah atau akses SSH ditolak</blockquote>", parseMode: "html" });
        } else if (err.message.includes("ECONNREFUSED")) {
          client.sendMessage(chatId, { message: "<blockquote>❌ Port 22 VPS tidak terbuka atau VPS mati</blockquote>", parseMode: "html" });
        } else if (err.message.includes("ETIMEDOUT")) {
          client.sendMessage(chatId, { message: "<blockquote>❌ VPS tidak merespon atau timeout</blockquote>", parseMode: "html" });
        } else {
          client.sendMessage(chatId, { message: `<blockquote>❌ SSH Error: ${err.message}</blockquote>`, parseMode: "html" });
        }
      })
      .connect(connSettings);

    } catch (e) {
      console.error("Error uninstallpanel:", e);
      client.sendMessage(chatId, { message: `<blockquote>❌ Terjadi error: ${e.message}</blockquote>`, parseMode: "html", replyTo: message.id });
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
          message: `<blockquote>❌ <b>Format salah! :</b> ${prefix}reinstallpanel ip_vps,password_vps,subdomain_panel,domain_node,ram_vps\n\n<b>Contoh:</b> ${prefix}reinstallpanel 1.2.3.4,PasswordVps,sub.domain.com,node.domain.com,16000000</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const [ipvps, passwd, subdomain, domainnode, ramvps] = t;
      const { Client } = require("ssh2");
      const conn = new Client();

      const connSettings = {
        host: ipvps,
        port: 22,
        username: "root",
        password: passwd,
      };

      const uninstallCmd = `
echo "🧹 Menghapus instalasi Pterodactyl lama...";
systemctl stop wings nginx mariadb redis || true;
systemctl disable wings nginx mariadb redis || true;
rm -rf /var/www/pterodactyl /etc/pterodactyl /var/lib/pterodactyl /etc/systemd/system/wings.service /usr/local/bin/wings /root/pterodactyl-installer.sh;
mysql -u root -e "DROP DATABASE IF EXISTS panel;";
apt remove -y nginx mariadb-server redis-server php*;
apt autoremove -y;
apt clean;
echo "✅ Semua instalasi Pterodactyl lama berhasil dihapus";
`;

      const installCmdPanel = `bash <(curl -s https://pterodactyl-installer.se)`;
      const installCmdWings = `bash <(curl -s https://pterodactyl-installer.se)`;
      const nodeCmd = `bash <(curl -s https://raw.githubusercontent.com/LeXcZxMoDz9/Installerlex/refs/heads/main/install.sh)`;

      await client.sendMessage(chatId, {
        message: `<blockquote>♻️ <b>Proses reinstall dimulai...</b>\n\n🖥️ <b>IP :</b> <code>${ipvps}</code>\n🌐 <b>Domain :</b> <code>${subdomain}</code>\n🛰️ <b>Node :</b> <code>${domainnode}</code>\n💾 <b>RAM :</b> <code>${ramvps}</code>\n\n⏳ Mohon tunggu beberapa menit...</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });

      conn.on("ready", () => {
        client.sendMessage(chatId, { message: "<blockquote>🧹 <b>Menghapus instalasi Pterodactyl lama...</b></blockquote>", parseMode: "html" });

        conn.exec(uninstallCmd, { pty: true }, (err, stream) => {
          if (err) return sendFail("Gagal uninstall pterodactyl lama", err);

          stream.on("close", (code) => {
            client.sendMessage(chatId, { message: "<blockquote>✅ <b>Uninstall Pterodactyl selesai!</b>\n🚀 Memulai instalasi Pterodactyl baru...</blockquote>", parseMode: "html" });
            installPanel();
          });

          stream.on("data", d => console.log("[UNINSTALL]", d.toString()));
        });

        function installPanel() {
          conn.exec(installCmdPanel, { pty: true }, (err, stream) => {
            if (err) return sendFail("Gagal install pterodactyl", err);

            client.sendMessage(chatId, { message: "<blockquote>🚀 <b>Instalasi Pterodactyl dimulai...</b></blockquote>", parseMode: "html" });

            stream.on("data", (data) => {
              const out = data.toString();
              console.log("[INSTALL PTERODACTYL]", out);

              if (out.includes("(Y)es/(N)o")) stream.write("yes\n");
              if (out.includes("email")) stream.write("kings@gmail.com\n");
              if (out.includes("hostname")) stream.write(`${subdomain}\n`);
              if (out.includes("password")) stream.write("kings\n");
              if (out.includes("Timezone")) stream.write("Asia/Jakarta\n");
            });

            stream.on("close", () => {
              client.sendMessage(chatId, { message: "<blockquote>✅ Pterodactyl selesai terpasang!\n🛠️ Melanjutkan instalasi Wings...</blockquote>", parseMode: "html" });
              installWings();
            });
          });
        }

        function installWings() {
          conn.exec(installCmdWings, { pty: true }, (err, stream) => {
            if (err) return sendFail("Gagal install wings", err);

            stream.on("data", (data) => {
              const out = data.toString();
              console.log("[INSTALL WINGS]", out);
              if (out.includes("(Y)es/(N)o")) stream.write("yes\n");
              if (out.includes("hostname")) stream.write(`${domainnode}\n`);
              if (out.includes("email")) stream.write("kings@gmail.com\n");
            });

            stream.on("close", () => {
              client.sendMessage(chatId, { message: "<blockquote>✅ Wings selesai dipasang!\n📡 Membuat Node otomatis...</blockquote>", parseMode: "html" });
              createNode();
            });
          });
        }

        function createNode() {
          conn.exec(nodeCmd, { pty: true }, (err, stream) => {
            if (err) return sendFail("Gagal membuat node", err);

            stream.on("data", d => console.log("[NODE]", d.toString()));

            stream.on("close", () => {
              conn.end();
              sendDone();
            });
          });
        }

        function sendFail(msg, err) {
          console.error("[ERROR]", err);
          conn.end();
          client.sendMessage(chatId, { message: `❌ ${msg}`, parseMode: "html" });
        }

        function sendDone() {
          client.sendMessage(chatId, {
            message: `<blockquote>🎉 <b>Reinstall Pterodactyl selesai!</b>\n━━━━━━━━━━━━━━━\n🔗 <b>Pterodactyl :</b> <a href="https://${subdomain}">https://${subdomain}</a>\n🛰️ <b>Node :</b> <a href="https://${domainnode}">https://${domainnode}</a>\n💾 <b>RAM :</b> <b>${ramvps}</b>\n👤 <b>User :</b> <b>kings</b>\n🔑 <b>Pass :</b> <b>kings</b>\n━━━━━━━━━━━━━━━\n⚙️ Login ke panel, buat location & node, lalu hubungkan wings\n━━━━━━━━━━━━━━━</blockquote>`,
            parseMode: "html"
          });
        }
      })
      .on("error", (err) => {
        let msg = "<blockquote>❌ Koneksi SSH gagal</blockquote>";
        if (err.message.includes("<blockquote>All configured authentication methods failed</blockquote>")) msg = "<blockquote>❌ Password VPS salah!</blockquote>";
        if (err.message.includes("ECONNREFUSED")) msg = "<blockquote>❌ Port 22 VPS tertutup atau mati</blockquote>";
        client.sendMessage(chatId, { message: msg, parseMode: "html" });
      })
      .connect(connSettings);

    } catch (e) {
      console.error("Error reinstallpanel:", e);
      client.sendMessage(chatId, { message: `<blockquote>❌ Terjadi error: ${e.message}</blockquote>`, parseMode: "html" });
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
          "<blockquote>❌ Balas pesan user atau tag @username untuk melakukan <b>ban</b></blockquote>",
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
        message: `<blockquote>🤓 <b>${target.username ? "@" + target.username : target.firstName}</b> mampus kontol diban 😹</blockquote>`,
        parseMode: "html",
      });
    } catch (e) {
      await client.sendMessage(message.chatId, {
        message: `⚠️ Gagal ban user: ${e.errorMessage || e.message}`,
      });
    }
    break;
  }

  case "unban": {
    const target = await getTargetUser(client, message, args);
    if (!target) {
      return client.sendMessage(message.chatId, {
        message:
          "<blockquote>❌ Balas pesan user atau tag @username untuk melakukan <b>unban</b></blockquote>",
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
        message: `<blockquote>😏 <b>${target.username ? "@" + target.username : target.firstName}</b> kacian kacung habis diban 🤪</blockquote>`,
        parseMode: "html",
      });
    } catch (e) {
      await client.sendMessage(message.chatId, {
        message: `⚠️ Gagal unban user: ${e.errorMessage || e.message}`,
      });
    }
    break;
  }

  case "kick": {
    const target = await getTargetUser(client, message, args);
    if (!target) {
      return client.sendMessage(message.chatId, {
        message:
          "<blockquote>❌ Balas pesan user atau tag @username untuk melakukan <b>kick</b></blockquote>",
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
        message: `<blockquote>😹 <b>${target.username ? "@" + target.username : target.firstName}</b> mampus hama dikick 😈</blockquote>`,
        parseMode: "html",
      });
    } catch (e) {
      await client.sendMessage(message.chatId, {
        message: `⚠️ Gagal kick user: ${e.errorMessage || e.message}`,
      });
    }
    break;
  }

case "mute": {
  const target = await getTargetUser(client, message, args);
  if (!target) {
    return client.sendMessage(message.chatId, {
      message:
        "<blockquote>❌ Balas pesan user atau tag @username untuk melakukan <b>mute</b></blockquote>",
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
    let reasonText = reason ? `<blockquote>\n📝 Alasan: <i>${reason}</i></blockquote>` : "";

    await client.sendMessage(message.chatId, {
      message: `<blockquote>🤪 <b>${userTag}</b> mampus kontol dimute ${durationText}😹${reasonText}</blockquote>`,
      parseMode: "html",
    });
  } catch (e) {
    await client.sendMessage(message.chatId, {
      message: `⚠️ Gagal mute user: ${e.errorMessage || e.message}`,
    });
  }
  break;
}

  case "unmute": {
    const target = await getTargetUser(client, message, args);
    if (!target) {
      return client.sendMessage(message.chatId, {
        message:
          "<blockquote>❌ Balas pesan user atau tag @username untuk melakukan <b>unmute</b></blockquote>",
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
        message: `<blockquote>😹 <b>${target.username ? "@" + target.username : target.firstName}</b> kacian habis dimute 🤪</blockquote>`,
        parseMode: "html",
      });
    } catch (e) {
      await client.sendMessage(message.chatId, {
        message: `⚠️ Gagal unmute user: ${e.errorMessage || e.message}`,
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
        message: `<blockquote>⚠️ Format: ${prefix}resetpw ID Pass_new</blockquote>`, 
        parseMode: "html",
        replyTo: message.id 
      });
    }

    const loadingMsg = await client.sendMessage(chatId, { 
      message: `<blockquote>⏳ Sedang mengubah password user ID ${userId}...</blockquote>`, 
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
      const msg = `<blockquote><b>✅ Reset Password Berhasil</b>\n\n<b>👤 Username:</b> ${user.username}\n<b>📧 Email:</b> ${user.email}\n<b>🆔 User ID:</b> ${user.id}\n<b>🔑 Password Baru:</b> <code>${newPassword}</code>\n<b>🕒 Waktu:</b> ${waktu}</blockquote>`;

      await client.sendMessage(chatId, { message: msg, parseMode: "html" });

    } catch (err) {
      console.error("ResetPW Error:", err.message);
      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
      await client.sendMessage(chatId, { 
        message: `<blockquote>❌ Gagal reset password.\n<b>Detail:</b> ${err.message}</blockquote>`, 
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
        message: `<blockquote>⚠️ Format: ${prefix}edituser ID Username_new</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }

    const loadingMsg = await client.sendMessage(chatId, {
      message: `<blockquote>⏳ Sedang mengubah nama username ID ${userId}...</blockquote>`,
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
      const msg = `<blockquote><b>✅ Username Berhasil Diperbarui</b>\n\n<b>🆔 User ID:</b> ${user.id}\n<b>👤 Username Lama:</b> ${user.username}\n<b>🆕 Username Baru:</b> ${newUsername}\n<b>📧 Email:</b> ${user.email}\n<b>🕒 Waktu:</b> ${waktu}</blockquote>`;

      await client.sendMessage(chatId, { message: msg, parseMode: "html" });

    } catch (err) {
      console.error("EditUser Error:", err.message);
      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ Gagal mengedit username.\n<b>Detail:</b> ${err.message}</blockquote>`,
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
        message: `<blockquote>Contoh: <code>${prefix}trackip &lt;ip address&gt;</code></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
      return;
    }

    const target = args[0];

    if (target === "0.0.0.0") {
      await client.sendMessage(chatId, {
        message: "<blockquote>⚠️ Jangan di ulangi manis, nanti usermu bisa dihapus 😅</blockquote>",
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
🌍 Informasi IP untuk ${target}

🏳️ Flags: ${ipInfo.country_flag || "N/A"}
🌐 Country: ${ipInfo.country_name || "N/A"}
🏛 Capital: ${ipInfo.country_capital || "N/A"}
🏙 City: ${ipInfo.city || "N/A"}
📡 ISP: ${ipInfo.isp || "N/A"}
🏢 Organization: ${ipInfo.organization || "N/A"}
📍 Latitude: ${ipInfo.latitude || "N/A"}
📍 Longitude: ${ipInfo.longitude || "N/A"}

🗺 Google Maps: https://www.google.com/maps/place/${additionalInfo.latitude || ""}+${additionalInfo.longitude || ""}
</blockquote>`;

      await client.sendMessage(chatId, {
        message: messageText,
        parseMode: "html",
        replyTo: message.id,
      });
    } catch (error) {
      console.error(`Error melacak ${target}:`, error);
      await client.sendMessage(chatId, {
        message: `❌ Error melacak ${target}. Silakan coba lagi nanti.\nError: ${error.message}`,
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
        message: `<blockquote>⚠️ Gunakan: <code>${prefix}cekhost &lt;domain&gt;</code>\nContoh: <code>${prefix}cekhost example.my.id</code></blockquote>`,
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
    if (!host) return client.sendMessage(chatId, { message: "<blockquote>❌ Domain tidak valid</blockquote>", parseMode: "html", replyTo: message.id });

    let loadingMsg;
    try {
      loadingMsg = await client.sendMessage(chatId, { message: `<blockquote>🔍 Memeriksa host: <code>${host}</code></blockquote>`, parseMode: "html" });
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

      const messageText = `
<blockquote>
╭━━━⬣ <b>INFORMASI DOMAIN</b> ⬣━━━╮
┃ 🌐 <b>Domain:</b> <code>${host}</code>
┃ 📡 <b>Status:</b> ${statusText}
┃ 📍 <b>IP Server:</b> <code>${ipDisplay}</code>
┃ 🏢 <b>Registrasi:</b> ${registrar}
┃ 📆 <b>Dibuat:</b> ${created}
┃ ⏳ <b>Kadaluarsa:</b> ${expiry}
┃ 🌍 <b>Negara:</b> ${country}
╰━━━━━━━━━━━━━━━━━━━━━━⬣
© ʙʏ ᴋɪɴɢs 👑
</blockquote>
`;

      await client.sendMessage(chatId, { message: messageText, parseMode: "html", replyTo: message.id });

    } catch (err) {
      console.error("Error cekhost:", err);
      await client.sendMessage(chatId, { message: "<blockquote>❌ Terjadi kesalahan saat mengecek host/domain</blockquote>", parseMode: "html", replyTo: message.id });
    } finally {
      if (loadingMsg) {
        try { await client.DeleteMessage(chatId, loadingMsg.id); } catch {}
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
          "<blockquote>⚠️ <b>Reply pesan</b></blockquote>",
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
        message: "<blockquote>❌ Gagal menemukan pesan yang direply</blockquote>",
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
          message: "<blockquote>❌ Gagal menghapus pesan target</blockquote>",
          parseMode: "html",
          replyTo: message.id,
        });
      }

      return;
    } catch (err) {
      console.error("Del error:", err);
      return client.sendMessage(chatId, {
        message: `<blockquote>❌ Gagal menghapus pesan\nDetail: ${String(err.message || err)}</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
  })();
  break;
}

case "cfdgroup": {
  (async () => {
    const chatId = message.chatId || message.chat?.id;
    const repliedId =
      message.replyTo?.id ||
      message.reply_to_message?.id ||
      message.replyTo?.replyToMsgId ||
      null;

    if (!repliedId) {
      return client.sendMessage(chatId, {
        message: `<blockquote>⚠️ <b>Reply pesan</b> yang ingin dikirim</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    let targetMsg;
    try {
      const res = await client.getMessages(chatId, { ids: repliedId });
      targetMsg = Array.isArray(res) ? res[0] : res;
    } catch (e) {
      console.error("Gagal ambil pesan:", e);
      return client.sendMessage(chatId, {
        message: "<blockquote>❌ Gagal mengambil pesan yang direply</blockquote>",
        parseMode: "html",
        replyTo: message.id,
      });
    }

    let loading;
    try {
      loading = await client.sendMessage(chatId, {
        message: "<blockquote>🚀 Mengirim pesan ke semua grup...</blockquote>",
        parseMode: "html",
      });
    } catch {}

    let dialogs = [];
    try {
      dialogs = await client.getDialogs({ limit: 500 });
    } catch (e) {
      console.error("Gagal ambil daftar grup:", e);
    }

    const groups = dialogs.filter(
      (d) => d.isGroup && !d.isUser
    );

    if (!groups.length) {
      try { if (loading) await client.deleteMessages(chatId, [loading.id]); } catch {}
      return client.sendMessage(chatId, {
        message: "<blockquote>⚠️ Tidak menemukan grup untuk dikirimi pesan</blockquote>",
        parseMode: "html",
        replyTo: message.id,
      });
    }

    async function copyToGroup(groupId, msg) {
      try {
        if (msg.media) {
          try {
            const buffer = await client.downloadMedia(msg);
            const caption = msg.message || msg.caption || "";
            await client.sendMessage(groupId, { file: buffer, caption, parseMode: "html" });
            return true;
          } catch (e) {
            console.warn("Gagal kirim media:", e);
            return false;
          }
        }

        if (msg.message && msg.message.trim() !== "") {
          try {
            await client.sendMessage(groupId, { message: msg.message, parseMode: "html" });
            return true;
          } catch {
            return false;
          }
        }

        if (msg.sticker || msg.media?.document?.mime_type?.includes("image/webp")) {
          try {
            const buf = await client.downloadMedia(msg);
            await client.sendMessage(groupId, { sticker: buf });
            return true;
          } catch {
            return false;
          }
        }

        return false;
      } catch (err) {
        console.error("Error copyToGroup:", err);
        return false;
      }
    }

    let sukses = 0;
    let gagal = 0;

    for (const g of groups) {
      const id = g.id || g.dialogId || g.entity?.id;
      if (!id || id === chatId) continue;

      try {
        const ok = await copyToGroup(id, targetMsg);
        if (ok) sukses++;
        else gagal++;
      } catch {
        gagal++;
      }

      await new Promise((r) => setTimeout(r, 600));
    }

    try { if (loading) await client.deleteMessages(chatId, [loading.id]); } catch {}

    await client.sendMessage(chatId, {
      message: `<blockquote>✅ <b>Pengiriman selesai</b>\n\n👥 Total Grup: <b>${groups.length}</b>\n✅ Berhasil: <b>${sukses}</b>\n❌ Gagal: <b>${gagal}</b></blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  })();
  break;
}

case "addbl": {
  (async () => {
    const chatId = message.chatId || message.chat?.id;
    const chatTitle = message.chat?.title || "Private/Unknown";

    if (!message.isGroup && !message.chat?.title) {
      return client.sendMessage(chatId, {
        message: `<blockquote>❗️ Perintah ini hanya bisa digunakan di grup</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    let blacklist = JSON.parse(fs.readFileSync(blFile, "utf-8"));

    if (blacklist.some((b) => String(b.id) === String(chatId))) {
      return client.sendMessage(chatId, {
        message: `<blockquote>⚠️ Grup <b>${chatTitle}</b> sudah ada di blacklist</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    blacklist.push({ id: chatId, group: chatTitle });
    fs.writeFileSync(blFile, JSON.stringify(blacklist, null, 2));

    await client.sendMessage(chatId, {
      message: `<blockquote><b>👥️ Grup: ${chatTitle}</b>\n<b>🆔️ Group ID:</b> <code>${chatId}</code>\n<b>📝 Ket:</b> berhasil ditambahkan ke blacklist</blockquote>`,
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
        message: `<blockquote>⚠️ Grup <b>${chatTitle}</b> tidak ada di blacklist</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    blacklist = blacklist.filter((b) => String(b.id) !== String(chatId));
    fs.writeFileSync(blFile, JSON.stringify(blacklist, null, 2));

    await client.sendMessage(chatId, {
      message: `<blockquote>✅ Grup <b>${chatTitle}</b> berhasil dihapus dari blacklist</blockquote>`,
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
        message: `<blockquote>❌️ Tidak ada grup dalam blacklist</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    const list = blacklist
      .map((b, i) => `${i + 1}. <b>${b.group}</b> — <code>${b.id}</code>`)
      .join("\n");

    await client.sendMessage(chatId, {
      message: `<blockquote><b>🚫 Daftar Grup yang di Blacklist:</b>\n\n${list}</blockquote>`,
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
        message: `<blockquote>⚠️ Format: ${prefix}cfdall ( pesan )</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }

    let loading;
    try {
      loading = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 Mengirim pesan ke semua user...</blockquote>`,
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
        message: `<blockquote>⚠️ Tidak ada user untuk dikirimi pesan.</blockquote>`,
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
      message: `<blockquote>✅ Pengiriman selesai\n\n<b>👥 Total user: ${users.length}</b>\n✅ Berhasil: <b>${sukses}</b>\n❌ Gagal: <b>${gagal}</b></blockquote>`,
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
          message: `<blockquote>❌ <b>Masukkan link TikTok yang valid!</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id,
        });
      }

      const tiktokUrl = urlMatch[0];

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>⏳ <i>Mengunduh video TikTok...</i></blockquote>`,
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

      const caption = `<blockquote>🎬 <b>${vid.title || "Video TikTok"}</b>
👤 @${vid.author?.unique_id || "?"}
❤️ ${vid.digg_count} | 💬 ${vid.comment_count}
<a href="${vid.share_url}">🌐 klik untuk lihat di TikTok</a>

© ʙʏ ᴋɪɴɢs 👑</blockquote>`;

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
        message: `<blockquote>❌ <b>Gagal download video!</b>\n${err.message}</blockquote>`,
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
          message: `<blockquote>❌ <b>Masukkan link TikTok yang valid!</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id,
        });
      }

      const tiktokUrl = urlMatch[0];

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>⌛️ <i>Mengunduh audio dari TikTok...</i></blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });

      const res = await fetch("https://www.tikwm.com/api/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: `url=${encodeURIComponent(tiktokUrl)}`,
      });

      const data = await res.json().catch(() => ({}));
      if (!data || data.code !== 0 || !data.data) throw new Error("Audio tidak ditemukan atau link salah!");

      const info = data.data;
      const audioUrl = info.music?.play_url || info.music?.url || info.music || null;
      if (!audioUrl) throw new Error("Tidak ada audio di video TikTok ini!");

      const caption = `<blockquote>🎵 <b>Audio TikTok</b>
👤 @${info.author?.unique_id || "?"}
🎧 <b>Durasi:</b> ${info.duration} detik

© ʙʏ ᴋɪɴɢs 👑</blcokquote>`;

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
        message: `<blockquote>❌ <b>Gagal mengunduh audio!</b>\n${err.message}</blockquote>`,
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
          message: `<blockquote>❌ <b>Masukkan kata kunci untuk mencari video YouTube!</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id,
        });
      }

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🔍 <i>Mencari video YouTube untuk:</i> <b>${text}</b> ...</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });

      const yts = require("yt-search");
      const results = await yts(text);
      if (!results.videos || results.videos.length === 0) {
        await client.sendMessage(chatId, {
          message: `❌ <b>Tidak ditemukan video untuk:</b> ${text}`,
          parseMode: "html",
          replyTo: message.id,
        });
        return;
      }

      const video = results.videos[0];
      const caption = `
<blockquote>
🎬 <b>${video.title}</b><br>
👤 <b>Channel:</b> ${video.author.name}<br>
⏱️ <b>Durasi:</b> ${video.timestamp}<br>
👀 <b>Views:</b> ${video.views.toLocaleString()}<br>
📅 <b>Upload:</b> ${video.ago}<br><br>
🔗 <a href="${video.url}">🎬 Klik untuk tonton di YouTube</a>\n© ʙʏ ᴋɪɴɢs 👑
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
        message: `<blockquote>❌ <b>Terjadi kesalahan saat mencari video YouTube!</b></blockquote>`,
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
          message: "<blockquote>⚠️ Hanya bisa digunakan di grup!</blockquote>", 
          parseMode: "html",
          replyTo: message.id 
        });
      }

      if (tagallChats.has(message.chat.id.toString())) {
        return await client.sendMessage(message.chat.id, { 
          message: "<blockquote>⚠️ Tagall sedang berjalan di grup ini</blockquote>", 
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
        message: "<blockquote>❌ Terjadi kesalahan saat menjalankan tagall</blockquote>",
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
          message: "<blockquote>⚠️ Hanya bisa digunakan di grup!</blockquote>", 
          parseMode: "html",
          replyTo: message.id 
        });
      }

      if (!tagallChats.has(message.chat.id.toString())) {
        return await client.sendMessage(message.chat.id, { 
          message: "<blockquote>❌ Tidak ada perintah tagall yang berjalan</blockquote>", 
          parseMode: "html",
          replyTo: message.id 
        });
      }

      tagallChats.delete(message.chat.id.toString());
      await client.sendMessage(message.chat.id, { 
        message: "<blockquote>✅ Tagall berhasil dibatalkan</blockquote>", 
        parseMode: "html",
        replyTo: message.id 
      });
    } catch (err) {
      console.error("❌ Batal Tagall Error:", err);
      await client.sendMessage(message.chat.id, {
        message: "<blockquote>❌ Terjadi kesalahan saat membatalkan tagall</blockquote>",
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
          message: `<blockquote>⚠️ <b>Format:</b> ${prefix}createbot <Nama Bot> | <username_bot>\nContoh: ${prefix}createbot Kings | Kings_bot</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const [botNameRaw, botUsernameRaw] = raw.split("|").map(s => s.trim());
      const botName = botNameRaw;
      const botUsername = botUsernameRaw;

      if (!(botUsername.endsWith("Bot") || botUsername.endsWith("_bot") || botUsername.endsWith("bot"))) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ Username bot harus diakhiri dengan 'Bot' atau '_bot'</blockquote>",
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
        message: `<blockquote>🚀 Proses membuat bot <b>${botName}</b></blockquote>`,
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
          await client.deleteMessages(chatId, [waitingMsg.id]);
        }
      } catch (err) {
        console.log("⚠️ Gagal hapus pesan status:", err.message);
      }

      if (token) {
        await client.sendMessage(chatId, {
          message: `<blockquote>✅ <b>Bot berhasil dibuat!</b>\n\n🤖 <b>Nama Bot:</b> ${botName}\n🔗 <b>Username:</b> @${botUsername}\n\n🔑 <b>Token:</b>\n<code>${token}</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      } else {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ Tidak bisa menemukan token untuk @${botUsername}. Coba cek langsung di @BotFather</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

    } catch (err) {
      console.error("createbot error:", err);
      await client.sendMessage(message.chat.id, {
        message: `<blockquote>❌ Terjadi kesalahan: ${err.message}</blockquote>`,
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
          message: `<blockquote>⚠️ <b>Format:</b> ${prefix}revoke <@username_bot></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const botUsername = input.replace("@", "");
      if (!botUsername.toLowerCase().endsWith("bot")) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ Username bot harus diakhiri dengan 'Bot'</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const botfather = await client.getEntity("BotFather");

      await client.sendMessage(botfather, { message: "/revoke" });
      await new Promise(r => setTimeout(r, 1500));
      await client.sendMessage(botfather, { message: `@${botUsername}` });

      const waitingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>⏳ Sedang reset token lama ke baru dari <b>@BotFather</b> untuk <b>@${botUsername}</b></blockquote>`,
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
        await client.deleteMessages(chatId, [waitingMsg.id]);
      } catch {}

      if (tokenBaru) {
        await client.sendMessage(chatId, {
          message:
            `<blockquote>✅ <b>Token baru berhasil diambil!</b>\n🤖 Bot: @${botUsername}\n🔑 Token Baru:</blockquote>\n<code>${tokenBaru}</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      } else {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ Gagal mendapatkan token baru. Cek langsung di @BotFather</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

    } catch (err) {
      await client.sendMessage(message.chat.id, {
        message: `<blockquote>❌ Terjadi kesalahan: ${err.message}</blockquote>`,
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
          message: "<blockquote>⚠️ Format: .delbot <@username_bot>\nContoh: .delbot @kings_bot</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const botUsername = input.replace("@", "");
      if (!botUsername.toLowerCase().endsWith("bot")) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ Username bot harus diakhiri dengan 'Bot'</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const botfather = await client.getEntity("BotFather");

      await client.sendMessage(botfather, { message: "/deletebot" });
      await new Promise(r => setTimeout(r, 1500));
      await client.sendMessage(botfather, { message: `@${botUsername}` });

      const loading = await client.sendMessage(chatId, {
        message: `<blockquote>⏳ Menghapus bot <b>@${botUsername}</b> dari <b>@BotFather</b>...</blockquote>`,
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
        await client.deleteMessages(chatId, [loading.id]);
      } catch {}

      if (status === "deleted") {
        await client.sendMessage(chatId, {
          message: `<blockquote>✅ <b>Bot @${botUsername} berhasil dihapus dari @BotFather!</b></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      } else if (status === "not_found") {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ Bot <b>@${botUsername}</b> tidak ditemukan di daftar BotFather</blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      } else {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ Tidak ada respon dari BotFather\nPesan terakhir: <code>${lastMsg}</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

    } catch (err) {
      await client.sendMessage(message.chat.id, {
        message: `<blockquote>❌ Terjadi kesalahan: ${err.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "q": {
  (async () => {
    try {
      const botUsername = "QuotLyBot";
      const chatId = message.chat.id;
      const replyMsg = message.replyTo ? await message.getReplyMessage() : null;
      const textInput = message.text?.split(" ").slice(1).join(" ").trim();

      if (!replyMsg && !textInput) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ Balas pesan atau ketik teks untuk dijadikan stiker</blockquote>",
          parseMode: "html",
          replyTo: message.id,
        });
      }

      const lastMsgs = await client.getMessages(botUsername, { limit: 1 });
      const lastBefore = lastMsgs[0]?.id || 0;

      if (replyMsg?.id) {
        await client.forwardMessages(botUsername, {
          messages: [replyMsg.id],
          fromPeer: chatId,
        });
      } else if (textInput) {
        await client.sendMessage(botUsername, { message: textInput });
      }

      const waitMsg = await client.sendMessage(chatId, {
        message: "<blockquote>🚀 Otw membuat stiker... tunggu sebentar!</blockquote>",
        parseMode: "html",
        replyTo: message.id,
      });

      let stickerMsg = null;
      const startTime = Date.now();

      while (Date.now() - startTime < 25000) {
        const msgs = await client.getMessages(botUsername, { limit: 5 });
        for (const msg of msgs) {
          if (
            msg.id > lastBefore &&
            msg.media?.document?.mimeType?.includes("image/webp")
          ) {
            stickerMsg = msg;
            break;
          }
        }
        if (stickerMsg) break;
        await new Promise((r) => setTimeout(r, 1500));
      }

      try {
        await client.deleteMessages(chatId, [waitMsg.id]);
      } catch {}

      if (!stickerMsg) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ Gagal mengambil hasil dari stiker</blockquote>",
          parseMode: "html",
          replyTo: message.id,
        });
      }

      await client.sendFile(chatId, {
        file: stickerMsg.media,
        replyTo: message.id,
      });

      try {
        await client.deleteMessages(botUsername, [stickerMsg.id]);
      } catch {}

    } catch (e) {
      await client.sendMessage(message.chat.id, {
        message: `<blockquote>❌ Terjadi kesalahan: ${e.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id,
      });
    }
  })();
  break;
}

case 'tohd': {
  (async () => {
    try {
      if (!message.replyTo) {
        return client.sendMessage(chatId, {
          message: `<blockquote>📸 Balas foto dengan perintah <code>${prefix}tohd</code></blockquote>`,
          parseMode: "html",
          replyTo: message.id
        });
      }

      const replyMsg = await message.getReplyMessage?.() || message.replyTo;
      if (!replyMsg) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ Tidak ada gambar yang dibalas!</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      if (!replyMsg.media || !(replyMsg.photo || replyMsg.media.photo)) {
        return client.sendMessage(chatId, {
          message: "<blockquote>❌ Pesan yang kamu reply bukan gambar!</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      const loading = await client.sendMessage(chatId, {
        message: "<blockquote>⏳ <i>Memproses foto menjadi HD...</i></blockquote>",
        parseMode: "html",
        replyTo: message.id
      });

      const buffer = await client.downloadMedia(replyMsg.media);
      const tempFile = `./temp_${Date.now()}.jpg`;
      fs.writeFileSync(tempFile, buffer);

      const fileName = Math.random().toString(36).slice(2, 10) + ".jpg";
      const { data: signed } = await axios.post("https://pxpic.com/getSignedUrl", {
        folder: "uploads",
        fileName
      });

      await axios.put(signed.presignedUrl, buffer, {
        headers: { "Content-Type": "image/jpeg" }
      });

      const imageUrl = "https://files.fotoenhancer.com/uploads/" + fileName;

      const enhance = await axios.post(
        "https://pxpic.com/callAiFunction",
        new URLSearchParams({
          imageUrl,
          targetFormat: "png",
          needCompress: "no",
          imageQuality: "100",
          compressLevel: "6",
          fileOriginalExtension: "png",
          aiFunction: "enhance",
          upscalingLevel: ""
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0",
            "accept-language": "id-ID"
          }
        }
      );

      try { await client.deleteMessages(chatId, [loading.id]); } catch {}

      if (enhance?.data?.resultImageUrl) {
        await client.sendFile(chatId, {
          file: enhance.data.resultImageUrl,
          caption: "<blockquote>🖼 <b>Foto berhasil di-HD kan</b>\n© ʙʏ ᴋɪɴɢs 👑</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      } else {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ Gagal HD kan foto</blockquote>",
          parseMode: "html",
          replyTo: message.id
        });
      }

      fs.unlinkSync(tempFile);
    } catch (err) {
      console.error("tohd error:", err);
      await client.sendMessage(chatId, {
        message: `<blockquote>⚠️ Terjadi kesalahan: ${err.message}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
    }
  })();
  break;
}

case "update": {
  (async () => {
    await updateHandler(message, client);
  })();
  break;
}
        }
    }, new NewMessage({}));
}

main();
