pragma solidity ^0.6.4;
import "./ownable.sol";

contract Allownce is Ownable {
    mapping (address => uint) public allownce;
    uint public myBalance;
    event getBalance(uint _getBalance);
    event allownceChange(address indexed _who, uint indexed _oldAmount, uint indexed _newAmount);
    modifier OwnerOrAllownce(uint _amount) {
        require(owner() == msg.sender || allownce[msg.sender] >= _amount, "you are not allwed");
        _;
    }
    function determineAllownce(address _who, uint _amount) public onlyOwner{
        assert(allownce[_who] <= allownce[_who] + _amount);
        uint oldAmount = allownce[_who];
        allownce[_who] += _amount;
        emit allownceChange(_who, oldAmount, _amount);
    }
    function reduceAllownce(address _who, uint _amount) internal {
        assert(allownce[_who] > allownce[_who] - _amount);
        uint oldAmount = allownce[_who];
        allownce[_who] -= _amount;
        emit allownceChange(_who, oldAmount, _amount);
    }
    function renounceOwnership() public virtual override onlyOwner {
       revert("this does't work yet");
    }
    function reduceAllownceToZero(address _who) public onlyOwner{
        require(allownce[_who] > 0, "this address already zero");
        uint oldAmount = allownce[_who];
        allownce[_who] = 0;
        emit allownceChange(_who, oldAmount, 0);
        }
}