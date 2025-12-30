require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");

// ========= Seguridad / logs =========
process.on("unhandledRejection", (err) => console.error("unhandledRejection:", err));
process.on("uncaughtException", (err) => console.error("uncaughtException:", err));

console.log("🚀 BOT INICIANDO...");

// ========= ENV =========
const token = process.env.TOKEN;
if (!token) {
    console.error("❌ TOKEN no definido en .env (TOKEN=xxxxx)");
    process.exit(1);
}

// ========= Express (UNA sola vez) =========
const app = express();
app.get("/", (req, res) => res.send("Bot activo!"));
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log("🌐 Web server en puerto", PORT));
server.on("error", (e) => console.error("Express error:", e));

// ========= Discord =========
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("error", console.error);
client.on("shardError", console.error);

// ========= Config JSON =========
const DATA_FILE = path.join(__dirname, "brainrots.json");

let config = null;
let brainrotByAlias = new Map(); // alias -> brainrot

function normalizeKey(s) {
    return String(s || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9_]/g, "");
}

function loadConfig() {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    config = JSON.parse(raw);

    brainrotByAlias = new Map();
    for (const b of config.brainrots || []) {
        const allKeys = new Set([b.id, ...(b.aliases || [])].map(normalizeKey));
        for (const k of allKeys) {
            if (!k) continue;
            // Si hay conflicto de alias, el primero gana (para no romper todo silenciosamente)
            if (!brainrotByAlias.has(k)) brainrotByAlias.set(k, b);
        }
    }
}

function saveConfig() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(config, null, 2), "utf-8");
}

function isStaff(member) {
    // Ajusta si quieres: Admin o ManageGuild
    return member?.permissions?.has(PermissionsBitField.Flags.Administrator)
        || member?.permissions?.has(PermissionsBitField.Flags.ManageGuild);
}

function makeEmbed({ title, description, color = 0x2b2d31 }) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description || null)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: "Brainrot Tools" });
}

function formulaToText(f) {
    if (!f || f.type !== "linear") return "N/A";
    // (M - base) * mult + add
    return `(M - ${f.base}) * ${f.mult} + ${f.add}`;
}

function evalLinearFormula(f, M) {
    return (M - Number(f.base)) * Number(f.mult) + Number(f.add);

}

// ========= Cargar config al inicio =========
try {
    loadConfig();
    console.log("✅ brainrots.json cargado");
} catch (e) {
    console.error("❌ No pude cargar brainrots.json:", e);
    process.exit(1);
}

