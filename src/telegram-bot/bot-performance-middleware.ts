import { BotContext } from "./telegram-context";

export async function tracePerf(ctx: BotContext, next: () => Promise<void>) {
    console.time(`Processing update ${ctx.update.update_id}`)
    await next()
    console.timeEnd(`Processing update ${ctx.update.update_id}`)
}