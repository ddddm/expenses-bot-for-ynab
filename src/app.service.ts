import { API } from 'ynab';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private instance?: API;

  constructor(private config: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getApiInstance(): API {
    if (!this.instance) {
      const token = this.config.get('YNAB_API_KEY');
      this.instance = new API(token);
    }
    return this.instance;
  }
  async getBudgets(): Promise<string> {
    const { data } = await this.getApiInstance().budgets.getBudgets();

    return data?.budgets
      .map(budget => {
        return `${budget.name}, last used at at ${budget.last_modified_on}`;
      })
      .join('\n');
  }
}
