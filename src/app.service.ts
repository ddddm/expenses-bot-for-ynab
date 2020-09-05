import { API } from 'ynab';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private instance: API;

  constructor(private config: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getApiInstnace(): API {
    const token = this.config.get('YNAB_API_KEY');
    return this.instance || new API(token);
  }
  async getBudgets(): Promise<string> {
    const { data } = await this.getApiInstnace().budgets.getBudgets();

    return data?.budgets
      .map(budget => {
        return `${budget.name}, last used at at ${budget.last_modified_on}`;
      })
      .join('\n');
  }
}
