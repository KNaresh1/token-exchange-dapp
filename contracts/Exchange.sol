// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

/**
 * Exchange facilitates or resposible for:
 * [X] Deposit Tokens
 * [X] Withdraw Tokens
 * [X] Check Balances
 * [X] Make Order
 * [X] Cancel Orders
 * [X] fill Order
 * [X] Charge Fees
 * [X] Track Fee Account
 */
contract Exchange {
    address public feeAccount;
    uint256 public feePercent;

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }
}
