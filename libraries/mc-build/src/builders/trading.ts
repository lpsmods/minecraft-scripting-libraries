import { TradingSchema, type OpenResourceData, type Trading } from "../schema";
import { resourceBuilder, defineResource } from "./resource";

/** Defines a trading table. */
export function defineTrading(data: Trading): Trading {
  return defineResource(data, TradingSchema);
}

/** Creates a trading table. */
export function trading(data: OpenResourceData = {}) {
  return resourceBuilder(TradingSchema, data);
}

export const tradeTable = trading;
