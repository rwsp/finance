import * as React from "react";
import { css } from "emotion";
import Modal from "react-modal";
import "./App.css";
// eslint-disable-next-line no-unused-vars
import { Tx } from "./Tx/module";
import {useState} from "react";
import AddTx from "./Tx/AddTx";
import {colors} from "./Tx/colors";
import {Party} from "./Party/module";
import {TxType} from "./TxType/module";
import {TxSubtype} from "./TxSubtypes/module";

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

const getTxHistoryPromise = async () => {
  return await axios.get("http://localhost:4000/tx");
};

const getPartiesPromise = async () => {
  return await axios.get("http://localhost:4000/parties");
};

const getTxTypesPromise = async () => {
  return await axios.get("http://localhost:4000/types");
};

const getTxSubtypesPromise = async () => {
  return await axios.get("http://localhost:4000/subtypes");
};

const postTx = async (tx: Tx) =>{
  console.log(tx);
  axios.post("http://localhost:4000/tx", tx, { headers: { "Content-Type": "application/json", } });
};

const toPartyString = (id: number, parties: Party[]): string => parties.find(p => p.id === id)!.name;
const toTxTypeString = (id: number, txTypes: TxType[]): string => txTypes.find(t => t.id === id)!.name;
const toTxSubtypeString = (id: number, txSubtypes: TxSubtype[]): string => txSubtypes.find(s => s.id === id)!.name;

function App() {

  const [modalState, setModalState] = useState(false);
  const [txHistory, setTxHistoryState] = useState([] as Tx[]);
  const [parties, setParties] = useState([] as Party[]);
  const [txTypes, setTxTypes] = useState([] as TxType[]);
  const [txSubtypes, setTxSubtypes] = useState([] as TxSubtype[]);
  const [isInit, setIsInit] = useState(false);
  const [balance, setBalance] = useState(0);
  const [nextId, setNextId] = useState(0);

  const handleTxResponse = (response: any) => {
    const getNextId = (history: Tx[]):number => history.reduce((maxId: Tx, currentId: Tx) => currentId.id > maxId.id ? currentId : maxId).id + 1;

    let history: Tx[] = [];
    let bal = 0;

    response.data.forEach((tx: Tx) => {
      bal = bal + tx.amount;
      history.push({...tx});
    });

    setBalance(bal);
    setTxHistoryState(history);
    setNextId(getNextId(history));
  };

  const handlePartiesResponse = (response: any) => setParties(response.data);
  const handleTypesResponse = (response: any) => setTxTypes(response.data);
  const handleSubtypesResponse = (response: any) => setTxSubtypes(response.data);

  const saveTx = (dto: Tx) => {
    setBalance(balance + dto.amount);
    setTxHistoryState([dto, ...txHistory]);
    postTx({id: dto.id, date: dto.date, partyId: dto.partyId, amount: dto.amount, typeId: dto.typeId, subtypeId: dto.subtypeId}).then(() => true);
    setNextId(dto.id + 1);
  };

  const toTxRows = () => txHistory.map( tx =>
    <span key={tx.id} className={styles.balance}>
      {`${tx.date} ${toPartyString(tx.id, parties)} $${tx.amount} ${toTxTypeString(tx.id, txTypes)} ${toTxSubtypeString(tx.id, txSubtypes)}`}
    </span>
  );

  //start exec
  if (!isInit) {
    Promise.all(    [
      getTxHistoryPromise().then(handleTxResponse),
      getPartiesPromise().then(handlePartiesResponse),
      getTxTypesPromise().then(handleTypesResponse),
      getTxSubtypesPromise().then(handleSubtypesResponse),
    ]).then(() => {
      setIsInit(true);
      console.log("init");
    });
  }

  return (
    <>
      <button type='button' onClick={() => setModalState(true)}>open</button>
      <div className={styles.txList}>
        <span className={styles.balance}>{balance}</span>
        { isInit && toTxRows() }
      </div>
      <Modal
        isOpen={modalState}
        onRequestClose={() => setModalState(false)}
        contentLabel="this is the content label"
      >
        <AddTx balance={balance} saveTx={saveTx} nextId={nextId}/>
      </Modal>
    </>
  );
}

export default App;
