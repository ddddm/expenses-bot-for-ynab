import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { API } from 'ynab';

describe('AppService', () => {
  let service: AppService;
  let configService: { get: jest.Mock };

  beforeEach(async () => {
    configService = { get: jest.fn().mockReturnValue('FAKE_TOKEN') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should reuse API instance', () => {
    const first: API = service.getApiInstance();
    const second: API = service.getApiInstance();

    expect(first).toBeDefined();
    expect(first).toBe(second);
    expect(configService.get).toHaveBeenCalledTimes(1);
  });
});
