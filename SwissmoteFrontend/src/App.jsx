import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Snackbar from "./Snackbar";
import "./App.css";

// Replace with your contract address and ABI
const contractAddress = "0xDec825b4AFF516e103eA8b0aaAf0d366A5CC0a4C";
const contractABI = [
  "function flip(bool _guess) external payable",
  "event BetPlaced(address indexed player, uint256 amount, bool guess, bool outcome, bool win)",
];

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [amount, setAmount] = useState("");
  const [guess, setGuess] = useState(true);
  const [balance, setBalance] = useState(0);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [latestEvent, setLatestEvent] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const initialize = async () => {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        setProvider(provider);

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        const signer = await provider.getSigner();
        setSigner(signer);

        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(contractInstance);

        const balanceEther = await provider.getBalance(accounts[0]);
        const balanceFinal = ethers.formatEther(balanceEther);
        setBalance(parseFloat(balanceFinal).toFixed(3));

        // Listen for the latest BetPlaced event
        contractInstance.on(
          "BetPlaced",
          (player, amount, guess, outcome, win) => {
            const event = {
              player,
              amount: ethers.formatEther(amount),
              guess,
              outcome,
              win,
            };
            setLatestEvent(event);
          }
        );
      } else {
        snackMsg("Please install MetaMask to use this app.", 10000);
      }
    };

    initialize();

    // Cleanup the event listener on component unmount
    return () => {
      if (contract) {
        contract.removeAllListeners("BetPlaced");
      }
    };
  }, [contract]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        snackMsg(
          "MetaMask is not installed. Please install it to use this app.",
          10000
        );
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);

      const provider = new ethers.BrowserProvider(ethereum);
      setProvider(provider);

      const signer = await provider.getSigner();
      setSigner(signer);

      const balanceEther = await provider.getBalance(accounts[0]);
      const balanceFinal = ethers.formatEther(balanceEther);
      setBalance(parseFloat(balanceFinal).toFixed(3));
    } catch (error) {
      console.error("Error connecting wallet:", error);
      snackMsg("Failed to connect wallet. Please try again.", 10000);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false); // Hide the snackbar
  };

  const snackMsg = (msg, time) => {
    setSnackbarMessage(msg);
    setShowSnackbar(true);

    setTimeout(() => {
      setShowSnackbar(false);
    }, time);
  };

  const flipCoin = async () => {
    if (amount < 0.001) {
      snackMsg("Please enter Amount greater than 0.001", 10000);
    } else if (contract && signer) {
      setFlipped(true);
      try {
        const amountInWei = ethers.parseUnits(amount, "ether");
        console.log("Bet Amount (in Wei):", amountInWei.toString());
        console.log("Guess (true for heads, false for tails):", guess);

        const tx = await contract.flip(guess, {
          value: amountInWei,
        });

        await tx.wait();
        const updatedBalance = await provider.getBalance(account);
        const updatedBalanceEther = ethers.formatEther(updatedBalance);
        setBalance(parseFloat(updatedBalanceEther).toFixed(3));

        setResult(true);
        setTimeout(() => {
          setResult(false);
          setFlipped(false);
        }, 4000);
      } catch (error) {
        setFlipped(false);

        snackMsg(`Transaction failed: ${error.reason}`, 4000);
      }
    } else {
      setFlipped(false);
      snackMsg("Contract or signer is not defined!", 10000);
    }
  };

  return (
    <div className="container">
      {showSnackbar && (
        <Snackbar
          message={snackbarMessage}
          show={showSnackbar}
          onClose={handleCloseSnackbar}
        />
      )}
      <div className="header">
        <div>
          <img src="/etherium_logo.jpeg" alt="Ethereum Logo" />
          <div className="heading">Welcome to Coinflip Game</div>
        </div>
        <button className="connect" onClick={connectWallet}>
          {account ? "Wallet Connected" : "Connect Wallet"}
        </button>
      </div>
      {account ? (
        <div className="dashboard">
          <div className="Balance">
            <img src="/ethereum-gif-58.jpg" alt="Ethereum GIF" />
            <div>Balance: {balance} ETH</div>
          </div>
          {flipped ? (
            result ? (
              <div className="result">
                {latestEvent &&
                  (latestEvent.win ? (
                    <div className="flipper">
                      <img src="/win.jpg" alt="You Won" />
                    </div>
                  ) : (
                    <div className="flipper">
                      <img src="/lose.jpg" alt="You Lost" />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flipper">
                <img src="/flipper.gif" alt="Flipping Coin" />
                <div>
                  <p>
                    Please wait while your transaction is being processed.
                    <br />
                    Kindly approve the request in your wallet.
                  </p>
                </div>
              </div>
            )
          ) : (
            <>
              <div className="Bet">
                <input
                  className="betAmt"
                  type="text"
                  placeholder="Enter your bet Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <br />
                <div>Select head or tail by clicking the coin below</div>
                <div className="chooseCoin">
                  <label className="choose">
                    <input
                      type="radio"
                      checked={guess}
                      onChange={() => setGuess(true)}
                    />
                    <img src="/head.jpg" alt="Heads" />
                    <span>Heads</span>
                  </label>
                  <label className="choose">
                    <input
                      type="radio"
                      checked={!guess}
                      onChange={() => setGuess(false)}
                    />
                    <img src="/tail.jpg" alt="Tails" />
                    <span>Tails</span>
                  </label>
                </div>

                <br />
                <button className="flip" onClick={flipCoin}>
                  Flip Coin
                </button>
              </div>
              <div className="lastBet">
                <h4>Last Flip</h4>
                {latestEvent && (
                  <div>
                    <p>
                      <strong>Amount:</strong> {latestEvent.amount} ETH
                    </p>
                    <p>
                      <strong>Guess:</strong>{" "}
                      {latestEvent.guess ? "Heads" : "Tails"}
                    </p>
                    <p>
                      <strong>Outcome:</strong>{" "}
                      {latestEvent.outcome ? "Heads" : "Tails"}
                    </p>
                    <p
                      className={latestEvent.win ? "result-win" : "result-lose"}
                    >
                      <strong>Result:</strong>{" "}
                      {latestEvent.win ? "You Won" : "You Lost"}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="dashboard_connect">
          <h4 className="pleaseConnect">
            Wallet not connected Please click the Connect wallet button to send
            the request and approve the request on wallet
          </h4>
          <button
            className="connect"
            onClick={() =>
              window.ethereum.request({ method: "eth_requestAccounts" })
            }
          >
            {account ? "Wallet Connected" : "Connect Wallet"}
          </button>
        </div>
      )}
      <div className="note">
        <h6 className="noteHeader" style={{}}>
          Note
        </h6>
        <p className="notepara">
          In the event of insufficient balance in the contract, please try with
          a minimum amount. If the transaction fails, consider selecting the
          other side of the coin and attempt the transaction again.
        </p>
      </div>
    </div>
  );
}

export default App;
