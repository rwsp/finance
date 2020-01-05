export interface Tx {
    date: string;
    party: string;
    amount: number;
    type: string;
    subtype: string;
}

export enum TxDirection {
    // eslint-disable-next-line no-unused-vars
    credit = 0,
    // eslint-disable-next-line no-unused-vars
    debit = 1,
}

export const isCredit = (t: TxDirection) => t === TxDirection.credit;
export const isDebit = (t: TxDirection) => t === TxDirection.debit;

