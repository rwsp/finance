import React, {useState} from "react";
import {Field, Form, Formik} from "formik";
// eslint-disable-next-line no-unused-vars
import {isCredit, Tx, TxDirection} from "./module";
import {Radio, RadioGroup} from "react-radio-group";

const defaultFormValues = (): Tx => ({
  date: "01-01-1990",
  party: "",
  amount: 0,
  type: "",
  subtype: "",
});

type Props = {
    balance: number;
    saveMethods: any;
};

const AddTx: React.FC<Props> = (props: Props) => {
  const [txType, setTxType] = useState(TxDirection.credit);
  const handleTxTypeChange = (value: TxDirection) => setTxType(value);

  const onSubmit = (tx: Tx) => {
    const obj: Tx = tx;
    if (isCredit(txType)) {
      obj.amount = obj.amount * -1;
    }
    props.saveMethods.tx(obj);
  };

  return (
    <>
      <span>{props.balance}</span>
      <RadioGroup selectedValue={txType} onChange={handleTxTypeChange}>
        <Radio value={TxDirection.credit} />Credit
        <Radio value={TxDirection.debit} />Debit
      </RadioGroup>
      <Formik
        initialValues={defaultFormValues()}
        onSubmit={onSubmit}>
        {  props => (
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