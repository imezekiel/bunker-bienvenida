require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js'); // <-- Añadido PermissionFlagsBits para seguridad

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`🤖 ¡El Diario de John está abierto! Bot conectado como ${client.user.tag}`);
});

// --- FUNCIÓN QUE CONTIENE LAS ENTRADAS DE DIARIO ALEATORIAS ---
function obtenerEntradaDiarioAleatoria(usuario, guild, channelMention) {
    const avatarUrl = usuario.displayAvatarURL({ dynamic: true, size: 256 });
    const bannerGif = 'https://i.postimg.cc/J4Pky6gZ/descarga.gif'; // Tu GIF personalizado

    // Definimos una lista con entradas más cortas y enfocadas en "bichos" específicos
    const entries = [
        // 1. Demonio de Ojos Negros
        new EmbedBuilder()
            .setColor('#701c1c') // Rojo Oscuro
            .setTitle('📖 Diario de John: Demonios')
            .setDescription(`⚠️ **¡Alerta en la entrada!**\nEl cazador ${usuario} acaba de cruzar las puertas.\n\n*«Regna terrae, cantate Deo...»* 📜\n💦 *Le tiramos agua bendita en la cara...* ¡Limpio! No viene poseído.\n\nPásate por ${channelMention} antes de que Dean arrase con la tarta. 🥧`)
            .setThumbnail(avatarUrl)
            .setImage(bannerGif),

        // 2. Cambiaformas (Shapeshifter)
        new EmbedBuilder()
            .setColor('#b8860b') // Dorado Gastado
            .setTitle('📖 Diario de John: Cambiaformas')
            .setDescription(`⚠️ **¡Inspección de piel!**\nEl cazador ${usuario} ha llegado al búnker.\n\n🗡️ *Le acercamos una hoja de plata...*\nNo hay quemaduras ni siseos. ¡Es de verdad! No es un clon.\n\nBienvenido, deja las armas y preséntate en ${channelMention}. 🥧`)
            .setThumbnail(avatarUrl)
            .setImage(bannerGif),

        // 3. Vampiros
        new EmbedBuilder()
            .setColor('#2e0854') // Morado Oscuro
            .setTitle('📖 Diario de John: Vampiros')
            .setDescription(`⚠️ **¡Revisión de colmillos!**\nEl cazador ${usuario} ha entrado al búnker.\n\n💉 *Análisis de sangre de muerto...*\nSus pupilas están normales y no tiene colmillos retráctiles. ¡Es humano!\n\nBienvenido a la red, cazador. Reportate en ${channelMention}. 🥧`)
            .setThumbnail(avatarUrl)
            .setImage(bannerGif),

        // 4. Wendigo
        new EmbedBuilder()
            .setColor('#1c3b1c') // Verde Bosque
            .setTitle('📖 Diario de John: Wendigos')
            .setDescription(`⚠️ **¡Rastreo en el bosque!**\nEl cazador ${usuario} ha escapado del bosque de Blackwater.\n\n🔥 *Le acercamos fuego por si acaso...*\nSolo viene cansado y con frío. Está a salvo de las garras del Wendigo.\n\nEntra a calentarte y preséntate en ${channelMention}. 🥧`)
            .setThumbnail(avatarUrl)
            .setImage(bannerGif),

        // 5. Djinn (Genio)
        new EmbedBuilder()
            .setColor('#008080') // Azul/Verde Azulado
            .setTitle('📖 Diario de John: Djinn')
            .setDescription(`⚠️ **¡Alerta de alucinación!**\nEl cazador ${usuario} ha sido rescatado de un nido de Djinns.\n\n🩸 *Le inyectamos sangre de muerto empapada en plata...*\n¡Despertó de la ilusión! Ya está de vuelta en el mundo real.\n\nPreséntate con la tripulación en ${channelMention} para que vean que estás bien. 🥧`)
            .setThumbnail(avatarUrl)
            .setImage(bannerGif)
    ];

    // Selecciona un número al azar entre 0 y el total de entradas que creamos
    const indiceAleatorio = Math.floor(Math.random() * entries.length);
    const embedSeleccionado = entries[indiceAleatorio];

    // Pie de página común
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
    const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
    if (!channel) return console.log("No se encontró el canal. Verifica el ID en tu .env");

    const presentationChannel = member.guild.channels.cache.find(ch => ch.name === 'el-impala-67');
    const channelMention = presentationChannel ? `${presentationChannel}` : '#el-impala-67';

    const resultado = obtenerEntradaDiarioAleatoria(member.user, member.guild, channelMention);
    
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

        const presentationChannel = message.guild.channels.cache.find(ch => ch.name === 'el-impala-67');
        const channelMention = presentationChannel ? `${presentationChannel}` : '#el-impala-67';

        const resultado = obtenerEntradaDiarioAleatoria(message.author, message.guild, channelMention);
        
        await channel.send({ 
            content: `🧪 *[SIMULACIÓN] Leyendo del diario de John...*`, 
            embeds: [resultado.embed] 
        });
        message.reply(`✅ ¡Prueba enviada! Se seleccionó al azar la **Entrada #${resultado.numeroEntrada}**.`);
    }

    // --- COMANDO 2: !clean [número] ---
    if (message.content.startsWith('!clean')) {
        // Verificar si el usuario tiene permisos para borrar mensajes
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply("⛔ No tienes los permisos necesarios (Gestionar Mensajes) para usar este comando en el búnker.");
        }

        // Dividir el mensaje para obtener el número (Ej: "!clean 10" -> "10")
        const args = message.content.split(' ');
        const cantidad = parseInt(args[1]);

        // Verificar que sea un número válido entre 1 y 99
        if (isNaN(cantidad) || cantidad < 1 || cantidad > 99) {
            return message.reply("🧹 Debes indicar cuántos mensajes borrar entre 1 y 99. Ejemplo: `!clean 10`");
        }

        try {
            // Borramos la cantidad indicada + 1 (para borrar también el comando "!clean" que escribiste)
            const mensajesBorrados = await message.channel.bulkDelete(cantidad + 1, true);
            
            // Envía un mensaje temporal avisando cuántos borró y lo elimina a los 3 segundos para no ensuciar
            const aviso = await message.channel.send(`🧹 ¡Purificación completa! Se han eliminado **${mensajesBorrados.size - 1}** mensajes del chat.`);
            setTimeout(() => aviso.delete().catch(() => null), 3000);
            
        } catch (error) {
            console.error(error);
            message.reply("❌ Ocurrió un error al intentar borrar los mensajes. Nota: Discord no permite borrar mensajes con más de 14 días de antigüedad.");
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
