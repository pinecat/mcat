/********************************************************************
* Name: The Mention Cat (mcat)
* Desc: Discord bot for mentioning all users in a voice channel.
*       Currently, this is not a native feature in Discord.
* Auth: pinecat (Rory)
********************************************************************/

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
  if (msg.author.bot || msg.author.id === msg.client.id) {  // if the author is a bot, or this bot is the author....
    return;                                                 // ...ignore the message
  }

  /* get voice channels, add names/ids to vc map */
  let vc = new Map();                     // create map to hold voice channels in the guild  
  msg.guild.channels.forEach(channel => { // loop through all channels in the guild
    if (channel.type === 'voice') {       // if the channel type is 'voice'...
      vc.set(channel.id, channel.name);   // ...then add the name and id to the map
    }
  });

  /* get msg content if begins with @ and split it to get parts */
  let parts = [];                     // create array to store the parts of the message content after split
  if (msg.content.startsWith('@')) {  // only care about message that start with '@'
    parts = msg.content.split('@');   // split on the '@' to get rid of it
    parts = parts[1].split(' ');      // then split on spaces (' ') to parse channel name
    /*
      note:
        right now, we are only parsing channel name from the
        very first string in the command (i.e. whatever string
        is next to the '@' symbol)
    */
    
    /* try and match one of the parts with one of the voice channels */
    let chan_id = '';                             // variable to store the channel id, if we find one that matches
    vc.forEach((chan, id) => {                    // loop through each key/value pair in the voice channel map
      let part = parts[0];                        // get the channel name from the user command we are trying to look for
      part = part.toLowerCase();                  // ignore case
      chan = chan.toLowerCase();                  // ignore case
      let matches = chan.match(part);             // try and match strings on the queried channel name with the channel names in the server
      if (matches != null && matches[0] != '') {  // if matches is not null and the first value in matches is not the empty string...
        chan_id = id;                             // ...then store the id in chan_id
        break;                                    // and break out of the loop
      }
    });

    /* get users from channel */
    let users = [];                               // array to store users in the from the voice channel
    if (chan_id != '') {                          // if we found a channel id in the above step, the continue, otherwise none of these steps are necessary
      let chan = msg.guild.channels.get(chan_id); // get the channel object using chan_id
      chan.members.forEach(member => {            // loop through members in the channel
        let user = member.user;                   // get user object from member
        users.push(user.id);                      // push the user id onto the array
      });

      /* construct message */
      let send_msg = `<@${msg.author.id}> says: `;  // credit original author of the message
      for (var i = 0; i < users.length; i++) {      // loop through users array
        let id = users[i];                          // get id of the user from the array at i
        if (msg.author.id !== id) {                 // if the author is in the channel, do not need to mention them a 2nd time
          if (i === users.length - 1) {             // if we are at the last id in the array...
            send_msg += `<@${id}> `;                // ...don't add a comma
          } else {                                  // otherwise...
            send_msg += `<@${id}>, `;               // ...add a comma in between names
          }
        }
      }
      for (var i = 1; i < parts.length; i++) {      // loop through the rest of the original message content
        send_msg += parts[i] + ' ';                 // append it to the message
      }

      /* delete original message from user */
      msg.delete(1);

      /* send message */
      msg.channel.send(send_msg);
    }
  }
});

/* login the bot */
client.login(token);
