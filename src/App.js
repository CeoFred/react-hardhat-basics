import { useState } from 'react'
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'
import './App.css'

const greeterAddress =  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const tokenAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
function App() {

const [greeting, setgreeting] = useState('');

const [userAccount, setuserAccount] = useState('');
const [amount, setamount] = useState(1);



async function fetchGreeting() {
  if(typeof window.ethereum != "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)

    try {
      const data = await contract.greet();
      console.log('Data: ', data);
    } catch (err) {
      console.log(err);
    }
  } else {
    alert('Not connected to metmask');
  }
}

async function setGreeting() {
  if(!greeting) return;
  if(typeof window.ethereum != "undefined"){
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
    console.log(greeting)
    const tx = await contract.setGreeting(greeting, {gasLimit: 1000000});
    setgreeting('')
    await tx.wait();
    console.log('Transaction complete');
    fetchGreeting();
  }
}
async function getBalance() {
  if(typeof window.ethereum != "undefined"){
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts'})
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
    const balance = await contract.balanceOf(account);
    console.log(balance.toString());
  }
}

async function sendCoins(){
  if(typeof window.ethereum != "undefined"){
    await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
    const tx = await contract.transfer(userAccount,amount);
    await tx.wait();
    console.log(`${amount} Coins successfully transferred to ${userAccount}`)
  }
}


async function requestAccount(){
  await window.ethereum.request({ method: 'eth_requestAccounts'})
}
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>

        <input 
          onChange={e => setgreeting(e.target.value)}
          value={greeting}
          placeholder="Set Greeting"
          />

          <br/>

          <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>

        <input 
          onChange={e => setuserAccount(e.target.value)}
          value={userAccount}
          placeholder="Account ID"
          />

          <input 
          onChange={e => setamount(e.target.value)}
          value={amount}
          placeholder="Amount"
          />
      </header>
    </div>
  );
}

export default App;
