require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");

// Capturar errores inesperados
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

console.log("🚀 BOT INICIANDO...");

const token = process.env.TOKEN;

// ================== CLIENTE DISCORD ==================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ================== MINI SERVIDOR WEB ==================
const app = express();
app.get("/", (req, res) => res.send("Bot activo!"));
app.listen(3000, () => console.log("Servidor web iniciado en puerto 3000"));

// ================== LOGIN ==================
client.login(token);

// ================== MINI SERVIDOR WEB ==================
const app = express();
app.get("/", (req, res) => res.send("Bot activo!"));
app.listen(3000, () => console.log("Servidor web iniciado en puerto 3000"));


// ================== PERSONAJES Y FÓRMULAS ================== 
const personajes = {
  // Las sis
  lassis: M => (M - 17.5) * 0.02 + 1,
  is: M => (M - 17.5) * 0.02 + 1,
  sis: M => (M - 17.5) * 0.02 + 1,
  lasi: M => (M - 17.5) * 0.02 + 1,

  // Tacorita bicicleta
  tacoritabicicleta: M => (M - 16.5) * 0.01 + 2,
  tb: M => (M - 16.5) * 0.01 + 2,
  taco: M => (M - 16.5) * 0.01 + 2,
  bici: M => (M - 16.5) * 0.01 + 2,

  // Nuclearo dinosauro
  nuclearodinossauro: M => (M - 15) * 0.01 + 3,
  nd: M => (M - 15) * 0.01 + 3,
  nuclear: M => (M - 15) * 0.01 + 3,
  dino: M => (M - 15) * 0.01 + 3,

  // Los bros
  losbros: M => (M - 24) * 0.01 + 3,
  lb: M => (M - 24) * 0.01 + 3,
  bros: M => (M - 24) * 0.01 + 3,
  br: M => (M - 24) * 0.01 + 3,

  // Los hotspotsitos
  loshotspositos: M => (M - 20) * 0.01 + 5,
  lhp: M => (M - 20) * 0.01 + 5,
  hots: M => (M - 20) * 0.01 + 5,
  positos: M => (M - 20) * 0.01 + 5,

  // Ketupat kepat
  ketupatkepat: M => (M - 35) * 0.01 + 4,
  kk: M => (M - 35) * 0.01 + 4,
  ketupat: M => (M - 35) * 0.01 + 4,
  kepat: M => (M - 35) * 0.01 + 4,

  // Tralaledon
  tralaledon: M => (M - 27.5) * 0.02 + 6,
  tr: M => (M - 27.5) * 0.02 + 6,
  tralale: M => (M - 27.5) * 0.02 + 6,
  tral: M => (M - 27.5) * 0.02 + 6,

  // Ketchuru and musturu
  ketchuruandmusturu: M => (M - 42.5) * 0.02 + 6.5,
  km: M => (M - 42.5) * 0.02 + 6.5,
  musturu: M => (M - 42.5) * 0.02 + 6.5,
  ketchuru: M => (M - 42.5) * 0.02 + 6.5,

  // La supreme combinasion
  lasupremecombinasion: M => (M - 40) * 0.11 + 32,
  isc: M => (M - 40) * 0.11 + 32,
  supreme: M => (M - 40) * 0.11 + 32,
  sup: M => (M - 40) * 0.11 + 32,

  // La extinct grande
  laextinctgrande: M => (M - 23.5) * 0.01 + 2,
  leg: M => (M - 23.5) * 0.01 + 2,
  extinct: M => (M - 23.5) * 0.01 + 2,
  ext: M => (M - 23.5) * 0.01 + 2,

  // Spaghetti tualetti
  spaghettitualetti: M => (M - 60) * 0.01 + 2.5,
  st: M => (M - 60) * 0.01 + 2.5,
  spaghetti: M => (M - 60) * 0.01 + 2.5,
  tua: M => (M - 60) * 0.01 + 2.5,

  // Celularcini viciosini
  celularciniviciosini: M => (M - 22.5) * 0.02 + 2.5,
  ccv: M => (M - 22.5) * 0.02 + 2.5,
  celular: M => (M - 22.5) * 0.02 + 2.5,
  vicio: M => (M - 22.5) * 0.02 + 2.5,

  // WorL
  worl: M => (M - 30) * 0.01 + 3,
  w: M => (M - 30) * 0.01 + 3,

  // Eviledon
  eviledon: M => (M - 31.5) * 0.01 + 3,
  ev: M => (M - 31.5) * 0.01 + 3,
  evil: M => (M - 31.5) * 0.01 + 3,
  edon: M => (M - 31.5) * 0.01 + 3,

  // Dragon cannelloni
  dragoncannelloni: M => (M - 250) * 0.04 + 80,
  dc: M => (M - 250) * 0.04 + 80,
  dragon: M => (M - 250) * 0.04 + 80,
  drag: M => (M - 250) * 0.04 + 80,

  // Cooki and milki
  cookiandmilki: M => (M - 155) * 0.01 + 25,
  cooki: M => (M - 155) * 0.01 + 25,
  milki: M => (M - 155) * 0.01 + 25,
  cam: M => (M - 155) * 0.01 + 25,

  // Reinito sleiguito
  reinitosleiguito: M => (M - 140) * 0.02 + 30,
  reinito: M => (M - 140) * 0.02 + 30,
  reno: M => (M - 140) * 0.02 + 30,

  // Los tacoritas
  lostacoritas: M => (M - 32) * 0.01 + 5,
  it: M => (M - 32) * 0.01 + 5,
  tacoritas: M => (M - 32) * 0.01 + 5,
  taco2: M => (M - 32) * 0.01 + 5,

  // Los primos
  losprimos: M => (M - 31) * 0.01 + 5,
  lp: M => (M - 31) * 0.01 + 5,
  primos: M => (M - 31) * 0.01 + 5,
  prim: M => (M - 31) * 0.01 + 5,

  // Tictac sahur
  tictacsahur: M => (M - 37.5) * 0.02 + 5,
  ts: M => (M - 37.5) * 0.02 + 5,
  tictac: M => (M - 37.5) * 0.02 + 5,
  sahur: M => (M - 37.5) * 0.02 + 5,

  // Garama and madundung
  garamaandmadundung: M => (M - 50) * 0.03 + 12,
  gm: M => (M - 50) * 0.03 + 12,
  garama: M => (M - 50) * 0.03 + 12,
  madundung: M => (M - 50) * 0.03 + 12,

  // Los puggies
  puggies: M => (M - 30) * 0.01 + 1.5,
  lospuggies: M => (M - 30) * 0.01 + 1.5,
  pug: M => (M - 30) * 0.01 + 1.5,

  // Money money puggy
  moneymoneypuggy: M => (M - 21) * 0.01 + 1.5,
  mmp: M => (M - 21) * 0.01 + 1.5,
  puggy: M => (M - 21) * 0.01 + 1.5,
  money: M => (M - 21) * 0.01 + 1.5,

  // La spooky grande
  laspookygrande: M => (M - 24.5) * 0.01 + 2,
  spooky: M => (M - 24.5) * 0.01 + 2,
  spook: M => (M - 24.5) * 0.01 + 2,
  spookygrande: M => (M - 24.5) * 0.01 + 2,
  isg: M => (M - 24.5) * 0.01 + 2,

  // Tang tang kelentang
  tangtangkelentang: M => (M - 33.5) * 0.02 + 3,
  ttk: M => (M - 33.5) * 0.02 + 3,
  kelentang: M => (M - 33.5) * 0.02 + 3,
  tang: M => (M - 33.5) * 0.02 + 3,

  // Chillin chili
  chillinchili: M => (M - 25) * 0.01 + 5,
  cc: M => (M - 25) * 0.01 + 5,
  chili: M => (M - 25) * 0.01 + 5,
  chill: M => (M - 25) * 0.01 + 5,

  // La secret combinasion
  lassecretcombinasion: M => (M - 125) * 0.01 + 7,
  lsec: M => (M - 125) * 0.01 + 7,
  secret: M => (M - 125) * 0.01 + 7,
  sec: M => (M - 125) * 0.01 + 7,

  // Fragrama and chocrama
  fragrama: M => (M - 100) * 0.01 + 12,
  fac: M => (M - 100) * 0.01 + 12,
  chocrama: M => (M - 100) * 0.01 + 12,
  fc: M => (M - 100) * 0.01 + 12,

  // Burguro and fryuro
  burguroandfryuro: M => (M - 150) * 0.01 + 18,
  bf: M => (M - 150) * 0.01 + 18,
  burguro: M => (M - 150) * 0.01 + 18,
  fryuro: M => (M - 150) * 0.01 + 18,

  // Strawberry elephant
  strawberryelephant: M => (M - 350) * 0.30 + 700,
  se: M => (M - 350) * 0.30 + 700,
  straw: M => (M - 350) * 0.30 + 700,
  elephant: M => (M - 350) * 0.30 + 700,

  // Los spaghettis
  spaghettis: M => (M - 70) * 0.01 + 3,
  losspaghettis: M => (M - 70) * 0.01 + 3,
  spag: M => (M - 70) * 0.01 + 3,

  // Chipso and queso
  chipsoandqueso: M => (M - 25) * 0.02 + 3.5,
  ca: M => (M - 25) * 0.02 + 3.5,
  chipso: M => (M - 25) * 0.02 + 3.5,
  queso: M => (M - 25) * 0.02 + 3.5,

  // La taco combinasion
  latacocombinasion: M => (M - 35) * 0.01 + 4,
  itc: M => (M - 35) * 0.01 + 4,
  tacocomb: M => (M - 35) * 0.01 + 4,

  // Fishino clownino
  fishinoclownino: M => (M - 15.5) * 0.01 + 10,
  fishino: M => (M - 15.5) * 0.01 + 10,
  clownino: M => (M - 15.5) * 0.01 + 10,

  // Spooky and pumpky
  spookyandpumpky: M => (M - 80) * 0.01 + 12,
  pumpky: M => (M - 80) * 0.01 + 12,
  spump: M => (M - 80) * 0.01 + 12,
  spookypump: M => (M - 80) * 0.01 + 12,
  sp: M => (M - 80) * 0.01 + 12,

  // La casa boo
  lacasa: M => (M - 100) * 0.03 + 14,
  boo: M => (M - 100) * 0.03 + 14,
  casa: M => (M - 100) * 0.03 + 14,
  icb: M => (M - 100) * 0.03 + 14,

  // Headless horseman
  headlesshorseman: M => (M - 175) * 0.25 + 460,
  headless: M => (M - 175) * 0.25 + 460,
  hh: M => (M - 175) * 0.25 + 460,
  horseman: M => (M - 175) * 0.25 + 460,
  head: M => (M - 175) * 0.25 + 460,

  // Meowl
  meowl: M => (M - 400) * 0.30 + 500,
  meow: M => (M - 400) * 0.30 + 500,
  meo: M => (M - 400) * 0.30 + 500,
  miau: M => (M - 400) * 0.30 + 500,

  // Swaggy bros
  swaggybros: M => (M - 40) * 0.01 + 3,

  // Lavadorito spinito
  lavadoritospinito: M => (M - 45) * 0.02 + 6,
  lavadorito: M => (M - 45) * 0.02 + 6,
  spinito: M => (M - 45) * 0.02 + 6,

  // La ginger sekolah
  lagingersekolah: M => (M - 75) * 0.02 + 5,
  laginger: M => (M - 75) * 0.02 + 5,
  ginger: M => (M - 75) * 0.02 + 5,

  // Festive 67
  festive67: M => (M - 67) * 0.01 + 14,
  sixseven: M => (M - 67) * 0.01 + 14,

  // Jolly jolly sahur
  jollysahur: M => (M - 45) * 0.01 + 10,
  jollyjollysahur: M => (M - 45) * 0.01 + 10,
  jjs: M => (M - 45) * 0.01 + 10,

  // Ginger gerat
  gingergerat: M => (M - 75) * 0.03 + 18,
  gerat: M => (M - 75) * 0.03 + 18,

  // Dragon Gingerini
  dragongingerini: M => (M - 300) * 0.04 + 100,
  gingerini: M => (M - 300) * 0.04 + 100
};


