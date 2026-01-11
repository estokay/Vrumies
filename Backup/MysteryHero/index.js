// --- IMPORTS ---
import { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} from "discord.js";

// --- CONFIGURATION ---
const token = "MTQyNDI5OTEyMzI4MDA1NjMzMA.GSNmL7.XjR0BBNwEOGpq6hcO6rA1VPRY_xiCT_QC4g8WQ";       // <-- put your bot token here
const clientId = "1424299123280056330";    // <-- put your client ID here

// --- HEROES ---
const heroes = {
  TANK: [
    { name: "Angela", image: "https://static.wikia.nocookie.net/marvel-rivals/images/3/3c/Angela_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250904172932" },
    { name: "Captain America", image: "https://static.wikia.nocookie.net/marvel-rivals/images/c/cc/Captain_America_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240823011847" },
    { name: "Doctor Strange", image: "https://static.wikia.nocookie.net/marvel-rivals/images/3/3b/Doctor_Strange_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819161954" },
    { name: "Emma Frost", image: "https://static.wikia.nocookie.net/marvel-rivals/images/4/43/Emma_Frost_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250830203904" },
    { name: "Groot", image: "https://static.wikia.nocookie.net/marvel-rivals/images/f/f8/Groot_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819162212" },
    { name: "Hulk", image: "https://static.wikia.nocookie.net/marvel-rivals/images/3/32/Hulk_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819162327" },
    { name: "Magneto", image: "https://static.wikia.nocookie.net/marvel-rivals/images/1/19/Magneto_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819163055" },
    { name: "Peni Parker", image: "https://static.wikia.nocookie.net/marvel-rivals/images/0/0f/Peni_Parker_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819163411" },
    { name: "The Thing", image: "https://static.wikia.nocookie.net/marvel-rivals/images/4/4e/The_Thing_HeroPortrait.png/revision/latest/scale-to-width-down/1000?cb=20250221032541" },
    { name: "Thor", image: "https://static.wikia.nocookie.net/marvel-rivals/images/7/70/Thor_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819164251" },
    { name: "Venom", image: "https://static.wikia.nocookie.net/marvel-rivals/images/0/06/Venom_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819164326" }
  ],
  DPS: [
    { name: "Black Panther", image: "https://static.wikia.nocookie.net/marvel-rivals/images/6/65/Black_Panther_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250901103332" },
    { name: "Daredevil", image: "https://static.wikia.nocookie.net/marvel-rivals/images/3/3a/Daredevil_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20251113042831" },
    { name: "Black Widow", image: "https://static.wikia.nocookie.net/marvel-rivals/images/8/8c/Black_Widow_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250901103643" },
    { name: "Blade", image: "https://static.wikia.nocookie.net/marvel-rivals/images/a/ad/Blade_Full_portrait.png/revision/latest/scale-to-width-down/1000?cb=20250830195424" },
    { name: "Hawkeye", image: "https://static.wikia.nocookie.net/marvel-rivals/images/1/13/Hawkeye_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20241122134311" },
    { name: "Hela", image: "https://static.wikia.nocookie.net/marvel-rivals/images/e/ec/Hela_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250901095333" },
    { name: "Human Torch", image: "https://static.wikia.nocookie.net/marvel-rivals/images/9/96/Human_Torch_HeroPortrait.png/revision/latest?cb=20250221031118" },
    { name: "Iron Fist", image: "https://static.wikia.nocookie.net/marvel-rivals/images/1/1c/Iron_Fist_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20241205132310" },
    { name: "Iron Man", image: "https://static.wikia.nocookie.net/marvel-rivals/images/3/34/Iron_Man_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250330010922" },
    { name: "Magik", image: "https://static.wikia.nocookie.net/marvel-rivals/images/8/8d/Magik_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819163017" },
    { name: "Mister Fantastic", image: "https://static.wikia.nocookie.net/marvel-rivals/images/2/2d/Mister_Fantastic_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250107172138" },
    { name: "Moon Knight", image: "https://static.wikia.nocookie.net/marvel-rivals/images/3/36/Moon_Knight_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20241113041358" },
    { name: "Namor", image: "https://static.wikia.nocookie.net/marvel-rivals/images/e/e8/Namor_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250116015733" },
    { name: "Phoenix", image: "https://static.wikia.nocookie.net/marvel-rivals/images/2/25/Phoenix_Full_Portrait_Hero.png/revision/latest/scale-to-width-down/1000?cb=20250830203714" },
    { name: "Psylocke", image: "https://static.wikia.nocookie.net/marvel-rivals/images/1/18/Psylocke_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20241128173406" },
    { name: "Scarlet Witch", image: "https://static.wikia.nocookie.net/marvel-rivals/images/e/e4/Scarlet_Witch_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250830174705" },
    { name: "Spider-Man", image: "https://static.wikia.nocookie.net/marvel-rivals/images/8/87/Spider-Man_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819163840" },
    { name: "Squirrel Girl", image: "https://static.wikia.nocookie.net/marvel-rivals/images/a/a6/Squirrel_Girl_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250608045154" },
    { name: "Star-Lord", image: "https://static.wikia.nocookie.net/marvel-rivals/images/9/9c/Star-Lord_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819163912" },
    { name: "Storm", image: "https://static.wikia.nocookie.net/marvel-rivals/images/6/66/Storm_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20251005061740" },
    { name: "The Punisher", image: "https://static.wikia.nocookie.net/marvel-rivals/images/8/84/The_Punisher_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819163622" },
    { name: "Winter Soldier", image: "https://static.wikia.nocookie.net/marvel-rivals/images/0/0c/Winter_Soldier_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240823011949" },
    { name: "Wolverine", image: "https://static.wikia.nocookie.net/marvel-rivals/images/c/c3/Wolverine_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250107174530" }
  ],
  HEALER: [
    { name: "Luna Snow", image: "https://static.wikia.nocookie.net/marvel-rivals/images/8/8c/Luna_Snow_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819162938" },
    { name: "Mantis", image: "https://static.wikia.nocookie.net/marvel-rivals/images/b/bf/Mantis_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819163247" },
    { name: "Adam Warlock", image: "https://static.wikia.nocookie.net/marvel-rivals/images/e/ec/Adam_Warlock_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250901100111" },
    { name: "Rocket Raccoon", image: "https://static.wikia.nocookie.net/marvel-rivals/images/b/b0/Rocket_Raccoon_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819163711" },
    { name: "Jeff the Land Shark", image: "https://static.wikia.nocookie.net/marvel-rivals/images/d/de/Jeff_the_Land_Shark_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819162642" },
    { name: "Invisible Woman", image: "https://static.wikia.nocookie.net/marvel-rivals/images/5/52/Invisible_Woman_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250107172026" },
    { name: "Cloak & Dagger", image: "https://static.wikia.nocookie.net/marvel-rivals/images/e/e2/Cloak_%26_Dagger_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20241205161921" },
    { 
      name: "Gambit", 
      image: "https://static.wikia.nocookie.net/marvel-rivals/images/2/23/Gambit_Full_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20251112002635" 
    },
    { name: "Loki", image: "https://static.wikia.nocookie.net/marvel-rivals/images/6/68/Loki_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20240819162724" },
    { name: "Ultron", image: "https://static.wikia.nocookie.net/marvel-rivals/images/0/0a/Ultron_Hero_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20250830204431" }
  ]
};

