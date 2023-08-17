let channelName = "BlueEyesWhiteBoomer";
let customSize = 0;

//#region Developers Only [Do not change these values]
let fishTank = "false";
let seventv = "true"
let emoteSize = "3"
let botUser = "";
let effect = "";
let animationSpeed = 1;
let duration = 1000 * 60 * 60 * 24;

if (channelName === '') {
    alert('Channel name is missing. Set ?channel=yourTwitchChannel in the URL and reload the browser');
}

let emoteLimit = "99999999";
let seventvEmotes = '';

// Dynamically get browser window width/height and set the #container.
$(document).ready(function () {
    $('#container').css({ 'height': window.innerHeight, 'width': window.innerWidth });
});

function htmlEntities(html) {
    function it() {
        return html.map(function (n, i, arr) {

            if (n.length === 1) {
                return n.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
                    return '&#' + i.charCodeAt(0) + ';';
                });
            }

            return n;
        });
    }

    let isArray = Array.isArray(html);

    if (!isArray) {
        html = html.split('');
    }

    html = it(html);

    if (!isArray) html = html.join('');

    return html;
}

function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function formatEmotes(text, emotes) {
    let splitText = text.split('');
    for (let i in emotes) {
        let e = emotes[i];
        for (let j in e) {
            let mote = e[j];
            if (typeof mote === 'string') {
                mote = mote.split('-');
                mote = [parseInt(mote[0]), parseInt(mote[1])];
                let length = mote[1] - mote[0],
                    empty = Array.apply(null, new Array(length + 1)).map(function () {
                        return ''
                    });
                splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[0] + 1, splitText.length));
                splitText.splice(mote[0], 0, "https://static-cdn.jtvnw.net/emoticons/v2/" + i + "/default/dark/" + 3 + ".0,");
            }
        }
    }
    return htmlEntities(splitText).join('')
}

// 7TV Emotes
if (seventv === 'true') {
    // Twitch API Gateway to lookup 7tv emotes using the twitch channelName and user_id.
    $.getJSON("https://twitchapi.teklynk.com/get7tvemotes.php?channel=" + channelName, function (result) {
        seventvEmotes = result;
    });
}

function do7tvEmotes(chatMessage) {

    let seventvEmotesStr = '';

    let chatMessageArr = chatMessage.split(' ');

    chatMessageArr.forEach(function (item) {
        for (let x in seventvEmotes) {
            if (item === seventvEmotes[x]['code']) {
                seventvEmotesStr += 'https://cdn.7tv.app/emote/' + seventvEmotes[x]['id'] + '/' + 3 + 'x.webp,';
            }
        }
    });

    seventvEmotesStr = seventvEmotesStr.slice(0, -1);

    return seventvEmotesStr;

}

function fadeInOut(item) {
    item.fadeIn(2000).delay(duration).fadeOut(2000, function () {
        if (item.next().length) {
            fadeInOut(item.next());
        } else {
            fadeInOut(item.siblings(':first'));
        }
        $('.latestblock:first-child').remove();
    });
}

