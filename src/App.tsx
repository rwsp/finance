import * as React from "react";
import { css } from "emotion";
import Modal from "react-modal";
import "./App.css";
// eslint-disable-next-line no-unused-vars
import { Tx } from "./Tx/module";
import {useState} from "react";
import AddTx from "./Tx/AddTx";
import {colors} from "./Tx/colors";
import {modalStyle} from "./styles";
import {TxType} from "./module";

/* notes
			<button type='button' onClick={() => getTxHistory().then((r: any) => console.log(r.data[1]))}>load</button>
*/

const styles = {
  txList: css`
		display: flex;
		flex-direction: column;
		background-color: ${colors.dark};
	`,
  balance: css`
    color: white;
  `,
  tx: css`
    background-color: ${colors.light};
    color: white;
    margin: 10px 0 0 10px;
  `,
};

const axios = require("axios");

const getTxListPromise = async () => {
  return await axios.get("http://localhost:4000/tx");
};

const getTypeListPromise = async () => {
  return await axios.get("http://localhost:4000/types");
};

const postTx = async (tx: Tx) =>{
  console.log(tx);
  axios.post("http://localhost:4000/tx", tx, { headers: { "Content-Type": "application/json", } });
};

function App() {

  const [modalState, setModalState] = useState(false);
  const [txList, setTxList] = useState([] as Tx[]);
  const [partyList, setPartyList] = useState([] as string[]);
  const [incomeTypeList, setIncomeTypeList] = useState([] as TxType[]);
  const [purchaseTypeList, setPurchaseTypeList] = useState([] as TxType[]);
  const [isInit, setIsInit] = useState(false);
  const [balance, setBalance] = useState(0);

  const refreshState = (_txList: Tx[]) => {
    const _partyList: string[] = [];
    let _balance = 0;

    _txList.forEach(tx => {
      if (!_partyList.includes(tx.party)) _partyList.push(tx.party);
      _balance += tx.amount;
    });
    setBalance(_balance);
    setTxList(_txList);
    setPartyList(_partyList);
  };

  const handleTxResponse = (response: any) => {
    const _txList: Tx[] = [];

    response.data.forEach((tx: Tx) => {_txList.push({...tx});});

    refreshState(_txList);
  };

  const handleTypeResponse = (response: any) => {
    const purchaseTypes: TxType[] = [];
    const incomeTypes: TxType[] = [];

    response.data.purchase.forEach((t: TxType) => purchaseTypes.push(t));
    setPurchaseTypeList(purchaseTypes);
    response.data.income.forEach((t: TxType) => incomeTypes.push(t));
    setIncomeTypeList(incomeTypes);
  };

  const saveMethods = {
    tx: (dto: Tx) => {
      setBalance(balance + dto.amount);
      refreshState([dto, ...txList]);
      postTx({date: dto.date, party: dto.party, amount: dto.amount, type: dto.type, subtype: dto.subtype})
        .then(() => true);
    },
  };

  const toTxRows = () => txList.map( tx =>
    <span className={styles.balance}>
      {`${tx.date} ${tx.party} $ ${tx.amount} ${tx.type} ${tx.subtype}`}
    </span>
  );

  //start exec
  if (!isInit) {
    Promise.all(    [
      getTxListPromise().then(handleTxResponse),
      getTypeListPromise().then(handleTypeResponse),
    ]).then(() => {
      setIsInit(true);
      console.log("init");
    });
  }

  return (
    <>
      <button type='button' onClick={() => setModalState(true)}>open</button>
      <span className={styles.balance}>$ {balance}</span>
      { isInit && (
        <div className={styles.txList}>
          {toTxRows()}
        </div>
      )}
      <Modal
        style={modalStyle.modal}
        isOpen={modalState}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={false}
        onRequestClose={() => setModalState(false)}
        contentLabel="this is the content label"
      >
        <AddTx balance={balance} saveMethods={saveMethods} incomeTypeList={incomeTypeList} purchaseTypeList={purchaseTypeList}/>
      </Modal>
    </>
  );
}

export default App;
