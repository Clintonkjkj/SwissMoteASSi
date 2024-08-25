// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract CoinFlip {
    address public owner;

    event BetPlaced(address indexed player, uint256 amount, bool guess, bool outcome, bool win);

    constructor() {
        owner = msg.sender;
    }

    function flip(bool _guess) external payable {
        require(msg.value > 0, "You need to send some ETH");

        uint256 randomHash = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, msg.sender)));
        bool outcome = (randomHash % 2 == 0);
        
        if (_guess == outcome) {
            // Correct guess: Winner gets double their bet
            uint256 transferAmt = msg.value + msg.value * 2;
            require(address(this).balance >= transferAmt, "Contract has insufficient funds to cover the bet");
            payable(msg.sender).transfer(transferAmt);
            emit BetPlaced(msg.sender, transferAmt, _guess, outcome, true);
        } else {
            // If the guess is wrong, the contract keeps the funds
            emit BetPlaced(msg.sender, msg.value, _guess, outcome, false);
        }
    }

    // Function to withdraw contract's balance (only for the owner)
    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    // Function to get contract's balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Function to receive ETH
    receive() external payable {}
}
