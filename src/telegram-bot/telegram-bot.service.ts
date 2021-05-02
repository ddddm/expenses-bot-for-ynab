import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { tracePerf } from './bot-performance-middleware';
import { BotContext } from './telegram-context';

@Injectable()
export class TelegramBotService implements OnApplicationShutdown{
  private bot: Telegraf<BotContext>;

  constructor(private readonly config: ConfigService) {}

  onApplicationShutdown(reason?: string) {
    this.stopBot(reason);
  }

  setupBot() {
    this.bot = new Telegraf<BotContext>(this.config.get('BOT_TOKEN'));
    this.bot.use(Telegraf.log());
    this.bot.use(tracePerf)
    this.addCommands();
    this.bot.launch();
  }

  stopBot(signal?: string) {
    this.bot.stop(signal);
  }

  addCommands() {
    this.bot.command('caption', ctx => {
      return ctx.replyWithPhoto(
        { url: 'https://picsum.photos/200/300/?random' },
      );
    });
  }
}
