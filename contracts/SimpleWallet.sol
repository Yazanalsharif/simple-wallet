pragma solidity ^0.6.4;

import "./Allownce.sol";

contract SimpleWallet is Allownce {
    event sendMoney(address indexed from, address indexed _to, uint indexed _amount);
    event reciveMoney(address indexed from, address indexed _to, uint indexed _amount);
    function withdrawAllMoney(address payable _to) public {
        uint theAmount = myBalance;
        myBalance = 0;
        _to.transfer(theAmount);
    }

    function withdrawMoney(address payable _to, uint _amount) public OwnerOrAllownce(_amount) {
        require(myBalance >=  _amount, "no enogh funds in the wallet");
        assert(myBalance >= myBalance - _amount);
        myBalance -= _amount;
        if(owner() != msg.sender){
            reduceAllownce(msg.sender, _amount);
            _to.transfer(_amount);
        }else{
            _to.transfer(_amount);
        }
        emit sendMoney(msg.sender, _to, _amount);
    }
   
    receive() external  payable {
        assert(myBalance <= myBalance + msg.value);
        myBalance += msg.value;
       emit reciveMoney(msg.sender, address(this), msg.value);
    }

}

