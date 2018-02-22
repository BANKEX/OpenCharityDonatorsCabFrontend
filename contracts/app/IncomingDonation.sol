pragma solidity ^0.4.17;

import '../OpenCharityToken.sol';

contract IncomingDonation {

    OpenCharityToken public token;

    // this field helps to identify and link fiat payment
    // with entity inside the OpenCharity
    // for example bank transaction ID
    string public realWorldIdentifier;


    // optional note. can be anything
    string public note;

    /**
     * @dev Events emitted when donation funds moved to charity event
     * @param donation address of donation
     * @param charityEvent address of target charity event
     * @param who address which initiate transaction
     * @param amount how much tokens moved
     */
    event FundsMovedToCharityEvent(address indexed donation, address indexed charityEvent, address indexed who, uint amount);



    function IncomingDonation(address _token, string _realWorldIdentifier, string _note) public {
        require(_token != address(0x0));

        token = OpenCharityToken(_token);

        realWorldIdentifier = _realWorldIdentifier;
        note = _note;
    }

    function moveToCharityEvent(address _charityEvent, uint _amount) public {
        token.transfer(_charityEvent, _amount);
    }

    // check that contract is charity event contract
    function isIncomingDonation() pure public returns (bool) {
        return true;
    }


}