// ========= Ready =========
client.once("ready", () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// ========= Comandos =========
const PREFIX = ",";

client.on("messageCreate", async (message) => {
    try {
        if (message.author.bot) return;
        if (!message.content.startsWith(PREFIX)) return;

        const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
        const comando = normalizeKey(args.shift());

        if (!comando) return;

        // ================== HELP / COMANDOS ==================
        if (comando === "comandos" || comando === "help") {
            const e = makeEmbed({
                title: "📌 Comandos",
                description:
                    "**Brainrots**\n" +
                    `• \`${PREFIX}brainrots [pagina]\` → listar brainrots\n` +
                    `• \`${PREFIX}brainrot <nombre>\` → ver detalle\n` +
                    `• \`${PREFIX}valor <nombre> <M>\` → calcular valor\n\n` +
                    "**Admin / Staff**\n" +
                    `• \`${PREFIX}brainrot set <nombre> <base> <mult> <add>\`\n` +
                    `• \`${PREFIX}brainrot alias add <nombre> <alias>\`\n` +
                    `• \`${PREFIX}brainrot alias remove <nombre> <alias>\`\n` +
                    `• \`${PREFIX}brainrot reload\` → recargar JSON\n\n` +
                    "**Eldorado**\n" +
                    `• \`${PREFIX}eldorado <precio>\`\n` +
                    `• \`${PREFIX}reventa <compra> <venta>\`\n` +
                    `• \`${PREFIX}proveedor <precioVenta> <10|15|20>\`\n\n` +
                    "**Moderación**\n" +
                    `• \`${PREFIX}c <1-100>\` → borrar mensajes (requiere Manage Messages)`,
                color: 0x5865f2,
            });

            return message.reply({ embeds: [e] });
        }

        // ================== LISTA BRAINROTS ==================
        if (comando === "brainrots") {
            const page = Math.max(1, parseInt(args[0] || "1", 10));
            const perPage = 15;

            const list = (config.brainrots || []).slice().sort((a, b) =>
                (a.displayName || a.id).localeCompare(b.displayName || b.id)
            );

            const totalPages = Math.max(1, Math.ceil(list.length / perPage));
            const safePage = Math.min(page, totalPages);
            const start = (safePage - 1) * perPage;
            const chunk = list.slice(start, start + perPage);

            const lines = chunk.map((b) => {
                const main = `**${b.displayName || b.id}**`;
                const hint = b.aliases?.length ? `\`(${b.aliases[0]})\`` : "";
                return `• ${main} ${hint}`;
            });

            const e = makeEmbed({
                title: "📚 Brainrots disponibles",
                description: lines.join("\n") || "No hay brainrots cargados.",
                color: 0xf1c40f,
            }).setFooter({ text: `Página ${safePage}/${totalPages} • Brainrot Tools` });

            return message.reply({ embeds: [e] });
        }

        // ================== VER DETALLE BRAINROT ==================
        if (comando === "brainrot") {
            const sub = normalizeKey(args[0]);

            // Staff: reload
            if (sub === "reload") {
                if (!isStaff(message.member)) {
                    return message.reply("⛔ No tienes permisos para recargar configuración.");
                }
                loadConfig();
                const e = makeEmbed({
                    title: "✅ Config recargada",
                    description: "brainrots.json se recargó correctamente.",
                    color: 0x57f287,
                });
                return message.reply({ embeds: [e] });
            }

            // Staff: set formula
            if (sub === "set") {
                if (!isStaff(message.member)) {
                    return message.reply("⛔ No tienes permisos para cambiar fórmulas.");
                }

                const key = normalizeKey(args[1]);
                const base = parseFloat(args[2]);
                const mult = parseFloat(args[3]);
                const add = parseFloat(args[4]);

                if (!key || [base, mult, add].some((n) => Number.isNaN(n))) {
                    return message.reply(
                        `❌ Uso: \`${PREFIX}brainrot set <nombre> <base> <mult> <add>\`\nEj: \`${PREFIX}brainrot set sis 17.5 0.02 1\``
                    );
                }

                const b = brainrotByAlias.get(key);
                if (!b) return message.reply("❌ No encontré ese brainrot.");

                b.formula = { type: "linear", base, mult, add };
                saveConfig();
                loadConfig();

                const e = makeEmbed({
                    title: "✅ Fórmula actualizada",
                    description:
                        `**${b.displayName || b.id}**\n` +
                        `Nueva fórmula: \`${formulaToText(b.formula)}\``,
                    color: 0x57f287,
                });

                return message.reply({ embeds: [e] });
            }

            // Staff: alias add/remove
            if (sub === "alias") {
                if (!isStaff(message.member)) {
                    return message.reply("⛔ No tienes permisos para editar aliases.");
                }

                const action = normalizeKey(args[1]); // add/remove
                const key = normalizeKey(args[2]);
                const aliasRaw = args[3];
                const alias = normalizeKey(aliasRaw);

                if (!["add", "remove"].includes(action) || !key || !alias) {
                    return message.reply(
                        `❌ Uso:\n` +
                        `• \`${PREFIX}brainrot alias add <nombre> <alias>\`\n` +
                        `• \`${PREFIX}brainrot alias remove <nombre> <alias>\``
                    );
                }

                const b = brainrotByAlias.get(key);
                if (!b) return message.reply("❌ No encontré ese brainrot.");

                b.aliases = Array.isArray(b.aliases) ? b.aliases : [];
                const set = new Set(b.aliases.map(normalizeKey));

                if (action === "add") set.add(alias);
                if (action === "remove") set.delete(alias);

                b.aliases = Array.from(set);
                saveConfig();
                loadConfig();

                const e = makeEmbed({
                    title: "✅ Aliases actualizados",
                    description:
                        `**${b.displayName || b.id}**\n` +
                        `Aliases: ${b.aliases.length ? b.aliases.map((a) => `\`${a}\``).join(", ") : "_(ninguno)_"}`
                    ,
                    color: 0x57f287,
                });

                return message.reply({ embeds: [e] });
            }

            // Normal: show brainrot info
            const key = normalizeKey(args[0]);
            if (!key) {
                return message.reply(`❌ Uso: \`${PREFIX}brainrot <nombre>\``);
            }

            const b = brainrotByAlias.get(key);
            if (!b) return message.reply("❌ No encontré ese brainrot.");

            const e = makeEmbed({
                title: `🧠 ${b.displayName || b.id}`,
                description:
                    `**ID:** \`${b.id}\`\n` +
                    `**Fórmula:** \`${formulaToText(b.formula)}\`\n` +
                    `**Aliases:** ${b.aliases?.length ? b.aliases.map((a) => `\`${a}\``).join(", ") : "_(ninguno)_"}`
                ,
                color: 0xf1c40f,
            });

            return message.reply({ embeds: [e] });
        }

        // ================== VALOR ==================
        if (comando === "valor") {
            const personaje = normalizeKey(args[0]);
            const M = parseFloat(args[1]);

            if (!personaje || Number.isNaN(M)) {
                return message.reply(
                    `❌ Uso: \`${PREFIX}valor <brainrot> <M>\`\nEj: \`${PREFIX}valor sis 25\``
                );
            }

            const b = brainrotByAlias.get(personaje);
            if (!b) return message.reply("❌ Ese brainrot no existe.");

            if (!b.formula || b.formula.type !== "linear") {
                return message.reply("❌ Este brainrot no tiene una fórmula válida.");
            }

            const resultado = evalLinearFormula(b.formula, M);

            const e = makeEmbed({
                title: "📊 Valor del brainrot",
                description: `Cálculo completado.`,
                color: 0xf1c40f,
            }).addFields(
                { name: "Brainrot", value: `**${b.displayName || b.id}** (\`${personaje}\`)`, inline: false },
                { name: "Fórmula", value: `\`${formulaToText(b.formula)}\``, inline: false },
                { name: "M", value: `\`${M}\``, inline: true },
                { name: "Resultado", value: `\`${resultado.toFixed(2)}\``, inline: true }
            );

            return message.reply({ embeds: [e] });
        }

        // ================== REVENTA ==================
        if (comando === "reventa") {
            const compra = parseFloat(args[0]);
            const venta = parseFloat(args[1]);
            if (Number.isNaN(compra) || Number.isNaN(venta)) {
                return message.reply(`❌ Uso: \`${PREFIX}reventa <compra> <venta>\``);
            }

            const COMISION = Number(config.commissionEldorado ?? 0.15);
            const comisionEldorado = venta * COMISION;
            const ventaLimpia = venta - comisionEldorado;
            const ganancia = ventaLimpia - compra;

            const estado = ganancia > 0 ? "✅ CONVIENE" : "⛔ NO CONVIENE";
            const color = ganancia > 0 ? 0x57f287 : 0xed4245;

            const e = makeEmbed({
                title: "🧾 Reventa (Eldorado)",
                description: estado,
                color,
            }).addFields(
                { name: "Compra", value: `$${compra.toFixed(2)}`, inline: true },
                { name: "Venta", value: `$${venta.toFixed(2)}`, inline: true },
                { name: "Comisión", value: `-${(COMISION * 100).toFixed(0)}%  →  -$${comisionEldorado.toFixed(2)}`, inline: false },
                { name: "Venta limpia", value: `$${ventaLimpia.toFixed(2)}`, inline: true },
                { name: "Ganancia real", value: `$${ganancia.toFixed(2)}`, inline: true }
            );

            return message.reply({ embeds: [e] });
        }

        // ================== ELDORADO ==================
        if (comando === "eldorado") {
            const precio = parseFloat(args[0]);
            if (Number.isNaN(precio)) {
                return message.reply(`❌ Uso: \`${PREFIX}eldorado <precio>\``);
            }

            const COMISION = Number(config.commissionEldorado ?? 0.15);
            const descuento = precio * COMISION;
            const limpio = precio - descuento;

            const e = makeEmbed({
                title: "💳 Comisión Eldorado",
                description: "Desglose de comisión",
                color: 0x5865f2,
            }).addFields(
                { name: "Precio de venta", value: `$${precio.toFixed(2)}`, inline: true },
                { name: "Comisión", value: `-${(COMISION * 100).toFixed(0)}%  →  -$${descuento.toFixed(2)}`, inline: true },
                { name: "Te queda limpio", value: `$${limpio.toFixed(2)}`, inline: false }
            );

            return message.reply({ embeds: [e] });
        }

        // ================== PROVEEDOR ==================
        if (comando === "proveedor") {
            const precioVenta = parseFloat(args[0]);
            const porcentajeVendedor = parseFloat(args[1]);

            if (
                Number.isNaN(precioVenta) ||
                Number.isNaN(porcentajeVendedor) ||
                ![10, 15, 20].includes(porcentajeVendedor)
            ) {
                return message.reply(
                    `❌ Uso: \`${PREFIX}proveedor <precioVenta> <10|15|20>\`\nEj: \`${PREFIX}proveedor 100 15\``
                );
            }

            const COMISION_ELDORADO = Number(config.commissionEldorado ?? 0.15);
            const comisionEldorado = precioVenta * COMISION_ELDORADO;
            const montoLimpio = precioVenta - comisionEldorado;

            const vendedorGana = montoLimpio * (porcentajeVendedor / 100);
            const proveedorGana = montoLimpio - vendedorGana;

            const e = makeEmbed({
                title: "🏪 Reparto Proveedor / Vendedor",
                description: "Cálculo de reparto con comisión Eldorado.",
                color: 0xf1c40f,
            }).addFields(
                { name: "Precio de venta", value: `$${precioVenta.toFixed(2)}`, inline: true },
                { name: "Comisión Eldorado", value: `-${(COMISION_ELDORADO * 100).toFixed(0)}% → -$${comisionEldorado.toFixed(2)}`, inline: true },
                { name: "Monto limpio", value: `$${montoLimpio.toFixed(2)}`, inline: false },
                { name: "Vendedor (%)", value: `${porcentajeVendedor}%`, inline: true },
                { name: "Vendedor recibe", value: `$${vendedorGana.toFixed(2)}`, inline: true },
                { name: "Proveedor recibe", value: `$${proveedorGana.toFixed(2)}`, inline: true }
            );

            return message.reply({ embeds: [e] });
        }

        // ================== PURGE ==================
        if (comando === "c") {
            const cantidad = parseInt(args[0], 10);
            if (Number.isNaN(cantidad) || cantidad < 1 || cantidad > 100) {
                return message.reply(`❌ Uso: \`${PREFIX}c <1-100>\``);
            }

            if (!message.member?.permissions?.has(PermissionsBitField.Flags.ManageMessages)) {
                return message.reply("⛔ Necesitas permiso **Manage Messages** para usar este comando.");
            }

            try {
                const deleted = await message.channel.bulkDelete(cantidad, true);

                const e = makeEmbed({
                    title: "🧹 Limpieza completada",
                    description: `Se eliminaron **${deleted.size}** mensajes.\n> Nota: Discord no borra mensajes de más de **14 días** con bulkDelete.`,
                    color: 0x57f287,
                });

                const aviso = await message.channel.send({ embeds: [e] });
                setTimeout(() => aviso.delete().catch(() => {}), 4000);

            } catch (err) {
                console.error(err);
                return message.reply("❌ No pude borrar mensajes (revisa permisos o mensajes muy antiguos).");
            }
        }
    } catch (err) {
        console.error("Handler error:", err);
        // Evitar que se caiga por cualquier tontería
        try { await message.reply("❌ Ocurrió un error ejecutando el comando."); } catch {}
    }
});

// ========= Login (UNA sola vez) =========
client.login(token);

// ========= Cierre limpio =========
process.on("SIGINT", () => {
    try { client.destroy(); } catch {}
    try { server.close(); } catch {}
    process.exit(0);
});
