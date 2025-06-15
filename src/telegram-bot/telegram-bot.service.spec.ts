import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TelegramBotService } from './telegram-bot.service';

jest.mock('telegraf', () => {
  const TelegrafMock: any = jest.fn().mockImplementation(() => ({
    use: jest.fn(),
    command: jest.fn(),
    launch: jest.fn(),
    stop: jest.fn(),
  }));
  TelegrafMock.log = jest.fn();
  return { Telegraf: TelegrafMock };
});

describe('TelegramBotService', () => {
  let service: TelegramBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramBotService,
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('FAKE_TOKEN') } },
      ],
    }).compile();

    service = module.get<TelegramBotService>(TelegramBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
