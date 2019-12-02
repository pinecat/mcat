# The Mention Cat (mcat)
#### by pinecat

Discord bot for mentioning all users in a voice channel.  You can add it [here](https://discordapp.com/api/oauth2/authorize?client_id=650838068118683678&permissions=134144&scope=bot).

To use the bot in Discord, use the '@' symbol, followed directly by the name of the channel.
The bot cannot account for voice channels with spaces in them, but it can string match pretty well.
So, if you have a voice channel named `The Commons`, you can mention it by doing `@commons 'whatever you want to say goes here'`.

If you are in a voice channel, you can also use `@us` to mention all the people of the voice chat you're currently in.

This bot is created with nodejs.
To run this bot yourself, create a file called 'token.json', and place your bot token in that file as follows:
```json
{
    "token": "<token>"
}
```
Then, simply run the command: `node .` in order to start the bot.

Check back for more updates :D
