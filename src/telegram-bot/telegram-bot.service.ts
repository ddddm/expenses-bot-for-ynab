import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf, Extra } from 'telegraf';

@Injectable()
export class TelegramBotService {
  private bot;

  constructor(private readonly config: ConfigService) {
    this.setupBot();
  }

  setupBot() {
    this.bot = new Telegraf(this.config.get('BOT_TOKEN'));
    this.bot.use(Telegraf.log());
    this.addCommands();
    this.bot.launch();
  }

  addCommands() {
    this.bot.command('caption', ctx => {
      return ctx.replyWithPhoto(
        { url: 'https://picsum.photos/200/300/?random' },
        Extra.load({ caption: 'Caption' })
          .markdown()
          .markup(m =>
            m.inlineKeyboard([
              m.callbackButton('Plain', 'plain'),
              m.callbackButton('Italic', 'italic'),
            ]),
          ),
      );
    });
  }
}
