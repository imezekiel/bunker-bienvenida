require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// ==========================================
// 🌐 SERVIDOR WEB PARA UPTIMEROBOT (OPCIÓN 2)
// ==========================================
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('🤖 ¡El Diario de John está online y protegido!'));
app.listen(process.env.PORT || 3000, () => console.log('✅ Servidor web listo para recibir pings de UptimeRobot.'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log(`🤖 ¡El Diario de John está abierto! Bot conectado como ${client.user.tag}`);
});

// --- FUNCIÓN QUE CONTIENE LAS ENTRADAS DE DIARIO ALEATORIAS ---
function obtenerEntradaDiarioAleatoria(usuario, guild) {
    const avatarUrl = usuario.displayAvatarURL({ dynamic: true, size: 256 });
    const bannerGif = 'https://i.postimg.cc/J4Pky6gZ/descarga.gif'; // Tu GIF personalizado

    const entries = [
        // 1. Demonio de Ojos Negros
        new EmbedBuilder()
            .setColor('#701c1c') // Rojo Oscuro
            .setTitle('📖 Diario de John: Demonios')
            .setDescription(`⚠️ **¡Alerta en la entrada!**\nEl cazador ${usuario} acaba de cruzar las puertas.\n\n*«Regna terrae, cantate Deo...»* 📜\n💦 *Le tiramos agua bendita en la cara...* ¡Limpio! No viene poseído.\n\n¡Bienvenido a la red, toma asiento antes de que Dean arrase con la tarta! 🥧`)
            .setThumbnail(avatarUrl)
            .setImage(bannerGif),

        // 2. Cambiaformas (Shapeshifter)
        new EmbedBuilder()
            .setColor('#b8860b') // Dorado Gastado
            .setTitle('📖 Diario de John: Cambiaformas')
            .setDescription(`⚠️ **¡Inspección de piel!**\nEl cazador ${usuario} ha llegado al búnker.\n\n🗡️ *Le acercamos una hoja de plata...*\nNo hay quemaduras ni siseos. ¡Es de verdad! No es un clon.\n\nBienvenido, deja las armas a un lado y siéntete como en casa. 🥧`)
            .setThumbnail(avatarUrl)
            .setImage(bannerGif),

        // 3. Vampiros
        new EmbedBuilder()
            .setColor('#2e0854') // Morado Oscuro
            .setTitle('📖 Diario de John: Vampiros')
            .setDescription(`⚠️ **¡Revisión de colmillos!**\nEl cazador ${usuario} ha entrado al búnker.\n\n💉 *Análisis de sangre de muerto...*\nSus pupilas están normales y no tiene colmillos retráctiles. ¡Es humano!\n\nBienvenido a los archivos centrales de la red. Reportate con los demás cazadores. 🥧`)
            .setThumbnail(avatarUrl)
            .setImage(bannerGif),

        // 4. Wendigo
        new EmbedBuilder()
            .setColor('#1c3b1c') // Verde Bosque
            .setTitle('📖 Diario de John: Wendigos')
            .setDescription(`⚠️ **¡Rastreo en el bosque!**\nEl cazador ${usuario} ha escapado del bosque de Blackwater.\n\n🔥 *Le acercamos fuego por si acaso...*\nSolo viene cansado y con frío. Está a salvo de las garras del Wendigo.\n\nEntra a calentarte y ponte cómodo en las salas del búnker. 🥧`)
            .setThumbnail(avatarUrl)
            .setImage(bannerGif),

        // 5. Djinn (Genio)
        new EmbedBuilder()
            .setColor('#008080') // Azul/Verde Azulado
            .setTitle('📖 Diario de John: Djinn')
            .setDescription(`⚠️ **¡Alerta de alucinación!**\nEl cazador ${usuario} ha sido rescatado de un nido de Djinns.\n\n🩸 *Le inyectamos sangre de muerto empapada en plata...*\n¡Despertó de la ilusión! Ya está de vuelta en el mundo real.\n\nPreséntate con la tripulación para que vean que estás bien y a salvo. 🥧`)
            .setThumbnail(avatarUrl)
            .setImage(bannerGif)
    ];

    const indiceAleatorio = Math.floor(Math.random() * entries.length);
    const embedSeleccionado = entries[indiceAleatorio];

    embedSeleccionado.setFooter({ 
        text: `Búnker de Papoi • Miembro #${guild.memberCount}`, 
        iconURL: guild.iconURL({ dynamic: true }) 
    }).setTimestamp();

    return {
        embed: embedSeleccionado,
        numeroEntrada: indiceAleatorio + 1
    };
}

