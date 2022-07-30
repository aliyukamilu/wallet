import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Accounts from 'web3-eth-accounts';

import Loader from '../components/Loader';

const Home = () => {

  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const testnet = "https://rinkeby.infura.io/v3/f3b0a7c03b7e47289cc277ed0d60579d"
  var web3 = new Web3(testnet);

  // var account = new Accounts(testnet);

  const walletAddress = '0xc25e27911b334C6B854cC66DE4d7276A80881288';
  const privKey = '609cf9dd85af6380b683166c6d6448b79be6b36c25006f73f4a9c74688bdf676';
  const addressTo = '0x52EdB5dFCE4640644AD366b660ee9b78872b16c3'

  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(testnet));
  }

  function setUpBalance() {
    web3.eth.getBalance(walletAddress, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        let theBalance = parseFloat(web3.utils.fromWei(result, 'ether')).toFixed(4);
        setBalance(theBalance)
      }
    })
  }

  useEffect(() => {
    setUpBalance()
  }, [])



  // Create transaction
  const deploy = async () => {
    setIsLoading(true)
    console.log(
      `Attempting to make transaction from ${walletAddress} to ${addressTo}`
    );

    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        from: walletAddress,
        to: addressTo,
        value: web3.utils.toWei('0.0005', 'ether'),
        gas: '21000',
      },
      privKey
    );

    // Deploy transaction
    const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
    );
    setUpBalance()
    setIsLoading(false)
    setSuccess(true)
    console.log(
      `Transaction successful with hash: https://rinkeby.etherscan.io/tx/${createReceipt.transactionHash}`
    );
  }

  function sendEth() {
    deploy();
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <p>{walletAddress} </p>
        <p>{balance} ETH</p>
        {isLoading
          ? <Loader />
          : (
            <button type="button" style={{display: isSuccess ? 'none' : 'block',}} className="btnEth" onClick={sendEth}>Send 0.002 Eth </button>
          )}
        {isSuccess && <p className='text-[green]'>Success!</p>}
      </main>

    </div>
  )
}

export default Home
