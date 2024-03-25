// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./Token.sol";

/**
 * Exchange facilitates or resposible for:
 * [X] Deposit Tokens
 * [X] Withdraw Tokens
 * [X] Check Balances
 * [X] Make Order
 * [X] Cancel Orders
 * [X] Fill Order
 * [X] Charge Fees
 * [X] Track Fee Account
 */
contract Exchange {
    address public feeAccount;
    uint256 public feePercent;

    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;
    mapping(uint256 => bool) public orderCancelled;
    mapping(uint256 => bool) public orderFilled;

    event Deposit(address token, address user, uint256 amount, uint256 balance);

    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event CancelOrder(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        address creator,
        uint256 timestamp
    );

    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }
    uint256 public orderCount;

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function depositToken(address _token, uint256 _amount) public {
        // Deposit tokens to exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));

        // Track user depsits
        tokens[_token][msg.sender] += _amount;

        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withdrawToken(address _token, uint256 _amount) public {
        require(
            balanceOf(_token, msg.sender) >= _amount,
            "Not enough balance to withdraw"
        );

        // Transfer tokens to the user
        Token(_token).transfer(msg.sender, _amount);

        // Update user balance
        tokens[_token][msg.sender] -= _amount;

        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user];
    }

    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        require(
            balanceOf(_tokenGive, msg.sender) >= _amountGive,
            "Not enough tokens to make order"
        );

        orderCount++;

        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );

        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    function cancelOrder(uint256 _id) public {
        _Order storage _order = orders[_id];

        require(
            address(_order.user) == msg.sender,
            "User not authorized to cancel the order"
        );

        require(_order.id == _id, "Order does not exist to cancel");

        orderCancelled[_id] = true;

        emit CancelOrder(
            _order.id,
            msg.sender,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp
        );
    }

    function fillOrder(uint256 _id) public {
        require(_id > 0 && _id <= orderCount, "Order does not exist");
        require(!orderFilled[_id], "Order already filled");
        require(!orderCancelled[_id], "Order already cancelled");

        _Order storage _order = orders[_id];

        _trade(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive
        );
        orderFilled[_order.id] = true;
    }

    function _trade(
        uint256 _orderId,
        address _user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) internal {
        // Fee will be paid by the user who fills the order
        uint256 _feeAmount = (_amountGet * feePercent) / 100;

        // Deduct tokenGet from the user who fills the order and add the same to the user who made the order
        tokens[_tokenGet][msg.sender] =
            tokens[_tokenGet][msg.sender] -
            (_amountGet + _feeAmount);
        tokens[_tokenGet][_user] += _amountGet;

        // Collect the fees into feeAccount
        tokens[_tokenGet][feeAccount] += _feeAmount;

        // Deduct tokenGive from the user who made the order and add the same to the user who filled the order
        tokens[_tokenGive][_user] -= _amountGive;
        tokens[_tokenGive][msg.sender] += _amountGive;

        emit Trade(
            _orderId,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            _user,
            block.timestamp
        );
    }
}