const client = new tmi.Client({
    options: {
        debug: true,
        skipUpdatingEmotesets: true
    },
    connection: { reconnect: true },
    channels: [channelName]
});

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {

    let username = `${tags.username}`;

    if (botUser === username) {
        doEmotes(); // bot user only
    } else if (botUser === '') {
        doEmotes(); // all users
    }

    function doEmotes() {

        let randomNumHeight = Math.floor(Math.random() * (window.innerHeight - 1 + 1)) + 1;
        let randomNumWidth = Math.floor(Math.random() * (window.innerWidth - 1 + 1)) + 1;
        let chatemotes = tags.emotes;

        // Ignore echoed messages.
        if (self) return;

        // If Twitch emotes
        let chatEmote = formatEmotes('', chatemotes, 3);

        // Create emotes array
        let chatEmoteArr = chatEmote.split(',');
        chatEmoteArr = chatEmoteArr.filter(Boolean);

        let seventvStr = do7tvEmotes(message, 3);

        // Set a limit on how many emotes can be displayed from each message
        let limitedEmoteArr = chatEmoteArr.filter((val, i) => i < parseInt(emoteLimit));

        let SevenTVEmoteArr = seventvStr.split(',');
        SevenTVEmoteArr = SevenTVEmoteArr.filter((val, i) => i < parseInt(emoteLimit));
        SevenTVEmoteArr = SevenTVEmoteArr.filter(Boolean);

        let randomEffect;
        let effectsArray = ['fade', 'grow', 'rotate', 'skew'];

        if (effect === 'random') {
            randomEffect = effectsArray[Math.floor(Math.random() * effectsArray.length)];
        }

        //Regular Emotes
        if (limitedEmoteArr.length !== 0) {
            //Clear previous emotes
            $("#container").empty();

            $.each(limitedEmoteArr, function (key, value) {
                if (value > "" || value !== null) {

                    // randomize location
                    $("<div class='latestblock'><img src='" + value + "' /></div>").appendTo("#container").css({
                        top: randomNumHeight + 'px',
                        left: randomNumWidth + 'px'
                    });

                    if (effect) {
                        if (effect === 'random') {
                            console.log(randomEffect);
                            $('.latestblock img:first-child').addClass(randomEffect);
                        } else {
                            $('.latestblock img:first-child').addClass(effect);
                        }
                    }

                    if (fishTank === 'false' || fishTank === '' || !fishTank) {
                        fadeInOut($('.latestblock img:first-child'));
                    } else {
                        $('.latestblock img').fadeIn(animationSpeed);
                    }

                }
            });

            /*
            //Only Save last emote
            var save = $('#container :last-child :last-child').detach();
            $('#container').empty().append(save);
            */
        }

        // SevenTV Emotes
        if (SevenTVEmoteArr.length !== 0) {
            //Clear previous emotes
            $("#container").empty();

            $.each(SevenTVEmoteArr, function (key, value) {
                if (value > "" || value !== null) {

                    // randomize location
                    $("<div class='latestblock'><img src='" + value + "' /></div>").appendTo("#container").css({
                        top: randomNumHeight + 'px',
                        left: randomNumWidth + 'px'
                    });

                    if (effect) {
                        $('.latestblock img:first-child').addClass(effect);
                    }

                    if (fishTank === 'false' || fishTank === '' || !fishTank) {
                        fadeInOut($('.latestblock img:first-child'));
                    } else {
                        $('.latestblock img').fadeIn(animationSpeed);
                    }

                }
            });

            /*
            //Only Save last emote
            var save = $('#container :last-child :last-child').detach();
            $('#container').empty().append(save);
            */
        }

        //do this after dom latestblock have been created
        if (customSize > 0) {
            $(".latestblock, .latestblock img").css({
                'max-width': customSize + 'px',
                'max-height': customSize + 'px',
                'width': customSize + 'px',
                'height': customSize + 'px'
            });
        }

        function moveRandom(obj) {
            /* get container position and size
             * -- access method : cPos.top and cPos.left */
            let cPos = $('#container').offset();
            let cHeight = $('#container').height();
            let cWidth = $('#container').width();

            // get box padding (assume all padding have same value)
            let pad = parseInt($('#container').css('padding-top').replace('px', ''));

            // get movable box size
            let bHeight = obj.height();
            let bWidth = obj.width();

            // set maximum position
            maxY = cPos.top + cHeight - bHeight - pad;
            maxX = cPos.left + cWidth - bWidth - pad;

            // set minimum position
            minY = cPos.top + pad;
            minX = cPos.left + pad;

            obj.animate({
                top: 0,
                left: 0
            }, animationSpeed, function () {
                moveRandom(obj);
            });
        }

        $('.latestblock').each(function () {
            moveRandom($(this));
        });
    }

});
//#endregion