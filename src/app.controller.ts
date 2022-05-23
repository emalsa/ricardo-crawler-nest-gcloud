import {Body, Controller, HttpCode, Logger, Post} from '@nestjs/common';
import {AppService} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Post('/article')
  @HttpCode(200)
  async getRicardoData(@Body() postData): Promise<string> {
    let htmlData = await this.appService.getRicardoData(postData.url);
    if (htmlData == null) {
      Logger.error('no html');
      return;
    }

    let cheerio = require('cheerio');
    const $ = cheerio.load(htmlData.content.data, {xmlMode: true});
    let scriptTags = $('script');
    let jsonData = null;


    scriptTags.each((index, el,) => {
      if (postData.type === 'article' && $(el).attr('id') == '__NEXT_DATA__' && $(el).text() != null) {
        jsonData = $(el).text();
        return jsonData;
      } else if (postData.type === 'seller-articles' && $(el).text() != null) {
        if ($(el).text().startsWith('ricardo=')) {
          jsonData = $(el).text().replace('ricardo=', '');
          if (jsonData.endsWith(';') || jsonData.endsWith('<')) {
            jsonData = jsonData.slice(0, -1)
          }
          return jsonData;

        }
      }
    });

    if (jsonData == null) {
      return JSON.parse('{"nodata":"nodata"}');
    }
    return JSON.parse(jsonData);
  }
}
