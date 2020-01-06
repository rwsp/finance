import React, {useState} from "react";
import {Field, Form, Formik} from "formik";
// eslint-disable-next-line no-unused-vars
import {isCredit, Tx, TxDirection} from "./module";
import {Radio, RadioGroup} from "react-radio-group";
import {TxType} from "../module";

const toDefaultFormValues = (defaultType: string, defaultSubtype: string): Tx => ({
  date: "01-01-1990",
  party: "",
  amount: 0,
  type: defaultType,
  subtype: defaultSubtype,
});

const toSubtypes = (typeList: TxType[], currentType: string) => typeList.find(t => t.name === currentType)!.subtypes;

type Props = {
    balance: number;
    saveMethods: any;
    purchaseTypeList: TxType[];
    incomeTypeList: TxType[];
};


const AddTx: React.FC<Props> = (props: Props) => {
  const [isPurchase, setIsPurchase] = useState(true);
  const [txTypes, setTxTypes] = useState(props.purchaseTypeList);

  const onSubmit = (tx: Tx) => {
    const obj: Tx = tx;
    if (isPurchase) {
      obj.amount = obj.amount * -1;
    }
    props.saveMethods.tx(obj);
  };

  const typesInit = (typeList: TxType[], setFieldValue: (field: string, value: string) => void) => {
    setTxTypes(typeList);
    setFieldValue("type", typeList[0].name);
    setFieldValue("subtype", typeList[0].subtypes[0]);
  };

  const onDirectionChange= (setFieldValue: (field: string, value: string) => void) => () => {
    const _isPurchase = !isPurchase;
    setIsPurchase(_isPurchase);
    typesInit(_isPurchase ? props.purchaseTypeList : props.incomeTypeList, setFieldValue);
  };

  const getTypeChangeMethod = (setFieldValue: (field: string, value: string) => void) => (e: any) => {
    setFieldValue("type", e.target.value);
    setFieldValue("subtype", toSubtypes(txTypes, e.target.value)[0]);
  };

  return (
    <>
      <span>{props.balance}</span>
      <Formik
        initialValues={toDefaultFormValues(txTypes[0].name, txTypes[0].subtypes[0])}
        onSubmit={onSubmit}>
        {  formikProps => (
          <Form>
            {console.log(formikProps.values)}
            <RadioGroup selectedValue={isPurchase} onChange={onDirectionChange(formikProps.setFieldValue)}>
              <Radio value={true} />Purchase
              <Radio value={false} />Income
            </RadioGroup>
            <Field type="date" name="date"/>
            <Field type="input" name="party"/>
            <Field type="number" name="amount"/>
            <select onChange={getTypeChangeMethod(formikProps.setFieldValue)}>
              {txTypes.map(t => <option value={t.name} selected={t.name === formikProps.values.type}>{t.name}</option> )}
            </select>
            <select onChange={(e: any) => formikProps.setFieldValue("subtype", e.target.value)}>
              {toSubtypes(txTypes, formikProps.values.type).map(s => <option value={s} selected={s === formikProps.values.subtype}>{s}</option>)}
            </select>
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