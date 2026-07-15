import { Infer } from "superstruct";
import { OpenObjectSchema } from "./resource";

/** Open schema for a trading table. */
export const TradingSchema = OpenObjectSchema;
export const TradeTableSchema = TradingSchema;

export type Trading = Infer<typeof TradingSchema>;
export type TradeTable = Trading;
