import {Injectable, Logger} from '@nestjs/common';
import * as fs from "fs";


@Injectable()
export class AppService {
    async getArticleData(url: string) {
        Logger.debug('Start')

        const apiKey = 'ak-2mzd8-5fvkv-8ty2g-63qbv-fxgmd';
        const phantomJsCloud = require('phantomjscloud');
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

                // Logger.log(JSON.parse(response.content.data));
                // Logger.log(response.statusCode);
                // Logger.log(response.content.statusCode);


                fs.writeFileSync(
                    'data.html',
                    response.content.data,
                );

                return response.content.data;

                // return JSON.parse(response.content);
                // const buff = new Buffer(response.content.data, 'base64');
                // fs.writeFileSync('stack-abuse-logo-out.png', buff);
            }
        );

    }
}
