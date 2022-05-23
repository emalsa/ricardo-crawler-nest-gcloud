import {Injectable, Logger} from '@nestjs/common';

@Injectable()
export class AppService {
    async getRicardoData(url: string) {
        Logger.debug('Start')
        const phantomJsCloud = require('phantomjscloud');
        const apiKey = 'ak-2mzd8-5fvkv-8ty2g-63qbv-fxgmd';
        const browser = new phantomJsCloud.BrowserApi(apiKey);
        return browser.requestSingle({
            url: url,
            renderType: 'html',
            suppressJson: ["meta.trace", "originalRequest", "encoding", "name",],
            requestSettings: {
                waitInterval: 0,
                doneWhen: [
                    {event: 'domReady'},
                ],
                ignoreImages: true,
                disableJavascript: true,
                resourceModifier: [
                    {type: "stylesheet", isBlacklisted: true},
                    {type: "font", isBlacklisted: true},
                    {type: "image", isBlacklisted: true},
                    ],
                }
            }, (err, response) => {
                if (err != null) {
                    throw err.response;
                }
                if (response.content == null) {
                    Logger.log('Empty response');
                    return;
                }
            if (response.statusCode != 200 || response.content.statusCode != 200) {
                Logger.log('Non 200 Status code returned');
                return;
            }

            return response.content.data;

        });
    }
}
