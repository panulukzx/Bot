const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {

  /* ---------- SLASH COMMAND ---------- */
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "ticket") {

      const embed = new EmbedBuilder()
        .setTitle("🎫 Ticket Support")
        .setDescription("กดปุ่มด้านล่างเพื่อเปิด Ticket")
        .setColor(0x00ffcc);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("open_ticket")
          .setLabel("เปิด Ticket")
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.reply({
        embeds: [embed],
        components: [row]
      });
    }
  }

  /* ---------- BUTTON ---------- */
  if (interaction.isButton()) {
    if (interaction.customId === "open_ticket") {

      const guild = interaction.guild;
      const user = interaction.user;

      const channel = await guild.channels.create({
        name: `ticket-${user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: user.id,
            allow: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: process.env.SUPPORT_ROLE_ID,
            allow: [PermissionsBitField.Flags.ViewChannel]
          }
        ]
      });

      const embed = new EmbedBuilder()
        .setTitle("📩 Ticket เปิดแล้ว")
        .setDescription(`สวัสดี <@${user.id}> กรุณารอแอดมิน`)
        .setColor(0x00ff99);

      const closeBtn = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("close_ticket")
          .setLabel("ปิด Ticket")
          .setStyle(ButtonStyle.Danger)
      );

      await channel.send({
        content: `<@&${process.env.SUPPORT_ROLE_ID}>`,
        embeds: [embed],
        components: [closeBtn]
      });

      await interaction.reply({
        content: "✅ เปิด Ticket ให้แล้ว",
        ephemeral: true
      });
    }

    if (interaction.customId === "close_ticket") {
      await interaction.channel.delete();
    }
  }
});

client.login(process.env.TOKEN);