import React, {useState} from "react";
import {Field, Form, Formik} from "formik";
// eslint-disable-next-line no-unused-vars
import {isCredit, Tx, TxType} from "./module";
import {Radio, RadioGroup} from "react-radio-group";

const defaultFormValues = (nextId: number): Tx => ({
	id: nextId,
	date: new Date,
	partyId: 0,
	amount: -1,
	typeId: 0,
	subtypeId: 0,
});

type Props = {
    balance: number;
    nextId: number;
    saveTx: (tx: Tx) => void;
};

const AddTx: React.FC<Props> = (props: Props) => {
	const [txType, setTxType] = useState(TxType.credit);
	const handleTxTypeChange = (value: TxType) => setTxType(value);

	const onSubmit = (tx: Tx) => {
		props.saveTx(
			isCredit(txType)
				? {
					id: props.nextId,
					date: tx.date,
					partyId: tx.partyId,
					amount: tx.amount * -1,
					typeId: tx.typeId,
					subtypeId: tx.subtypeId,
				}
				: {
					id: props.nextId,
					date: tx.date,
					partyId: tx.partyId,
					amount: tx.amount,
					typeId: tx.typeId,
					subtypeId: tx.subtypeId,
				}
		);
	};

	return (
		<>
			<span>{props.balance}</span>
			<RadioGroup selectedValue={txType} onChange={handleTxTypeChange}>
				<Radio value={TxType.credit} />Credit
				<Radio value={TxType.debit} />Debit
			</RadioGroup>
			<Formik
				initialValues={defaultFormValues(props.nextId)}
				onSubmit={onSubmit}>
				{() => (
					<Form>
						<Field type="date" name="date"/>
						<Field type="input" name="party"/>
						<Field type="number" name="amount"/>
						<Field type="input" name="type"/>
						<Field type="input" name="subtype"/>
						<button type="submit">
                        Submit
						</button>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default AddTx;