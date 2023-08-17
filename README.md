# Twitch + 7TV Emote Showcase

## What is this?
Based on [https://github.com/teklynk/twitch_chat_emotes](https://github.com/teklynk/twitch_chat_emotes) this is a much simpler version 
that allows you to showcase emotes in rotation (one at a time). I have removed BTTV and FFZ because most people use 7tv exclusively because
of their generous emote limits, or lack thereof

This is a much dumbed-down version, no URL parameters needed. No webserver needed. Simply follow the setup below.

# Setup (7 Steps):
1. Download the files to your computer
2. Extract the folder in the zip to anywhere on your computer
3. Add a new browser source and check "Local File"
4. Find bot.html on your computer that you downloaded and select it
5. Modify the CSS by adding this to the CSS section in your OBS browser source.
```
#container {
    width: 1920px;
    height: 1080px;
    padding: 0;
    margin: 0;
}

.latestblock,
.latestblock img {
    max-width: 112px;
    max-height: 112px;
    min-width: 28px;
    min-height: 28px;
}
```
6. Find bot.js in your files and change the channel name of BlueEyesWhiteBoomer to your channel name and save
7. Optionally, if you want a custom emote size change the 0 to the pixel size you want and save

If you have any questions feel free to add comments. Thanks for looking :)