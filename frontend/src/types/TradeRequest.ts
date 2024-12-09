export type TradeRequest = {
    _id: string
    trainer_id: string,
    friend_id: string,
    pkm_traded: number,
    pkm_received: number,
    trade_date: Date,
    trade_status: string,
};