// --- EVENTO 1: Cuando entra un miembro real ---
client.on('guildMemberAdd', async (member) => {
    // 🛡️ SISTEMA DE ROL AUTOMÁTICO DE BIENVENIDA
    const ID_ROL_AUTO = '1527503923420598272';

    try {
        const rolAsignar = member.guild.roles.cache.get(ID_ROL_AUTO);
        if (rolAsignar) {
            await member.roles.add(rolAsignar);
            console.log(`✅ Rol de Iniciado asignado automáticamente a: ${member.user.tag}`);
        } else {
            console.log(`⚠️ No se pudo encontrar el rol con la ID: ${ID_ROL_AUTO} en los ajustes de Discord.`);
        }
    } catch (error) {
        console.error("❌ Error al intentar asignar el rol automático:", error.message);
    }

    // 📢 SISTEMA DE MENSAJE DE BIENVENIDA ALEATORIO
    const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
    if (!channel) return console.log("No se encontró el canal. Verifica el ID en tu .env");

    const resultado = obtenerEntradaDiarioAleatoria(member.user, member.guild);
    
    channel.send({ 
        content: `📢 **[Diario descifrado]** ¡Bienvenido, ${member}!`, 
        embeds: [resultado.embed] 
    });
});

// --- EVENTO 2: Manejo de comandos manuales ---
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // --- COMANDO 1: !probar ---
    if (message.content === '!probar') {
        const channel = message.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
        if (!channel) return message.reply("❌ No se encontró el canal de bienvenida. Revisa tu archivo .env");

        const resultado = obtenerEntradaDiarioAleatoria(message.author, message.guild);
        
        await channel.send({ 
            content: `🧪 *[SIMULACIÓN] Leyendo del diario de John...*`, 
            embeds: [resultado.embed] 
        });
        message.reply(`✅ ¡Prueba enviada! Se seleccionó al azar la **Entrada #${resultado.numeroEntrada}**.`);
    }

    // --- COMANDO EXTRA: !probar_rol (Simula asignación automática de bienvenida) ---
    if (message.content === '!probar_rol') {
        const ID_ROL_AUTO = '1527503923420598272';
        
        const tieneRol = message.member.roles.cache.has(ID_ROL_AUTO);
        if (tieneRol) {
            try {
                await message.member.roles.remove(ID_ROL_AUTO);
                await message.reply("🔄 *Tenías el rol asignado. Te lo he quitado para hacer la prueba. Vuelve a escribir `!probar_rol` para simular que entras.*");
                return;
            } catch (err) {
                return message.reply("❌ No pude remover el rol para la prueba. Revisa la jerarquía.");
            }
        }

        try {
            const rolAsignar = message.guild.roles.cache.get(ID_ROL_AUTO);
            if (!rolAsignar) {
                return message.reply(`❌ No se encontró ningún rol con la ID: \`${ID_ROL_AUTO}\` en el servidor.`);
            }

            await message.member.roles.add(rolAsignar);
            await message.reply(`✅ **¡Prueba exitosa!** El bot te ha asignado el rol **${rolAsignar.name}** correctamente.`);
        } catch (error) {
            console.error(error);
            await message.reply(`❌ **Fallo de permisos:** No pude asignarte el rol.\n*Asegúrate de que el rol de tu bot esté más arriba que el rol de prueba en los ajustes de Discord.*`);
        }
    }

    // --- COMANDO 2: !clean [número] ---
    if (message.content.startsWith('!clean')) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply("⛔ No tienes los permisos necesarios (Gestionar Mensajes) para usar este comando en el búnker.");
        }

        const args = message.content.split(' ');
        const cantidad = parseInt(args[1]);

        if (isNaN(cantidad) || cantidad < 1 || cantidad > 99) {
            return message.reply("🧹 Debes indicar cuántos mensajes borrar entre 1 y 99. Ejemplo: `!clean 10`");
        }

        try {
            const mensajesBorrados = await message.channel.bulkDelete(cantidad + 1, true);
            const aviso = await message.channel.send(`🧹 ¡Purificación completa! Se han eliminado **${mensajesBorrados.size - 1}** mensajes del chat.`);
            setTimeout(() => aviso.delete().catch(() => null), 3000);
            
        } catch (error) {
            console.error(error);
            message.reply("❌ Ocurrió un error al intentar borrar los mensajes. Nota: Discord no permite borrar mensajes con más de 14 días de antigüedad.");
        }
    }
});

client.login(process.env.DISCORD_TOKEN);