import * as React from "react";
import { css } from "emotion";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import "./App.css";
import TestComponent from "./TestComponent";
import {Tx, TxType} from "./Tx/module";
import {useState} from "react";
import AddTx from "./Tx/AddTx";
import * as ReactModal from "react-modal";

/* notes
			<button type='button' onClick={() => getTxHistory().then((r: any) => console.log(r.data[1]))}>load</button>
*/

const styles = {
	txList: css`
		display: flex;
		flex-direction: column;
		border: 2px solid red;
		& > span {
			border: 1px solid lime;
		}
	`,
};

const axios = require("axios");

const getTxHistoryPromise = async () => {
	return await axios.get("http://localhost:4000/tx");
};

const postTx = async (tx: Tx) =>{
	console.log(tx);
	axios.post("http://localhost:4000/tx", tx, { headers: { "Content-Type": "application/json", } });
};


function App() {

	const [modalState, setModalState] = useState(false);
	const [txHistory, setTxHistoryState] = useState([] as Tx[]);
	const [balance, setBalance] = useState(0);
	const [nextId, setNextId] = useState(0);

	const handleResponse = (response: any) => {
		const getNextId = (history: Tx[]):number => history.reduce((maxId: Tx, currentId: Tx) => currentId.id > maxId.id ? currentId : maxId).id + 1;

		let history = [] as Tx[];
		let bal = 0;

		response.data.forEach((tx: Tx) => {
			bal = bal + tx.amount;
			history.push({...tx});
		});

		setBalance(bal);
		setTxHistoryState(history);
		setNextId(getNextId(history));
	};
	
	const saveTx = (dto: Tx) => {
		setBalance(balance + dto.amount);
		setTxHistoryState([dto, ...txHistory]);
		postTx({id: dto.id, date: dto.date, partyId: dto.partyId, amount: dto.amount, typeId: dto.typeId, subtypeId: dto.subtypeId}).then(() => true);
		setNextId(dto.id + 1);
	};
	
	//start exec
	if (!txHistory.length) {
		getTxHistoryPromise().then(handleResponse);
	}

	return (
		<>
			<button type='button' onClick={() => setModalState(true)}>open</button>
			<div className={styles.txList}>
				{balance}
				{
					txHistory.length > 0 && (
						<>
							{txHistory.map((tx: Tx) => <span key={tx.id}>{`${tx.date} ${tx.amount} ${tx.partyId} ${tx.typeId} ${tx.subtypeId}`}</span>)}
						</>
					)
				}
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
