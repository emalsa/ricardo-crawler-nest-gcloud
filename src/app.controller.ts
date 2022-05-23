import {Body, Controller, HttpCode, Logger, Post} from '@nestjs/common';
import {AppService} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Post('/article')
  @HttpCode(200)
  async getArticleData(@Body() postData): Promise<string> {
    Logger.debug(postData.url);
    let htmlData = await this.appService.getArticleData(postData.url);
    if (htmlData == null) {
      Logger.error('no html');
      return;
    }

    let cheerio = require('cheerio');
    const $ = cheerio.load(htmlData.content.data, {xmlMode: true});
    let scriptTags = $('script');
    let jsonData = null;

    scriptTags.each((index, el,) => {
      if ($(el).attr('id') == '__NEXT_DATA__' && $(el).text() != null) {
        jsonData = $(el).text();
      }
    });

    if (jsonData == null) {
      return JSON.parse('{"nodata":"nodata"}');
    }
    return JSON.parse(jsonData);

  }
}
