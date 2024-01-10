

exports.make = function func(message){
    let content = message.content;
    const nl = new RegExp("\n");
    const twitter = new RegExp("https?://twitter.com/");
    const xcom = new RegExp("https?://x.com/");
    const vxtwitter = new RegExp("https?://vxtwitter.com/");
    const embedLink = new RegExp("[-_.!~*'a-zA-Z0-9;?:&=+$,%#]");
    const specialChar = new RegExp("[^-_.!~*'a-zA-Z0-9;?:&=+$,%#/]");


    if(twitter.test(content) || xcom.test(content)){
        while(specialChar.test(content)){
            content = content.replace(specialChar,"");
        }
        while(nl.test(content)){
            content = content.replace(nl,"");
        }
        while(vxtwitter.test(content)){
            content = content.replace(twitter,"xxxxxxxxxxxxvxtwitterx");
        }
        while(twitter.test(content) || xcom.test(content)){
            content = content.replace(twitter,"https://vxtwitter.com/");
            content = content.replace(xcom,"https://vxtwitter.com/");
        }

        const lines = content.split(/\r\n|\r|\n/);
        let url = [];
        for(let l of lines){
            url = url.concat(l.split(vxtwitter));
        }

        let msg = "";
        let num=1;
        let flag = true;
        for(let i=1;i<url.length;i++){
            if(embedLink.test(url[i])){
                if(flag){
                    flag = false;
                    msg += `[URL${num}](https://vxtwitter.com/${url[i]}あ${message.id}い${message.channelId}う${message.guildId}え)\n`;
                }
                else{
                    msg += `[URL${num}](https://vxtwitter.com/${url[i]})\n`;
                }
                num++;
            }
        }
        return msg;
    }
    return "";
}