// --- INIT CLIENT ---
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// --- SLASH COMMAND ---
const commands = [
  new SlashCommandBuilder()
    .setName("mysteryhero")
    .setDescription("Pick a random Marvel Rivals hero")
].map(cmd => cmd.toJSON());

// --- REGISTER SLASH COMMAND ---
const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("⏳ Registering slash command...");
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log("✅ Slash command registered!");
  } catch (error) {
    console.error(error);
  }
})();

// --- BUTTON ROW WITH USER TAG ---
function createHeroButtons(userId) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`ANY-${userId}`)
      .setLabel("Any Hero")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`TANK-${userId}`)
      .setLabel("Tank")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`DPS-${userId}`)
      .setLabel("DPS")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(`HEALER-${userId}`)
      .setLabel("Healer")
      .setStyle(ButtonStyle.Success)
  );
}

// --- PICK RANDOM HERO ---
function getRandomHero(role) {
  let pool;
  if (role === "ANY") pool = [...heroes.TANK, ...heroes.DPS, ...heroes.HEALER];
  else pool = heroes[role];
  return pool[Math.floor(Math.random() * pool.length)];
}

// --- GET EMBED COLOR BY ROLE ---
function getEmbedColor(role) {
  switch (role) {
    case "ANY": return 0xFFFF00;
    case "TANK": return 0x800080;
    case "DPS": return 0xFF0000;
    case "HEALER": return 0xFFC0CB;
    default: return 0xFF0000;
  }
}

// --- INTERACTIONS ---
client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "mysteryhero") {
        const hero = getRandomHero("ANY");
        const embed = new EmbedBuilder()
          .setTitle(`🎲 ${interaction.user.username}'s Mystery Hero is...`)
          .setDescription(`🦸 **${hero.name}**`)
          .setImage(hero.image)
          .setColor(getEmbedColor("ANY"))
          .setFooter({ text: "Marvel Rivals Mystery Hero Generator\nCreated by LilSpicyBigMac" });

        await interaction.reply({ embeds: [embed], components: [createHeroButtons(interaction.user.id)] });
      }
    } else if (interaction.isButton()) {
      const [role, userId] = interaction.customId.split("-");
      

      const hero = getRandomHero(role);
      const embed = new EmbedBuilder()
        .setTitle(`🎲 ${interaction.user.username}'s Mystery Hero is...`)
        .setDescription(`🦸 **${hero.name}**`)
        .setImage(hero.image)
        .setColor(getEmbedColor(role))
        .setFooter({ text: "Marvel Rivals Mystery Hero Generator\nCreated by LilSpicyBigMac" });

      await interaction.channel.send({ embeds: [embed], components: [createHeroButtons(interaction.user.id)] });
      await interaction.deferUpdate();
    }
  } catch (err) {
    console.error(err);
  }
});

// --- READY ---
client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(token);