// ================== BOT LISTO ==================
client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// ================== MENSAJES ==================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(",")) return;

  const args = message.content.slice(1).trim().split(/\s+/);
  const comando = args.shift().toLowerCase();
// ================== COMANDO VALOR ==================
if (comando === "valor") {
  const personaje = args[0]?.toLowerCase();
  const M = parseFloat(args[1]);

  if (!personaje || isNaN(M)) {
    return message.reply(
      "❌ Uso correcto:\n" +
      "` ,valor <personaje> <M>`\n" +
      "Ejemplo: `,valor sis 25`"
    );
  }

  const formula = personajes[personaje];

  if (!formula) {
    return message.reply("❌ Ese personaje no existe.");
  }

  const resultado = formula(M);

  const embed = new EmbedBuilder()
    .setTitle("📊 Valor del personaje")
    .addFields(
      { name: "Personaje", value: personaje, inline: true },
      { name: "Valor M", value: M.toString(), inline: true },
      { name: "Resultado", value: resultado.toFixed(2) }
    )
    .setColor("Gold");

  return message.reply({ embeds: [embed] });
}
// ================== COMANDO REVENTA ==================
if (comando === "reventa") {
  const compra = parseFloat(args[0]);
  const venta = parseFloat(args[1]);

  if (isNaN(compra) || isNaN(venta)) {
    return message.reply("❌ Usa: `,reventa <compra> <venta>`");
  }

  const COMISION = 0.15;

  const comisionEldorado = venta * COMISION;
  const ventaLimpia = venta - comisionEldorado;
  const ganancia = ventaLimpia - compra;

  const estado = ganancia > 0 ? "✅ CONVIENE" : "⛔ NO CONVIENE";

  const embed = new EmbedBuilder()
    .setTitle("📊 Reventa Eldorado")
    .addFields(
      { name: "💰 Compra", value: `$${compra.toFixed(2)}`, inline: true },
      { name: "💵 Venta", value: `$${venta.toFixed(2)}`, inline: true },
      { name: "🧾 Comisión Eldorado (15%)", value: `-$${comisionEldorado.toFixed(2)}` },
      { name: "📥 Venta limpia", value: `$${ventaLimpia.toFixed(2)}` },
      { name: "📈 Ganancia real", value: `$${ganancia.toFixed(2)}` },
      { name: "📌 Resultado", value: estado }
    )
    .setColor(ganancia > 0 ? "Green" : "Red");

  return message.reply({ embeds: [embed] });
}
// ================== COMANDO ELDORADO ==================
if (comando === "eldorado") {
  const precio = parseFloat(args[0]);

  if (isNaN(precio)) {
    return message.reply("❌ Usa: `,eldorado <precio>`");
  }

  const COMISION = 0.15;
  const descuento = precio * COMISION;
  const limpio = precio - descuento;

  const embed = new EmbedBuilder()
    .setTitle("🧾 Comisión Eldorado")
    .addFields(
      { name: "💵 Precio de venta", value: `$${precio.toFixed(2)}` },
      { name: "📉 Eldorado (15%)", value: `-$${descuento.toFixed(2)}` },
      { name: "📥 Te queda limpio", value: `$${limpio.toFixed(2)}` }
    )
    .setColor("Blue");

  return message.reply({ embeds: [embed] });
}
// ================== COMANDO PROVEEDOR ==================
else if (comando === "proveedor") {
  const precioVenta = parseFloat(args[0]);
  const porcentajeVendedor = parseFloat(args[1]);

  if (
    isNaN(precioVenta) ||
    isNaN(porcentajeVendedor) ||
    ![10, 15, 20].includes(porcentajeVendedor)
  ) {
    return message.reply(
      "❌ Usa: `,proveedor <precioVenta> <porcentajeVendedor>`\n" +
      "Porcentaje del vendedor permitido: 10, 15 o 20\n" +
      "Ejemplo: `,proveedor 100 15`"
    );
  }

  const COMISION_ELDORADO = 0.15;

  // Comisión Eldorado
  const comisionEldorado = precioVenta * COMISION_ELDORADO;
  const montoLimpio = precioVenta - comisionEldorado;

  // Reparto
  const vendedorGana = montoLimpio * (porcentajeVendedor / 100);
  const proveedorGana = montoLimpio - vendedorGana;

  const embed = new EmbedBuilder()
    .setTitle("🏪 Reparto Proveedor / Vendedor")
    .addFields(
      { name: "💰 Precio de venta", value: `$${precioVenta.toFixed(2)}` },
      { name: "🧾 Comisión Eldorado (15%)", value: `-$${comisionEldorado.toFixed(2)}` },
      { name: "📥 Monto limpio", value: `$${montoLimpio.toFixed(2)}` },
      { name: "🧑‍💼 Vendedor (%)", value: `${porcentajeVendedor}%` },
      { name: "🧑‍💼 Vendedor recibe", value: `$${vendedorGana.toFixed(2)}` },
      { name: "📦 Proveedor recibe", value: `$${proveedorGana.toFixed(2)}` }
    )
    .setColor("Orange");

  return message.reply({ embeds: [embed] });
}

/*
COMANDOS DISPONIBLES:
- ,valor <personaje> <M>
- ,reventa <compra> <venta>
- ,eldorado <precio>
- ,proveedor <precio> <10|15|20>
- ,comandos
- ,c <1-100>
*/

  // ================== COMANDO PURGE ==================
  if (comando === "c") {
    const cantidad = parseInt(args[0]);

    if (isNaN(cantidad) || cantidad < 1 || cantidad > 100) {
      return message.reply("❌ Usa: `,c 1-100`");
    }

    try {
      await message.channel.bulkDelete(cantidad, true);
      const aviso = await message.channel.send(`🧹 ${cantidad} mensajes eliminados`);
      setTimeout(() => aviso.delete(), 3000);
    } catch (err) {
      console.error(err);
      message.reply("❌ No pude borrar los mensajes.");
    }
  }
});

// ================== LOGIN ==================
client.login(token);
