import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Composer, Markup, Scenes, session, Telegraf } from 'telegraf';
import { tracePerf } from './bot-performance-middleware';
import { BotContext } from './telegram-context';

@Injectable()
export class TelegramBotService implements OnApplicationShutdown {
  private bot: Telegraf<BotContext>;
  private sceneId = 'super-wizard';

  constructor(private readonly config: ConfigService) {
    this.setupBot();
  }

  onApplicationShutdown(reason?: string) {
    this.stopBot(reason);
  }

  async setupBot() {
    this.bot = new Telegraf<BotContext>(this.config.get('BOT_TOKEN'));
    this.bot.use(Telegraf.log());
    this.bot.use(tracePerf);
    this.addStage()
    this.addCommands();
    await this.bot.launch();
  }

  stopBot(signal?: string) {
    this.bot.stop(signal);
  }

  addStage() {
    const stepHandler = new Composer<Scenes.WizardContext>();
    stepHandler.action('next', async ctx => {
      await ctx.reply('Step 2. Via inline button');
      return ctx.wizard.next();
    });
    stepHandler.command('next', async ctx => {
      await ctx.reply('Step 2. Via command');
      return ctx.wizard.next();
    });
    stepHandler.use(ctx =>
      ctx.replyWithMarkdown('Press `Next` button or type /next'),
    );

    const superWizard = new Scenes.WizardScene(
      this.sceneId,
      async ctx => {
        await ctx.reply(
          'Step 1',
          Markup.inlineKeyboard([
            Markup.button.url('❤️', 'http://telegraf.js.org'),
            Markup.button.callback('➡️ Next', 'next'),
          ]),
        );
        return ctx.wizard.next();
      },
      stepHandler,
      async ctx => {
        await ctx.reply('Step 3');
        return ctx.wizard.next();
      },
      async ctx => {
        await ctx.reply('Step 4');
        return ctx.wizard.next();
      },
      async ctx => {
        await ctx.reply('Done');
        return await ctx.scene.leave();
      },
    );
    superWizard.enter(ctx => {
      ctx.reply('welcome to the scene!')
    })

    const stage = new Scenes.Stage<Scenes.WizardContext>([superWizard,], {});

    this.bot.use(session())
    this.bot.use(stage.middleware())
    this.bot.hears('stage', async (ctx) => {
      ctx.scene.enter(this.sceneId)
    })
    this.bot.command('test', (ctx) => {
      ctx.reply('test response')
    })
  }

  addCommands() {
    this.bot.command('caption', ctx => {
      return ctx.replyWithPhoto({
        url: 'https://picsum.photos/200/300/?random',
      });
    });
  }

  getSelf() {
    return this.bot.botInfo;
  }
}
