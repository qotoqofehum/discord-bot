require('dotenv').config();

const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.content === '!doxing --help') {
    const response = await axios.get('https://cekrek.heirro.dev/api/check');
      const data = response.data;

      let infoText = '';
      for (const [key, value] of Object.entries(data.info.descriptions)) {
        infoText += `${value} | ${key}\n`;
      }
    message.reply(
        `Bank | Parameter\n${infoText}\nContoh penggunaan: !doxing 1234567890 bca`
      );
    message.reply(
      'Format yang benar: !doxing [nomor rekening] [bank]\nContoh penggunaan: !doxing 2381132929 bca'
    );
  }

  if (message.content.startsWith('!doxing ')) {
    const [, accountNumber, accountBank] = message.content.split(' ');

    if (!accountNumber || !accountBank) {
      message.reply(
        'Silakan gunakan format yang benar. Ketik `!doxing --help` untuk melihat format yang benar.'
      );
      return;
    }

    try {
      const response = await axios({
        method: 'POST',
        url: 'https://cekrek.heirro.dev/api/check',
        data: `accountBank=${accountBank}&accountNumber=${accountNumber}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': 'https://cekrek.heirro.dev/',
          'Origin': 'https://cekrek.heirro.dev',
        },
      });

      const result = response.data;

      if (result.status === 200) {
        const accountName = result.data[0].accountName;
        const bankName = result.data[0].accountBank;
        const accountNumber = result.data[0].accountNumber;

        message.reply(
          `Nama rekening: ${accountName}\nBank: ${bankName}\nNomor rekening: ${accountNumber}`
        );
      } else {
        message.reply('Maaf, nomor rekening tidak ditemukan.');
      }
    } catch (error) {
      message.reply('Maaf, terjadi kesalahan saat melakukan pencarian.');
    }
  }
});

client.login(process.env.DISCORD_KEY);

const keepAlive = require('./server');
keepAlive();
