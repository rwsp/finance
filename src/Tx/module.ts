export interface Tx {
    id: number;
    date: Date;
    partyId: number;
    amount: number;
    typeId: number;
    subtypeId: number;
}

export enum TxType {
    // eslint-disable-next-line no-unused-vars
    credit = 0,
    // eslint-disable-next-line no-unused-vars
    debit = 1,
}

export const isCredit = (t: TxType) => t === TxType.credit;
export const isDebit = (t: TxType) => t === TxType.debit;

