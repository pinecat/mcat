/* imports */
const Discord = require('discord.js');
const fs = require('fs');

/* read token from file */
const token = fs.readFileSync('token.txt', 'utf8');

/* create discord client (i.e. the bot) */
const client = new Discord.Client();

/* log some text to the console when the bot is ready */
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

/* rules for parsing messages */
client.on('message', msg => {
  /* ignore messages from bots or from ourselves */
  if (msg.author.bot || msg.author.id === msg.client.id) {
    return;
  }

  /* get voice channels, add names/ids to vc map */
  let vc = new Map();
  msg.guild.channels.forEach(channel => {
    if (channel.type === 'voice') {
      vc.set(channel.id, channel.name);
    }
  });

  /* get msg content if begins with @ and split it to get parts */
  let parts = [];
  if (msg.content.startsWith('@')) {
    parts = msg.content.split('@');
    parts = parts[1].split(' ');
  }

  /* try and match one of the parts with one of the voice channels */
  let chan_id = '';
  vc.forEach((chan, id) => {
    let part = parts[0];
    part = part.toLowerCase();
    chan = chan.toLowerCase();
    let matches = chan.match(part);
    if (matches != null && matches[0] != '') {
      chan_id = id;
    }
  });

  /* get users from channel */
  let users = [];
  if (chan_id != '') {
    let chan = msg.guild.channels.get(chan_id);
    chan.members.forEach(member => {
      let user = member.user;
      users.push(user.id);
    });

    /* construct message */
    let send_msg = `<@${msg.author.id}> says: `;
    for (var i = 0; i < users.length; i++) {
      let id = users[i];
      if (msg.author.id !== id) {
        if (i === users.length - 1) {
          send_msg += `<@${id}> `;
        } else {
          send_msg += `<@${id}>, `;
        }
      }
    }
    for (var i = 1; i < parts.length; i++) {
      send_msg += parts[i] + ' ';
    }

    /* delete original message from user */
    msg.delete(1);

    /* send message */
    msg.channel.send(send_msg);
  }
});

/* login the bot */
client.login(token);
