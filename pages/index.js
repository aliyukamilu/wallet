import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Accounts from 'web3-eth-accounts';

import { FaEthereum } from 'react-icons/fa'
import { FiCopy } from 'react-icons/fi'

import Loader from '../components/Loader';
import Tooltip from '../components/Tooltip'
import { shortenAddress } from '../utils/shortenAddress'

const tdd = 'text-sm text-[white] font-light px-6 py-4 whitespace-nowrap'

const Home = () => {

  const [balance, setBalance] = useState(0);
  const [dollarBalance, setDollarBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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
        let dollarBals = theBalance * 1580.56
        setBalance(theBalance)
        setDollarBalance(dollarBals.toFixed(2))

      }
    })
  }

  useEffect(() => {
    setUpBalance()
  }, [])



  const deploy = async () => {
    setIsLoading(true)
    console.log(
      `Attempting to make transaction from ${walletAddress} to ${addressTo}`
    );

    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        from: walletAddress,
        to: addressTo,
        value: web3.utils.toWei('0.05', 'ether'),
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
    console.log(createReceipt);
    console.log(
      `Transaction successful with hash: https://rinkeby.etherscan.io/tx/${createReceipt.transactionHash}`
    );
  }

  function sendEth() {
    deploy();
  }

  function coptToClip() {
    navigator.clipboard.writeText(walletAddress)
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 1000)
  }

  const Input = ({ placeholder, name, type, value, handleChange }) => (
    <input
      placeholder={placeholder}
      type={type}
      step="0.0001"
      value={value}
      // onChange={(e) => handleChange(e, name)}
      style={{ borderBottom: '2px solid #604EDE' }}
      className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-sm "
    />
  );

  return (
    <div className="flex min-h-screen flex-col p-2">


      <section className='bg-gradient max-w-auto rounded-xl p-5'>
        <div className='flex flex-row justify-between items-center'>

          <div className='profile flex flex-row items-center'>
            <img src='/profile.png' alt='profile' className='rounded-full h-12 w-12' />
            <p className='text-sm -mb-2'>Hello, Broski</p>
          </div>

          <div>
            <FaEthereum className='text-lg' />
          </div>
        </div>

        <div className='addressBal mt-5'>
          <div>
            <p className='text-xs text-[#cbaef7]'>Wallet Address</p>
            <div className='flex justify-between items-center'>
              <p className='text-xs font-bold'>{shortenAddress(walletAddress)}</p>
              <FiCopy onClick={coptToClip} />
            </div>

          </div>
          <div className='mt-10'>
            <p className='text-xs text-[#cbaef7]'>Wallet Balance</p>
            <p className='text-2xl font-bold'>{balance} ETH <span className='text-sm text-[#cbaef7] font-bold'>{dollarBalance} USD</span></p>

          </div>
        </div>

      </section>


      <section className='mt-5 flex flex-col justify-center'>
        <div className='py-5 mt-5 px-3 blue-glassmorphism'>
          <Input placeholder="Address To" value="0x52EdB5dFCE4640644AD366b660ee9b78872b16c3" name="addressTo" type="text" />
          <Input placeholder="Amount (ETH)" value="0.05" name="amount" type="number" />
        </div>
        <div className='mb-10'></div>
        {isLoading
          ? <Loader />
          : (
            <button type="button"
              style={{ display: isSuccess ? 'none' : 'block', }}
              className="bg-gradient2 rounded-lg px-8 py-5"
              onClick={sendEth}>Make Payment</button>
          )}
        {isSuccess && (
          <div className='mt-5'>
            <p className='text-[green] text-center'>Payment successful!</p>

            <h2 className='text-center mt-5 font-bold text-2xl'>Transaction Details</h2>
            <div className='d-flex justify-center mt-3'>
              <table className='min-w-full'>
                <tr className='border-b'>
                  <td className={tdd}>AddressTo :</td>
                  <td className={tdd}>{shortenAddress(addressTo)}</td>
                </tr>
                <tr className='border-b'>
                  <td className={tdd}>AddressFrom :</td>
                  <td className={tdd}>{shortenAddress(walletAddress)}</td>
                </tr>
                <tr className='border-b'>
                  <td className={tdd}>Amount Sent :</td>
                  <td className={tdd}>0.05</td>
                </tr>
              </table>
            </div>
          </div>
        )}

        {showTooltip && <Tooltip />}
      </section>
    </div>
  )
}

export default Home
