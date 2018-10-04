pragma solidity ^0.4.24;

contract DrugOn {

    struct Doctor {
        uint creationDate;
        address owner;          // address of the account who created the user
        string[] prescriptions;
    }

    struct Patient {
        uint creationDate;
        address owner;
    }

    mapping (bytes32 => Doctor) public medics;
    mapping (bytes32 => Patient) public patients;
    mapping (address => bytes32) public owners;

    event NewPrescription(
        bytes32 indexed _from,
        bytes32 indexed _to,
        string prescription,
        uint expiringtime,
        uint time
    );

    function createPatient() public{
        require(owners[msg.sender] == 0);
        patients[bytes32(msg.sender)].creationDate = now;
        patients[bytes32(msg.sender)].owner = msg.sender;
    }

    function createMedic() public {
        require(owners[msg.sender] == 0);
        require(medics[bytes32(msg.sender)].creationDate == 0);

        medics[bytes32(msg.sender)].creationDate = now;
        medics[bytes32(msg.sender)].owner = msg.sender;
    }

    function createPrescription(string content, bytes32 patientAdress) public {
        require(owners[msg.sender].length > 0);
        require(patientExist(patientAdress));
        require(bytes(content).length <= 100);
        require(bytes32(patientAdress).length <= 10000);

        bytes32 medicHash = owners[msg.sender];
        Doctor storage mediquito = medics[medicHash];
        uint prescriptionIndex = mediquito.prescriptions.length++;

        mediquito.prescriptions[prescriptionIndex] = content;

        // emit the tweet event and notify the listeners
        emit NewPrescription(medicHash, patientAdress, content, now + 60 days, now);
    }

    function patientExist(bytes32 patientHash) public view returns (bool){
        return patients[patientHash].creationDate != 0;
    }

}
